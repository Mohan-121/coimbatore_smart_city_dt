import os
import sys
import math
import random
from pathlib import Path
from datetime import datetime, timedelta
import numpy as np
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Add root directory to sys.path
root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))

from ml.features.traffic_features import extract_traffic_features, features_to_vector, FEATURE_NAMES

def generate_synthetic_training_dataset(days: int = 30):
    """
    Generates realistic hourly multi-segment traffic dataset for Coimbatore.
    Simulates weather variations and random accidents.
    """
    start_time = datetime(2026, 8, 1, 0, 0)
    data = []
    
    # 5 Corridors
    corridors = [
        {"name": "Avinashi Road", "speed_limit": 50.0, "lanes": 6, "base_cap": 3600},
        {"name": "Trichy Road", "speed_limit": 50.0, "lanes": 4, "base_cap": 2800},
        {"name": "Sathy Road", "speed_limit": 50.0, "lanes": 4, "base_cap": 2800},
        {"name": "Mettupalayam Road", "speed_limit": 50.0, "lanes": 4, "base_cap": 2800},
        {"name": "Pollachi Road", "speed_limit": 55.0, "lanes": 4, "base_cap": 2800},
    ]

    for d in range(days):
        for h in range(24):
            dt = start_time + timedelta(days=d, hours=h)
            hour_float = dt.hour
            is_weekend = dt.weekday() >= 5
            
            # Weather probability (occasional monsoon shower)
            rain_mm = 25.0 if (random.random() < 0.12 and 14 <= hour_float <= 19) else 0.0
            weather_speed_penalty = 0.80 if rain_mm > 0 else 1.0

            for corr in corridors:
                speed_limit = corr["speed_limit"]
                lanes = corr["lanes"]
                
                # Diurnal rush hour demand
                if not is_weekend and (8.0 <= hour_float <= 10.5 or 17.5 <= hour_float <= 20.5):
                    base_cong = random.uniform(62.0, 88.0)
                else:
                    base_cong = random.uniform(10.0, 45.0) if not is_weekend else random.uniform(15.0, 50.0)

                # Incident probability (~5% chance during peak hours)
                is_incident = random.random() < 0.05
                capacity_loss = random.uniform(40.0, 70.0) if is_incident else 0.0
                if is_incident:
                    base_cong = min(98.0, base_cong + 25.0)

                current_speed = max(8.0, speed_limit * (1.0 - (base_cong / 115.0)) * weather_speed_penalty)
                upstream_speed = max(10.0, current_speed * random.uniform(0.9, 1.15))

                feat_dict = extract_traffic_features(
                    dt=dt,
                    current_speed_kmh=current_speed,
                    current_congestion=base_cong,
                    upstream_speed_kmh=upstream_speed,
                    speed_limit_kmh=speed_limit,
                    lane_count=lanes,
                    is_incident_active=is_incident,
                    capacity_loss_pct=capacity_loss,
                    rain_mm=rain_mm
                )
                vec = features_to_vector(feat_dict)

                # Targets for 15m, 30m, 60m, 120m
                # Congestion evolves with momentum and diurnal shift
                t_15 = max(5.0, min(100.0, base_cong + random.gauss(0, 3.0)))
                t_30 = max(5.0, min(100.0, base_cong + (10.0 if (8 <= hour_float <= 9 or 17 <= hour_float <= 18) else -5.0) + random.gauss(0, 4.5)))
                t_60 = max(5.0, min(100.0, base_cong + (18.0 if (8 <= hour_float <= 9 or 17 <= hour_float <= 18) else -10.0) + random.gauss(0, 6.0)))
                t_120 = max(5.0, min(100.0, base_cong + random.gauss(0, 8.0)))

                data.append((dt, vec, t_15, t_30, t_60, t_120, base_cong))

    return data

def train_and_evaluate():
    print("Generating synthetic historical time-series dataset for Coimbatore...")
    dataset = generate_synthetic_training_dataset(days=35)
    
    # Sort strictly by timestamp (chronological time-series split)
    dataset.sort(key=lambda x: x[0])
    
    n = len(dataset)
    train_idx = int(n * 0.70)
    val_idx = int(n * 0.85)

    train_data = dataset[:train_idx]
    val_data = dataset[train_idx:val_idx]
    test_data = dataset[val_idx:]

    X_train = np.array([x[1] for x in train_data])
    X_test = np.array([x[1] for x in test_data])
    baseline_test = np.array([x[6] for x in test_data]) # Current congestion persistence baseline

    horizons = [15, 30, 60, 120]
    weights_dir = root_dir / "ml" / "models" / "weights"
    weights_dir.mkdir(parents=True, exist_ok=True)

    print(f"\nTraining Samples: {len(X_train)} | Test Samples: {len(X_test)}")
    print(f"{'Horizon':<10} | {'Baseline MAE':<15} | {'Model MAE':<12} | {'Model RMSE':<12} | {'R2 Score':<10}")
    print("-" * 65)

    for i, h in enumerate(horizons):
        y_train = np.array([x[2 + i] for x in train_data])
        y_test = np.array([x[2 + i] for x in test_data])

        # Baseline MAE (Persistence model: y_pred = current_congestion)
        base_mae = mean_absolute_error(y_test, baseline_test)

        # Train Gradient Boosting Regressor
        model = GradientBoostingRegressor(
            n_estimators=75,
            learning_rate=0.1,
            max_depth=4,
            random_state=42
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        print(f"{f'{h} mins':<10} | {base_mae:<15.2f} | {mae:<12.2f} | {rmse:<12.2f} | {r2:<10.3f}")

        # Save model
        model_path = weights_dir / f"traffic_model_{h}m.pkl"
        joblib.dump(model, model_path)

    print(f"\nAll models serialized to: {weights_dir}")

if __name__ == "__main__":
    train_and_evaluate()
