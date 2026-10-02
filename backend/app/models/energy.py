from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from backend.app.db.session import Base

class EnergyZone(Base):
    __tablename__ = "energy_zones"

    zone_id = Column(String(32), primary_key=True, index=True) # e.g. "ZONE_METRO"
    name = Column(String(128), nullable=False) # e.g. "Coimbatore Metro Central"
    substation_type = Column(String(64), default="230/110kV Substation")
    capacity_mw = Column(Float, nullable=False, default=300.0)
    polygon_coordinates_json = Column(Text, nullable=False)

    telemetry = relationship("EnergyTelemetry", back_populates="zone", cascade="all, delete-orphan")
    predictions = relationship("EnergyPrediction", back_populates="zone", cascade="all, delete-orphan")

class EnergyTelemetry(Base):
    __tablename__ = "energy_telemetry"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    zone_id = Column(String(32), ForeignKey("energy_zones.zone_id"), nullable=False, index=True)
    active_power_mw = Column(Float, nullable=False)
    reactive_power_mvar = Column(Float, default=15.0)
    voltage_kv = Column(Float, default=110.0)
    grid_frequency_hz = Column(Float, default=50.0)
    ambient_temp_c = Column(Float, default=29.5)
    solar_generation_mw = Column(Float, default=0.0)
    data_origin = Column(String(16), default="SIMULATED")

    zone = relationship("EnergyZone", back_populates="telemetry")

class EnergyPrediction(Base):
    __tablename__ = "energy_predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    target_time = Column(DateTime, nullable=False, index=True)
    horizon_hours = Column(Integer, nullable=False) # 1, 3, 6, 12, 24
    zone_id = Column(String(32), ForeignKey("energy_zones.zone_id"), nullable=False)
    predicted_demand_mw = Column(Float, nullable=False)
    peak_expected_time = Column(DateTime, nullable=True)
    confidence_score = Column(Float, nullable=False)
    contributing_factors = Column(JSON, nullable=False) # {"temperature": 0.40, "industrial_shift": 0.35, "baseline": 0.25}
    model_version = Column(String(32), default="xgboost_v1.0")

    zone = relationship("EnergyZone", back_populates="predictions")
