from typing import Dict, Any, List
from backend.app.services.emission_service import calculate_traffic_emissions

# Coimbatore Road Topology Adjacency & Alternate Corridor Mapping
DOWNSTREAM_CORRIDOR_MAP = {
    "SEG_AVINASHI_01": {
        "upstream": ["Gandhipuram Flyover Junction"],
        "downstream": ["SEG_AVINASHI_02"],
        "alternate_corridors": ["Trichy Road (via Sungam Bypass)", "Sathy Road (via 100ft Road)"],
        "diverted_pct": 28.0
    },
    "SEG_AVINASHI_02": {
        "upstream": ["SEG_AVINASHI_01 (Peelamedu)"],
        "downstream": ["SEG_AVINASHI_03 (Airport / Sitra)"],
        "alternate_corridors": ["Trichy Road (via Singanallur)", "Kalapatti Road to Sathy Road"],
        "diverted_pct": 34.0
    },
    "SEG_AVINASHI_03": {
        "upstream": ["SEG_AVINASHI_02 (TIDEL Park)"],
        "downstream": ["Chinniampalayam / NH 544"],
        "alternate_corridors": ["Neelambur Bypass", "Trichy Road (Ondipudur)"],
        "diverted_pct": 25.0
    },
    "SEG_TRICHY_01": {
        "upstream": ["Coimbatore Railway Junction"],
        "downstream": ["SEG_TRICHY_02 (Ramanathapuram)"],
        "alternate_corridors": ["Avinashi Road (via Lakshmi Mills)", "Palakkad Road"],
        "diverted_pct": 22.0
    },
    "SEG_TRICHY_02": {
        "upstream": ["SEG_TRICHY_01 (Ramanathapuram)"],
        "downstream": ["SEG_TRICHY_03 (Singanallur)"],
        "alternate_corridors": ["Avinashi Road (via Hope College Link)", "Ukkadam Bypass"],
        "diverted_pct": 30.0
    },
    "SEG_SATHY_02": {
        "upstream": ["SEG_SATHY_01 (Ganapathy)"],
        "downstream": ["Saravanampatti CHIL SEZ"],
        "alternate_corridors": ["Mettupalayam Road (via Thudiyalur Link)", "Avinashi Road (via TIDEL)"],
        "diverted_pct": 26.0
    }
}

def analyze_downstream_impact(
    segment_id: str,
    corridor_name: str,
    congestion_score: float,
    current_speed_kmh: float,
    speed_limit_kmh: float,
    length_meters: float,
    vehicle_count: int
) -> Dict[str, Any]:
    """
    Evaluates network propagation and environmental cost when congestion occurs on a segment.
    """
    topology = DOWNSTREAM_CORRIDOR_MAP.get(segment_id, {
        "upstream": ["Adjacent Upstream Junction"],
        "downstream": ["Next Corridor Segment"],
        "alternate_corridors": ["Parallel Ring Road Corridors"],
        "diverted_pct": 20.0
    })

    # Emission calculations
    emissions = calculate_traffic_emissions(
        vehicle_count=vehicle_count,
        current_speed_kmh=current_speed_kmh,
        free_flow_speed_kmh=speed_limit_kmh,
        length_meters=length_meters
    )

    # Queue length growth estimate
    queue_meters = 0.0
    if congestion_score > 60.0:
        queue_meters = round(min(length_meters * 0.9, (congestion_score - 50.0) * 12.0), 1)

    # Travel time delay factor
    delay_factor = round(speed_limit_kmh / max(5.0, current_speed_kmh), 2)

    # Impact severity rating
    if congestion_score >= 85.0:
        severity = "CRITICAL"
        explanation = f"Gridlock spillover active. Queues propagating into {', '.join(topology['upstream'])}. Alternative routes absorbing ~{topology['diverted_pct']}% diverted volume."
    elif congestion_score >= 60.0:
        severity = "HIGH"
        explanation = f"Significant bottleneck detected. Upstream queue building up to {queue_meters}m. Diverted pressure mounting on {', '.join(topology['alternate_corridors'])}."
    elif congestion_score >= 35.0:
        severity = "MEDIUM"
        explanation = f"Moderate delay with localized slowing. Minor queue buildup ({queue_meters}m); no major corridor diversion yet."
    else:
        severity = "LOW"
        explanation = "Traffic flowing at or near nominal capacity. Downstream spillover risk is negligible."

    return {
        "segment_id": segment_id,
        "corridor_name": corridor_name,
        "impact_severity": severity,
        "delay_factor": delay_factor,
        "estimated_queue_spillover_meters": queue_meters,
        "upstream_affected_zones": topology["upstream"],
        "alternate_routes_affected": topology["alternate_corridors"],
        "diverted_traffic_pct": topology["diverted_pct"],
        "environmental_impact": {
            "excess_fuel_liters": emissions["excess_fuel_liters"],
            "excess_co2_kg": emissions["excess_co2_kg"],
            "fuel_penalty_pct": emissions["fuel_penalty_pct"]
        },
        "impact_narrative": explanation
    }
