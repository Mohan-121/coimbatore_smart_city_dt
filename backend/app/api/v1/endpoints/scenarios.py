from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from backend.app.simulation.engine import twin_simulator
from backend.app.simulation.traffic_sim import simulate_segment_traffic
from backend.app.simulation.energy_sim import get_diurnal_energy_demand
from datetime import datetime

router = APIRouter(prefix="/scenarios", tags=["What-If Urban Scenario Simulation"])

class TrafficScenarioRequest(BaseModel):
    scenario_type: str = Field(..., description="ROAD_CLOSURE, TRAFFIC_SURGE, MONSOON_DOWNPOUR, ACCIDENT")
    corridor_id: Optional[str] = "Avinashi Road"
    capacity_reduction_pct: float = Field(50.0, ge=0.0, le=100.0)
    surge_multiplier: float = Field(1.0, ge=0.5, le=2.5)
    description: Optional[str] = ""

class EnergyScenarioRequest(BaseModel):
    temp_delta_c: float = Field(0.0, ge=-5.0, le=8.0)
    ev_count: int = Field(0, ge=0, le=20000)
    industrial_shift_factor: float = Field(1.0, ge=0.5, le=1.5)
    solar_penetration_pct: float = Field(10.0, ge=0.0, le=50.0)

@router.post("/traffic/run")
async def run_traffic_scenario(req: TrafficScenarioRequest):
    """
    Executes a What-If traffic scenario, rerouting flow and returning baseline vs. simulated deltas.
    """
    now = datetime.utcnow()
    baseline_state = await twin_simulator.step()

    speed_factor = 0.65 if req.scenario_type == "MONSOON_DOWNPOUR" else 1.0
    surge = req.surge_multiplier
    if req.scenario_type == "TRAFFIC_SURGE":
        surge = max(surge, 1.35)

    simulated_segments = []
    sim_total_speed = 0.0
    sim_total_cong = 0.0

    for seg in twin_simulator.segments_cache:
        seg_id = seg["segment_id"]
        cname = seg["corridor_name"]

        # Apply capacity reduction if this segment is targeted
        reduction = 0.0
        if req.scenario_type in ["ROAD_CLOSURE", "ACCIDENT"] and (req.corridor_id in cname or req.corridor_id in seg_id):
            reduction = req.capacity_reduction_pct

        sim_res = simulate_segment_traffic(
            segment_id=seg_id,
            corridor_name=cname,
            length_meters=seg["length_meters"],
            speed_limit_kmh=seg["speed_limit_kmh"],
            capacity_vph=seg["capacity_vph"],
            lane_count=seg["lane_count"],
            dt=now,
            incident_capacity_reduction=reduction,
            weather_factor=speed_factor,
            surge_multiplier=surge
        )
        simulated_segments.append(sim_res)
        sim_total_speed += sim_res["average_speed_kmh"]
        sim_total_cong += sim_res["congestion_score"]

    cnt = max(1, len(simulated_segments))
    sim_avg_speed = round(sim_total_speed / cnt, 1)
    sim_congestion = round(sim_total_cong / cnt, 1)

    base_avg_speed = baseline_state["avg_speed_kmh"]
    base_congestion = baseline_state["city_congestion_index"]

    delta_speed = round(sim_avg_speed - base_avg_speed, 1)
    delta_cong = round(sim_congestion - base_congestion, 1)

    # Extra emissions calculation
    extra_co2_kg = round(max(0.0, -delta_speed) * 32.5, 1)
    extra_fuel_liters = round(extra_co2_kg / 2.31, 1)

    return {
        "scenario_type": req.scenario_type,
        "parameters": req.model_dump(),
        "baseline": {
            "city_congestion_index": base_congestion,
            "avg_speed_kmh": base_avg_speed,
            "worst_corridor": "Avinashi Road"
        },
        "simulated": {
            "city_congestion_index": sim_congestion,
            "avg_speed_kmh": sim_avg_speed,
            "segments": simulated_segments
        },
        "delta": {
            "congestion_index_delta": delta_cong,
            "average_speed_delta_kmh": delta_speed,
            "travel_time_inflation_pct": round(max(0.0, (base_avg_speed / max(5.0, sim_avg_speed) - 1.0)) * 100.0, 1),
            "estimated_extra_fuel_liters": extra_fuel_liters,
            "estimated_excess_co2_kg": extra_co2_kg
        },
        "recommendation": "Deploy dynamic diversion signboards directing eastbound traffic via Trichy Road and activate priority green waves on parallel arterials."
    }

@router.post("/energy/run")
async def run_energy_scenario(req: EnergyScenarioRequest):
    """
    Executes a What-If energy scenario (heatwave, EV fleet addition, solar growth).
    """
    now = datetime.utcnow()
    base_state = await twin_simulator.step()
    base_temp = base_state.get("environment", {}).get("temperature_c", 29.0)
    sim_temp = base_temp + req.temp_delta_c

    # EV charging MW load: 50kW fast charger per commercial delivery EV
    ev_mw = round((req.ev_count * 50.0) / 1000.0, 1)

    sim_zones = {}
    sim_total_mw = 0.0

    for zid in twin_simulator.zones_cache:
        res = get_diurnal_energy_demand(now, zid, sim_temp)
        active_mw = res["active_power_mw"] * req.industrial_shift_factor

        # Add EV load distribution to Metro and IT zones
        if zid in ["ZONE_METRO", "ZONE_NORTH_IT"]:
            active_mw += ev_mw * 0.5

        # Solar penetration adjustment
        solar_cut = active_mw * (req.solar_penetration_pct / 100.0) * 0.35 if 8 <= now.hour <= 16 else 0.0
        active_mw = max(100.0, round(active_mw - solar_cut, 1))

        sim_zones[zid] = {
            "zone_id": zid,
            "simulated_active_power_mw": active_mw,
            "capacity_utilization_pct": round((active_mw / 300.0) * 100.0, 1)
        }
        sim_total_mw += active_mw

    sim_total_mw = round(sim_total_mw, 1)
    base_total_mw = base_state["total_energy_mw"]
    delta_mw = round(sim_total_mw - base_total_mw, 1)

    return {
        "scenario_parameters": req.model_dump(),
        "baseline_total_mw": base_total_mw,
        "simulated_total_mw": sim_total_mw,
        "delta_mw": delta_mw,
        "pct_change": round((delta_mw / base_total_mw) * 100.0, 1),
        "ev_load_contribution_mw": ev_mw,
        "zones": sim_zones,
        "overload_warning": sim_total_mw > 1400.0
    }
