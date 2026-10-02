from fastapi import APIRouter
from backend.app.simulation.engine import twin_simulator
from backend.app.services.alert_service import alert_service

router = APIRouter(prefix="/alerts", tags=["Intelligent Alerts & Anomaly Detection"])

@router.get("/active")
async def get_active_alerts():
    """Returns currently active urban alerts across Traffic, Energy, and Environment."""
    state = await twin_simulator.step()
    alerts = alert_service.evaluate_twin_state(state)
    return {
        "timestamp": state["timestamp"],
        "count": len(alerts),
        "alerts": alerts
    }

@router.post("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    """Marks an alert as acknowledged by an operator."""
    for a in alert_service.alerts:
        if a["alert_id"] == alert_id:
            a["status"] = "ACKNOWLEDGED"
            return {"success": True, "message": f"Alert {alert_id} acknowledged."}
    return {"success": True, "message": "Alert state updated."}
