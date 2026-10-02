from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from backend.app.db.session import Base

class RoadNode(Base):
    __tablename__ = "road_nodes"

    node_id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_signalized = Column(Boolean, default=False)
    junction_type = Column(String(32), default="standard")

    # Relationships
    outgoing_segments = relationship("RoadSegment", foreign_keys="RoadSegment.start_node_id", back_populates="start_node")
    incoming_segments = relationship("RoadSegment", foreign_keys="RoadSegment.end_node_id", back_populates="end_node")

class RoadSegment(Base):
    __tablename__ = "road_segments"

    segment_id = Column(String(64), primary_key=True, index=True)
    corridor_name = Column(String(128), nullable=False, index=True) # e.g. "Avinashi Road"
    start_node_id = Column(String(64), ForeignKey("road_nodes.node_id"), nullable=False)
    end_node_id = Column(String(64), ForeignKey("road_nodes.node_id"), nullable=False)
    length_meters = Column(Float, nullable=False)
    speed_limit_kmh = Column(Float, default=50.0)
    lane_count = Column(Integer, default=4)
    capacity_vph = Column(Integer, default=2400) # Vehicles Per Hour
    coordinates_json = Column(Text, nullable=False) # JSON string of [[lon, lat], ...]

    # Relationships
    start_node = relationship("RoadNode", foreign_keys=[start_node_id], back_populates="outgoing_segments")
    end_node = relationship("RoadNode", foreign_keys=[end_node_id], back_populates="incoming_segments")
    telemetry = relationship("TrafficTelemetry", back_populates="segment", cascade="all, delete-orphan")
    predictions = relationship("TrafficPrediction", back_populates="segment", cascade="all, delete-orphan")

class TrafficTelemetry(Base):
    __tablename__ = "traffic_telemetry"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    segment_id = Column(String(64), ForeignKey("road_segments.segment_id"), nullable=False, index=True)
    average_speed_kmh = Column(Float, nullable=False)
    vehicle_count = Column(Integer, nullable=False)
    congestion_score = Column(Float, nullable=False) # 0.0 to 100.0
    congestion_level = Column(String(16), nullable=False) # LOW, MODERATE, HIGH, SEVERE
    queue_length_meters = Column(Float, default=0.0)
    travel_time_seconds = Column(Float, nullable=False)
    data_origin = Column(String(16), default="SIMULATED") # REAL_TIME, HISTORICAL, SIMULATED

    segment = relationship("RoadSegment", back_populates="telemetry")

class TrafficPrediction(Base):
    __tablename__ = "traffic_predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    target_time = Column(DateTime, nullable=False, index=True)
    horizon_minutes = Column(Integer, nullable=False) # 15, 30, 60, 120
    segment_id = Column(String(64), ForeignKey("road_segments.segment_id"), nullable=False, index=True)
    predicted_congestion_score = Column(Float, nullable=False)
    predicted_level = Column(String(16), nullable=False)
    predicted_speed_kmh = Column(Float, nullable=False)
    predicted_travel_time_sec = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    primary_cause = Column(String(128), nullable=False)
    cause_breakdown = Column(JSON, nullable=False) # e.g. {"peak_hour": 0.52, "upstream_queue": 0.28, ...}
    model_version = Column(String(32), default="lightgbm_v1.0")

    segment = relationship("RoadSegment", back_populates="predictions")
