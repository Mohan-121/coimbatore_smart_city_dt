# Coimbatore Smart City Digital Twin
### Predictive Traffic, Energy & Urban Intelligence Platform

A software-only, cyber-physical digital twin representing **Coimbatore, Tamil Nadu, India**. The platform integrates real-time atmospheric APIs, geospatial road graphs, machine learning predictions, explainable AI (TreeSHAP), downstream impact propagation, and interactive what-if scenarios into a Command Center dashboard.

---

## 🌟 Key Features
* **Interactive 2.5D/3D Digital Twin Map**: Built with MapLibre GL JS & Deck.gl, featuring animated traffic flow arcs, building extrusions, and GPU hexagonal congestion heatmaps.
* **Corridor Traffic Monitoring & Multi-Horizon Forecasting**: 15m, 30m, 60m, and 120m forecasts powered by LightGBM/GradientBoosting.
* **Explainable AI (XAI) Cause Engine**: Explains *why* congestion rises using TreeSHAP additive feature attributions (e.g. Peak hour 52%, Upstream Queue 28%, Weather 12%).
* **Downstream Impact & Emission Engine**: Computes queue spillover, detour pressure on parallel corridors, and estimated excess fuel burn (Liters) and carbon emissions (kg CO2).
* **Energy Grid Digital Twin**: Monitors 5 TANGEDCO Coimbatore distribution zones with 24-hour predictive load curves and peak warning alerts.
* **What-If Urban Scenario Simulator**: Synchronized dual-map comparison (Baseline vs Scenario) for road closures, traffic volume surges, and heatwaves.
* **Grounded AI Urban Assistant**: Natural language conversational assistant answering questions based strictly on live database telemetry.
* **Interactive Demo Mode**: 1-click presentation triggers (`Simulate TIDEL Park Accident`, `Trigger Rainstorm`, `Simulate Heatwave`) for live demonstrations.
* **Strict Data Provenance**: Every metric displays explicit `[LIVE API]`, `[HISTORICAL]`, or `[SIMULATED]` badges.

---

## 🚀 Quickstart (Local Execution)

### Prerequisites
* Python 3.10+ (tested on Python 3.14)
* Node.js v18+ (tested on Node v24) & npm

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies (or run directly if packages already installed)
pip install -r requirements.txt

# Initialize database and seed Coimbatore geospatial corridors
python ../scripts/init_db.py
python ../scripts/seed_coimbatore_geo.py

# Launch FastAPI Backend
python -m uvicorn app.main:app --reload --port 8000
```
Backend API will be running at: `http://localhost:8000`  
Interactive Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend Command Center will be running at: `http://localhost:5173`

---

## 📂 Architecture & Documentation
* [docs/SYSTEM_ARCHITECTURE_SPECIFICATION.md](docs/SYSTEM_ARCHITECTURE_SPECIFICATION.md): Complete system architecture, mathematical formulations (Greenshields, EPA VSP), and database schemas.
* [docs/ANTIGRAVITY_IMPLEMENTATION_PROMPTS.md](docs/ANTIGRAVITY_IMPLEMENTATION_PROMPTS.md): All 29 sequential development phase prompts.
