import httpx
from datetime import datetime
from typing import Dict, Any
from backend.app.core.config import settings
from backend.app.core.logging import logger

class WeatherService:
    """
    Fetches real-time atmospheric and air quality telemetry for Coimbatore
    from Open-Meteo free public API, with resilient fallback to synthetic state.
    """
    def __init__(self):
        self.cached_weather: Dict[str, Any] = {
            "temperature_c": 29.5,
            "relative_humidity_pct": 58.0,
            "precipitation_mm": 0.0,
            "wind_speed_kmh": 12.4,
            "aqi": 72,
            "pm25": 22.4,
            "pm10": 48.0,
            "no2": 16.5,
            "co": 0.5,
            "data_origin": "SIMULATED",
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }

    async def fetch_current_telemetry(self) -> Dict[str, Any]:
        """Queries Open-Meteo API for Coimbatore coordinates."""
        try:
            weather_url = (
                f"{settings.OPEN_METEO_BASE_URL}/forecast"
                f"?latitude={settings.COIMBATORE_LAT}&longitude={settings.COIMBATORE_LON}"
                f"&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m"
            )
            aqi_url = (
                f"{settings.OPEN_METEO_AIR_QUALITY_URL}"
                f"?latitude={settings.COIMBATORE_LAT}&longitude={settings.COIMBATORE_LON}"
                f"&current=pm10,pm2_5,nitrogen_dioxide,carbon_monoxide,us_aqi"
            )

            async with httpx.AsyncClient(timeout=4.0) as client:
                w_resp = await client.get(weather_url)
                a_resp = await client.get(aqi_url)

                if w_resp.status_code == 200 and a_resp.status_code == 200:
                    w_data = w_resp.json().get("current", {})
                    a_data = a_resp.json().get("current", {})

                    self.cached_weather = {
                        "temperature_c": float(w_data.get("temperature_2m", 29.5)),
                        "relative_humidity_pct": float(w_data.get("relative_humidity_2m", 58.0)),
                        "precipitation_mm": float(w_data.get("precipitation", 0.0)),
                        "wind_speed_kmh": float(w_data.get("wind_speed_10m", 12.0)),
                        "aqi": int(a_data.get("us_aqi", 72)),
                        "pm25": float(a_data.get("pm2_5", 22.4)),
                        "pm10": float(a_data.get("pm10", 48.0)),
                        "no2": float(a_data.get("nitrogen_dioxide", 16.5)),
                        "co": float(a_data.get("carbon_monoxide", 0.5)),
                        "data_origin": "REAL_TIME",
                        "last_updated": datetime.utcnow().isoformat() + "Z"
                    }
                    logger.info("Successfully ingested live Open-Meteo weather and AQI telemetry.")
        except Exception as e:
            logger.warning(f"Open-Meteo API unreachable or timed out ({e}). Falling back to simulated environmental state.")
            self.cached_weather["data_origin"] = "SIMULATED"
            self.cached_weather["last_updated"] = datetime.utcnow().isoformat() + "Z"

        return self.cached_weather

weather_service = WeatherService()
