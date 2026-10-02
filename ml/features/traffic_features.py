import math
from datetime import datetime
from typing import Dict, Any, List
import numpy as np

def extract_traffic_features(
    dt: datetime,
    current_speed_kmh: float,
    current_congestion: float,
    upstream_speed_kmh: float,
    speed_limit_kmh: float,
    lane_count: int,
    is_incident_active: bool,
    capacity_loss_pct: float,
    ambient_temp_c: float = 29.0,
    rain_mm: float = 0.0
) -> Dict[str, float]:
    """
    Extracts time-series and spatial lag features for multi-horizon traffic prediction.
    No future data leakage.
    """
    hour_float = dt.hour + dt.minute / 60.0
    day_of_week = dt.weekday()
    is_weekend = 1.0 if day_of_week >= 5 else 0.0

    # Cyclic time encoding
    sin_hour = math.sin(2 * math.pi * hour_float / 24.0)
    cos_hour = math.cos(2 * math.pi * hour_float / 24.0)
    sin_day = math.sin(2 * math.pi * day_of_week / 7.0)
    cos_day = math.cos(2 * math.pi * day_of_week / 7.0)

    # Rush hour indicator (Morning 8-10, Evening 17-20)
    is_rush_hour = 1.0 if (8.0 <= hour_float <= 10.5 or 17.5 <= hour_float <= 20.5) else 0.0

    # Speed ratio
    speed_ratio = current_speed_kmh / max(10.0, speed_limit_kmh)
    speed_deficit = max(0.0, speed_limit_kmh - current_speed_kmh)
    upstream_speed_deficit = max(0.0, speed_limit_kmh - upstream_speed_kmh)

    return {
        "sin_hour": sin_hour,
        "cos_hour": cos_hour,
        "sin_day": sin_day,
        "cos_day": cos_day,
        "is_weekend": is_weekend,
        "is_rush_hour": is_rush_hour,
        "current_speed_kmh": current_speed_kmh,
        "current_congestion": current_congestion,
        "speed_ratio": speed_ratio,
        "speed_deficit": speed_deficit,
        "upstream_speed_deficit": upstream_speed_deficit,
        "lane_count": float(lane_count),
        "is_incident_active": 1.0 if is_incident_active else 0.0,
        "capacity_loss_pct": capacity_loss_pct,
        "ambient_temp_c": ambient_temp_c,
        "rain_mm": rain_mm
    }

FEATURE_NAMES = [
    "sin_hour", "cos_hour", "sin_day", "cos_day", "is_weekend", "is_rush_hour",
    "current_speed_kmh", "current_congestion", "speed_ratio", "speed_deficit",
    "upstream_speed_deficit", "lane_count", "is_incident_active", "capacity_loss_pct",
    "ambient_temp_c", "rain_mm"
]

def features_to_vector(feat_dict: Dict[str, float]) -> List[float]:
    return [feat_dict[k] for k in FEATURE_NAMES]
