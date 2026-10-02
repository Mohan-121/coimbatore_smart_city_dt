from datetime import datetime
from typing import Dict, Any

def simulate_environmental_metrics(
    avg_city_speed_kmh: float,
    active_incident_count: int,
    ambient_temp_c: float,
    humidity_pct: float,
    is_live_api: bool = False
) -> Dict[str, Any]:
    """
    Computes environmental intelligence parameters and traffic emission contributions for Coimbatore.
    Lower average vehicular speeds lead to higher stop-and-go idling emissions.
    """
    # Free-flow baseline city speed is ~48 km/h
    free_flow = 48.0
    speed_deficit_pct = max(0.0, (free_flow - avg_city_speed_kmh) / free_flow)

    # Base atmospheric pollution for Coimbatore (semi-industrial)
    base_pm25 = 20.0
    base_pm10 = 45.0
    base_no2 = 15.0

    # Traffic contribution scaling (idling exhaust factor)
    traffic_pm25_boost = speed_deficit_pct * 28.0 + (active_incident_count * 4.5)
    traffic_no2_boost = speed_deficit_pct * 22.0

    pm25 = round(base_pm25 + traffic_pm25_boost, 1)
    pm10 = round(base_pm10 + traffic_pm25_boost * 1.5, 1)
    no2 = round(base_no2 + traffic_no2_boost, 1)
    co = round(0.4 + (speed_deficit_pct * 0.8), 2)

    # AQI calculation based on CPCB / US EPA standards
    # PM2.5 is typically the limiting factor in Coimbatore
    if pm25 <= 30:
        aqi = int((50 / 30) * pm25)
    elif pm25 <= 60:
        aqi = int(50 + ((50 / 30) * (pm25 - 30)))
    elif pm25 <= 90:
        aqi = int(100 + ((100 / 30) * (pm25 - 60)))
    elif pm25 <= 120:
        aqi = int(200 + ((100 / 30) * (pm25 - 90)))
    else:
        aqi = int(300 + ((100 / 130) * (pm25 - 120)))

    # Traffic emission contribution percentage
    traffic_emission_pct = round((traffic_pm25_boost / max(1.0, pm25)) * 100.0, 1)

    return {
        "station_id": "CPCB_COIMBATORE_01",
        "station_name": "SIDCO Kurichi / Peelamedu Air Station",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "aqi": aqi,
        "pm25": pm25,
        "pm10": pm10,
        "no2": no2,
        "co": co,
        "temperature_c": ambient_temp_c,
        "humidity_pct": humidity_pct,
        "traffic_emission_contribution_pct": traffic_emission_pct,
        "data_origin": "REAL_TIME" if is_live_api else "SIMULATED"
    }
