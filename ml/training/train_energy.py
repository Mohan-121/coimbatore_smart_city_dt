import sys
import random
from pathlib import Path
from datetime import datetime, timedelta
import numpy as np
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Add root directory to sys.path
root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))

from ml.features.energy_features import extract_energy_features, energy_features_to_vector
from backend.app.simulation.energy_sim import get_diurnal_energy_demand

def generate_energy_dataset(days: int = 60):
    start_time = datetime(2026, 7, 1, 0, 0)
    data = []
    zones = ["ZONE_METRO", "ZONE_NORTH_IT", "ZONE_EAST_IND", "ZONE_SOUTH_RES", "ZONE_KURICHI_SIDCO"]

    for d in range(days):
        for h in range(24):
            dt = start_time + timedelta(days=d, hours=h)
            # Ambient temp variations
            temp_c = 26.0 + 7.0 * np.sin(np.pi * (h - 9) / 12.0) if 7 <= h <= 19 else 24.5
            temp_c += random.gauss(0, 1.2)

            for zid in zones:
                res = get_diurnal_energy_demand(dt, zid, temp_c)
                actual_mw = res["active_power_mw"] + random.gauss(0, 2.0)

                # Simulated lags
                lag_1h = actual_mw * random.uniform(0.97, 1.03)
                lag_24h = actual_mw * random.uniform(0.95, 1.05)

                feat_dict = extract_energy_features(
                    dt=dt,
                    zone_id=zid,
                    temp_celsius=temp_c,
                    lag_1h_mw=lag_1h,
                    lag_24h_mw=lag_24h
                )
                vec = energy_features_to_vector(feat_dict)
                data.append((dt, vec, actual_mw))

    return data

def train_energy_model():
    print("Generating historical energy dataset for Coimbatore grid zones...")
    dataset = generate_energy_dataset(days=60)
    dataset.sort(key=lambda x: x[0])

    n = len(dataset)
    split_idx = int(n * 0.80)
    train_data = dataset[:split_idx]
    test_data = dataset[split_idx:]

    X_train = np.array([x[1] for x in train_data])
    y_train = np.array([x[2] for x in train_data])

    X_test = np.array([x[1] for x in test_data])
    y_test = np.array([x[2] for x in test_data])

    print(f"Training Samples: {len(X_train)} | Test Samples: {len(X_test)}")
    model = GradientBoostingRegressor(
        n_estimators=100,
        learning_rate=0.08,
        max_depth=5,
        random_state=42
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100.0

    print(f"\nModel Evaluation Metrics:")
    print(f"  MAE  : {mae:.2f} MW")
    print(f"  RMSE : {rmse:.2f} MW")
    print(f"  MAPE : {mape:.2f}% (Target: < 4.0%)")

    weights_dir = root_dir / "ml" / "models" / "weights"
    weights_dir.mkdir(parents=True, exist_ok=True)
    model_path = weights_dir / "energy_forecast_model.pkl"
    joblib.dump(model, model_path)
    print(f"Energy forecast model serialized to: {model_path}\n")

if __name__ == "__main__":
    train_energy_model()
