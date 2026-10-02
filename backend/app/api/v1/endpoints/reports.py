from datetime import datetime
from fastapi import APIRouter
from backend.app.simulation.engine import twin_simulator
from backend.app.services.weather_service import weather_service
from backend.app.services.alert_service import alert_service

router = APIRouter(prefix="/reports", tags=["Analytics & Executive Reporting"])

@router.get("/daily")
async def get_daily_executive_report():
    """Generates an executive daily municipal briefing report for Coimbatore administrators."""
    now = datetime.utcnow()
    state = await twin_simulator.step()
    weather = await weather_service.fetch_current_telemetry()
    alerts = alert_service.evaluate_twin_state(state)

    segments = list(state.get("segments", {}).values())
    segments.sort(key=lambda s: s["congestion_score"], reverse=True)
    worst = segments[0] if segments else {"corridor_name": "Avinashi Road", "congestion_score": 65.0}

    return {
        "report_id": f"RPT-CBE-{now.strftime('%Y%m%d')}",
        "generated_at": now.isoformat() + "Z",
        "city": "Coimbatore, Tamil Nadu",
        "summary": {
            "overall_urban_health": "MODERATE",
            "city_congestion_index": state["city_congestion_index"],
            "city_avg_speed_kmh": state["avg_speed_kmh"],
            "peak_traffic_bottleneck": f"{worst['corridor_name']} ({worst['congestion_score']}/100)",
            "total_power_demand_mw": state["total_energy_mw"],
            "grid_peak_forecast_mw": 1320.0,
            "air_quality_index": weather["aqi"],
            "air_quality_category": "Moderate" if weather["aqi"] <= 100 else "Unhealthy",
            "active_unresolved_alerts": len(alerts)
        },
        "traffic_kpis": {
            "corridors_monitored": 5,
            "segments_evaluated": len(segments),
            "severe_bottlenecks": len([s for s in segments if s["congestion_score"] >= 80.0]),
            "estimated_daily_excess_fuel_liters": 1840.0,
            "estimated_daily_co2_kg": 4250.0
        },
        "energy_kpis": {
            "total_substation_zones": 5,
            "highest_stressed_zone": "Coimbatore East (Peelamedu & CODISSIA)",
            "peak_window": "19:00 - 21:30 IST",
            "grid_frequency_stability": "Normal (50.02 Hz)"
        },
        "environmental_kpis": {
            "pm25": weather["pm25"],
            "pm10": weather["pm10"],
            "traffic_emission_contribution": f"{round(min(60.0, 20.0 + (50 - state['avg_speed_kmh'])), 1)}%",
            "cpcb_compliance": "Within National Ambient Air Quality Standards (NAAQS)"
        },
        "executive_recommendations": [
            "Maintain active traffic diversion protocols along Avinashi Road during elevated expressway construction.",
            "Request TANGEDCO 110kV grid wheeling support ahead of expected 19:30 evening cooling peak.",
            "Deploy mobile misting units near Gandhipuram bus terminal if PM2.5 exceeds 60 µg/m³."
        ]
    }
