import uuid
from datetime import datetime
from typing import Dict, Any, List

class AlertService:
    """
    Evaluates digital twin state and generates actionable urban alerts
    with root cause explanations, predicted impacts, and recommended operator actions.
    """
    def __init__(self):
        self.alerts: List[Dict[str, Any]] = []

    def evaluate_twin_state(self, twin_state: Dict[str, Any]) -> List[Dict[str, Any]]:
        active_alerts = []
        now_str = datetime.utcnow().isoformat() + "Z"

        # 1. Traffic Bottleneck & Severity Checks
        segments = twin_state.get("segments", {})
        for seg_id, s in segments.items():
            cong = s.get("congestion_score", 0.0)
            cname = s.get("corridor_name", "Coimbatore Corridor")
            speed = s.get("average_speed_kmh", 45.0)

            if cong >= 85.0:
                active_alerts.append({
                    "alert_id": str(uuid.uuid4()),
                    "created_at": now_str,
                    "domain": "TRAFFIC",
                    "severity": "CRITICAL",
                    "title": f"Gridlock Emergency on {cname}",
                    "description": f"Congestion reached {cong}/100. Average vehicle speed collapsed to {speed} km/h.",
                    "location_label": f"{cname} ({seg_id})",
                    "cause_summary": "High vehicular demand compounded by localized bottleneck or active incident.",
                    "predicted_impact": "Downstream queue spillover expected within 15 minutes. Alternate arterial delay +22 minutes.",
                    "recommended_action": "Adjust traffic signal green-time at upstream junctions and broadcast advisory to municipal transit.",
                    "status": "UNRESOLVED"
                })
            elif cong >= 70.0:
                active_alerts.append({
                    "alert_id": str(uuid.uuid4()),
                    "created_at": now_str,
                    "domain": "TRAFFIC",
                    "severity": "SEVERE",
                    "title": f"Severe Congestion Warning on {cname}",
                    "description": f"Congestion score {cong}/100 indicates significant stop-and-go conditions.",
                    "location_label": f"{cname} ({seg_id})",
                    "cause_summary": "Peak-hour commuter accumulation along arterial junction.",
                    "predicted_impact": "Travel delay factor inflated by 2.1x.",
                    "recommended_action": "Deploy traffic wardens to clear bottleneck intersection.",
                    "status": "UNRESOLVED"
                })

        # 2. Energy Substation Overload Checks
        zones = twin_state.get("zones", {})
        for zid, z in zones.items():
            util = z.get("capacity_utilization_pct", 0.0)
            mw = z.get("active_power_mw", 0.0)
            if util >= 90.0:
                active_alerts.append({
                    "alert_id": str(uuid.uuid4()),
                    "created_at": now_str,
                    "domain": "ENERGY",
                    "severity": "CRITICAL",
                    "title": f"Substation Overload Danger: {zid}",
                    "description": f"Current load {mw} MW has reached {util}% of maximum transformer rating.",
                    "location_label": zid,
                    "cause_summary": "Simultaneous industrial power draw and residential air conditioning cooling surge.",
                    "predicted_impact": "Thermal stress on 110kV step-down transformers; risk of localized feeder trip.",
                    "recommended_action": "Initiate voluntary industrial demand response and request TANGEDCO grid power wheeling.",
                    "status": "UNRESOLVED"
                })
            elif util >= 82.0:
                active_alerts.append({
                    "alert_id": str(uuid.uuid4()),
                    "created_at": now_str,
                    "domain": "ENERGY",
                    "severity": "WARNING",
                    "title": f"High Grid Load Alert: {zid}",
                    "description": f"Substation utilization is at {util}% ({mw} MW).",
                    "location_label": zid,
                    "cause_summary": "Approaching peak diurnal window.",
                    "predicted_impact": "Limited headroom for unexpected spikes.",
                    "recommended_action": "Monitor transformer oil temperatures and prepare backup diesel/solar feeds.",
                    "status": "UNRESOLVED"
                })

        # 3. Environmental AQI Checks
        env = twin_state.get("environment", {})
        aqi = env.get("aqi", 70)
        if aqi >= 150:
            active_alerts.append({
                "alert_id": str(uuid.uuid4()),
                "created_at": now_str,
                "domain": "ENVIRONMENT",
                "severity": "SEVERE",
                "title": "Air Quality Deterioration Warning",
                "description": f"City Air Quality Index reached {aqi} (Unhealthy).",
                "location_label": "Coimbatore Urban Core",
                "cause_summary": "Concentrated vehicular emissions from stop-and-go idling combined with atmospheric inversion.",
                "predicted_impact": "Respiratory sensitivity risk for vulnerable populations.",
                "recommended_action": "Issue public health advisory and encourage non-motorized / public transit.",
                "status": "UNRESOLVED"
            })

        # Deduplicate and keep top 8 alerts
        self.alerts = active_alerts[:8]
        return self.alerts

alert_service = AlertService()
