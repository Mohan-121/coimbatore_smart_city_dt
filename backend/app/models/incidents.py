from datetime import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, Boolean, Text
from backend.app.db.session import Base

class UrbanIncident(Base):
    __tablename__ = "urban_incidents"

    incident_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(128), nullable=False)
    incident_type = Column(String(32), nullable=False) # ACCIDENT, ROAD_CLOSURE, CONSTRUCTION, EVENT
    segment_id = Column(String(64), nullable=True, index=True)
    severity = Column(String(16), nullable=False, default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    capacity_reduction_pct = Column(Float, nullable=False, default=50.0)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expected_clear_at = Column(DateTime, nullable=True)
    status = Column(String(16), default="ACTIVE") # ACTIVE, CLEARED
    is_simulated = Column(Boolean, default=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=True)

class UrbanAlert(Base):
    __tablename__ = "urban_alerts"

    alert_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    domain = Column(String(32), nullable=False) # TRAFFIC, ENERGY, ENVIRONMENT, ANOMALY
    severity = Column(String(16), nullable=False) # INFO, WARNING, SEVERE, CRITICAL
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    location_label = Column(String(128), nullable=False)
    cause_summary = Column(Text, nullable=False)
    predicted_impact = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    status = Column(String(16), default="UNRESOLVED") # UNRESOLVED, ACKNOWLEDGED, RESOLVED
