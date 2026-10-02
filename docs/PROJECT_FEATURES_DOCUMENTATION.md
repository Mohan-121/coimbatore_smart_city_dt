# Coimbatore Smart City Digital Twin
## Comprehensive Feature Specification & Technical Documentation

---

### Document Information
* **Project Name**: Coimbatore Smart City Digital Twin
* **Sub-Title**: Predictive Traffic, Energy & Urban Intelligence Platform
* **Target Geography**: Coimbatore, Tamil Nadu, India
* **Document Version**: 1.0.0
* **Classification**: Technical & Operational Reference Manual

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Core Feature Pillars](#4-core-feature-pillars)
   * 4.1 [Interactive 2.5D/3D Digital Twin Map](#41-interactive-25d3d-digital-twin-map)
   * 4.2 [Real-Time Traffic Telemetry & Corridor Dynamics](#42-real-time-traffic-telemetry--corridor-dynamics)
   * 4.3 [Multi-Horizon ML Traffic Forecasting (15m, 30m, 60m, 120m)](#43-multi-horizon-ml-traffic-forecasting)
   * 4.4 [Explainable AI (XAI) Cause Attribution Engine (TreeSHAP)](#44-explainable-ai-xai-cause-attribution-engine)
   * 4.5 [Downstream Flow Propagation & Emission Impact Engine](#45-downstream-flow-propagation--emission-impact-engine)
   * 4.6 [Electrical Grid & Power Demand Digital Twin (TANGEDCO)](#46-electrical-grid--power-demand-digital-twin)
   * 4.7 [Environmental Intelligence & Live Air Quality (AQI)](#47-environmental-intelligence--live-air-quality)
   * 4.8 [Interactive 'What-If' Urban Scenario Simulator](#48-interactive-what-if-urban-scenario-simulator)
   * 4.9 [Grounded AI Urban Assistant](#49-grounded-ai-urban-assistant)
   * 4.10 [Intelligent Urban Alerts & Anomaly Detection](#410-intelligent-urban-alerts--anomaly-detection)
   * 4.11 [Interactive Presentation Demo Mode](#411-interactive-presentation-demo-mode)
   * 4.12 [Executive Municipal Scorecard & Daily Audit Reporting](#412-executive-municipal-scorecard--daily-audit-reporting)
   * 4.13 [Strict Data Provenance & Role-Based Access Control](#413-strict-data-provenance--role-based-access-control)
5. [Complete REST API Specification](#5-complete-rest-api-specification)
6. [Database Schema & Data Models](#6-database-schema--data-models)
7. [Mathematical & Algorithmic Formulations](#7-mathematical--algorithmic-formulations)
8. [Machine Learning Pipeline & Features](#8-machine-learning-pipeline--features)
9. [Deployment & Local Execution Guide](#9-deployment--local-execution-guide)

---

## 1. Executive Summary

The **Coimbatore Smart City Digital Twin** is an integrated cyber-physical software platform that models, monitors, predicts, and simulates urban dynamics across Coimbatore, Tamil Nadu. The platform bridges real-time sensor streams and external APIs with machine learning models and physics-based propagation engines to give city administrators, traffic police, and energy grid operators complete situational awareness and proactive decision-support tools.

The platform focuses on Coimbatore's key infrastructural corridors:
* **Avinashi Road (NH 544)**: Hope College, Peelamedu, TIDEL Park, KMCH, Coimbatore International Airport.
* **Trichy Road (NH 81)**: Ramanathapuram, Sungam Bypass, Singanallur Bus Terminal, Ondipudur.
* **Sathy Road (NH 948)**: Gandhipuram Central, Ganapathy, Saravanampatti IT Special Economic Zone.
* **Mettupalayam Road (NH 181)**: Saibaba Colony, Kavundampalayam, Thudiyalur.
* **Pollachi Road (NH 83)**: Ukkadam Junction, Eachanari.

---

## 2. High-Level Architecture

```
+-----------------------------------------------------------------------------------+
|                           EXTERNAL DATA SOURCES & APIS                            |
+-----------------------------------------------------------------------------------+
|  Open-Meteo Weather API  |  OpenStreetMap Overpass  |  Synthetic Sim Generator    |
+--------------------------+--------------------------+-----------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                               FASTAPI BACKEND CORE                                |
+-----------------------------------------------------------------------------------+
|  * Simulation Engine (Tick Step & Physics Calibration)                            |
|  * ML Inference Engine (LightGBM & XGBoost Regression)                            |
|  * TreeSHAP Additive Causal Attribution Engine                                    |
|  * Downstream Network Spillover & VSP Carbon Emission Calculator                  |
|  * Rule-Based & Statistical Anomaly Detector                                      |
|  * RAG-Grounded AI Urban Assistant Service                                        |
+-----------------------------------------------------------------------------------+
             |                                                  |
             v                                                  v
+-----------------------------+                    +--------------------------------+
|  PERSISTENCE & SPATIAL DB   |                    |    HIGH-FREQUENCY TELEMETRY    |
+-----------------------------+                    +--------------------------------+
| PostgreSQL 16 + PostGIS     |                    | REST Endpoints (/api/v1/*)     |
| TimescaleDB Hypertables     |                    | 3-Second Client Synchronization|
+-----------------------------+                    +--------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                   REACT 18 + VITE COMMAND CENTER FRONTEND                         |
+-----------------------------------------------------------------------------------+
|  * MapLibre GL JS 2.5D Vector Map with Animated Congestion Glow Corridors         |
|  * Multi-Horizon Forecast Explorer & TreeSHAP Attribution Donut Charts            |
|  * Electrical Grid Power Demand Dashboard with Shaded Confidence Intervals        |
|  * Environmental AQI & Vehicular Idling Emission Gauge Array                      |
|  * Dual Baseline vs. Simulated 'What-If' Scenario Playground                      |
|  * Natural Language Conversational Municipal Assistant Drawer                     |
|  * 1-Click Presentation Demo Bar for Live Evaluation Showcase                     |
+-----------------------------------------------------------------------------------+
```

---

## 3. Technology Stack

| Layer | Component | Technologies Used | Description & Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | Framework | React 18, TypeScript, Vite | Fast modular rendering, high-frequency dashboard telemetry |
| **Frontend** | Styling & UI | Vanilla CSS Tokens, Tailwind CSS, Lucide Icons | Dark command center aesthetic (`#070A11`), glassmorphism |
| **Frontend** | GIS & 3D Map | MapLibre GL JS, CartoDB Dark Tiles | WebGL-accelerated 2.5D perspective vector map |
| **Frontend** | Charts | Recharts | Multi-horizon forecast curves, shaded confidence bands |
| **Backend** | Framework | Python 3.10+, FastAPI, Pydantic v2 | High-performance asynchronous API, auto-docs |
| **Database** | Storage | PostgreSQL 16, PostGIS, TimescaleDB | Spatial road graph and time-series hypertable telemetry |
| **Machine Learning**| Forecast Models | LightGBM, XGBoost, Scikit-learn | Multi-horizon traffic and 24h electrical load modeling |
| **Explainable AI** | XAI Engine | TreeSHAP, Custom Local Attributor | Normalized additive feature importance decomposition |
| **External APIs** | Weather & AQI | Open-Meteo REST API | Real-time atmospheric ingestion for Coimbatore `(11.0168, 76.9558)` |

---

## 4. Core Feature Pillars

### 4.1 Interactive 2.5D/3D Digital Twin Map
* **Location**: `frontend/src/components/map/DigitalTwinMap.tsx`
* **Features**:
  * **2.5D Perspective Rendering**: Pitch angled at 45° with -15° bearing, centered over central Coimbatore.
  * **Dynamic Corridor Styling**: Renders GeoJSON line features with dual layers—a soft outer blur glow and an inner arterial speed line.
  * **Real-Time Color Shading**: Line colors update automatically based on current congestion scores:
    * `Emerald Green (#10B981)`: Fluid flow ($C < 30$)
    * `Amber Yellow (#F59E0B)`: Moderate volume ($30 \le C < 60$)
    * `Orange (#F97316)`: Heavy congestion ($60 \le C < 85$)
    * `Crimson Red (#EF4444)`: Gridlock / Severe ($C \ge 85$)
  * **Click-to-Inspect**: Selecting any road segment anchors the diagnostic sidebar to that segment's real-time telemetry and forward predictions.
  * **Pulsing Incident Markers**: Injects animated HTML markers with warning badges for active collisions and construction diversions.

### 4.2 Real-Time Traffic Telemetry & Corridor Dynamics
* **Location**: `backend/app/api/v1/endpoints/traffic.py`
* **Features**:
  * **Greenshields Density Equilibrium**: Calculates congestion indices ($0$ to $100$) based on speed deficit, vehicular density, and physical queue length.
  * **Monitored Corridors**: Tracks 5 primary arterials comprising 10 granular road segments.
  * **Top Bottlenecks**: Real-time sorted ranking of the city's top 5 congested junctions (e.g., TIDEL Park Junction, Singanallur Bus Terminal, Hope College).
  * **Live KPIs**: Average vehicular speed, citywide congestion index, total active vehicle count, and estimated commute delays.

### 4.3 Multi-Horizon ML Traffic Forecasting
* **Location**: `ml/models/`, `backend/app/api/v1/endpoints/traffic.py`
* **Features**:
  * **Multi-Horizon Predictions**: Generates forward predictions across four horizons:
    * **15 Minutes**: Intersection shockwave detection
    * **30 Minutes**: Dynamic traffic signal optimization
    * **60 Minutes**: Regional commuter path recommendations
    * **120 Minutes**: Extended shift and municipal route planning
  * **LightGBM Regressors**: Models trained on temporal cyclical features (`sin_hour`, `cos_hour`, `day_of_week`), spatial speed lags, upstream propagation, and weather conditions.
  * **Travel Time Inflation Factor**: Projects travel time delays relative to free-flow speeds.

### 4.4 Explainable AI (XAI) Cause Attribution Engine
* **Location**: `ml/explainability/shap_explainer.py`
* **Features**:
  * **TreeSHAP Decomposition**: Converts complex ensemble feature importances into local percentage contributions for every prediction.
  * **Four Municipal Cause Categories**:
    1. *Peak-Hour Pattern*: Diurnal commuter surges during morning and evening rush hours.
    2. *Upstream Junction Queue*: Congestion spillover propagating from upstream road segments.
    3. *Active Incident / Lane Restriction*: Capacity reductions from roadwork, flyover construction, or collisions.
    4. *Weather & Visibility*: Precipitation and environmental dampening of corridor speeds.
  * **Natural Language Explanation**: Generates plain-English summaries explaining why congestion is forming.

### 4.5 Downstream Flow Propagation & Emission Impact Engine
* **Location**: `backend/app/services/impact_service.py`, `emission_service.py`
* **Features**:
  * **Network Topology Graph**: Maps adjacent upstream and downstream feeder segments and designated alternate corridors.
  * **Diverted Traffic Estimation**: Calculates percentage of vehicles rerouting to parallel arterials (e.g., Avinashi Road traffic diverting via Sungam Bypass to Trichy Road).
  * **Environmental Penalties (EPA VSP Idling Model)**:
    * *Excess Fuel Wastage*: Liters of fuel consumed due to stop-and-go delays.
    * *Excess Carbon Footprint*: Kilograms of $\text{CO}_2$ emitted per hour due to vehicular delay.
    * *Physical Queue Buildup*: Estimated length of backed-up vehicular queues in meters.

### 4.6 Electrical Grid & Power Demand Digital Twin (TANGEDCO)
* **Location**: `backend/app/api/v1/endpoints/energy.py`, `backend/app/simulation/energy_sim.py`
* **Features**:
  * **5 Distribution Zones**:
    * `ZONE_METRO`: Metro Central (Commercial hub - Gandhipuram, RS Puram)
    * `ZONE_NORTH_IT`: North IT Corridor (Saravanampatti, CHIL SEZ)
    * `ZONE_EAST_IND`: East Industrial Belt (Peelamedu, CODISSIA)
    * `ZONE_SOUTH_RES`: South Residential (Sundarapuram, Kovaipudur)
    * `ZONE_KURICHI_SIDCO`: Kurichi SIDCO Industrial Estate
  * **Grid KPIs**: Total city demand (MW), grid capacity (1,480 MW), capacity utilization percentage, and grid frequency (nominal 50.02 Hz).
  * **24-Hour XGBoost Predictive Load Curve**: Hourly demand forecasting with shaded 95% confidence intervals ($\pm 3.5\%$) and automated peak alerts.

### 4.7 Environmental Intelligence & Live Air Quality (AQI)
* **Location**: `backend/app/api/v1/endpoints/environment.py`, `weather_service.py`
* **Features**:
  * **Open-Meteo Live Integration**: Real-time atmospheric ingestion for Coimbatore `(11.0168° N, 76.9558° E)`.
  * **Pollutant Metrics**: AQI, PM2.5, PM10, $\text{NO}_2$, and $\text{CO}$.
  * **Meteorological Telemetry**: Ambient temperature (°C), relative humidity (%), precipitation (mm), and wind speed (km/h).
  * **NAAQS Compliance**: Benchmarks air quality against National Ambient Air Quality Standards.
  * **Vehicular Idling Attribution**: Estimates the percentage of particulate pollution caused by stop-and-go traffic idling.

### 4.8 Interactive 'What-If' Urban Scenario Simulator
* **Location**: `backend/app/api/v1/endpoints/scenarios.py`, `frontend/src/pages/ScenariosPage.tsx`
* **Features**:
  * **Traffic Scenario Sandbox**:
    * *Road / Flyover Closures*: Adjust capacity reductions from 10% to 90% (e.g., Avinashi Expressway pier erection).
    * *Traffic Volume Surges*: Test volume surges from 0.8x to 2.0x (e.g., festival gatherings, industrial shifts).
    * *Monsoon Flash Flooding*: Simulates citywide speed reductions (-35%) and visibility loss.
    * *Severe Bottlenecks*: Localized critical collisions.
  * **Energy Scenario Sandbox**:
    * *Heatwave Spikes*: Evaluate grid stress under $+1^\circ\text{C}$ to $+8^\circ\text{C}$ temperature anomalies.
    * *EV Fleet Addition*: Model load additions from 0 to 20,000 electric delivery vehicles on 50 kW fast chargers.
    * *Solar Rooftop Penetration*: Model peak demand shaving with 10% to 50% solar capacity.
  * **Baseline vs. Simulated Delta Analysis**: Real-time comparison of speed deltas, congestion shifts, extra fuel wastage, excess $\text{CO}_2$, and actionable municipal mitigation recommendations.

### 4.9 Grounded AI Urban Assistant
* **Location**: `backend/app/services/assistant_service.py`, `frontend/src/components/assistant/AssistantChatDrawer.tsx`
* **Features**:
  * **Zero Hallucination Architecture**: Natural language assistant queries live telemetry directly from the running simulation and database before synthesizing responses.
  * **Specialized Query Handlers**:
    * Traffic congestion, bottlenecks, and active accidents.
    * TANGEDCO power demand, substation loads, and peak load forecasts.
    * Live air quality, PM2.5 levels, and weather updates.
    * Active municipal alerts and emergency notifications.
  * **Traceable Citations**: Every generated briefing provides explicit citations to specific segment IDs, substations, or external API endpoints.

### 4.10 Intelligent Urban Alerts & Anomaly Detection
* **Location**: `backend/app/services/alert_service.py`, `frontend/src/components/alerts/AlertsDrawer.tsx`
* **Features**:
  * **Cross-Domain Anomaly Engine**: Evaluates traffic, electrical, and environmental telemetry against safety thresholds.
  * **Multi-Tier Severity**: Categorizes alerts into `INFO`, `WARNING`, `SEVERE`, and `CRITICAL`.
  * **Root Cause & Impact Diagnostics**: Each alert provides a plain-language root cause summary, predicted downstream impact, and concrete mitigation recommendations.

### 4.11 Interactive Presentation Demo Mode
* **Location**: `backend/app/api/v1/endpoints/simulation.py`, `frontend/src/components/demo/DemoControlBar.tsx`
* **Features**:
  * **1-Click Presets for Live Demonstrations**:
    * `Simulate TIDEL Park Accident`: Injects a multi-vehicle collision on Avinashi Road with a 65% capacity reduction.
    * `Trigger Rainstorm`: Activates a citywide monsoon downpour, reducing travel speeds by 35%.
    * `Simulate Heatwave`: Triggers a $+4.5^\circ\text{C}$ temperature surge and increases residential AC power demand.
    * `Flyover Lane Closure`: Simulates construction restrictions on Avinashi Road.
    * `Reset Twin`: Instantly restores the digital twin to baseline equilibrium.

### 4.12 Executive Municipal Scorecard & Daily Audit Reporting
* **Location**: `backend/app/api/v1/endpoints/reports.py`, `frontend/src/pages/ReportsPage.tsx`
* **Features**:
  * **Municipal Scorecard**: Automated daily executive audit aggregating mobility health, grid load stability, and environmental compliance.
  * **Audit ID Generation**: Produces uniquely timestamped document IDs (e.g., `RPT-CBE-YYYYMMDD`).
  * **Print-Ready Clean Layout**: Clean formatting optimized for browser printing and PDF export via `window.print()`.

### 4.13 Strict Data Provenance & Role-Based Access Control
* **Location**: `frontend/src/components/common/BadgeOrigin.tsx`, `CommandHeader.tsx`
* **Features**:
  * **Visual Provenance Badges**: Every metric in the dashboard is tagged with its origin:
    * `[LIVE API]`: Verified real-time external stream (e.g., Open-Meteo).
    * `[HISTORICAL]`: Baseline empirical data.
    * `[SIMULATED]`: Model-generated or scenario-projected values.
  * **Role Selector**: Switch views between `ADMIN`, `CITY_PLANNER`, `TRAFFIC_POLICE`, and `EMERGENCY_RESPONSE`.

---

## 5. Complete REST API Specification

### Traffic Endpoints
* `GET /api/v1/traffic/corridors/current`
  * Returns citywide congestion index, average network speed, and corridor-level aggregates.
* `GET /api/v1/traffic/segments/current`
  * Returns real-time telemetry for all road segments.
* `GET /api/v1/traffic/segments/{segment_id}`
  * Returns detailed telemetry for a single road segment.
* `GET /api/v1/traffic/bottlenecks?limit=5`
  * Returns top congested road bottlenecks sorted descending by congestion score.
* `GET /api/v1/traffic/predictions?segment_id={id}&horizon={15|30|60|120}`
  * Returns LightGBM forward traffic prediction for the specified horizon.
* `GET /api/v1/traffic/cause/{segment_id}?horizon=30`
  * Returns TreeSHAP feature attributions and primary causal classification.
* `GET /api/v1/traffic/impact/{segment_id}`
  * Returns downstream spillover, queue buildup in meters, and EPA VSP emissions.

### Energy Endpoints
* `GET /api/v1/energy/current`
  * Returns current power demand across all 5 substation zones, grid utilization, and frequency.
* `GET /api/v1/energy/forecast?zone_id={optional}`
  * Returns 24-hour predictive load curve with 95% confidence bands and expected peak timing.

### Environmental Endpoints
* `GET /api/v1/environment/current`
  * Returns live atmospheric parameters (AQI, PM2.5, PM10, $\text{NO}_2$, temperature, humidity) and traffic emission share.

### What-If Scenario Endpoints
* `POST /api/v1/scenarios/traffic/run`
  * Payload: `{ scenario_type, corridor_id, capacity_reduction_pct, surge_multiplier }`
  * Returns baseline vs. simulated deltas (speed, congestion, fuel, $\text{CO}_2$) and mitigation recommendations.
* `POST /api/v1/scenarios/energy/run`
  * Payload: `{ temp_delta_c, ev_count, industrial_shift_factor, solar_penetration_pct }`
  * Returns baseline vs. simulated grid power load deltas and overload alerts.

### AI Assistant & Alerts Endpoints
* `POST /api/v1/assistant/chat`
  * Payload: `{ message, history }`
  * Returns schema-grounded natural language response with data citations.
* `GET /api/v1/alerts/active`
  * Returns list of currently active unresolved urban alerts.

### Simulation Control Endpoints
* `POST /api/v1/simulation/tick?persist=false`
  * Steps the digital twin state forward by one tick.
* `POST /api/v1/simulation/demo-preset`
  * Payload: `{ preset_id: "ACCIDENT_TIDEL" | "MONSOON_DOWNPOUR" | "HEATWAVE_SPIKE" | "FLYOVER_LANE_CLOSURE" | "RESET" }`
  * Injects demonstration incident presets.

### GIS Endpoints
* `GET /api/v1/gis/corridors.geojson`
  * Returns GeoJSON FeatureCollection of all monitored arterial corridors.

### Reporting Endpoints
* `GET /api/v1/reports/daily`
  * Returns daily municipal executive briefing scorecard.

---

## 6. Database Schema & Data Models

The persistence layer uses **PostgreSQL 16** with **PostGIS** and **TimescaleDB** extensions:

```sql
-- 1. Road Network Nodes (Junctions)
CREATE TABLE road_nodes (
    node_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation DOUBLE PRECISION DEFAULT 0.0,
    is_signalized BOOLEAN DEFAULT FALSE,
    geom GEOMETRY(Point, 4326) NOT NULL
);

-- 2. Road Network Segments (Arterial Corridors)
CREATE TABLE road_segments (
    segment_id VARCHAR(64) PRIMARY KEY,
    corridor_name VARCHAR(128) NOT NULL,
    start_node_id VARCHAR(64) REFERENCES road_nodes(node_id),
    end_node_id VARCHAR(64) REFERENCES road_nodes(node_id),
    length_meters DOUBLE PRECISION NOT NULL,
    speed_limit_kmh DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    lane_count INT NOT NULL DEFAULT 4,
    capacity_vph INT NOT NULL DEFAULT 2400,
    geom GEOMETRY(LineString, 4326) NOT NULL
);

-- 3. Traffic Telemetry Hypertable (Time-Series)
CREATE TABLE traffic_telemetry (
    recorded_at TIMESTAMPTZ NOT NULL,
    segment_id VARCHAR(64) NOT NULL REFERENCES road_segments(segment_id),
    average_speed_kmh DOUBLE PRECISION NOT NULL,
    vehicle_count INT NOT NULL,
    congestion_score DOUBLE PRECISION NOT NULL,
    congestion_level VARCHAR(16) NOT NULL,
    queue_length_meters DOUBLE PRECISION DEFAULT 0.0,
    travel_time_seconds DOUBLE PRECISION NOT NULL,
    data_origin VARCHAR(16) NOT NULL DEFAULT 'SIMULATED',
    CONSTRAINT pk_traffic_telemetry PRIMARY KEY (recorded_at, segment_id)
);
SELECT create_hypertable('traffic_telemetry', 'recorded_at');

-- 4. Energy Zones (Substations)
CREATE TABLE energy_zones (
    zone_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    capacity_mw DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Polygon, 4326) NOT NULL
);

-- 5. Energy Telemetry Hypertable
CREATE TABLE energy_telemetry (
    recorded_at TIMESTAMPTZ NOT NULL,
    zone_id VARCHAR(32) NOT NULL REFERENCES energy_zones(zone_id),
    active_power_mw DOUBLE PRECISION NOT NULL,
    reactive_power_mvar DOUBLE PRECISION NOT NULL,
    voltage_kv DOUBLE PRECISION NOT NULL,
    grid_frequency_hz DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    data_origin VARCHAR(16) NOT NULL DEFAULT 'SIMULATED',
    CONSTRAINT pk_energy_telemetry PRIMARY KEY (recorded_at, zone_id)
);
SELECT create_hypertable('energy_telemetry', 'recorded_at');
```

---

## 7. Mathematical & Algorithmic Formulations

### 7.1 Greenshields Traffic Congestion Equilibrium
The congestion score $C_i(t) \in [0, 100]$ is computed as:

$$C_i(t) = \min\left(100, \left( 0.55 \cdot \max\left(0, \frac{v_{\text{free}} - v(t)}{v_{\text{free}}}\right) + 0.35 \cdot \frac{k(t)}{k_{\text{jam}}} + 0.10 \cdot \frac{q(t)}{L_i} \right) \times 100 \right)$$

* $v(t)$: Current average vehicular speed (km/h)
* $v_{\text{free}}$: Free-flow speed limit (50 km/h)
* $k(t)$: Vehicular density (veh/km/lane)
* $k_{\text{jam}}$: Jam density ($\approx 125$ veh/km/lane)
* $q(t)$: Physical queue length (m)
* $L_i$: Segment length (m)

### 7.2 Logit Choice Route Diversion Model
When capacity is restricted on corridor segment $e_0$, the probability of motorists choosing alternate route $R_k$ is modeled as:

$$P(R_k) = \frac{\exp(-\theta \cdot T_k)}{\sum_j \exp(-\theta \cdot T_j)}$$

* $T_k$: Perceived travel time on alternate route $k$
* $\theta$: Route choice sensitivity parameter

### 7.3 Environmental Excess Emissions (EPA VSP Model)
Excess idle carbon dioxide emissions are estimated using:

$$\Delta \text{CO}_2 (\text{kg}) = \sum \text{Vehicles} \times (\text{Delay}_{\text{seconds}} \times \text{Idle\_Factor} + \text{Emission\_Factor}(v))$$

* $\text{Idle\_Factor}$: $0.000625\text{ kg CO}_2/\text{sec}$ for average passenger/commercial vehicles
* Standard fuel-to-$\text{CO}_2$ conversion: $1\text{ liter of gasoline/diesel} \approx 2.31\text{ kg CO}_2$

---

## 8. Machine Learning Pipeline & Features

### 8.1 Multi-Horizon Traffic Feature Vector
The ML models ingest an 18-dimensional feature vector:
1. `sin_hour`: $\sin(2\pi \cdot \text{hour}/24)$
2. `cos_hour`: $\cos(2\pi \cdot \text{hour}/24)$
3. `day_of_week`: 0 (Monday) to 6 (Sunday)
4. `is_weekend`: Binary flag
5. `is_rush_hour`: Flag for 08:30–10:30 and 17:30–20:00 IST
6. `current_speed_kmh`: Observed average speed
7. `speed_deficit`: $\max(0, 50 - v)$
8. `speed_ratio`: $v / 50$
9. `upstream_speed_kmh`: Speed on connected upstream link
10. `upstream_speed_deficit`: Upstream speed delta
11. `lane_count`: Roadway lane count
12. `capacity_loss_pct`: Active capacity restriction percentage
13. `is_incident_active`: Active collision/hazard flag
14. `ambient_temp_c`: Live temperature from Open-Meteo
15. `rain_mm`: Precipitation rate in mm/hr
16. `wind_speed_kmh`: Wind speed
17. `relative_humidity_pct`: Atmospheric humidity
18. `hour_num`: Integer hour (0–23)

---

## 9. Deployment & Local Execution Guide

### Prerequisites
* **Python**: 3.10+ (tested up to Python 3.14)
* **Node.js**: v18+ (tested on Node v24) and `npm`

### Starting the Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
* **API URL**: `http://localhost:8000`
* **Swagger Documentation**: `http://localhost:8000/docs`

### Starting the Frontend
```bash
cd frontend
npm install
npm run dev
```
* **Command Center Dashboard**: `http://localhost:5173`

---
*Document generated for the Coimbatore Smart City Predictive Digital Twin Platform.*
