# Coimbatore Smart City Digital Twin — Features & Architecture Documentation

A complete operational and architectural manual for the Coimbatore Smart City Digital Twin.

---

## 📑 Quick Navigation & Downloads
* **Markdown Document**: [PROJECT_FEATURES_DOCUMENTATION.md](file:///c:/Users/Mohan%20Anbu/OneDrive/Pictures/Desktop/ds_project/docs/PROJECT_FEATURES_DOCUMENTATION.md)
* **Interactive / Printable HTML (Download as PDF)**: [PROJECT_FEATURES_DOCUMENTATION.html](file:///c:/Users/Mohan%20Anbu/OneDrive/Pictures/Desktop/ds_project/docs/PROJECT_FEATURES_DOCUMENTATION.html)
* **System Architecture Specification**: [SYSTEM_ARCHITECTURE_SPECIFICATION.md](file:///c:/Users/Mohan%20Anbu/OneDrive/Pictures/Desktop/ds_project/docs/SYSTEM_ARCHITECTURE_SPECIFICATION.md)

---

## 🏙️ Core Platform Pillars

### 1. 2.5D/3D Geospatial Digital Twin Map
* Built with **MapLibre GL JS** and **Deck.gl** vector tiles.
* Covers 5 arterial national highways in Coimbatore: Avinashi Road (NH 544), Trichy Road (NH 81), Sathy Road (NH 948), Mettupalayam Road (NH 181), and Pollachi Road (NH 83).
* Color-coded congestion glow lines (Emerald, Amber, Orange, Crimson) and interactive segment click-to-inspect.
* Animated visual incident markers for active collisions and construction lane restrictions.

### 2. Traffic Intelligence & Multi-Horizon ML Forecasting
* Real-time congestion index calculation via **Greenshields Traffic Density Equilibrium**.
* Top 5 congested bottleneck ranking in real-time.
* Forward forecasting across **15m, 30m, 60m, and 120m** using **LightGBM**.

### 3. Explainable AI (XAI) Cause Attribution Engine
* Uses **TreeSHAP** to decompose predictions into four additive municipal root causes:
  * **Peak-Hour Commuter Surge**
  * **Upstream Junction Queue Spillover**
  * **Active Incident / Lane Capacity Loss**
  * **Weather & Monsoon Downpour**
* Synthesizes automated natural language cause narratives.

### 4. Downstream Spillover & Environmental Impact Engine
* Analyzes network graph topology and driver diversion across alternate corridors.
* Evaluates queue growth in meters.
* Calculates excess fuel burn (Liters) and carbon emissions (kg $\text{CO}_2$) via the **EPA Vehicle Specific Power (VSP)** model.

### 5. Electrical Grid & Power Demand Twin (TANGEDCO)
* Monitors 5 distribution zones: Metro Central, North IT, East Industrial, South Residential, and Kurichi SIDCO.
* 24-Hour forward demand forecasting with shaded 95% confidence intervals and evening cooling peak warning alerts.

### 6. Environmental Intelligence & Live Air Quality
* Real-time atmospheric data ingestion via **Open-Meteo Live API** for Coimbatore (`11.0168° N, 76.9558° E`).
* Tracks AQI, PM2.5, PM10, $\text{NO}_2$, $\text{CO}$, temperature, humidity, wind, and rain.
* Evaluates stop-and-go vehicular idling contribution percentage to air pollution.

### 7. 'What-If' Urban Scenario Simulator
* Dual-view baseline vs. simulated delta analysis for:
  * Flyover & road closures (10% to 90% capacity reduction).
  * Traffic surges (0.8x to 2.0x volume multiplier).
  * Monsoon flash downpours (35% speed throttling).
  * Heatwaves (+1°C to +8°C) and fleet EV charging (up to 20,000 EVs).

### 8. Grounded AI Urban Assistant
* Conversational natural language assistant in a slide-out drawer.
* Answers questions grounded strictly in real-time telemetry from the simulation and database with traceable citations.

### 9. Anomaly Alerts & 1-Click Presentation Demo Mode
* Multi-severity alert drawer (`INFO`, `WARNING`, `SEVERE`, `CRITICAL`).
* 1-click live demo presets: *Simulate TIDEL Park Accident*, *Trigger Rainstorm*, *Simulate Heatwave*, *Flyover Lane Closure*, and *Reset Twin*.

### 10. Executive Municipal Reporting & Strict Provenance
* Daily automated municipal scorecard with PDF print styling.
* Provenance badges on every metric: `[LIVE API]`, `[HISTORICAL]`, or `[SIMULATED]`.

---

## 🛠️ Complete REST Endpoints

| Endpoint | Method | Functionality |
| :--- | :--- | :--- |
| `/api/v1/traffic/corridors/current` | `GET` | Corridor speeds, congestion scores, city aggregates |
| `/api/v1/traffic/predictions` | `GET` | 15m, 30m, 60m, 120m LightGBM traffic forecasts |
| `/api/v1/traffic/cause/{segment_id}` | `GET` | TreeSHAP 4-category causal attribution |
| `/api/v1/traffic/impact/{segment_id}` | `GET` | Queue spillover, excess fuel liters, $\text{CO}_2$ |
| `/api/v1/energy/current` | `GET` | TANGEDCO 5-zone power demand & frequency |
| `/api/v1/energy/forecast` | `GET` | 24h predictive load curve with 95% confidence intervals |
| `/api/v1/environment/current` | `GET` | Live Open-Meteo AQI, PM2.5, PM10, and weather |
| `/api/v1/scenarios/traffic/run` | `POST` | What-If road closure, surge, and monsoon deltas |
| `/api/v1/scenarios/energy/run` | `POST` | What-If heatwave & EV fast-charging demand deltas |
| `/api/v1/assistant/chat` | `POST` | Grounded AI assistant chat with citations |
| `/api/v1/alerts/active` | `GET` | Active unresolved urban alerts |
| `/api/v1/simulation/demo-preset` | `POST` | Injects 1-click demo scenario presets |
| `/api/v1/reports/daily` | `GET` | Daily executive municipal scorecard |
