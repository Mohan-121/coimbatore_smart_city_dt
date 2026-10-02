import asyncio
import json
from datetime import datetime
from typing import Dict, Any, List
from pathlib import Path

from backend.app.core.config import BASE_DIR
from backend.app.core.logging import logger
from backend.app.simulation.traffic_sim import simulate_segment_traffic
from backend.app.simulation.energy_sim import get_diurnal_energy_demand
from backend.app.simulation.environment_sim import simulate_environmental_metrics
from backend.app.simulation.incident_generator import incident_manager
from backend.app.db.session import AsyncSessionLocal
from backend.app.models.traffic import TrafficTelemetry
from backend.app.models.energy import EnergyTelemetry
from backend.app.models.environment import EnvironmentalTelemetry

class DigitalTwinSimulationEngine:
    def __init__(self):
        self.segments_cache: List[Dict[str, Any]] = []
        self.zones_cache: List[str] = [
            "ZONE_METRO", "ZONE_NORTH_IT", "ZONE_EAST_IND", "ZONE_SOUTH_RES", "ZONE_KURICHI_SIDCO"
        ]
        self.current_state: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "city_congestion_index": 45.0,
            "avg_speed_kmh": 36.5,
            "total_energy_mw": 1120.0,
            "aqi": 75,
            "corridors": {},
            "zones": {},
            "environment": {},
            "active_incidents": []
        }
        self.load_static_metadata()

    def load_static_metadata(self):
        """Loads corridor and road segment definitions from GeoJSON."""
        geojson_path = BASE_DIR / "data" / "geojson" / "coimbatore_corridors.geojson"
        if geojson_path.exists():
            with open(geojson_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.segments_cache = [feat["properties"] for feat in data["features"]]
        logger.info(f"Loaded {len(self.segments_cache)} segments into simulation cache.")

    async def step(self, persist_to_db: bool = False) -> Dict[str, Any]:
        """Executes a single simulation tick for the entire Coimbatore digital twin."""
        now = datetime.utcnow()
        weather = incident_manager.weather_scenario
        base_temp = 29.0 + weather["temp_delta"]
        surge = incident_manager.traffic_surge_factor
        speed_factor = weather["speed_factor"]

        # 1. Simulate all road segments
        segment_results = []
        total_speed = 0.0
        total_congestion = 0.0

        for seg in self.segments_cache:
            seg_id = seg["segment_id"]
            incident_reduction = incident_manager.get_segment_incident_penalty(seg_id)
            res = simulate_segment_traffic(
                segment_id=seg_id,
                corridor_name=seg["corridor_name"],
                length_meters=seg["length_meters"],
                speed_limit_kmh=seg["speed_limit_kmh"],
                capacity_vph=seg["capacity_vph"],
                lane_count=seg["lane_count"],
                dt=now,
                incident_capacity_reduction=incident_reduction,
                weather_factor=speed_factor,
                surge_multiplier=surge
            )
            segment_results.append(res)
            total_speed += res["average_speed_kmh"]
            total_congestion += res["congestion_score"]

        count = max(1, len(segment_results))
        avg_speed = round(total_speed / count, 1)
        city_congestion = round(total_congestion / count, 1)

        # Group by corridor
        corridor_groups: Dict[str, Dict[str, Any]] = {}
        for r in segment_results:
            cname = r["corridor_name"]
            if cname not in corridor_groups:
                corridor_groups[cname] = {
                    "corridor_name": cname,
                    "avg_speed_kmh": 0.0,
                    "congestion_score": 0.0,
                    "segments": [],
                    "worst_level": "LOW",
                    "data_origin": "SIMULATED"
                }
            corridor_groups[cname]["segments"].append(r)

        for cname, cdata in corridor_groups.items():
            s_list = cdata["segments"]
            cdata["avg_speed_kmh"] = round(sum(s["average_speed_kmh"] for s in s_list) / len(s_list), 1)
            cdata["congestion_score"] = round(sum(s["congestion_score"] for s in s_list) / len(s_list), 1)
            # Find worst level
            levels = [s["congestion_level"] for s in s_list]
            if "SEVERE" in levels:
                cdata["worst_level"] = "SEVERE"
            elif "HIGH" in levels:
                cdata["worst_level"] = "HIGH"
            elif "MODERATE" in levels:
                cdata["worst_level"] = "MODERATE"
            else:
                cdata["worst_level"] = "LOW"

        # 2. Simulate all 5 Energy Zones
        zone_results = {}
        total_energy_mw = 0.0
        for zid in self.zones_cache:
            z_res = get_diurnal_energy_demand(now, zid, base_temp)
            zone_results[zid] = z_res
            total_energy_mw += z_res["active_power_mw"]
        total_energy_mw = round(total_energy_mw, 1)

        # 3. Simulate Environmental Metrics
        env_metrics = simulate_environmental_metrics(
            avg_city_speed_kmh=avg_speed,
            active_incident_count=len(incident_manager.active_incidents),
            ambient_temp_c=base_temp,
            humidity_pct=60.0 if weather["type"] != "MONSOON_DOWNPOUR" else 92.0
        )

        # 4. Update Current In-Memory State
        self.current_state = {
            "timestamp": now.isoformat() + "Z",
            "city_congestion_index": city_congestion,
            "avg_speed_kmh": avg_speed,
            "total_energy_mw": total_energy_mw,
            "aqi": env_metrics["aqi"],
            "corridors": corridor_groups,
            "segments": {s["segment_id"]: s for s in segment_results},
            "zones": zone_results,
            "environment": env_metrics,
            "active_incidents": incident_manager.list_active(),
            "weather_scenario": weather
        }

        # Optional persistence
        if persist_to_db:
            try:
                async with AsyncSessionLocal() as session:
                    # Write latest traffic telemetry
                    for r in segment_results:
                        tt = TrafficTelemetry(
                            recorded_at=now,
                            segment_id=r["segment_id"],
                            average_speed_kmh=r["average_speed_kmh"],
                            vehicle_count=r["vehicle_count"],
                            congestion_score=r["congestion_score"],
                            congestion_level=r["congestion_level"],
                            queue_length_meters=r["queue_length_meters"],
                            travel_time_seconds=r["travel_time_seconds"],
                            data_origin="SIMULATED"
                        )
                        session.add(tt)
                    # Write energy telemetry
                    for zid, zr in zone_results.items():
                        et = EnergyTelemetry(
                            recorded_at=now,
                            zone_id=zid,
                            active_power_mw=zr["active_power_mw"],
                            reactive_power_mvar=zr["reactive_power_mvar"],
                            voltage_kv=zr["voltage_kv"],
                            grid_frequency_hz=zr["grid_frequency_hz"],
                            ambient_temp_c=zr["ambient_temp_c"],
                            solar_generation_mw=zr["solar_generation_mw"],
                            data_origin="SIMULATED"
                        )
                        session.add(et)
                    await session.commit()
            except Exception as e:
                logger.error(f"Error persisting simulation tick: {e}")

        return self.current_state

# Global simulator singleton
twin_simulator = DigitalTwinSimulationEngine()
