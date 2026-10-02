import math
from datetime import datetime
from typing import Dict, Any

def get_diurnal_energy_demand(dt: datetime, zone_id: str, ambient_temp_c: float) -> Dict[str, Any]:
    """
    Computes realistic power demand for Coimbatore's 5 distribution zones based on:
    - Base load
    - Industrial daytime shift (10:00 - 16:00 IST)
    - Evening residential lighting & cooling peak (18:30 - 22:30 IST)
    - Temperature sensitivity (+2.5 MW / deg C above 26C base).
    """
    hour = dt.hour + dt.minute / 60.0

    # Zone capacity and base MW allocation
    zone_profiles = {
        "ZONE_METRO": {"base": 140.0, "cap": 320.0, "ind_weight": 0.20, "res_weight": 0.50, "comm_weight": 0.30},
        "ZONE_NORTH_IT": {"base": 110.0, "cap": 260.0, "ind_weight": 0.15, "res_weight": 0.40, "comm_weight": 0.45},
        "ZONE_EAST_IND": {"base": 180.0, "cap": 380.0, "ind_weight": 0.65, "res_weight": 0.20, "comm_weight": 0.15},
        "ZONE_SOUTH_RES": {"base": 120.0, "cap": 280.0, "ind_weight": 0.15, "res_weight": 0.70, "comm_weight": 0.15},
        "ZONE_KURICHI_SIDCO": {"base": 130.0, "cap": 240.0, "ind_weight": 0.75, "res_weight": 0.15, "comm_weight": 0.10},
    }

    profile = zone_profiles.get(zone_id, {"base": 130.0, "cap": 300.0, "ind_weight": 0.4, "res_weight": 0.4, "comm_weight": 0.2})

    # Industrial curve: active mostly from 08:30 to 18:00
    ind_curve = 0.85 * math.exp(-((hour - 13.0) ** 2) / (2 * (3.5 ** 2))) if 7 <= hour <= 19 else 0.10

    # Residential curve: evening peak centered at 20:30 IST
    res_curve = 0.95 * math.exp(-((hour - 20.5) ** 2) / (2 * (2.0 ** 2))) + (0.35 if 6 <= hour <= 9 else 0.0)

    # Commercial curve: 10:00 to 21:00
    comm_curve = 0.80 if 10 <= hour <= 21 else 0.15

    # Combined normalized demand factor [0.0 - 1.0]
    demand_factor = (
        profile["ind_weight"] * ind_curve +
        profile["res_weight"] * res_curve +
        profile["comm_weight"] * comm_curve
    )

    # Thermal cooling penalty (Air conditioning load increases above 26C)
    temp_penalty = max(0.0, ambient_temp_c - 26.0) * 3.2

    # Calculate active power (MW)
    active_power_mw = profile["base"] + (profile["cap"] - profile["base"]) * demand_factor * 0.75 + temp_penalty
    active_power_mw = round(min(profile["cap"] * 0.98, max(profile["base"] * 0.8, active_power_mw)), 1)

    # Solar generation (MW) during sunny hours (08:00 to 17:00)
    solar_mw = 0.0
    if 7.5 <= hour <= 17.5:
        solar_peak = profile["cap"] * 0.12 # ~12% rooftop solar penetration
        solar_mw = round(solar_peak * math.sin(math.pi * (hour - 7.5) / 10.0), 1)

    # Reactive power and voltage
    reactive_power_mvar = round(active_power_mw * 0.22, 1)
    voltage_kv = round(110.0 - (active_power_mw / profile["cap"]) * 3.5, 1)
    frequency_hz = round(50.0 + (0.02 * math.sin(hour * 2)), 2)

    return {
        "zone_id": zone_id,
        "active_power_mw": active_power_mw,
        "reactive_power_mvar": reactive_power_mvar,
        "voltage_kv": voltage_kv,
        "grid_frequency_hz": frequency_hz,
        "ambient_temp_c": ambient_temp_c,
        "solar_generation_mw": solar_mw,
        "capacity_utilization_pct": round((active_power_mw / profile["cap"]) * 100.0, 1),
        "data_origin": "SIMULATED"
    }
