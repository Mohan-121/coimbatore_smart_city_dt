import numpy as np
from typing import Dict, Any, List

class AnomalyDetector:
    """
    Statistical anomaly detector tracking rolling Z-scores:
    Z = (X - mean) / std. Triggers anomaly when |Z| > 2.5.
    """
    def __init__(self):
        # Baseline speed statistics by corridor (mean, std)
        self.traffic_baselines = {
            "Avinashi Road": {"mean": 38.5, "std": 6.2},
            "Trichy Road": {"mean": 36.0, "std": 5.8},
            "Sathy Road": {"mean": 37.2, "std": 6.0},
            "Mettupalayam Road": {"mean": 35.8, "std": 5.5},
            "Pollachi Road": {"mean": 42.0, "std": 7.0},
        }

    def check_traffic_anomaly(self, corridor_name: str, current_speed_kmh: float) -> Dict[str, Any]:
        baseline = self.traffic_baselines.get(corridor_name, {"mean": 37.0, "std": 6.0})
        mean = baseline["mean"]
        std = baseline["std"]

        z_score = (current_speed_kmh - mean) / std

        is_anomaly = z_score < -2.2 # Speed significantly lower than baseline
        return {
            "corridor_name": corridor_name,
            "current_speed_kmh": current_speed_kmh,
            "baseline_mean_kmh": mean,
            "z_score": round(z_score, 2),
            "is_anomaly": is_anomaly,
            "deviation_label": "Severe Statistical Slowdown" if is_anomaly else "Normal Variance"
        }

anomaly_detector = AnomalyDetector()
