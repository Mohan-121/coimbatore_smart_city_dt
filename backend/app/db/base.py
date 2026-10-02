# Import all models here so that Alembic and Base.metadata can discover them cleanly
from backend.app.db.session import Base
from backend.app.models.traffic import RoadNode, RoadSegment, TrafficTelemetry, TrafficPrediction
from backend.app.models.energy import EnergyZone, EnergyTelemetry, EnergyPrediction
from backend.app.models.environment import EnvironmentalTelemetry
from backend.app.models.incidents import UrbanIncident, UrbanAlert
from backend.app.models.user import User

__all__ = [
    "Base",
    "RoadNode",
    "RoadSegment",
    "TrafficTelemetry",
    "TrafficPrediction",
    "EnergyZone",
    "EnergyTelemetry",
    "EnergyPrediction",
    "EnvironmentalTelemetry",
    "UrbanIncident",
    "UrbanAlert",
    "User"
]
