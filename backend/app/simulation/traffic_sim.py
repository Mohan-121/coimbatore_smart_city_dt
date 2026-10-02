import math
from datetime import datetime
from typing import Dict, Any

def get_diurnal_traffic_factor(dt: datetime) -> float:
    """
    Computes diurnal traffic demand factor for Coimbatore based on time of day.
    Peak 1: Morning Commute (08:30 - 10:30 IST) -> IT corridor & schools rush.
    Peak 2: Evening Commute (17:30 - 20:30 IST) -> Commercial & residential return.
    Lull: Night hours (00:00 - 05:00 IST).
    """
    hour = dt.hour + dt.minute / 60.0
    day_of_week = dt.weekday() # 0 = Monday, 6 = Sunday

    # Weekend baseline is lower and smoother
    is_weekend = day_of_week >= 5

    if is_weekend:
        # Weekend curve: peaks gently around 12:00-14:00 and 19:00-21:00
        factor = 0.35 + 0.35 * math.sin(math.pi * (hour - 8) / 14) if 8 <= hour <= 22 else 0.15
        return max(0.12, min(0.75, factor))

    # Weekday Bimodal Curve
    # Morning peak Gaussian centered at 9.25 (09:15 AM)
    morning_peak = 0.85 * math.exp(-((hour - 9.25) ** 2) / (2 * (1.2 ** 2)))
    # Evening peak Gaussian centered at 18.75 (06:45 PM)
    evening_peak = 0.95 * math.exp(-((hour - 18.75) ** 2) / (2 * (1.5 ** 2)))
    # Base daytime activity
    day_base = 0.40 if 7 <= hour <= 22 else 0.12

    factor = max(day_base, morning_peak, evening_peak)
    return max(0.10, min(1.0, factor))

def simulate_segment_traffic(
    segment_id: str,
    corridor_name: str,
    length_meters: float,
    speed_limit_kmh: float,
    capacity_vph: int,
    lane_count: int,
    dt: datetime,
    incident_capacity_reduction: float = 0.0,
    weather_factor: float = 1.0,
    surge_multiplier: float = 1.0
) -> Dict[str, Any]:
    """
    Simulates traffic telemetry for a single road segment using the Greenshields traffic density equilibrium.
    """
    base_factor = get_diurnal_traffic_factor(dt)

    # Specific corridor multipliers (Saravanampatti and Singanallur experience higher commuter loads)
    corridor_multiplier = 1.0
    if "Saravanampatti" in corridor_name or "Sathy" in corridor_name:
        corridor_multiplier = 1.15
    elif "Singanallur" in corridor_name or "Trichy" in corridor_name:
        corridor_multiplier = 1.20
    elif "Avinashi" in corridor_name:
        corridor_multiplier = 1.18

    # Effective capacity considering active incident
    effective_capacity = capacity_vph * (1.0 - (incident_capacity_reduction / 100.0))
    effective_capacity = max(200.0, effective_capacity)

    # Inflow commuter demand (vehicles per hour) based on nominal corridor capacity
    inflow_demand_vph = capacity_vph * base_factor * corridor_multiplier * surge_multiplier

    # Jam density: ~120 vehicles/km/lane
    jam_density = 120.0 * lane_count
    
    # Volume to Capacity ratio (V/C)
    vc_ratio = inflow_demand_vph / effective_capacity

    # Density scales with V/C ratio bottlenecking
    density = (inflow_demand_vph / speed_limit_kmh) * max(1.0, vc_ratio ** 1.6)
    density = min(jam_density * 0.98, max(5.0, density))

    # Greenshields Model: v = v_free * (1 - k / k_jam) * weather_factor
    speed_ratio = max(0.08, 1.0 - (density / jam_density))
    speed_kmh = speed_limit_kmh * speed_ratio * weather_factor
    speed_kmh = max(5.0, min(speed_limit_kmh, speed_kmh))

    # Queue length estimation (meters)
    queue_length_meters = 0.0
    if speed_kmh < (speed_limit_kmh * 0.45):
        excess_density = max(0.0, density - (jam_density * 0.5))
        queue_length_meters = min(length_meters * 0.95, excess_density * (length_meters / 1000.0) * 8.0)

    # Congestion Score (0 - 100)
    # 55% speed deficit + 35% density ratio + 10% queue ratio
    speed_deficit = max(0.0, (speed_limit_kmh - speed_kmh) / speed_limit_kmh)
    density_ratio = density / jam_density
    queue_ratio = queue_length_meters / max(100.0, length_meters)

    congestion_score = (0.55 * speed_deficit + 0.35 * density_ratio + 0.10 * queue_ratio) * 100.0
    congestion_score = round(max(0.0, min(100.0, congestion_score)), 1)

    # Categorical classification
    if congestion_score < 30.0:
        congestion_level = "LOW"
    elif congestion_score < 60.0:
        congestion_level = "MODERATE"
    elif congestion_score < 85.0:
        congestion_level = "HIGH"
    else:
        congestion_level = "SEVERE"

    # Travel time (seconds)
    travel_time_seconds = round((length_meters / (speed_kmh * (1000.0 / 3600.0))), 1)

    return {
        "segment_id": segment_id,
        "corridor_name": corridor_name,
        "average_speed_kmh": round(speed_kmh, 1),
        "vehicle_count": int(inflow_demand_vph / 60.0), # vehicles currently on segment
        "congestion_score": congestion_score,
        "congestion_level": congestion_level,
        "queue_length_meters": round(queue_length_meters, 1),
        "travel_time_seconds": travel_time_seconds,
        "data_origin": "SIMULATED"
    }
