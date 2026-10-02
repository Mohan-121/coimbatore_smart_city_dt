import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

class IncidentManager:
    """Manages active and simulated incidents across Coimbatore."""
    def __init__(self):
        self.active_incidents: Dict[str, Dict[str, Any]] = {}
        self.weather_scenario: Dict[str, Any] = {
            "type": "NORMAL", # NORMAL, MONSOON_DOWNPOUR, HEATWAVE
            "temp_delta": 0.0,
            "speed_factor": 1.0,
            "rain_mm": 0.0
        }
        self.traffic_surge_factor: float = 1.0

    def inject_incident(
        self,
        title: str,
        incident_type: str,
        segment_id: str,
        severity: str,
        capacity_reduction_pct: float,
        latitude: float,
        longitude: float,
        duration_minutes: int = 60,
        description: str = ""
    ) -> Dict[str, Any]:
        incident_id = str(uuid.uuid4())
        started_at = datetime.utcnow()
        expected_clear_at = started_at + timedelta(minutes=duration_minutes)

        incident = {
            "incident_id": incident_id,
            "title": title,
            "incident_type": incident_type,
            "segment_id": segment_id,
            "severity": severity,
            "capacity_reduction_pct": capacity_reduction_pct,
            "started_at": started_at.isoformat() + "Z",
            "expected_clear_at": expected_clear_at.isoformat() + "Z",
            "status": "ACTIVE",
            "is_simulated": True,
            "latitude": latitude,
            "longitude": longitude,
            "description": description or f"{title} on {segment_id}"
        }
        self.active_incidents[incident_id] = incident
        return incident

    def clear_incident(self, incident_id: str) -> bool:
        if incident_id in self.active_incidents:
            del self.active_incidents[incident_id]
            return True
        return False

    def clear_all(self):
        self.active_incidents.clear()
        self.weather_scenario = {
            "type": "NORMAL",
            "temp_delta": 0.0,
            "speed_factor": 1.0,
            "rain_mm": 0.0
        }
        self.traffic_surge_factor = 1.0

    def set_weather_scenario(self, scenario_type: str):
        if scenario_type == "MONSOON_DOWNPOUR":
            self.weather_scenario = {
                "type": "MONSOON_DOWNPOUR",
                "temp_delta": -4.0,
                "speed_factor": 0.65, # 35% speed drop
                "rain_mm": 45.0
            }
        elif scenario_type == "HEATWAVE":
            self.weather_scenario = {
                "type": "HEATWAVE",
                "temp_delta": +4.5,
                "speed_factor": 0.95,
                "rain_mm": 0.0
            }
        else:
            self.weather_scenario = {
                "type": "NORMAL",
                "temp_delta": 0.0,
                "speed_factor": 1.0,
                "rain_mm": 0.0
            }

    def set_surge(self, surge_multiplier: float):
        self.traffic_surge_factor = max(0.5, min(2.5, surge_multiplier))

    def get_segment_incident_penalty(self, segment_id: str) -> float:
        for inc in self.active_incidents.values():
            if inc.get("segment_id") == segment_id and inc.get("status") == "ACTIVE":
                return inc.get("capacity_reduction_pct", 0.0)
        return 0.0

    def list_active(self) -> List[Dict[str, Any]]:
        return list(self.active_incidents.values())

# Global singleton
incident_manager = IncidentManager()
