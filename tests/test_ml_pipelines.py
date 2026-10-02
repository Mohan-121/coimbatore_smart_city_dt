import pytest
from datetime import datetime
from pathlib import Path
import joblib

from backend.app.core.config import BASE_DIR
from ml.features.traffic_features import extract_traffic_features, features_to_vector
from ml.features.energy_features import extract_energy_features, energy_features_to_vector
from ml.explainability.shap_explainer import TrafficCauseExplainer

def test_traffic_models_serialization():
    weights_dir = BASE_DIR / "ml" / "models" / "weights"
    for h in [15, 30, 60, 120]:
        model_file = weights_dir / f"traffic_model_{h}m.pkl"
        assert model_file.exists(), f"Model file for {h}m horizon missing"
        model = joblib.load(model_file)
        assert hasattr(model, "predict"), f"Model for {h}m is not callable"

def test_traffic_inference_and_shap_explanation():
    dt = datetime(2026, 10, 1, 18, 30)
    feat_dict = extract_traffic_features(
        dt=dt,
        current_speed_kmh=18.0,
        current_congestion=75.0,
        upstream_speed_kmh=22.0,
        speed_limit_kmh=50.0,
        lane_count=4,
        is_incident_active=True,
        capacity_loss_pct=60.0
    )
    vec = features_to_vector(feat_dict)

    weights_dir = BASE_DIR / "ml" / "models" / "weights"
    model = joblib.load(weights_dir / "traffic_model_30m.pkl")
    pred = float(model.predict([vec])[0])

    assert 0.0 <= pred <= 100.0, "Prediction must be bounded between 0 and 100"

    explainer = TrafficCauseExplainer(weights_dir / "traffic_model_30m.pkl")
    explanation = explainer.explain(vec, pred)

    assert "primary_cause" in explanation
    assert "confidence_score" in explanation
    assert "contributions" in explanation
    total_pct = sum(explanation["contributions"].values())
    assert 99.0 <= total_pct <= 101.0, f"Attribution percentages must sum to ~100%, got {total_pct}"

def test_energy_model_inference():
    weights_dir = BASE_DIR / "ml" / "models" / "weights"
    energy_file = weights_dir / "energy_forecast_model.pkl"
    assert energy_file.exists()

    model = joblib.load(energy_file)
    dt = datetime(2026, 10, 1, 14, 0)
    feat_dict = extract_energy_features(
        dt=dt,
        zone_id="ZONE_METRO",
        temp_celsius=32.0,
        lag_1h_mw=220.0,
        lag_24h_mw=215.0
    )
    vec = energy_features_to_vector(feat_dict)
    pred_mw = float(model.predict([vec])[0])

    assert 100.0 <= pred_mw <= 350.0, f"Predicted zone demand {pred_mw} MW outside realistic bounds"
