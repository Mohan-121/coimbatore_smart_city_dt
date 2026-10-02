import math
from datetime import datetime
from typing import Dict, Any, List

def extract_energy_features(
    dt: datetime,
    zone_id: str,
    temp_celsius: float,
    lag_1h_mw: float,
    lag_24h_mw: float,
    cooling_degree_days: float = 0.0
) -> Dict[str, float]:
    """
    Extracts time-series features for 24-hour ahead energy demand forecasting.
    """
    hour_float = dt.hour + dt.minute / 60.0
    day_of_week = dt.weekday()
    is_weekend = 1.0 if day_of_week >= 5 else 0.0

    sin_hour = math.sin(2 * math.pi * hour_float / 24.0)
    cos_hour = math.cos(2 * math.pi * hour_float / 24.0)
    sin_day = math.sin(2 * math.pi * day_of_week / 7.0)
    cos_day = math.cos(2 * math.pi * day_of_week / 7.0)

    # CDD = max(0, T - 24)
    cdd = max(0.0, temp_celsius - 24.0)

    # Zone one-hot encoding
    zones = ["ZONE_METRO", "ZONE_NORTH_IT", "ZONE_EAST_IND", "ZONE_SOUTH_RES", "ZONE_KURICHI_SIDCO"]
    zone_vec = [1.0 if zone_id == z else 0.0 for z in zones]

    feat = {
        "sin_hour": sin_hour,
        "cos_hour": cos_hour,
        "sin_day": sin_day,
        "cos_day": cos_day,
        "is_weekend": is_weekend,
        "temp_celsius": temp_celsius,
        "cooling_degree_days": cdd,
        "lag_1h_mw": lag_1h_mw,
        "lag_24h_mw": lag_24h_mw
    }
    for i, z in enumerate(zones):
        feat[f"is_{z}"] = zone_vec[i]

    return feat

ENERGY_FEATURE_NAMES = [
    "sin_hour", "cos_hour", "sin_day", "cos_day", "is_weekend",
    "temp_celsius", "cooling_degree_days", "lag_1h_mw", "lag_24h_mw",
    "is_ZONE_METRO", "is_ZONE_NORTH_IT", "is_ZONE_EAST_IND", "is_ZONE_SOUTH_RES", "is_ZONE_KURICHI_SIDCO"
]

def energy_features_to_vector(feat_dict: Dict[str, float]) -> List[float]:
    return [feat_dict[k] for k in ENERGY_FEATURE_NAMES]
