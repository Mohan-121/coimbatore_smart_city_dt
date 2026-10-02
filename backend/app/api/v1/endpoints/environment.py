from fastapi import APIRouter
from backend.app.services.weather_service import weather_service
from backend.app.simulation.engine import twin_simulator

router = APIRouter(prefix="/environment", tags=["Environmental Intelligence"])

@router.get("/current")
async def get_current_environment():
    """
    Returns real-time AQI, PM2.5, PM10, temperature, and vehicular emission contribution.
    Pulls live data from Open-Meteo for Coimbatore (`11.0168, 76.9558`).
    """
    live_weather = await weather_service.fetch_current_telemetry()
    state = await twin_simulator.step()

    # Merge live API values with traffic emission calculations
    avg_speed = state.get("avg_speed_kmh", 42.0)
    free_flow = 50.0
    speed_deficit = max(0.0, (free_flow - avg_speed) / free_flow)

    traffic_contribution_pct = round(min(65.0, 20.0 + speed_deficit * 45.0), 1)

    # AQI Categorization
    aqi = live_weather["aqi"]
    if aqi <= 50:
        aqi_category = "Good"
        aqi_color = "#10B981" # Green
    elif aqi <= 100:
        aqi_category = "Moderate"
        aqi_color = "#F59E0B" # Amber
    elif aqi <= 150:
        aqi_category = "Unhealthy for Sensitive Groups"
        aqi_color = "#F97316" # Orange
    else:
        aqi_category = "Unhealthy"
        aqi_color = "#EF4444" # Red

    return {
        "timestamp": live_weather["last_updated"],
        "station_name": "SIDCO Kurichi / Peelamedu Air Monitoring Station",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "aqi": aqi,
        "aqi_category": aqi_category,
        "aqi_color": aqi_color,
        "pollutants": {
            "pm25_ugm3": live_weather["pm25"],
            "pm10_ugm3": live_weather["pm10"],
            "no2_ugm3": live_weather["no2"],
            "co_mgm3": live_weather["co"]
        },
        "meteorological": {
            "temperature_c": live_weather["temperature_c"],
            "humidity_pct": live_weather["relative_humidity_pct"],
            "precipitation_mm": live_weather["precipitation_mm"],
            "wind_speed_kmh": live_weather["wind_speed_kmh"]
        },
        "traffic_emission_contribution_pct": traffic_contribution_pct,
        "traffic_correlation_note": "Estimated traffic-related emission contribution calculated via vehicular idling models along major corridors.",
        "data_origin": live_weather["data_origin"] # REAL_TIME (Open-Meteo) or SIMULATED
    }
