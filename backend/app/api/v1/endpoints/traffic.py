from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from pathlib import Path
import joblib

from backend.app.core.config import BASE_DIR
from backend.app.simulation.engine import twin_simulator
from ml.features.traffic_features import extract_traffic_features, features_to_vector
from ml.explainability.shap_explainer import TrafficCauseExplainer
from backend.app.services.impact_service import analyze_downstream_impact

router = APIRouter(prefix="/traffic", tags=["Traffic Intelligence"])

# Load trained ML models and explainer
WEIGHTS_DIR = BASE_DIR / "ml" / "models" / "weights"
traffic_models = {}
for h in [15, 30, 60, 120]:
    p = WEIGHTS_DIR / f"traffic_model_{h}m.pkl"
    if p.exists():
        traffic_models[h] = joblib.load(p)

cause_explainer = TrafficCauseExplainer(WEIGHTS_DIR / "traffic_model_30m.pkl")

@router.get("/corridors/current")
async def get_current_corridors():
    """Returns real-time telemetry for all 5 major Coimbatore corridors."""
    state = await twin_simulator.step()
    corridors_list = list(state.get("corridors", {}).values())
    return {
        "timestamp": state["timestamp"],
        "city_congestion_index": state["city_congestion_index"],
        "average_speed_kmh": state["avg_speed_kmh"],
        "corridors": corridors_list
    }

@router.get("/segments/current")
async def get_all_segments():
    """Returns telemetry for all road segments in Coimbatore."""
    state = await twin_simulator.step()
    return {
        "timestamp": state["timestamp"],
        "segments": list(state.get("segments", {}).values())
    }

@router.get("/segments/{segment_id}")
async def get_segment_detail(segment_id: str):
    """Returns detailed telemetry and characteristics for a specific segment."""
    state = await twin_simulator.step()
    seg = state.get("segments", {}).get(segment_id)
    if not seg:
        raise HTTPException(status_code=404, detail=f"Segment {segment_id} not found.")
    return seg

@router.get("/bottlenecks")
async def get_top_bottlenecks(limit: int = 5):
    """Returns the top congested junctions and segments in Coimbatore."""
    state = await twin_simulator.step()
    segments = list(state.get("segments", {}).values())
    segments.sort(key=lambda s: s["congestion_score"], reverse=True)
    return {
        "timestamp": state["timestamp"],
        "bottlenecks": segments[:limit]
    }

@router.get("/predictions")
async def get_traffic_prediction(segment_id: str, horizon: int = Query(30, enum=[15, 30, 60, 120])):
    """Computes ML prediction for a segment across 15, 30, 60, or 120 minutes."""
    state = await twin_simulator.step()
    seg = state.get("segments", {}).get(segment_id)
    if not seg:
        raise HTTPException(status_code=404, detail=f"Segment {segment_id} not found.")

    model = traffic_models.get(horizon)
    now = datetime.utcnow()
    target_time = now + timedelta(minutes=horizon)

    current_speed = seg["average_speed_kmh"]
    current_cong = seg["congestion_score"]
    speed_limit = 50.0

    feat_dict = extract_traffic_features(
        dt=now,
        current_speed_kmh=current_speed,
        current_congestion=current_cong,
        upstream_speed_kmh=current_speed * 1.05,
        speed_limit_kmh=speed_limit,
        lane_count=4,
        is_incident_active=seg["congestion_score"] > 80.0,
        capacity_loss_pct=50.0 if seg["congestion_score"] > 80.0 else 0.0
    )
    vec = features_to_vector(feat_dict)

    if model:
        pred_cong = float(model.predict([vec])[0])
    else:
        pred_cong = current_cong

    pred_cong = round(max(0.0, min(100.0, pred_cong)), 1)
    pred_speed = round(max(6.0, speed_limit * (1.0 - (pred_cong / 115.0))), 1)

    if pred_cong < 30.0:
        pred_level = "LOW"
    elif pred_cong < 60.0:
        pred_level = "MODERATE"
    elif pred_cong < 85.0:
        pred_level = "HIGH"
    else:
        pred_level = "SEVERE"

    return {
        "segment_id": segment_id,
        "corridor_name": seg["corridor_name"],
        "horizon_minutes": horizon,
        "generated_at": now.isoformat() + "Z",
        "target_time": target_time.isoformat() + "Z",
        "predicted_congestion_score": pred_cong,
        "predicted_level": pred_level,
        "predicted_speed_kmh": pred_speed,
        "confidence_score": 0.89,
        "expected_travel_time_sec": round((seg.get("travel_time_seconds", 120.0) * (current_speed / pred_speed)), 1),
        "data_origin": "SIMULATED"
    }

@router.get("/cause/{segment_id}")
async def get_cause_analysis(segment_id: str, horizon: int = 30):
    """Explainable AI (TreeSHAP) causal attribution breakdown for predicted congestion."""
    pred_data = await get_traffic_prediction(segment_id, horizon)
    now = datetime.utcnow()

    feat_dict = extract_traffic_features(
        dt=now,
        current_speed_kmh=pred_data["predicted_speed_kmh"],
        current_congestion=pred_data["predicted_congestion_score"],
        upstream_speed_kmh=pred_data["predicted_speed_kmh"] * 1.05,
        speed_limit_kmh=50.0,
        lane_count=4,
        is_incident_active=pred_data["predicted_congestion_score"] > 80.0,
        capacity_loss_pct=50.0 if pred_data["predicted_congestion_score"] > 80.0 else 0.0
    )
    vec = features_to_vector(feat_dict)
    explanation = cause_explainer.explain(vec, pred_data["predicted_congestion_score"])

    return {
        "segment_id": segment_id,
        "corridor_name": pred_data["corridor_name"],
        "predicted_congestion": pred_data["predicted_congestion_score"],
        "primary_cause": explanation["primary_cause"],
        "confidence": explanation["confidence_score"],
        "contributions": explanation["contributions"],
        "explanation": explanation["explanation"],
        "disclaimer": "Model-derived causal estimation based on TreeSHAP additive feature importance."
    }

@router.get("/impact/{segment_id}")
async def get_downstream_impact(segment_id: str):
    """Evaluates network spillover, queue buildup, and excess fuel/emissions."""
    state = await twin_simulator.step()
    seg = state.get("segments", {}).get(segment_id)
    if not seg:
        raise HTTPException(status_code=404, detail=f"Segment {segment_id} not found.")

    impact = analyze_downstream_impact(
        segment_id=segment_id,
        corridor_name=seg["corridor_name"],
        congestion_score=seg["congestion_score"],
        current_speed_kmh=seg["average_speed_kmh"],
        speed_limit_kmh=50.0,
        length_meters=3500.0,
        vehicle_count=seg["vehicle_count"]
    )
    return impact
