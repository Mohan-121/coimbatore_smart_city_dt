from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime
from backend.app.db.session import Base

class EnvironmentalTelemetry(Base):
    __tablename__ = "environmental_telemetry"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    station_id = Column(String(32), index=True, default="CPCB_COIMBATORE_01")
    station_name = Column(String(128), default="SIDCO Kurichi / Peelamedu")
    latitude = Column(Float, default=11.0168)
    longitude = Column(Float, default=76.9558)
    aqi = Column(Integer, nullable=False, default=78)
    pm25 = Column(Float, nullable=False, default=24.5)
    pm10 = Column(Float, nullable=False, default=52.0)
    no2 = Column(Float, nullable=False, default=18.2)
    co = Column(Float, nullable=False, default=0.6)
    temperature_c = Column(Float, nullable=False, default=29.0)
    humidity_pct = Column(Float, nullable=False, default=62.0)
    traffic_emission_contribution_pct = Column(Float, default=32.5)
    data_origin = Column(String(16), default="REAL_TIME") # REAL_TIME (Open-Meteo) or SIMULATED
