import pytest
from datetime import datetime
from backend.app.simulation.traffic_sim import simulate_segment_traffic, get_diurnal_traffic_factor
from backend.app.simulation.energy_sim import get_diurnal_energy_demand
from backend.app.simulation.environment_sim import simulate_environmental_metrics

def test_diurnal_traffic_curve():
    # Morning rush hour (09:15 AM)
    dt_morning = datetime(2026, 10, 1, 9, 15)
    morning_factor = get_diurnal_traffic_factor(dt_morning)

    # Night lull (03:00 AM)
    dt_night = datetime(2026, 10, 1, 3, 0)
    night_factor = get_diurnal_traffic_factor(dt_night)

    assert morning_factor > night_factor, "Morning rush hour factor must exceed night lull"
    assert 0.0 <= morning_factor <= 1.0, "Traffic factor must be normalized between 0 and 1"

def test_greenshields_traffic_dynamics():
    dt = datetime(2026, 10, 1, 18, 30) # Evening peak
    res = simulate_segment_traffic(
        segment_id="SEG_AVINASHI_02",
        corridor_name="Avinashi Road",
        length_meters=3400.0,
        speed_limit_kmh=50.0,
        capacity_vph=3600,
        lane_count=6,
        dt=dt,
        incident_capacity_reduction=0.0
    )

    assert 0.0 <= res["congestion_score"] <= 100.0
    assert 5.0 <= res["average_speed_kmh"] <= 50.0
    assert res["congestion_level"] in ["LOW", "MODERATE", "HIGH", "SEVERE"]
    assert res["data_origin"] == "SIMULATED"

def test_incident_capacity_reduction_impact():
    dt = datetime(2026, 10, 1, 14, 0)
    normal = simulate_segment_traffic(
        segment_id="SEG_AVINASHI_02",
        corridor_name="Avinashi Road",
        length_meters=3400.0,
        speed_limit_kmh=50.0,
        capacity_vph=3600,
        lane_count=6,
        dt=dt,
        incident_capacity_reduction=0.0
    )

    accident = simulate_segment_traffic(
        segment_id="SEG_AVINASHI_02",
        corridor_name="Avinashi Road",
        length_meters=3400.0,
        speed_limit_kmh=50.0,
        capacity_vph=3600,
        lane_count=6,
        dt=dt,
        incident_capacity_reduction=70.0 # 70% capacity drop
    )

    assert accident["congestion_score"] > normal["congestion_score"]
    assert accident["average_speed_kmh"] < normal["average_speed_kmh"]

def test_energy_demand_temperature_sensitivity():
    dt = datetime(2026, 10, 1, 14, 0)
    cool_res = get_diurnal_energy_demand(dt, "ZONE_METRO", ambient_temp_c=25.0)
    hot_res = get_diurnal_energy_demand(dt, "ZONE_METRO", ambient_temp_c=35.0)

    assert hot_res["active_power_mw"] > cool_res["active_power_mw"], "Higher ambient temperature must increase cooling load"
