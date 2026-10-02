# Antigravity Implementation Prompts: Phase 0 to Phase 28
## Coimbatore Smart City Digital Twin Platform

This document contains 29 sequential, copy-pasteable implementation prompts designed for Antigravity.
Every phase is self-contained and adheres strictly to the 15-part prompt specification.

---

### GLOBAL ANTIGRAVITY AGENT RULES (Applies to all prompts)
- Always inspect existing repository files before modifying anything.
- Do not overwrite working functionality unnecessarily; reuse existing components and services.
- Maintain consistent naming conventions (camelCase in React/TS, snake_case in Python).
- Store all configuration in `.env` files; never hardcode API keys or database credentials.
- Add informative loading states, empty states, and resilient error boundaries in the UI.
- Validate all incoming API inputs using Pydantic v2.
- Clearly tag all data with `data_origin`: `REAL_TIME`, `HISTORICAL`, or `SIMULATED`.
- Run tests after implementation and fix any bugs before concluding the phase.

---

## PHASE 0: Project Planning & Architecture Initialization

```markdown
### 1. Objective
Establish the foundational documentation, architecture manifests, environment variables, and Docker Compose development services for the Coimbatore Smart City Digital Twin.

### 2. Context
We are building a software-only digital twin of Coimbatore city covering Traffic, Energy, and Environmental intelligence. Live sensors are not required; we leverage OpenStreetMap, Open-Meteo, public data, and a realistic physics-based synthetic simulation engine.

### 3. Files to Create
- `README.md`
- `.env.example`
- `.gitignore`
- `docker-compose.yml`
- `docs/ARCHITECTURE.md`
- `docs/API_CONTRACTS.md`

### 4. Files to Modify
None (initialization).

### 5. Exact Functionality
- Document the end-to-end architecture, corridor list (Avinashi Rd, Trichy Rd, Sathy Rd, Mettupalayam Rd, Pollachi Rd), and energy zones.
- Create `.env.example` with standard defaults: Postgres, TimescaleDB, Redis, Open-Meteo URLs, port allocations (Frontend: 5173, Backend: 8000, DB: 5432, Redis: 6379).
- Configure `docker-compose.yml` to launch:
  1. `timescaledb`: TimescaleDB 2.14 on Postgres 16 with PostGIS extension.
  2. `redis`: Redis 7 alpine for cache and pub/sub.
  3. Placeholder service blocks for `backend` and `frontend`.

### 6. UI Requirements
N/A for Phase 0.

### 7. Backend Requirements
N/A for Phase 0.

### 8. Database Requirements
Dockerized PostgreSQL 16 image with PostGIS and TimescaleDB enabled (`timescale/timescaledb-ha:pg16`). Health checks configured on port 5432.

### 9. API Requirements
Define OpenAPI contract specs in `docs/API_CONTRACTS.md` for `/api/v1/traffic`, `/api/v1/energy`, `/api/v1/environment`, and `/api/v1/ws/telemetry`.

### 10. ML Requirements
Document feature schema and training/evaluation metrics (MAE, RMSE, MAPE) in `docs/ARCHITECTURE.md`.

### 11. Validation Requirements
Verify YAML syntax of `docker-compose.yml` and ensure `.gitignore` excludes `node_modules`, `__pycache__`, `.venv`, `.env`, and local model weights.

### 12. Testing Requirements
Verify that Docker Compose config validates cleanly (`docker compose config`).

### 13. Acceptance Criteria
- `docker compose config` exits with code 0.
- All 5 core corridors and energy zones are documented.
- All environment variables are documented with clear comments.

### 14. Commands to Run
docker compose config
git status

### 15. Expected Result
Valid Docker Compose configuration and complete architectural blueprint documentation ready for repository scaffolding.
```

---

## PHASE 1: Repository and Folder Setup

```markdown
### 1. Objective
Scaffold the complete monorepo directory structure, Python virtual environment, package dependencies, frontend Vite workspace, and pre-commit linting configs.

### 2. Context
The project requires a modular architecture separating Frontend (React/Vite), Backend (FastAPI), ML pipelines (Scikit-Learn/LightGBM/XGBoost), Simulation Engine, and Data Scripts.

### 3. Files to Create
- `backend/requirements.txt`
- `backend/pyproject.toml`
- `backend/app/main.py`
- `frontend/package.json`
- `frontend/vite.config.ts`
- `frontend/tsconfig.json`
- `frontend/index.html`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `.editorconfig`

### 4. Files to Modify
- `README.md` (add quickstart instructions).

### 5. Exact Functionality
- Scaffold directories: `backend/app/{api,core,models,services,ml,simulation,db}`, `frontend/src/{components,hooks,pages,services,types,utils,assets}`, `ml/{training,evaluation,models}`, `data/{osm,historical,geojson}`, and `tests/{backend,frontend,ml}`.
- Setup `requirements.txt` with: `fastapi`, `uvicorn[standard]`, `pydantic>=2.0`, `sqlalchemy>=2.0`, `asyncpg`, `geoalchemy2`, `shapely`, `lightgbm`, `xgboost`, `scikit-learn`, `shap`, `redis`, `httpx`, `pytest`.
- Initialize standard Vite React TypeScript frontend with basic health-check root component.

### 6. UI Requirements
Minimalist dark-themed screen displaying "Coimbatore Smart City Digital Twin - System Initializing...".

### 7. Backend Requirements
Minimal FastAPI app with `/health` returning `{"status": "online", "city": "Coimbatore", "timestamp": "..."}`.

### 8. Database Requirements
None for this phase.

### 9. API Requirements
- `GET /health` -> 200 OK.

### 10. ML Requirements
Create placeholder directories and empty `__init__.py` files under `ml/`.

### 11. Validation Requirements
Verify Python packages install cleanly without conflicts and frontend compiles via `npm run build`.

### 12. Testing Requirements
Smoke test `/health` via pytest or curl.

### 13. Acceptance Criteria
- `uvicorn backend.app.main:app` boots cleanly on port 8000.
- `npm run dev` serves Vite on port 5173.
- Directory structure matches production specifications.

### 14. Commands to Run
pip install -r backend/requirements.txt
cd frontend && npm install && npm run build
python -m pytest tests/

### 15. Expected Result
Both backend and frontend run locally without errors and communicate over HTTP.
```

---

## PHASE 2: React Dashboard Foundation & Design System

```markdown
### 1. Objective
Build the responsive dark-mode Smart City Command Center layout with Tailwind CSS, custom design tokens, glassmorphism headers, navigation drawers, and real-time status banners.

### 2. Context
The Digital Twin interface must look like a high-tech municipal command center (similar to Palantir Foundry / Bloomberg terminal for cities). It must impress evaluators with curated HSL dark tones (`#0B0F19`, `#111827`, `#1E293B`), neon accents (Cyan, Emerald, Amber, Crimson), and subtle micro-animations.

### 3. Files to Create
- `frontend/src/index.css`
- `frontend/tailwind.config.js`
- `frontend/src/components/layout/CommandHeader.tsx`
- `frontend/src/components/layout/SidebarNav.tsx`
- `frontend/src/components/layout/DashboardLayout.tsx`
- `frontend/src/components/common/KpiCard.tsx`
- `frontend/src/components/common/BadgeOrigin.tsx`
- `frontend/src/types/telemetry.ts`

### 4. Files to Modify
- `frontend/src/App.tsx`

### 5. Exact Functionality
- Header displays: Coimbatore Smart City Digital Twin logo, live IST clock (hh:mm:ss AM/PM), System Health pulse (Green), Data Origin indicator (`SIMULATED ENGINE ACTIVE`), and quick scenario launcher trigger.
- Navigation Sidebar allows toggling between: Overview Twin, Traffic Intelligence, Energy Grid, Environmental Monitor, What-If Simulator, and AI Assistant.
- Reusable `BadgeOrigin` component clearly displays whether a metric is `[LIVE API]` (Green badge), `[HISTORICAL]` (Blue badge), or `[SIMULATED]` (Amber badge).
- 4 Top KPI cards: Overall City Congestion Index (%), Average Corridor Speed (km/h), Total Energy Demand (MW), and City Air Quality Index (AQI).

### 6. UI Requirements
- Glassmorphism: `backdrop-blur-md bg-slate-900/80 border border-slate-800`.
- Inter / Outfit modern sans typography.
- Smooth Framer Motion or CSS transitions on hover and route switches.

### 7. Backend Requirements
None (mock data state hooks in frontend for now).

### 8. Database Requirements
None for this phase.

### 9. API Requirements
None (static design system phase).

### 10. ML Requirements
None for this phase.

### 11. Validation Requirements
Ensure layout is responsive across 1080p desktop, 1440p ultrawide, and laptop screens without horizontal overflow.

### 12. Testing Requirements
Verify frontend components render without React console warnings.

### 13. Acceptance Criteria
- Clean, futuristic command center UI renders in browser.
- Time ticks accurately in IST every second.
- Data origin badges render with correct color codes.

### 14. Commands to Run
cd frontend && npm run dev

### 15. Expected Result
Command Center shell is visible on `http://localhost:5173` with working KPI cards and navigation tabs.
```

---

## PHASE 3: FastAPI Backend Foundation & Architecture

```markdown
### 1. Objective
Implement the core FastAPI application architecture with asynchronous lifespan management, CORS, structured JSON logging, global exception handling, dependency injection, and modular API routers.

### 2. Context
The backend serves high-frequency telemetry, predictions, cause calculations, and WebSocket streaming. It must be resilient, strictly typed via Pydantic v2, and follow clean architecture.

### 3. Files to Create
- `backend/app/core/config.py`
- `backend/app/core/logging.py`
- `backend/app/core/exceptions.py`
- `backend/app/api/v1/router.py`
- `backend/app/api/v1/endpoints/health.py`
- `backend/app/api/v1/endpoints/traffic.py`
- `backend/app/api/v1/endpoints/energy.py`
- `backend/app/api/v1/endpoints/environment.py`
- `backend/app/api/v1/endpoints/simulation.py`

### 4. Files to Modify
- `backend/app/main.py`

### 5. Exact Functionality
- `config.py`: Uses `pydantic-settings` to load DB credentials, CORS origins, and API keys.
- Structured logger outputs timestamps, log level, request IDs, and module names.
- Central error handler catches validation errors and returns uniform error JSON: `{"success": false, "error": {"code": "...", "message": "..."}}`.
- Wire up `/api/v1/` subrouters with placeholder stub endpoints returning 200 OK.

### 6. UI Requirements
N/A.

### 7. Backend Requirements
- Lifespan context manager in `main.py` for DB connection pool and cache initialization.
- Middleware: CORS (`*` for development), GZip compression, and Request Timing middleware adding `X-Process-Time` header.

### 8. Database Requirements
None (connection stubs).

### 9. API Requirements
- `GET /api/v1/health`
- `GET /api/v1/traffic/status`
- `GET /api/v1/energy/status`
- `GET /api/v1/environment/status`

### 10. ML Requirements
None for this phase.

### 11. Validation Requirements
Ensure Swagger UI is auto-generated and fully interactive at `http://localhost:8000/docs`.

### 12. Testing Requirements
Create `tests/backend/test_health.py` and run via `pytest`.

### 13. Acceptance Criteria
- Server starts with `uvicorn backend.app.main:app --reload`.
- Swagger docs accessible at `/docs` with grouped v1 routes.
- All tests pass.

### 14. Commands to Run
pytest tests/backend/
curl http://localhost:8000/api/v1/health

### 15. Expected Result
FastAPI server returns structured health response with process timing headers.
```

---

## PHASE 4: PostgreSQL & TimescaleDB Setup

```markdown
### 1. Objective
Configure the PostgreSQL 16 database with PostGIS and TimescaleDB extensions, asynchronous SQLAlchemy 2.0 session factory, connection pooling, and automated database migration infrastructure with Alembic.

### 2. Context
The digital twin stores geospatial vectors (road networks, bus stops, zones) alongside high-velocity time-series sensor telemetry. TimescaleDB hypertables are essential for automated data partitioning and sub-millisecond time-range queries.

### 3. Files to Create
- `backend/app/db/session.py`
- `backend/app/db/base.py`
- `backend/alembic.ini`
- `backend/alembic/env.py`
- `backend/alembic/script.py.mako`
- `scripts/init_db.py`

### 4. Files to Modify
- `docker-compose.yml` (confirm PostGIS/TimescaleDB container config).
- `backend/app/core/config.py` (add database connection string).

### 5. Exact Functionality
- `session.py`: Implements `create_async_engine` using `asyncpg` with connection pool size = 20, max overflow = 10.
- Provide `get_db` FastAPI dependency for request-scoped database sessions.
- `init_db.py` script automatically runs `CREATE EXTENSION IF NOT EXISTS postgis;` and `CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;`.

### 6. UI Requirements
N/A.

### 7. Backend Requirements
Async database engine with auto-reconnect and transaction rollback on exception.

### 8. Database Requirements
- PostgreSQL 16 + TimescaleDB + PostGIS active.
- Verify extension status via SQL query.

### 9. API Requirements
Add `GET /api/v1/health/db` endpoint to verify live database latency and extension status.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Verify that raw SQL `SELECT PostGIS_Version(), extversion FROM pg_extension WHERE extname = 'timescaledb';` returns non-null values.

### 12. Testing Requirements
Write integration test in `tests/backend/test_db_connection.py`.

### 13. Acceptance Criteria
- Database initializes cleanly in Docker.
- Extensions PostGIS and TimescaleDB are confirmed active.
- `/api/v1/health/db` returns status 200 with DB version.

### 14. Commands to Run
docker compose up -d timescaledb
python scripts/init_db.py
pytest tests/backend/test_db_connection.py

### 15. Expected Result
TimescaleDB and PostGIS operational; database connection verified.
```

---

## PHASE 5: Database Schema & Coimbatore Geospatial Seeding

```markdown
### 1. Objective
Define SQLAlchemy ORM models, Alembic migrations, and seed real Coimbatore road network geometries, junctions, and energy zones into PostGIS and TimescaleDB hypertables.

### 2. Context
The digital twin must accurately represent Coimbatore landmarks: Avinashi Road (Hope College, Peelamedu, TIDEL, KMCH, Airport), Trichy Road (Ramanathapuram, Sungam, Singanallur, Ondipudur), Sathy Road (Gandhipuram, Ganapathy, Saravanampatti), Mettupalayam Road (Saibaba Colony, Thudiyalur), and Pollachi Road (Ukkadam, Eachanari).

### 3. Files to Create
- `backend/app/models/traffic.py` (RoadNode, RoadSegment, TrafficTelemetry)
- `backend/app/models/energy.py` (EnergyZone, EnergyTelemetry)
- `backend/app/models/environment.py` (EnvironmentalTelemetry)
- `backend/app/models/incidents.py` (UrbanIncident, UrbanAlert)
- `scripts/seed_coimbatore_geo.py`
- `data/geojson/coimbatore_corridors.geojson`
- `data/geojson/coimbatore_energy_zones.geojson`

### 4. Files to Modify
- `backend/app/db/base.py` (import all models for Alembic discovery).

### 5. Exact Functionality
- Define ORM models matching the database design in the specification.
- Mark `traffic_telemetry`, `energy_telemetry`, and `environmental_telemetry` as TimescaleDB hypertables partitioned by `recorded_at` (1-day chunk intervals).
- `seed_coimbatore_geo.py`: Ingests actual latitude/longitude coordinates of Coimbatore junctions and road LineStrings into `road_nodes` and `road_segments`. Ingests 5 major energy zones (Metro Central, North IT, East Industrial, South Residential, Kurichi SIDCO).

### 6. UI Requirements
N/A.

### 7. Backend Requirements
Async ORM repository methods to query road segments with GeoJSON output.

### 8. Database Requirements
- Tables created with spatial GIST indexes on all `geom` columns.
- Hypertables confirmed via `SELECT * FROM timescaledb_information.hypertables;`.

### 9. API Requirements
- `GET /api/v1/gis/corridors` -> Returns GeoJSON FeatureCollection of Coimbatore road segments.
- `GET /api/v1/gis/energy-zones` -> Returns GeoJSON FeatureCollection of energy zones.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Validate all coordinates fall within Coimbatore bounding box: `lat: [10.90, 11.15], lon: [76.85, 77.10]`.

### 12. Testing Requirements
Verify database query returns 15+ road segments and 5 energy zones.

### 13. Acceptance Criteria
- Alembic migration runs without errors.
- Seeding script populates Coimbatore GIS entities.
- `/api/v1/gis/corridors` returns valid GeoJSON.

### 14. Commands to Run
alembic revision --autogenerate -m "create_initial_schema"
alembic upgrade head
python scripts/seed_coimbatore_geo.py
pytest tests/backend/test_gis_endpoints.py

### 15. Expected Result
PostGIS database contains verified Coimbatore corridors and energy zones accessible via GeoJSON REST endpoints.
```

---

## PHASE 6: Realistic Synthetic Data Simulation Engine

```markdown
### 1. Objective
Build an autonomous, physics-grounded synthetic simulation service that continuously generates realistic traffic flow, energy consumption, and environmental telemetry for Coimbatore with distinct diurnal peaks.

### 2. Context
Because live citywide IoT feeds are simulated in a software-only project, the simulation engine must not generate flat random noise. It must replicate:
- Traffic: Morning peak (08:30-10:30 AM), Evening peak (17:30-20:30 PM), Saravanampatti IT commuter surge, Singanallur junction bottlenecks, and weekend relaxation.
- Energy: Dual diurnal peak (10:00-12:00 AM industrial, 19:00-22:00 PM residential AC), ambient temperature correlation ($+25\text{ MW}/^{\circ}\text{C}$).
- Clear tagging: `data_origin = 'SIMULATED'`.

### 3. Files to Create
- `backend/app/simulation/traffic_sim.py`
- `backend/app/simulation/energy_sim.py`
- `backend/app/simulation/environment_sim.py`
- `backend/app/simulation/incident_generator.py`
- `backend/app/simulation/engine.py`
- `scripts/run_simulator.py`

### 4. Files to Modify
- `backend/app/main.py` (optionally trigger simulation worker in background).

### 5. Exact Functionality
- `traffic_sim.py`: Implements Greenshields traffic density model: speed decreases non-linearly as vehicle count approaches corridor capacity; computes congestion score (0-100) and queue length.
- `energy_sim.py`: Computes active power demand ($P(t) = P_{\text{base}} + P_{\text{diurnal}}(t) + 2.5 \cdot \max(0, T_{\text{ambient}} - 26) + \epsilon$).
- `environment_sim.py`: Generates PM2.5 and AQI linked to stop-and-go traffic emissions on nearby road segments.
- `incident_generator.py`: Allows injecting simulated events (e.g. "Accident near TIDEL Park Junction", reducing lane capacity by 60%).

### 6. UI Requirements
N/A.

### 7. Backend Requirements
Async background task with configurable interval (default: generates a time slice every 5 seconds).

### 8. Database Requirements
Bulk inserts into `traffic_telemetry`, `energy_telemetry`, and `environmental_telemetry`.

### 9. API Requirements
- `POST /api/v1/simulation/tick`: Triggers manual single-step generation.
- `POST /api/v1/simulation/inject-incident`: Injects an incident at a specific segment.
- `POST /api/v1/simulation/reset`: Clears simulated state.

### 10. ML Requirements
Ensure synthetic data distributions provide realistic training variance for ML models.

### 11. Validation Requirements
Verify generated congestion score values are bounded between 0 and 100. Check that morning and evening time slices show higher congestion.

### 12. Testing Requirements
Unit test the mathematical models in `tests/simulation/test_physics_models.py`.

### 13. Acceptance Criteria
- Running `python scripts/run_simulator.py --duration 60` populates 1 hour of simulated telemetry.
- Telemetry shows clear peak vs off-peak differences.
- All rows contain `data_origin: 'SIMULATED'`.

### 14. Commands to Run
python scripts/run_simulator.py --ticks 100
pytest tests/simulation/

### 15. Expected Result
Realistic time-series records populated in TimescaleDB with distinct peak-hour signatures.
```

---

## PHASE 7: Traffic Ingestion & Core Traffic REST APIs

```markdown
### 1. Objective
Develop high-performance REST APIs to query current corridor traffic states, junction congestion indices, bottleneck rankings, historical telemetry intervals, and active incidents.

### 2. Context
The frontend and digital twin map require sub-50ms access to corridor states, congestion categorizations (`LOW`, `MODERATE`, `HIGH`, `SEVERE`), average speeds, and travel time deltas across all Coimbatore routes.

### 3. Files to Create
- `backend/app/schemas/traffic.py` (Pydantic schemas: TrafficCurrentResponse, CorridorSummary, SegmentDetail)
- `backend/app/services/traffic_service.py`
- `backend/app/api/v1/endpoints/traffic.py` (expand)

### 4. Files to Modify
- `backend/app/api/v1/router.py`

### 5. Exact Functionality
- `GET /api/v1/traffic/corridors/current`: Returns current status of all 5 Coimbatore corridors, including average speed, congestion level, queue length, and `data_origin`.
- `GET /api/v1/traffic/segments/{segment_id}`: Returns granular metrics for a specific segment.
- `GET /api/v1/traffic/bottlenecks`: Returns the top 5 congested junctions in Coimbatore ordered by congestion score descending.
- `GET /api/v1/traffic/history?segment_id=...&hours=24`: Returns time-series telemetry for charting.

### 6. UI Requirements
N/A.

### 7. Backend Requirements
- Implement 30-second Redis caching on `traffic/corridors/current` to minimize DB load.
- Return calculated travel-time delay factor (`current_travel_time / free_flow_travel_time`).

### 8. Database Requirements
Optimized SQL queries leveraging TimescaleDB `time_bucket` aggregations.

### 9. API Requirements
Strict Pydantic response models with documentation examples.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Verify API response times are under 60ms.

### 12. Testing Requirements
Write API integration tests in `tests/backend/test_traffic_api.py`.

### 13. Acceptance Criteria
- All endpoints return 200 OK with expected JSON structure.
- Bottleneck endpoint correctly ranks Singanallur and Saravanampatti high during peak hours.

### 14. Commands to Run
pytest tests/backend/test_traffic_api.py
curl http://localhost:8000/api/v1/traffic/bottlenecks

### 15. Expected Result
Traffic APIs successfully serve live and aggregated telemetry with sub-60ms response times.
```

---

## PHASE 8: Interactive Coimbatore Digital Twin Map (MapLibre GL JS)

```markdown
### 1. Objective
Build an interactive, high-performance 2.5D/3D GIS map centered on Coimbatore using MapLibre GL JS, featuring colored traffic congestion overlays, junction bottleneck markers, and 3D building extrusions.

### 2. Context
Evaluators should immediately recognize Coimbatore's urban geography. The map must center at `[76.9558, 11.0168]`, render roads color-coded by congestion level (Green: Low, Amber: Moderate, Orange: High, Crimson: Severe), and allow clicking segments to view detailed live telemetry.

### 3. Files to Create
- `frontend/src/components/map/DigitalTwinMap.tsx`
- `frontend/src/components/map/MapControls.tsx`
- `frontend/src/components/map/SegmentPopup.tsx`
- `frontend/src/components/map/layers/TrafficLayer.ts`
- `frontend/src/components/map/layers/BuildingLayer.ts`
- `frontend/src/services/gisApi.ts`

### 4. Files to Modify
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/index.css` (add map canvas styling)

### 5. Exact Functionality
- Loads vector/raster base map tiles (CartoDB Dark Matter / OpenStreetMap tiles).
- Queries `/api/v1/gis/corridors` and `/api/v1/traffic/corridors/current` via TanStack Query.
- Binds congestion levels to road line colors:
  - Low (<30): `#10B981` (Emerald)
  - Moderate (30-60): `#F59E0B` (Amber)
  - High (60-85): `#F97316` (Orange)
  - Severe (>85): `#EF4444` (Crimson glowing line)
- Click on any road segment displays popup with: Corridor Name, Current Speed, Congestion Score, Queue Length, Travel Time Delay, and Data Origin Badge.
- Includes 2.5D pitch/bearing controls and zoom-to-corridor shortcuts (Avinashi Rd, Sathy Rd, etc.).

### 6. UI Requirements
- Dark mode map container with smooth zoom/pan interactions.
- Legend displaying color thresholds and data freshness timestamp.

### 7. Backend Requirements
Ensure GeoJSON corridor endpoint returns valid coordinates and properties.

### 8. Database Requirements
None.

### 9. API Requirements
Integration with `GET /api/v1/gis/corridors` and `GET /api/v1/traffic/corridors/current`.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Ensure no WebGL canvas context errors on map unmount/remount.

### 12. Testing Requirements
Verify map container mounts and renders layers without throwing JavaScript exceptions.

### 13. Acceptance Criteria
- Map centers on Coimbatore with visible road networks.
- Corridors are color-coded dynamically according to live congestion score.
- Clicking a segment displays the telemetry card popup.

### 14. Commands to Run
cd frontend && npm run dev

### 15. Expected Result
Interactive 2.5D Map of Coimbatore live in browser with real-time colored traffic corridors.
```

---

## PHASE 9: Traffic Analytics & Historical Trends View

```markdown
### 1. Objective
Implement a dedicated Traffic Analytics module featuring hourly speed distributions, peak-hour heatmaps, corridor delay comparisons, and historical time-series charts using Recharts.

### 2. Context
City planners require historical trend analysis to observe recurring bottlenecks (e.g., Avinashi Road Hope College junction delays on Monday mornings) and evaluate long-term traffic degradation.

### 3. Files to Create
- `frontend/src/components/traffic/TrafficTrendsChart.tsx`
- `frontend/src/components/traffic/CorridorSpeedComparison.tsx`
- `frontend/src/components/traffic/PeakHourHeatmap.tsx`
- `frontend/src/components/traffic/BottleneckRankingList.tsx`
- `frontend/src/pages/TrafficAnalyticsPage.tsx`
- `frontend/src/services/trafficApi.ts`

### 4. Files to Modify
- `frontend/src/App.tsx` (add route `/traffic`)

### 5. Exact Functionality
- `TrafficTrendsChart`: Multi-line chart comparing average speed vs. congestion score over the selected time range (6h, 24h, 7d).
- `CorridorSpeedComparison`: Horizontal bar chart displaying speed deficit across all 5 major corridors against their free-flow speed limit.
- `BottleneckRankingList`: Ranked list of top congestion spots with trend indicators (increasing / stable / easing).
- Range selector allowing administrators to toggle between 6 hours, 24 hours, and 7 days.

### 6. UI Requirements
- Dark glassmorphism cards.
- Recharts responsive containers with custom tooltips displaying timestamp, speed (km/h), and data origin.

### 7. Backend Requirements
- `GET /api/v1/traffic/trends?range={6h|24h|7d}`: Aggregates historical telemetry using TimescaleDB `time_bucket('15 minutes', recorded_at)`.

### 8. Database Requirements
Time-series bucket query optimization using TimescaleDB continuous aggregates where appropriate.

### 9. API Requirements
Strict schema returning array of `{ timestamp, corridor_name, avg_speed, avg_congestion }`.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Verify charts handle empty or missing data points gracefully without UI crash.

### 12. Testing Requirements
Test API endpoint performance and check frontend chart rendering with mocked time-series data.

### 13. Acceptance Criteria
- `/traffic` page displays interactive charts.
- Toggling between 6h and 24h updates data smoothly.
- Data origin badges are clearly displayed on all charts.

### 14. Commands to Run
pytest tests/backend/test_traffic_api.py
cd frontend && npm test

### 15. Expected Result
Fully interactive Traffic Analytics view displaying speed and congestion trends for Coimbatore.
```

---

## PHASE 10: Multi-Horizon Traffic Prediction ML Pipeline

```markdown
### 1. Objective
Develop, train, evaluate, and serialize a multi-horizon Machine Learning pipeline predicting traffic congestion (15m, 30m, 60m, 120m) for all Coimbatore road segments using LightGBM and Scikit-Learn.

### 2. Context
Simple regression is insufficient for complex urban dynamics. We implement a time-series feature pipeline incorporating temporal cyclics (`sin_hour`, `cos_hour`), spatial lags (speeds from adjacent upstream segments), weather parameters (rain, temperature), and active incident indicators.

### 3. Files to Create
- `ml/features/traffic_features.py`
- `ml/training/train_traffic.py`
- `ml/evaluation/evaluate_traffic.py`
- `ml/models/traffic_predictor.py`
- `backend/app/services/prediction_service.py`
- `backend/app/api/v1/endpoints/predictions.py`

### 4. Files to Modify
- `backend/app/api/v1/router.py`

### 5. Exact Functionality
- `traffic_features.py`: Extracts temporal cyclic features, historical lag values (15m, 30m, 60m), rolling mean/std of speed, and upstream corridor speed.
- `train_traffic.py`: Splits data chronologically (no future data leakage: Train 70%, Val 15%, Test 15%). Trains independent LightGBM regressors for $H \in \{15, 30, 60, 120\}$ minutes.
- `evaluate_traffic.py`: Computes MAE, RMSE, and $R^2$ scores for each horizon.
- Exports trained models to `ml/models/weights/lightgbm_traffic_{horizon}m.pkl`.
- `prediction_service.py`: Loads models in FastAPI and exposes fast inference.

### 6. UI Requirements
N/A (model training phase; API exposed for future UI).

### 7. Backend Requirements
Async inference service caching recent predictions in Redis to maintain $<25\text{ms}$ response times.

### 8. Database Requirements
Store generated predictions in `traffic_predictions` table for validation against actual future conditions.

### 9. API Requirements
- `GET /api/v1/predictions/traffic?segment_id=...&horizon={15|30|60|120}`: Returns `{ predicted_congestion, predicted_speed, confidence_score, expected_travel_time_sec }`.

### 10. ML Requirements
- Baseline model: Persistence model ($C(t+H) = C(t)$).
- LightGBM model must outperform baseline MAE by at least 25% on the test set.

### 11. Validation Requirements
Ensure time-series split prevents lookahead bias (Train max timestamp < Test min timestamp).

### 12. Testing Requirements
Write `tests/ml/test_traffic_model.py` verifying model serialization, loading, and inference shape.

### 13. Acceptance Criteria
- Training script executes and achieves test MAE $< 6.5$ congestion points.
- Endpoint `/api/v1/predictions/traffic` returns predictions with confidence scores.

### 14. Commands to Run
python ml/training/train_traffic.py
python ml/evaluation/evaluate_traffic.py
pytest tests/ml/test_traffic_model.py

### 15. Expected Result
Trained LightGBM models serialized and integrated into FastAPI prediction endpoint.
```

---

## PHASE 11: Explainable AI (XAI) Cause Analysis Engine

```markdown
### 1. Objective
Build an Explainable AI (XAI) Cause Analysis Engine utilizing TreeSHAP and causal rule attribution to explain *why* traffic congestion is predicted to rise on any given Coimbatore corridor.

### 2. Context
City administrators must not receive black-box predictions. When the model forecasts severe congestion on Avinashi Road at 18:30, it must explain:
"Congestion is predicted to increase primarily due to Peak Hour Commuter Traffic (55%), Upstream Bottle-neck at Hope College (30%), and Rainy Weather (15%)."

### 3. Files to Create
- `ml/explainability/shap_explainer.py`
- `backend/app/services/cause_service.py`
- `backend/app/schemas/cause.py`
- `frontend/src/components/traffic/CauseAnalysisModal.tsx`
- `frontend/src/components/traffic/ShapContributionBar.tsx`

### 4. Files to Modify
- `backend/app/api/v1/endpoints/predictions.py`
- `frontend/src/components/map/SegmentPopup.tsx`

### 5. Exact Functionality
- `shap_explainer.py`: Precomputes TreeSHAP explainer on the trained LightGBM models. Computes local SHAP values for current feature vectors during inference.
- Groups raw feature attributions into human-interpretable categories:
  - `Peak Hour Pattern` (from time/day cyclics)
  - `Upstream Propagation` (from adjacent corridor lag speeds)
  - `Weather & Visibility` (from rain/temp features)
  - `Active Incident / Work` (from road work or accident flags)
- Calculates relative percentage contribution and returns confidence rating.
- Frontend: Click "Analyze Cause" on any road popup to view a breakdown bar chart showing exact factor contributions with plain-language explanations.

### 6. UI Requirements
- Donut chart or horizontal percentage bar showing factor attributions.
- Clear disclaimer: "Model-derived causal estimation based on SHAP feature importance."

### 7. Backend Requirements
Sub-50ms TreeSHAP tree-path calculations using optimized TreeExplainer.

### 8. Database Requirements
Store cause breakdown JSON in `traffic_predictions.cause_breakdown`.

### 9. API Requirements
- `GET /api/v1/predictions/traffic/cause/{segment_id}?horizon=30`: Returns `{ primary_cause, contributions: { "Peak Hour": 0.55, ... }, confidence: 0.88, explanation: "..." }`.

### 10. ML Requirements
SHAP values must sum up to the difference between base expected value and predicted score.

### 11. Validation Requirements
Verify percentages sum to 100% ($\pm 1\%$).

### 12. Testing Requirements
Test explanation generator with edge-case feature inputs (e.g., midnight with no traffic vs rush hour downpour).

### 13. Acceptance Criteria
- Causal endpoint returns human-readable causes and percentage contributions.
- Frontend modal displays intuitive cause charts upon clicking road segments.

### 14. Commands to Run
pytest tests/ml/test_cause_engine.py
curl http://localhost:8000/api/v1/predictions/traffic/cause/SEG_AVINASHI_01?horizon=30

### 15. Expected Result
Complete XAI cause analysis pipeline functioning across API and dashboard UI.
```

---

## PHASE 12: Traffic Downstream Impact & Emission Analysis Engine

```markdown
### 1. Objective
Develop a Downstream Network Impact Engine that models congestion propagation through the road graph, calculates alternate route pressure, and estimates vehicular fuel waste and carbon emissions.

### 2. Context
A bottleneck on Avinashi Road does not stay isolated—it spills back to Peelamedu, causes vehicles to divert to Trichy Road, and causes stop-and-go idling that spikes emissions. We quantify this downstream chain reaction.

### 3. Files to Create
- `backend/app/services/impact_service.py`
- `backend/app/services/emission_service.py`
- `backend/app/schemas/impact.py`
- `frontend/src/components/traffic/ImpactFlowDiagram.tsx`
- `frontend/src/components/traffic/EmissionImpactCard.tsx`

### 4. Files to Modify
- `backend/app/api/v1/endpoints/traffic.py`
- `frontend/src/pages/DashboardPage.tsx`

### 5. Exact Functionality
- `impact_service.py`: Computes network spillover using the Coimbatore PostGIS road topology. Identifies upstream segments within 2 hops.
- `emission_service.py`: Implements EPA Vehicle Specific Power (VSP) estimation:
  - Fuel Consumption: $\Delta \text{Fuel (Liters)} = \text{Vehicles} \times \left( \frac{\text{Delay (hrs)} \times 1.2\text{ L/hr (idling)}}{1} \right)$.
  - CO2 Emissions: $\Delta \text{CO}_2 (\text{kg}) = \Delta \text{Fuel} \times 2.31\text{ kg CO}_2/\text{L}$.
- Calculates **Impact Severity Score**: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` based on delay duration, affected vehicles, and transit route interference.
- Frontend: Flow diagram depicting chain reaction: Current Condition -> Predicted Spillover -> Downstream Routes Affected -> Emission & Fuel Penalty.

### 6. UI Requirements
- Visual chain reaction diagram with animated flow arrows.
- KPI cards for "Estimated Extra Fuel Burned" (Litres) and "Excess CO2 Emitted" (kg).

### 7. Backend Requirements
Calculate multi-segment spillover within 100ms using graph adjacency list.

### 8. Database Requirements
None.

### 9. API Requirements
- `GET /api/v1/traffic/impact/{segment_id}`: Returns `{ impact_severity, affected_corridors: [...], extra_travel_time_mins, fuel_impact_liters, co2_impact_kg }`.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Ensure emission values scale proportionally with queue delay and vehicular volume.

### 12. Testing Requirements
Unit test the emission and graph propagation formulas in `tests/backend/test_impact_engine.py`.

### 13. Acceptance Criteria
- API calculates downstream spillover and emissions for any chosen bottleneck.
- UI visualizes impact severity and environmental cost clearly.

### 14. Commands to Run
pytest tests/backend/test_impact_engine.py
curl http://localhost:8000/api/v1/traffic/impact/SEG_AVINASHI_01

### 15. Expected Result
Downstream impact and emissions engine fully operational with visual UI reporting.
```

---

## PHASE 13: Interactive What-If Traffic Scenario Simulator

```markdown
### 1. Objective
Build an interactive "What-If" Traffic Scenario Simulator allowing city planners to test urban interventions (road closures, flyover construction, traffic volume surges, accidents) and visually compare baseline vs. simulated conditions.

### 2. Context
Administrators need to ask:
"What happens if Avinashi Road flyover construction closes 2 lanes near Hope College?"
"What happens if a major CODISSIA trade fair increases East Coimbatore traffic by 30%?"
The simulator computes network rerouting and displays side-by-side comparative digital twin maps.

### 3. Files to Create
- `backend/app/services/scenario_service.py`
- `backend/app/schemas/scenario.py`
- `backend/app/api/v1/endpoints/scenarios.py`
- `frontend/src/pages/WhatIfScenarioPage.tsx`
- `frontend/src/components/simulation/ScenarioControlPanel.tsx`
- `frontend/src/components/simulation/DualMapCompare.tsx`
- `frontend/src/components/simulation/DeltaMetricsSummary.tsx`

### 4. Files to Modify
- `backend/app/api/v1/router.py`
- `frontend/src/App.tsx` (add `/scenarios` route)

### 5. Exact Functionality
- `ScenarioControlPanel`: Lets users select scenario type:
  1. `Road Closure / Lane Restriction` (choose corridor + capacity reduction %)
  2. `Traffic Volume Surge` (+10%, +25%, +50%)
  3. `Severe Accident Injection`
  4. `Monsoon Flash Downpour` (-30% speed limit)
- `scenario_service.py`: Computes network equilibrium rebalance; diverts traffic to alternate corridors and calculates new congestion scores.
- `DualMapCompare`: Synchronized dual-map view:
  - Left Map: **Baseline (Current Reality)**
  - Right Map: **Simulated Scenario Result**
- `DeltaMetricsSummary`: Shows net citywide change: Average Speed (-14.2 km/h), Congestion Index (+18%), Additional Travel Delay (+22 mins), Extra Carbon Footprint (+410 kg CO2).

### 6. UI Requirements
- Split-screen comparison with synced pan/zoom between baseline and scenario maps.
- "Apply Scenario" and "Reset to Reality" action buttons with loading animations.

### 7. Backend Requirements
Compute network rerouting simulation in under 300ms.

### 8. Database Requirements
Store scenario definitions and simulation runs in a transient `simulation_runs` table for auditing.

### 9. API Requirements
- `POST /api/v1/scenarios/traffic/run`: Accepts scenario parameters, returns baseline vs. simulated corridor metrics.

### 10. ML Requirements
Use ML prediction model to re-forecast congestion under modified scenario feature conditions.

### 11. Validation Requirements
Ensure closed road shows 0 throughput and adjacent parallel corridors show increased volume.

### 12. Testing Requirements
Test scenario logic in `tests/simulation/test_traffic_scenarios.py`.

### 13. Acceptance Criteria
- User can configure and execute a scenario from the UI.
- Dual-map view displays visual contrast between baseline and simulated conditions.
- Delta metrics correctly quantify urban impact.

### 14. Commands to Run
pytest tests/simulation/test_traffic_scenarios.py
cd frontend && npm run dev

### 15. Expected Result
What-If traffic simulator fully functional with synchronized comparative map visualization.
```

---

## PHASE 14: Energy Grid Telemetry & Ingestion Pipeline

```markdown
### 1. Objective
Establish the Energy Digital Twin telemetry pipeline, modeling Coimbatore's 5 electrical distribution zones (Metro Central, North IT, East Industrial, South Residential, Kurichi SIDCO) with real-time demand monitoring, power factor, and weather sensitivity.

### 2. Context
Energy demand in Coimbatore is heavily driven by industrial textile/foundry operations (Peelamedu, Kurichi) during the day and residential cooling during hot afternoon/evening hours. We build the data pipelines to track zone-level power flows.

### 3. Files to Create
- `backend/app/schemas/energy.py`
- `backend/app/services/energy_service.py`
- `backend/app/api/v1/endpoints/energy.py` (expand)
- `frontend/src/services/energyApi.ts`
- `frontend/src/pages/EnergyTwinPage.tsx`
- `frontend/src/components/energy/ZoneDemandGrid.tsx`
- `frontend/src/components/energy/RealTimeLoadGauge.tsx`

### 4. Files to Modify
- `frontend/src/App.tsx` (add route `/energy`)

### 5. Exact Functionality
- `energy_service.py`: Computes current aggregated city electricity demand (MW), peak demand recorded today, minimum demand, and per-zone capacity headroom.
- Ingests ambient temperature and solar PV generation proxy.
- Frontend: `EnergyTwinPage` displaying:
  - Top Gauges: Current Citywide Load (MW vs Max Grid Capacity 1,500 MW), Grid Frequency (50.0 Hz $\pm 0.05$).
  - `ZoneDemandGrid`: Cards for each of the 5 zones showing current MW, % of substation capacity, voltage level, and `data_origin` badge.
  - Interactive Zone Map: Polygons colored by grid load intensity (Green: <60%, Amber: 60-85%, Red: >85% overload warning).

### 6. UI Requirements
- High-tech power grid monitoring aesthetic with neon cyan and amber gauges.
- Overload warning indicators when any substation exceeds 85% utilization.

### 7. Backend Requirements
Redis cache for current energy metrics with 10-second TTL.

### 8. Database Requirements
TimescaleDB hypertable queries over `energy_telemetry`.

### 9. API Requirements
- `GET /api/v1/energy/current`: Returns aggregate and zone-level power demand.
- `GET /api/v1/energy/history?zone_id=...&range=24h`: Returns 24-hour load profile.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Verify sum of individual zone demands equals total reported city demand.

### 12. Testing Requirements
Write integration tests in `tests/backend/test_energy_api.py`.

### 13. Acceptance Criteria
- `/api/v1/energy/current` returns accurate power metrics.
- Frontend `/energy` page renders interactive load gauges and zone cards.

### 14. Commands to Run
pytest tests/backend/test_energy_api.py
curl http://localhost:8000/api/v1/energy/current

### 15. Expected Result
Energy Digital Twin operational with live substation telemetry and load distribution.
```

---

## PHASE 15: Energy Demand Forecasting ML Pipeline

```markdown
### 1. Objective
Develop, train, and deploy an XGBoost machine learning model to forecast Coimbatore electricity demand across multi-hour horizons (1h, 3h, 6h, 12h, 24h), identifying peak load hours and temperature sensitivity.

### 2. Context
Power utilities (TANGEDCO) must anticipate peak load hours to schedule power procurement and prevent transformer burnouts. We predict demand using historical lag features, cooling degree days ($\text{CDD} = \max(0, T - 24)$), industrial shift schedules, and calendar flags.

### 3. Files to Create
- `ml/features/energy_features.py`
- `ml/training/train_energy.py`
- `ml/models/energy_predictor.py`
- `backend/app/services/energy_prediction_service.py`
- `frontend/src/components/energy/EnergyForecastChart.tsx`
- `frontend/src/components/energy/PeakPredictionCard.tsx`

### 4. Files to Modify
- `backend/app/api/v1/endpoints/energy.py`
- `frontend/src/pages/EnergyTwinPage.tsx`

### 5. Exact Functionality
- `train_energy.py`: Trains XGBoost Regressor with 24-hour recursive / multi-output forecasting.
- Input Features: `hour`, `day_of_week`, `is_holiday`, `temp_celsius`, `cooling_degree_days`, `lag_1h`, `lag_24h`, `lag_168h` (same hour last week).
- Evaluates model using MAPE (Mean Absolute Percentage Error); target $< 4.0\%$.
- Exports model to `ml/models/weights/xgboost_energy_forecast.pkl`.
- Frontend: `EnergyForecastChart` displays actual load curve for past 12h and forecasted load curve for next 24h with a shaded 95% confidence interval band.
- `PeakPredictionCard`: Highlights forecasted peak time (e.g. "Expected Peak: 1,320 MW at 19:30 IST") and primary drivers (+3.2°C temperature anomaly + evening residential surge).

### 6. UI Requirements
- Shaded forecast envelope in Recharts time-series graph.
- Amber visual marker at the forecasted peak timestamp.

### 7. Backend Requirements
Async inference returning 24 hourly forecasted points in $<30\text{ms}$.

### 8. Database Requirements
Store predictions in `energy_predictions` table.

### 9. API Requirements
- `GET /api/v1/energy/forecast?zone_id={all|zone_id}`: Returns array of forecasted hourly MW, expected peak time, confidence score, and contributing factors.

### 10. ML Requirements
Model must achieve test MAPE $< 4.5\%$.

### 11. Validation Requirements
Ensure forecasted values match realistic physical boundaries (e.g. Coimbatore demand between 600 MW and 1,600 MW).

### 12. Testing Requirements
Verify model serialization and API response shape in `tests/ml/test_energy_model.py`.

### 13. Acceptance Criteria
- ML model trains successfully and generates forecast.
- Frontend renders 24-hour predictive load curve with peak alert card.

### 14. Commands to Run
python ml/training/train_energy.py
pytest tests/ml/test_energy_model.py
curl http://localhost:8000/api/v1/energy/forecast

### 15. Expected Result
Accurate 24-hour energy demand forecasting with peak detection live on dashboard.
```

---

## PHASE 16: Energy Grid What-If Scenario Simulation

```markdown
### 1. Objective
Implement a What-If Energy Scenario Simulator allowing planners to model the grid impact of heatwaves (+2°C to +5°C temperature rise), rapid EV charging station adoption, industrial shift adjustments, and solar rooftop integration.

### 2. Context
Smart city planners must test grid resilience:
"What happens if heatwave temperatures reach 41°C during peak summer?"
"What happens if 5,000 commercial EV delivery vehicles fast-charge at 18:00?"
The simulator calculates incremental MW demand, peak shifts, and transformer overload risks.

### 3. Files to Create
- `backend/app/services/energy_scenario_service.py`
- `frontend/src/components/energy/EnergyScenarioModal.tsx`
- `frontend/src/components/energy/EnergyScenarioCompareChart.tsx`

### 4. Files to Modify
- `backend/app/api/v1/endpoints/scenarios.py`
- `frontend/src/pages/EnergyTwinPage.tsx`

### 5. Exact Functionality
- `EnergyScenarioModal`: User configures:
  - `Temperature Delta` (-3°C to +6°C)
  - `EV Fleet Charging Surge` (None, 1,000 EVs, 5,000 EVs, 10,000 EVs)
  - `Industrial Output Shift` (-20% to +30%)
  - `Rooftop Solar Penetration` (0% to 40%)
- Backend computes delta load using temperature elasticity coefficients and EV charging profile curves.
- Re-runs XGBoost predictor with modified feature inputs.
- Frontend: Displays comparative chart:
  - Blue line: **Baseline Forecast**
  - Purple line: **Scenario Forecast**
  - Visual callout highlighting delta: "+185 MW Net Peak Increase (+14.2%)".

### 6. UI Requirements
- Interactive sliders for scenario parameters.
- Overload alert badge if scenario exceeds total substation threshold (1,500 MW).

### 7. Backend Requirements
Simulation execution time $< 150\text{ms}$.

### 8. Database Requirements
None.

### 9. API Requirements
- `POST /api/v1/scenarios/energy/run`: Accepts `{ temp_delta, ev_count, industrial_factor, solar_pct }`, returns baseline vs scenario forecast series.

### 10. ML Requirements
Model inference under modified synthetic feature conditions.

### 11. Validation Requirements
Verify that positive temperature delta always produces equal or higher demand during daylight/evening hours.

### 12. Testing Requirements
Test scenario boundary conditions in `tests/simulation/test_energy_scenarios.py`.

### 13. Acceptance Criteria
- User can run what-if energy scenarios from the UI.
- Comparative chart clearly depicts baseline vs scenario demand curves and peak shifts.

### 14. Commands to Run
pytest tests/simulation/test_energy_scenarios.py
cd frontend && npm run dev

### 15. Expected Result
Energy what-if simulation operational with real-time comparative visualization.
```

---

## PHASE 17: Environmental Intelligence & Air Quality Module

```markdown
### 1. Objective
Integrate real-time and simulated environmental intelligence, tracking Coimbatore Air Quality Index (AQI), PM2.5, PM10, NO2, temperature, and humidity, while modeling the direct emission contribution from traffic congestion.

### 2. Context
Urban health is tied to mobility. Stalled traffic on major corridors releases concentrated particulate matter and NO2. We fetch live atmospheric data from Open-Meteo for Coimbatore (`lat: 11.0168, lon: 76.9558`) and combine it with localized corridor traffic emission models.

### 3. Files to Create
- `backend/app/services/weather_service.py`
- `backend/app/services/environment_service.py`
- `backend/app/schemas/environment.py`
- `frontend/src/pages/EnvironmentPage.tsx`
- `frontend/src/components/environment/AqiGauge.tsx`
- `frontend/src/components/environment/PollutionBreakdownChart.tsx`
- `frontend/src/components/environment/TrafficPollutionCorrelation.tsx`

### 4. Files to Modify
- `backend/app/api/v1/endpoints/environment.py`
- `frontend/src/App.tsx` (add `/environment` route)

### 5. Exact Functionality
- `weather_service.py`: Queries Open-Meteo free API for live Coimbatore hourly weather and air quality parameters (PM2.5, PM10, NO2, CO, temperature, humidity). If API is unreachable, falls back seamlessly to simulated environmental state.
- Computes `traffic_emission_contribution_pct`: Estimated share of local PM2.5 and NO2 attributable to vehicular stop-and-go idling along nearby corridors.
- Frontend:
  - Radial `AqiGauge` categorized: Good (0-50), Moderate (51-100), Unhealthy for Sensitive Groups (101-150), Unhealthy (151-200), Very Unhealthy (>200).
  - Time-series chart tracking AQI vs Corridor Congestion over the last 24 hours.
  - Explicit disclaimer: "Estimated traffic-related emission contribution calculated via vehicular idling models."

### 6. UI Requirements
- Crisp environmental color scales matching CPCB/EPA standards.
- Prominent `[LIVE OPEN-METEO API]` or `[SIMULATED]` origin badge.

### 7. Backend Requirements
Cache external Open-Meteo API responses in Redis for 15 minutes to avoid rate limiting.

### 8. Database Requirements
Store environmental readings in `environmental_telemetry` hypertable.

### 9. API Requirements
- `GET /api/v1/environment/current`: Returns live AQI, pollutant breakdown, weather, and traffic contribution percentage.
- `GET /api/v1/environment/history`: Returns historical 24-hour environmental trend.

### 10. ML Requirements
Correlation coefficient calculation between corridor speed deficits and localized PM2.5 concentrations.

### 11. Validation Requirements
Verify Open-Meteo response fallback works when network connection is disabled.

### 12. Testing Requirements
Test API fallback and parsing in `tests/backend/test_environment_api.py`.

### 13. Acceptance Criteria
- Environmental dashboard displays current AQI and pollutant concentrations.
- Correlation with traffic congestion is computed and visualized.
- Origin badges accurately represent whether data came from live API or simulator.

### 14. Commands to Run
pytest tests/backend/test_environment_api.py
curl http://localhost:8000/api/v1/environment/current

### 15. Expected Result
Environmental monitoring module functioning with live Open-Meteo integration and traffic correlation analytics.
```

---

## PHASE 18: Intelligent Alert & Anomaly Detection Engine

```markdown
### 1. Objective
Develop an autonomous Anomaly Detection and Intelligent Alert Engine that identifies statistical traffic outliers, grid overload risks, and air quality degradation, generating actionable alerts for city administrators.

### 2. Context
Operators cannot monitor every sensor feed manually. The platform must automatically generate context-rich alerts:
- Traffic Alert: "Severe Congestion Predicted at Singanallur Junction in 25 minutes (Score 89)."
- Energy Alert: "Coimbatore Metro Substation approaching 92% capacity limit."
- Environmental Alert: "PM2.5 spike detected near Gandhipuram bus terminal."
- Anomaly Alert: "Traffic speed on Avinashi Road is 3.2 standard deviations below historical baseline for a Tuesday morning."

### 3. Files to Create
- `backend/app/services/alert_service.py`
- `backend/app/services/anomaly_detector.py`
- `backend/app/schemas/alert.py`
- `backend/app/api/v1/endpoints/alerts.py`
- `frontend/src/components/alerts/AlertsDrawer.tsx`
- `frontend/src/components/alerts/AlertBadge.tsx`
- `frontend/src/components/alerts/AlertItem.tsx`

### 4. Files to Modify
- `backend/app/api/v1/router.py`
- `frontend/src/components/layout/CommandHeader.tsx`

### 5. Exact Functionality
- `anomaly_detector.py`: Computes rolling Z-Scores ($Z = \frac{x - \mu_{h,d}}{\sigma_{h,d}}$) against historical hour-of-week baselines. Triggers anomaly when $|Z| > 2.5$.
- `alert_service.py`: Generates structured alerts containing:
  - `Severity`: INFO, WARNING, SEVERE, CRITICAL
  - `Domain`: TRAFFIC, ENERGY, ENVIRONMENT, ANOMALY
  - `Location`: Corridor / Substation name
  - `Cause Summary`: Extracted from Cause Engine
  - `Predicted Impact`: Estimated delay / MW deficit
  - `Recommended Action`: Suggested administrative response (e.g. "Adjust signal timing at Hope College to favor westbound traffic")
- Frontend: Bell icon in header displays unread alert count with pulsing red badge; clicking opens slide-out `AlertsDrawer`.

### 6. UI Requirements
- Visual color-coding by severity (Yellow: Warning, Orange: Severe, Pulsing Red: Critical).
- Action button to acknowledge or resolve alerts.

### 7. Backend Requirements
Evaluates rules on every telemetry update cycle in $<15\text{ms}$.

### 8. Database Requirements
Store alerts in `urban_alerts` table.

### 9. API Requirements
- `GET /api/v1/alerts/active`: Returns all unresolved alerts.
- `POST /api/v1/alerts/{alert_id}/acknowledge`: Updates alert status.

### 10. ML Requirements
Statistical outlier detection using rolling mean and standard deviation baselines.

### 11. Validation Requirements
Ensure duplicate alerts are not generated within a 15-minute window for the same corridor.

### 12. Testing Requirements
Test alert generation rules in `tests/backend/test_alert_engine.py`.

### 13. Acceptance Criteria
- Anomaly detector flags simulated traffic disruptions.
- Alerts appear in slide-out drawer with causes, predicted impacts, and recommendations.

### 14. Commands to Run
pytest tests/backend/test_alert_engine.py
curl http://localhost:8000/api/v1/alerts/active

### 15. Expected Result
Intelligent alert system operational with real-time notification drawer.
```

---

## PHASE 19: AI Urban Assistant & RAG Knowledge Engine

```markdown
### 1. Objective
Build an AI Urban Assistant for city administrators powered by Retrieval-Augmented Generation (RAG) and schema-aware tool calling, capable of answering natural-language queries grounded strictly in live database telemetry.

### 2. Context
Administrators can chat directly with the digital twin:
- "What areas currently have severe congestion?"
- "Why is traffic backed up near TIDEL Park?"
- "What is today's forecasted energy peak, and will the Metro substation handle it?"
- "Compare today's Avinashi Road traffic with yesterday."
The assistant must never hallucinate; it queries real database state before answering.

### 3. Files to Create
- `backend/app/services/assistant_service.py`
- `backend/app/services/agent_tools.py`
- `backend/app/schemas/assistant.py`
- `backend/app/api/v1/endpoints/assistant.py`
- `frontend/src/components/assistant/AssistantChatDrawer.tsx`
- `frontend/src/components/assistant/ChatMessage.tsx`
- `frontend/src/services/assistantApi.ts`

### 4. Files to Modify
- `backend/app/api/v1/router.py`
- `frontend/src/components/layout/CommandHeader.tsx`

### 5. Exact Functionality
- `agent_tools.py`: Implements Python tools callable by the AI agent:
  - `query_traffic_status(corridor_name: Optional[str])`
  - `query_traffic_predictions(corridor_name: str, horizon: int)`
  - `query_cause_analysis(corridor_name: str)`
  - `query_energy_forecast()`
  - `query_active_alerts()`
- `assistant_service.py`: Orchestrates user query, dispatches tool calls, retrieves structured JSON from the database, and formats an executive summary.
- If an LLM API key (OpenAI/Anthropic/Gemini) is configured in `.env`, uses the provider; if no external key is provided, falls back to a deterministic, rule-based natural language response generator grounded in the exact same tool data!
- Frontend: Floating AI Assistant button in bottom-right corner; opens modern chat drawer with suggested starter prompts and instant query streaming.

### 6. UI Requirements
- Futuristic AI conversational drawer with markdown formatting, syntax highlighting, and source citations.
- Pre-built quick action chips: "Show Bottlenecks", "Energy Peak Today", "Why is Avinashi Rd Congested?".

### 7. Backend Requirements
Response generation under 1.5 seconds.

### 8. Database Requirements
Read-only queries to `traffic_telemetry`, `traffic_predictions`, `energy_predictions`, and `urban_alerts`.

### 9. API Requirements
- `POST /api/v1/assistant/chat`: Accepts `{ message, history: [...] }`, returns `{ reply, tools_executed: [...], data_citations: [...] }`.

### 10. ML Requirements
Tool-calling agent dispatch loop with JSON schema validation.

### 11. Validation Requirements
Ensure the assistant explicitly cites data sources and refuses to provide unsubstantiated traffic claims.

### 12. Testing Requirements
Test tool dispatching in `tests/backend/test_assistant_tools.py`.

### 13. Acceptance Criteria
- Assistant responds accurately to questions regarding live traffic, predictions, and energy peaks.
- Works offline in deterministic mode even without an external LLM API key.

### 14. Commands to Run
pytest tests/backend/test_assistant_tools.py
curl -X POST http://localhost:8000/api/v1/assistant/chat -H "Content-Type: application/json" -d '{"message": "What areas currently have severe congestion?"}'

### 15. Expected Result
AI Urban Assistant live and answering complex natural language queries about Coimbatore city state.
```

---

## PHASE 20: WebSocket Real-Time Digital Twin Synchronization

```markdown
### 1. Objective
Implement a bidirectional WebSocket telemetry channel streaming real-time traffic updates, energy load changes, and active incidents directly to the frontend dashboard every second.

### 2. Context
A digital twin must feel alive. Instead of polling REST endpoints every 10 seconds, the frontend maintains a persistent WebSocket connection to `ws://localhost:8000/api/v1/ws/telemetry`, receiving instant state transitions, traffic flow pulses, and incident injections.

### 3. Files to Create
- `backend/app/api/v1/endpoints/websocket.py`
- `backend/app/services/connection_manager.py`
- `frontend/src/services/websocket.ts`
- `frontend/src/hooks/useTwinWebSocket.ts`

### 4. Files to Modify
- `backend/app/main.py`
- `frontend/src/App.tsx`
- `frontend/src/components/layout/CommandHeader.tsx`

### 5. Exact Functionality
- `connection_manager.py`: Manages active WebSocket connections with heartbeats, auto-reconnect logic, and broadcast channel fanout.
- Telemetry Broadcaster: Pushes live snapshot every 2 seconds:
  ```json
  {
    "type": "TWIN_SYNC",
    "timestamp": "2026-10-01T12:00:00Z",
    "metrics": {
      "city_congestion_index": 54.2,
      "avg_speed_kmh": 32.8,
      "total_energy_mw": 1140.5,
      "aqi": 82
    },
    "updated_segments": [ ... ]
  }
  ```
- Frontend `useTwinWebSocket`: Listens to incoming messages, updates React state, triggers subtle UI pulse animations, and updates map corridor colors in real time.
- Displays live connection status in header: `WS: CONNECTED` (Green dot) or `WS: RECONNECTING` (Amber dot).

### 6. UI Requirements
- Instant zero-flicker UI updates.
- Real-time pulse animation on updated KPI values.

### 7. Backend Requirements
Async broadcaster capable of streaming to 50+ concurrent client connections with minimal CPU overhead.

### 8. Database Requirements
None (broadcasts from in-memory twin state).

### 9. API Requirements
- `WS /api/v1/ws/telemetry`

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Verify client automatically reconnects within 3 seconds if the server restarts.

### 12. Testing Requirements
Test WebSocket handshake and message broadcasting in `tests/backend/test_websocket.py`.

### 13. Acceptance Criteria
- Frontend connects via WebSocket immediately upon page load.
- KPI cards and map layers update smoothly without page reload.

### 14. Commands to Run
pytest tests/backend/test_websocket.py
cd frontend && npm run dev

### 15. Expected Result
Bidirectional real-time WebSocket telemetry synchronization active across the platform.
```

---

## PHASE 21: Advanced 3D Digital Twin Visualization (Deck.gl & 3D Extrusions)

```markdown
### 1. Objective
Enhance the digital twin map with advanced WebGL layers using Deck.gl, featuring 3D building extrusions, dynamic animated traffic arc flow lines, and hexagonal GPU congestion heatmaps.

### 2. Context
To truly stand out in evaluations, the platform must visually look like a digital twin rather than a standard 2D web map. We add 3D extruded building models for Coimbatore's urban core, animated vehicular flow arcs, and density heatmaps.

### 3. Files to Create
- `frontend/src/components/map/DeckGlOverlay.tsx`
- `frontend/src/components/map/layers/ArcFlowLayer.ts`
- `frontend/src/components/map/layers/HexagonHeatmapLayer.ts`
- `frontend/src/components/map/MapLayerToggle.tsx`

### 4. Files to Modify
- `frontend/src/components/map/DigitalTwinMap.tsx`

### 5. Exact Functionality
- `ArcFlowLayer`: Animates glowing traffic flow pulses between major Coimbatore junctions (e.g. Gandhipuram -> Peelamedu -> TIDEL Park). The arc speed reflects vehicular speed; color reflects congestion.
- `HexagonHeatmapLayer`: Renders 3D hexagonal density columns indicating localized vehicle concentration across the city.
- `MapLayerToggle`: Floating control widget allowing operators to toggle:
  - [x] 3D Building Extrusions
  - [x] Animated Flow Arcs
  - [x] Congestion Hex Heatmap
  - [x] Energy Substation Zones
  - [x] Air Quality Stations

### 6. UI Requirements
- 60 FPS smooth rendering via WebGL.
- Seamless integration between MapLibre base map and Deck.gl overlays.

### 7. Backend Requirements
N/A (uses existing GeoJSON and telemetry feeds).

### 8. Database Requirements
None.

### 9. API Requirements
N/A.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Verify memory consumption remains stable (< 300 MB browser RAM) during continuous animation.

### 12. Testing Requirements
Verify Deck.gl canvas mounts properly without WebGL context loss.

### 13. Acceptance Criteria
- Map supports switching between standard 2D view and rich 3D digital twin view.
- Traffic arcs animate smoothly along Coimbatore corridors.

### 14. Commands to Run
cd frontend && npm run build
cd frontend && npm run dev

### 15. Expected Result
Breathtaking 3D digital twin visualization running smoothly in the browser.
```

---

## PHASE 22: Authentication & Role-Based Access Control (RBAC)

```markdown
### 1. Objective
Implement JWT-based authentication and Role-Based Access Control (RBAC) supporting 6 municipal user personas: ADMIN, CITY_PLANNER, TRAFFIC_OPERATOR, ENERGY_OPERATOR, ANALYST, and VIEWER.

### 2. Context
Smart city infrastructure demands enterprise-grade governance. Different city officials have distinct capabilities:
- `TRAFFIC_OPERATOR`: Can inject traffic incidents and adjust signal parameters.
- `CITY_PLANNER`: Can execute what-if urban scenarios.
- `ENERGY_OPERATOR`: Can adjust grid dispatch simulations.
- `VIEWER`: Read-only access to dashboard.

### 3. Files to Create
- `backend/app/core/security.py` (JWT encoding/decoding, bcrypt password hashing)
- `backend/app/models/user.py`
- `backend/app/schemas/user.py`
- `backend/app/api/v1/endpoints/auth.py`
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/components/auth/LoginPage.tsx`
- `frontend/src/components/auth/ProtectedRoute.tsx`

### 4. Files to Modify
- `backend/app/api/v1/router.py`
- `frontend/src/App.tsx`

### 5. Exact Functionality
- `auth.py`: Provides `POST /api/v1/auth/login` (returns JWT access token) and `GET /api/v1/auth/me`.
- FastAPI dependency `require_roles(["ADMIN", "CITY_PLANNER"])` protects sensitive simulation and management endpoints.
- Pre-seeds 6 demo accounts (one for each role) with simple credentials documented on the login page for effortless hackathon/jury evaluation.
- Frontend: Quick-switch persona dropdown allowing evaluators to jump between roles with one click during demonstrations!

### 6. UI Requirements
- Elegant command-center login screen with demo credentials quick-fill buttons.
- Current active role badge displayed in the navigation header.

### 7. Backend Requirements
Stateless JWT tokens with 24-hour expiration.

### 8. Database Requirements
`users` table with password hash and role enumeration.

### 9. API Requirements
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Ensure unauthenticated requests to protected endpoints return 401 Unauthorized.

### 12. Testing Requirements
Test authentication and role permission enforcement in `tests/backend/test_auth.py`.

### 13. Acceptance Criteria
- Login with demo credentials works seamlessly.
- Persona quick-switch allows instant role demonstration.
- Protected actions are disabled for VIEWER role.

### 14. Commands to Run
pytest tests/backend/test_auth.py
curl -X POST http://localhost:8000/api/v1/auth/login -d "username=admin&password=adminpassword"

### 15. Expected Result
Full RBAC security system in place with 1-click demo persona switcher.
```

---

## PHASE 23: Automated Analytics & Executive PDF/JSON Reporting

```markdown
### 1. Objective
Build an automated Reporting and Analytics Engine that compiles daily urban intelligence summaries, corridor congestion scorecards, energy peak analyses, and generates downloadable executive reports.

### 2. Context
Municipal executives require printable daily briefings summarizing city performance, worst bottleneck incidents, energy consumption vs. forecasted peaks, and carbon emission savings.

### 3. Files to Create
- `backend/app/services/report_service.py`
- `backend/app/api/v1/endpoints/reports.py`
- `frontend/src/pages/ReportsPage.tsx`
- `frontend/src/components/reports/DailyReportCard.tsx`
- `frontend/src/components/reports/ReportExportButton.tsx`

### 4. Files to Modify
- `backend/app/api/v1/router.py`
- `frontend/src/App.tsx` (add `/reports` route)

### 5. Exact Functionality
- `report_service.py`: Aggregates 24-hour metrics:
  - Peak congestion timestamp & location (e.g. Singanallur, 18:45 IST, Congestion 91)
  - Total grid power consumed (MWh) and peak demand (MW)
  - Air quality index average vs worst peak
  - List of detected anomalies and resolution times
- Generates structured JSON scorecard and printable HTML/PDF report.
- Frontend `ReportsPage`: Displays interactive summary cards and provides "Download Executive Briefing" button.

### 6. UI Requirements
- Clean, print-friendly layout.
- Summary tables with KPI comparisons against yesterday.

### 7. Backend Requirements
Report generation compiles in $<200\text{ms}$.

### 8. Database Requirements
Aggregation queries over 24-hour TimescaleDB records.

### 9. API Requirements
- `GET /api/v1/reports/daily?date=...`: Returns daily executive summary.
- `GET /api/v1/reports/export`: Returns formatted report file.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Verify numbers match database aggregations for the specified date.

### 12. Testing Requirements
Test report generation logic in `tests/backend/test_reports.py`.

### 13. Acceptance Criteria
- Executive report renders on frontend.
- PDF/Print export produces professional municipal summary.

### 14. Commands to Run
pytest tests/backend/test_reports.py
curl http://localhost:8000/api/v1/reports/daily

### 15. Expected Result
Executive reporting engine operational with instant briefing downloads.
```

---

## PHASE 24: Comprehensive Automated Testing Suite

```markdown
### 1. Objective
Establish a complete, automated test suite covering unit tests, integration tests, ML pipeline evaluation tests, simulation fidelity checks, and API latency benchmarks.

### 2. Context
A mission-critical smart city platform must not crash during live demonstrations. We implement comprehensive test coverage across backend, ML, simulation, and frontend.

### 3. Files to Create
- `tests/conftest.py` (fixtures for test DB, mock telemetry, and mock Redis)
- `tests/backend/test_traffic_pipeline.py`
- `tests/backend/test_energy_pipeline.py`
- `tests/simulation/test_full_simulation_loop.py`
- `tests/ml/test_prediction_accuracy.py`
- `scripts/run_all_tests.sh`

### 4. Files to Modify
- `backend/pyproject.toml` (pytest configuration)

### 5. Exact Functionality
- `test_traffic_pipeline.py`: Tests the full path from telemetry ingestion -> TimescaleDB storage -> API query -> Prediction -> Cause explanation.
- `test_full_simulation_loop.py`: Runs 200 ticks of the simulation engine and verifies all constraints (no negative speeds, congestion scores within [0, 100], energy demand within [600, 1600] MW).
- `test_prediction_accuracy.py`: Validates that ML models achieve benchmark metrics (Traffic MAE $< 7.0$, Energy MAPE $< 5.0\%$).
- Latency benchmarks: Verifies that 95% of API queries respond in $< 80\text{ms}$.

### 6. UI Requirements
N/A.

### 7. Backend Requirements
Async test runner using `pytest-asyncio`.

### 8. Database Requirements
SQLite in-memory or dedicated test PostgreSQL database.

### 9. API Requirements
N/A.

### 10. ML Requirements
Model prediction sanity checks.

### 11. Validation Requirements
All tests must execute in under 45 seconds total.

### 12. Testing Requirements
Achieve $> 85\%$ test coverage on core backend services and simulation models.

### 13. Acceptance Criteria
- `pytest` executes and reports 100% passing tests.
- Zero uncaught exceptions or unhandled promise rejections.

### 14. Commands to Run
bash scripts/run_all_tests.sh

### 15. Expected Result
Full test suite passes with green results and documented benchmark metrics.
```

---

## PHASE 25: Containerization & Docker Compose Orchestration

```markdown
### 1. Objective
Containerize the entire platform into production-grade multi-stage Docker images and orchestrate all services (TimescaleDB, Redis, Backend, Frontend, and Simulator) via Docker Compose.

### 2. Context
Evaluators and team members must be able to boot the entire digital twin on any machine with a single command: `docker compose up --build`.

### 3. Files to Create
- `backend/Dockerfile` (multi-stage Python 3.11-slim build)
- `frontend/Dockerfile` (multi-stage Node build with Nginx alpine serving static assets and proxying `/api` and `/ws`)
- `frontend/nginx.conf`
- `docker-compose.prod.yml`
- `scripts/docker_entrypoint.sh`

### 4. Files to Modify
- `docker-compose.yml`

### 5. Exact Functionality
- `backend/Dockerfile`: Minimal image size (<400 MB), non-root user execution, installs all C-extensions for GeoAlchemy and LightGBM.
- `frontend/Dockerfile`: Stage 1 builds Vite bundle; Stage 2 serves through Nginx with Gzip compression and WebSocket reverse proxying.
- Docker Compose links:
  - `timescaledb` on port 5432
  - `redis` on port 6379
  - `backend` on port 8000
  - `frontend` on port 80 (and 5173 for dev)
  - `simulator` running background time-series generator

### 6. UI Requirements
Frontend accessible on `http://localhost`.

### 7. Backend Requirements
Container health checks on `/api/v1/health`.

### 8. Database Requirements
Persistent Docker volume for TimescaleDB data directory.

### 9. API Requirements
Reverse proxy routing `/api/v1/*` to backend service seamlessly without CORS friction.

### 10. ML Requirements
Pre-bake trained model weights into the backend container image.

### 11. Validation Requirements
Verify containers restart automatically on failure (`restart: unless-stopped`).

### 12. Testing Requirements
Verify complete system boots from scratch with clean volumes.

### 13. Acceptance Criteria
- `docker compose up -d` boots all 5 containers successfully.
- Web browser opening `http://localhost` displays operational digital twin.

### 14. Commands to Run
docker compose down -v
docker compose up --build -d
docker compose ps

### 15. Expected Result
Complete digital twin platform running seamlessly in unified Docker containers.
```

---

## PHASE 26: Performance Optimization & Sub-50ms Latency Tuning

```markdown
### 1. Objective
Optimize backend and frontend performance, achieving sub-50ms API response latencies, sub-100ms WebSocket propagation, database query indexing, and frontend bundle splitting.

### 2. Context
During presentations, latency lag destroys the illusion of a live digital twin. We implement aggressive Redis caching, PostGIS spatial index clustering, and Vite manual chunk splitting.

### 3. Files to Create
- `backend/app/core/cache.py` (Redis caching decorator with automatic cache invalidation)
- `scripts/optimize_db_indexes.sql`

### 4. Files to Modify
- `frontend/vite.config.ts` (rollup chunk splitting: MapLibre, Deck.gl, Recharts)
- `backend/app/services/traffic_service.py`
- `backend/app/services/energy_service.py`

### 5. Exact Functionality
- Implement Redis cache decorator `@cache_response(ttl_seconds=15)` on read-heavy corridor endpoints.
- Database optimization: Run `CLUSTER road_segments USING idx_road_segments_geom;` and configure TimescaleDB chunk compression policy for records older than 7 days.
- Frontend optimization: Split vendor bundles in `vite.config.ts` so initial page load is $< 350\text{ KB}$ gzipped.
- Enable WebGL hardware acceleration flags on MapLibre map initialization.

### 6. UI Requirements
Lighthouse Performance score $> 90$.

### 7. Backend Requirements
95th percentile response time $< 45\text{ms}$.

### 8. Database Requirements
TimescaleDB native compression active.

### 9. API Requirements
Add `X-Cache: HIT` or `X-Cache: MISS` response headers.

### 10. ML Requirements
Model inference pre-warmed in memory on server boot.

### 11. Validation Requirements
Run Apache Benchmark or `wrk` with 100 concurrent connections.

### 12. Testing Requirements
Benchmark test in `tests/test_performance.py`.

### 13. Acceptance Criteria
- APIs return in $< 50\text{ms}$.
- Frontend loads in $< 1.2$ seconds on cold refresh.

### 14. Commands to Run
python -m pytest tests/test_performance.py
curl -i http://localhost:8000/api/v1/traffic/corridors/current

### 15. Expected Result
Blazing-fast responsiveness verified across APIs, database queries, and frontend rendering.
```

---

## PHASE 27: Final UI/UX Polish & Interactive Presentation Demo Mode

```markdown
### 1. Objective
Apply high-impact visual polish, refined micro-animations, keyboard shortcuts, and build a dedicated "Demo Mode" control bar allowing evaluators to trigger live city events with one click.

### 2. Context
Judges evaluate visual elegance and immediate interactivity. We add an interactive "Demo Mode" bar at the bottom of the screen with preset triggers:
- `[🚨 Simulate Accident at TIDEL Park]`
- `[🌧️ Trigger Monsoon Rainstorm]`
- `[⚡ Simulate Heatwave Load Spike]`
- `[🚧 Close Flyover Lane]`
Clicking a trigger instantly sets off the chain reaction across the entire digital twin!

### 3. Files to Create
- `frontend/src/components/demo/DemoControlBar.tsx`
- `frontend/src/components/demo/IncidentToast.tsx`
- `frontend/src/components/common/HelpModal.tsx`

### 4. Files to Modify
- `frontend/src/components/layout/DashboardLayout.tsx`
- `frontend/src/index.css`

### 5. Exact Functionality
- `DemoControlBar`: Fixed floating glassmorphism pill at screen bottom with quick trigger buttons.
- Triggering "Accident at TIDEL Park":
  1. Spawns pulsing red accident marker on Avinashi Road on the map.
  2. Reduces capacity by 60%; speeds drop from 45 km/h to 14 km/h over 3 seconds.
  3. Prediction Engine triggers: Horizon 30m congestion shifts from 42 to 88 (SEVERE).
  4. Cause Analysis explains: "Accident Lane Closure (65%) + Peak Commuter Traffic (35%)".
  5. Downstream Impact updates: Spillover delay +18 mins, extra fuel burn +140 L.
  6. Toast notification slides in with audio cue (optional toggle).
- Add keyboard shortcuts (`D` to toggle demo bar, `M` for map reset, `A` for AI assistant).

### 6. UI Requirements
- Stunning visual animations (Framer Motion spring transitions).
- Zero clutter: Demo bar can be collapsed into a sleek icon.

### 7. Backend Requirements
Instant event processing and WebSocket broadcast within 100ms.

### 8. Database Requirements
Tag injected demo events with `is_simulated = TRUE`.

### 9. API Requirements
- `POST /api/v1/simulation/demo-event`: Accepts `{ event_preset_id }`.

### 10. ML Requirements
N/A.

### 11. Validation Requirements
Verify resetting demo returns city metrics to baseline state smoothly.

### 12. Testing Requirements
Verify all demo preset triggers execute without errors.

### 13. Acceptance Criteria
- Demo bar is visible and interactive.
- Triggering any demo event creates a visible, coherent chain reaction across map, prediction cards, alerts, and charts.

### 14. Commands to Run
cd frontend && npm run dev

### 15. Expected Result
Breathtaking, exhibition-ready Smart City Digital Twin with one-click presentation triggers.
```

---

## PHASE 28: Production Deployment & Zero-Cost Cloud Staging

```markdown
### 1. Objective
Configure production deployment manifests for zero-cost cloud staging (e.g. Render / Railway / Hugging Face Spaces for backend and Vercel / Netlify for frontend) along with production environment documentation.

### 2. Context
While the platform is primarily built for local demonstration, having a live public URL guarantees maximum credibility in hackathons and college reviews. We provide turnkey configurations for free-tier cloud deployment.

### 3. Files to Create
- `render.yaml` (Render blueprint for FastAPI + PostgreSQL)
- `frontend/vercel.json` (Vercel deployment rewrite rules)
- `docs/DEPLOYMENT_GUIDE.md`
- `scripts/healthcheck.sh`

### 4. Files to Modify
- `README.md` (add deployment badges and live URL instructions)

### 5. Exact Functionality
- `render.yaml`: Defines Render Web Service for FastAPI backend and Managed PostgreSQL with PostGIS.
- `vercel.json`: Handles client-side React routing and proxies `/api` calls to the live Render backend.
- `DEPLOYMENT_GUIDE.md`: Step-by-step instructions to deploy in under 10 minutes without spending any money.
- Configures automated database migration execution on build.

### 6. UI Requirements
Ensure all asset paths work under root and subpath domains.

### 7. Backend Requirements
Enable secure CORS origins for the production frontend domain.

### 8. Database Requirements
Support for external cloud Postgres connection string (`DATABASE_URL`).

### 9. API Requirements
Enforce HTTPS and production headers.

### 10. ML Requirements
Ensure serialized model files are bundled in the repository or fetched during build.

### 11. Validation Requirements
Verify zero mixed-content (HTTP vs HTTPS) warnings on deployed frontend.

### 12. Testing Requirements
Run live smoke test against cloud deployment endpoint.

### 13. Acceptance Criteria
- Frontend deploys cleanly to Vercel.
- Backend deploys cleanly to Render/Railway.
- Live public URL connects and displays operational digital twin.

### 14. Commands to Run
git status
bash scripts/healthcheck.sh https://your-app.vercel.app

### 15. Expected Result
Coimbatore Smart City Digital Twin deployed live on the web with complete documentation.
```
