import asyncio
import json
import sys
from pathlib import Path
from datetime import datetime

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.core.logging import setup_logging, logger
from backend.app.db.session import AsyncSessionLocal
from backend.app.models.traffic import RoadNode, RoadSegment
from backend.app.models.energy import EnergyZone
from backend.app.models.environment import EnvironmentalTelemetry
from backend.app.models.user import User
from backend.app.core.security import hash_password

setup_logging()

# Node metadata lookup
NODE_METADATA = {
    "NODE_GANDHIPURAM": {"name": "Gandhipuram Central Junction", "lat": 11.0183, "lon": 76.9691, "signal": True},
    "NODE_PEELAMEDU": {"name": "Peelamedu (PSG Tech) Junction", "lat": 11.0248, "lon": 77.0035, "signal": True},
    "NODE_TIDEL": {"name": "TIDEL Park & Hope College Junction", "lat": 11.0332, "lon": 77.0315, "signal": True},
    "NODE_AIRPORT": {"name": "Coimbatore Airport (Sitra) Junction", "lat": 11.0402, "lon": 77.0505, "signal": True},
    "NODE_RAILWAY_STATION": {"name": "Coimbatore Junction Railway Station", "lat": 11.0005, "lon": 76.9680, "signal": True},
    "NODE_RAMANATHAPURAM": {"name": "Ramanathapuram 80ft Rd Junction", "lat": 10.9950, "lon": 76.9985, "signal": True},
    "NODE_SINGANALLUR": {"name": "Singanallur Bus Terminal Junction", "lat": 10.9975, "lon": 77.0250, "signal": True},
    "NODE_ONDIPUDUR": {"name": "Ondipudur Flyover Node", "lat": 10.9985, "lon": 77.0480, "signal": False},
    "NODE_GANAPATHY": {"name": "Ganapathy Junction", "lat": 11.0360, "lon": 76.9790, "signal": True},
    "NODE_SARAVANAMPATTI": {"name": "Saravanampatti IT Corridor Junction", "lat": 11.0780, "lon": 76.9980, "signal": True},
    "NODE_SUKRAWARPET": {"name": "Sukrawarpet / Flower Market", "lat": 11.0080, "lon": 76.9540, "signal": True},
    "NODE_SAIBABA_COLONY": {"name": "Saibaba Colony NSR Rd Junction", "lat": 11.0245, "lon": 76.9480, "signal": True},
    "NODE_THUDIYALUR": {"name": "Thudiyalur Junction", "lat": 11.0760, "lon": 76.9380, "signal": True},
    "NODE_UKKADAM": {"name": "Ukkadam Bus Terminal Junction", "lat": 10.9910, "lon": 76.9580, "signal": True},
    "NODE_EACHANARI": {"name": "Eachanari Temple Junction", "lat": 10.9320, "lon": 76.9650, "signal": True},
    "NODE_CROSS_CUT": {"name": "Cross Cut 100ft Road Interchange", "lat": 11.0195, "lon": 76.9580, "signal": False},
    "NODE_RS_PURAM": {"name": "DB Road / Post Office Junction (RS Puram)", "lat": 11.0090, "lon": 76.9470, "signal": True},
}

DEMO_USERS = [
    {"username": "admin", "email": "admin@smartcity.coimbatore.gov.in", "role": "ADMIN", "full_name": "Municipal Chief Commissioner"},
    {"username": "planner", "email": "planner@smartcity.coimbatore.gov.in", "role": "CITY_PLANNER", "full_name": "Senior Urban Planner"},
    {"username": "traffic_op", "email": "traffic@smartcity.coimbatore.gov.in", "role": "TRAFFIC_OPERATOR", "full_name": "Traffic Command Controller"},
    {"username": "energy_op", "email": "energy@smartcity.coimbatore.gov.in", "role": "ENERGY_OPERATOR", "full_name": "TANGEDCO Grid Engineer"},
    {"username": "analyst", "email": "analyst@smartcity.coimbatore.gov.in", "role": "ANALYST", "full_name": "Urban Data Scientist"},
    {"username": "viewer", "email": "viewer@smartcity.coimbatore.gov.in", "role": "VIEWER", "full_name": "Citizen / Public Viewer"},
]

async def seed_data():
    logger.info("Starting geospatial and entity seeding for Coimbatore...")
    async with AsyncSessionLocal() as session:
        # 1. Seed Nodes
        for node_id, meta in NODE_METADATA.items():
            existing = await session.get(RoadNode, node_id)
            if not existing:
                node = RoadNode(
                    node_id=node_id,
                    name=meta["name"],
                    latitude=meta["lat"],
                    longitude=meta["lon"],
                    is_signalized=meta["signal"],
                    junction_type="signalized" if meta["signal"] else "roundabout"
                )
                session.add(node)
        await session.commit()
        logger.info(f"Seeded {len(NODE_METADATA)} road nodes/junctions.")

        # 2. Seed Road Segments from GeoJSON
        corridors_geojson_path = root_dir / "data" / "geojson" / "coimbatore_corridors.geojson"
        with open(corridors_geojson_path, "r", encoding="utf-8") as f:
            geojson_data = json.load(f)

        segment_count = 0
        for feature in geojson_data["features"]:
            props = feature["properties"]
            geom = feature["geometry"]
            existing = await session.get(RoadSegment, props["segment_id"])
            if not existing:
                segment = RoadSegment(
                    segment_id=props["segment_id"],
                    corridor_name=props["corridor_name"],
                    start_node_id=props["start_node_id"],
                    end_node_id=props["end_node_id"],
                    length_meters=props["length_meters"],
                    speed_limit_kmh=props["speed_limit_kmh"],
                    lane_count=props["lane_count"],
                    capacity_vph=props["capacity_vph"],
                    coordinates_json=json.dumps(geom["coordinates"])
                )
                session.add(segment)
                segment_count += 1
        await session.commit()
        logger.info(f"Seeded {segment_count} road segments.")

        # 3. Seed Energy Zones from GeoJSON
        energy_geojson_path = root_dir / "data" / "geojson" / "coimbatore_energy_zones.geojson"
        with open(energy_geojson_path, "r", encoding="utf-8") as f:
            energy_data = json.load(f)

        zone_count = 0
        for feature in energy_data["features"]:
            props = feature["properties"]
            geom = feature["geometry"]
            existing = await session.get(EnergyZone, props["zone_id"])
            if not existing:
                zone = EnergyZone(
                    zone_id=props["zone_id"],
                    name=props["name"],
                    substation_type=props["substation_type"],
                    capacity_mw=props["capacity_mw"],
                    polygon_coordinates_json=json.dumps(geom["coordinates"])
                )
                session.add(zone)
                zone_count += 1
        await session.commit()
        logger.info(f"Seeded {zone_count} energy zones.")

        # 4. Seed Demo Users for RBAC
        default_pwd_hash = hash_password("coimbatore2026")
        for u in DEMO_USERS:
            existing = await session.execute(User.__table__.select().where(User.username == u["username"]))
            if not existing.scalar_one_or_none():
                user = User(
                    username=u["username"],
                    email=u["email"],
                    hashed_password=default_pwd_hash,
                    full_name=u["full_name"],
                    role=u["role"],
                    is_active=True
                )
                session.add(user)
        await session.commit()
        logger.info(f"Seeded {len(DEMO_USERS)} RBAC demo users.")

        # 5. Seed initial baseline environmental telemetry
        env_sample = EnvironmentalTelemetry(
            station_id="CPCB_COIMBATORE_01",
            station_name="SIDCO Kurichi / Peelamedu Air Station",
            latitude=11.0168,
            longitude=76.9558,
            aqi=78,
            pm25=24.5,
            pm10=52.0,
            no2=18.2,
            co=0.6,
            temperature_c=29.0,
            humidity_pct=62.0,
            traffic_emission_contribution_pct=32.5,
            data_origin="REAL_TIME"
        )
        session.add(env_sample)
        await session.commit()
        logger.info("Seeded initial environmental telemetry baseline.")

    logger.info("Coimbatore geospatial seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_data())
