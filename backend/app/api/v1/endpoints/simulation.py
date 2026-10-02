from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional

from backend.app.simulation.engine import twin_simulator
from backend.app.simulation.incident_generator import incident_manager

router = APIRouter(prefix="/simulation", tags=["Simulation Control & Demo Mode"])

class DemoPresetRequest(BaseModel):
    preset_id: str = Field(..., description="ACCIDENT_TIDEL, MONSOON_DOWNPOUR, HEATWAVE_SPIKE, FLYOVER_LANE_CLOSURE, RESET")

class IncidentInjectionRequest(BaseModel):
    title: str = "Traffic Incident"
    segment_id: str = "SEG_AVINASHI_02"
    severity: str = "HIGH"
    capacity_reduction_pct: float = 60.0
    duration_minutes: int = 45
    latitude: float = 11.0332
    longitude: float = 77.0315
    description: str = ""

@router.post("/tick")
async def trigger_simulation_tick(persist: bool = False):
    """Executes a single simulation tick and returns the new digital twin state."""
    state = await twin_simulator.step(persist_to_db=persist)
    return state

@router.post("/demo-preset")
async def apply_demo_preset(req: DemoPresetRequest):
    """
    Triggers 1-click presentation demo presets for live jury/evaluator demonstration.
    """
    preset = req.preset_id.upper()

    if preset == "ACCIDENT_TIDEL":
        incident_manager.clear_all()
        inc = incident_manager.inject_incident(
            title="Multi-Vehicle Collision near TIDEL Park",
            incident_type="ACCIDENT",
            segment_id="SEG_AVINASHI_02",
            severity="CRITICAL",
            capacity_reduction_pct=65.0,
            latitude=11.0332,
            longitude=77.0315,
            duration_minutes=60,
            description="Accident blocking 2 arterial lanes on Avinashi Road towards Airport."
        )
        state = await twin_simulator.step()
        return {
            "success": True,
            "preset": preset,
            "message": "Injected simulated critical accident at TIDEL Park Junction.",
            "incident": inc,
            "state_summary": {
                "city_congestion_index": state["city_congestion_index"],
                "target_segment_speed": state["segments"]["SEG_AVINASHI_02"]["average_speed_kmh"],
                "target_segment_congestion": state["segments"]["SEG_AVINASHI_02"]["congestion_score"]
            }
        }

    elif preset == "MONSOON_DOWNPOUR":
        incident_manager.clear_all()
        incident_manager.set_weather_scenario("MONSOON_DOWNPOUR")
        state = await twin_simulator.step()
        return {
            "success": True,
            "preset": preset,
            "message": "Monsoon downpour activated. Road speeds throttled citywide by 35% with reduced visibility.",
            "state_summary": {
                "city_congestion_index": state["city_congestion_index"],
                "avg_speed_kmh": state["avg_speed_kmh"]
            }
        }

    elif preset == "HEATWAVE_SPIKE":
        incident_manager.clear_all()
        incident_manager.set_weather_scenario("HEATWAVE")
        state = await twin_simulator.step()
        return {
            "success": True,
            "preset": preset,
            "message": "Heatwave alert (+4.5°C). Substation residential cooling demand surge active.",
            "state_summary": {
                "total_energy_mw": state["total_energy_mw"],
                "ambient_temp_c": state["environment"]["temperature_c"]
            }
        }

    elif preset == "FLYOVER_LANE_CLOSURE":
        incident_manager.clear_all()
        inc = incident_manager.inject_incident(
            title="Avinashi Road Elevated Flyover Pier Erection",
            incident_type="CONSTRUCTION",
            segment_id="SEG_AVINASHI_01",
            severity="HIGH",
            capacity_reduction_pct=50.0,
            latitude=11.0248,
            longitude=77.0035,
            duration_minutes=120,
            description="Structural work closing 1 eastbound and 1 westbound lane near Peelamedu."
        )
        state = await twin_simulator.step()
        return {
            "success": True,
            "preset": preset,
            "message": "Flyover lane construction diversion active near Peelamedu.",
            "incident": inc,
            "state_summary": {
                "city_congestion_index": state["city_congestion_index"]
            }
        }

    elif preset == "RESET":
        incident_manager.clear_all()
        state = await twin_simulator.step()
        return {
            "success": True,
            "preset": preset,
            "message": "All simulated disruptions cleared. Restored baseline urban conditions.",
            "state_summary": {
                "city_congestion_index": state["city_congestion_index"],
                "avg_speed_kmh": state["avg_speed_kmh"],
                "total_energy_mw": state["total_energy_mw"]
            }
        }

    return {"success": False, "message": f"Unknown preset {preset}."}

@router.post("/inject-incident")
async def inject_custom_incident(req: IncidentInjectionRequest):
    """Allows administrators to manually place custom incidents on any corridor."""
    inc = incident_manager.inject_incident(
        title=req.title,
        incident_type="ACCIDENT",
        segment_id=req.segment_id,
        severity=req.severity,
        capacity_reduction_pct=req.capacity_reduction_pct,
        latitude=req.latitude,
        longitude=req.longitude,
        duration_minutes=req.duration_minutes,
        description=req.description
    )
    state = await twin_simulator.step()
    return {"success": True, "incident": inc, "twin_state": state}

@router.post("/reset")
async def reset_simulation():
    """Resets simulator to clean baseline state."""
    incident_manager.clear_all()
    state = await twin_simulator.step()
    return {"success": True, "message": "Simulation reset to nominal baseline.", "state": state}
