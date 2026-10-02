import json
from pathlib import Path
from fastapi import APIRouter
from backend.app.core.config import BASE_DIR

router = APIRouter(prefix="/gis", tags=["Geospatial & City Topology"])

@router.get("/corridors")
async def get_corridors_geojson():
    """Return GeoJSON FeatureCollection of all major Coimbatore corridors."""
    geojson_path = BASE_DIR / "data" / "geojson" / "coimbatore_corridors.geojson"
    if geojson_path.exists():
        with open(geojson_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"type": "FeatureCollection", "features": []}

@router.get("/energy-zones")
async def get_energy_zones_geojson():
    """Return GeoJSON FeatureCollection of Coimbatore energy distribution zones."""
    geojson_path = BASE_DIR / "data" / "geojson" / "coimbatore_energy_zones.geojson"
    if geojson_path.exists():
        with open(geojson_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"type": "FeatureCollection", "features": []}
