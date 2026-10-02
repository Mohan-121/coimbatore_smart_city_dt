import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "Coimbatore" in data["city"]

def test_gis_corridors():
    res = client.get("/api/v1/gis/corridors")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) >= 10

def test_traffic_corridors_current():
    res = client.get("/api/v1/traffic/corridors/current")
    assert res.status_code == 200
    data = res.json()
    assert "city_congestion_index" in data
    assert len(data["corridors"]) >= 4

def test_traffic_prediction_endpoint():
    res = client.get("/api/v1/traffic/predictions?segment_id=SEG_AVINASHI_01&horizon=30")
    assert res.status_code == 200
    data = res.json()
    assert data["segment_id"] == "SEG_AVINASHI_01"
    assert data["horizon_minutes"] == 30
    assert "predicted_congestion_score" in data

def test_cause_analysis_endpoint():
    res = client.get("/api/v1/traffic/cause/SEG_AVINASHI_01?horizon=30")
    assert res.status_code == 200
    data = res.json()
    assert "primary_cause" in data
    assert "contributions" in data
    assert "explanation" in data

def test_energy_current_and_forecast():
    c_res = client.get("/api/v1/energy/current")
    assert c_res.status_code == 200
    assert "total_active_power_mw" in c_res.json()

    f_res = client.get("/api/v1/energy/forecast")
    assert f_res.status_code == 200
    data = f_res.json()
    assert "peak_predicted_mw" in data
    assert len(data["forecast_series"]) == 24

def test_environment_endpoint():
    res = client.get("/api/v1/environment/current")
    assert res.status_code == 200
    data = res.json()
    assert "aqi" in data
    assert "pollutants" in data

def test_what_if_traffic_scenario():
    payload = {
        "scenario_type": "ROAD_CLOSURE",
        "corridor_id": "Avinashi Road",
        "capacity_reduction_pct": 50.0,
        "surge_multiplier": 1.0
    }
    res = client.post("/api/v1/scenarios/traffic/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "baseline" in data
    assert "simulated" in data
    assert "delta" in data

def test_ai_assistant_chat():
    res = client.post("/api/v1/assistant/chat", json={"message": "What is the forecasted energy peak today?"})
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert len(data["tools_executed"]) > 0
