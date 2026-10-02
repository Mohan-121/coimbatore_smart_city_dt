from typing import Dict, Any

def calculate_traffic_emissions(
    vehicle_count: int,
    current_speed_kmh: float,
    free_flow_speed_kmh: float,
    length_meters: float
) -> Dict[str, Any]:
    """
    Computes fuel consumption and carbon emissions using the EPA Vehicle Specific Power (VSP)
    idling and congestion penalty formulation.
    """
    # Free flow vs current travel time in hours
    free_flow_time_hr = (length_meters / 1000.0) / max(10.0, free_flow_speed_kmh)
    current_time_hr = (length_meters / 1000.0) / max(5.0, current_speed_kmh)
    delay_hours = max(0.0, current_time_hr - free_flow_time_hr)

    # Normal cruise consumption: ~0.08 L/km per vehicle
    cruise_fuel_liters = (length_meters / 1000.0) * 0.08 * vehicle_count

    # Stop-and-go idling penalty: ~1.2 Liters/hour per vehicle in delay
    idling_excess_fuel_liters = delay_hours * 1.2 * vehicle_count

    total_fuel_liters = round(cruise_fuel_liters + idling_excess_fuel_liters, 1)
    excess_fuel_liters = round(idling_excess_fuel_liters, 1)

    # Carbon emissions: 2.31 kg CO2 per liter of gasoline/diesel average
    co2_cruise_kg = cruise_fuel_liters * 2.31
    co2_excess_kg = idling_excess_fuel_liters * 2.31
    total_co2_kg = round(co2_cruise_kg + co2_excess_kg, 1)
    excess_co2_kg = round(co2_excess_kg, 1)

    return {
        "delay_seconds": round(delay_hours * 3600.0, 1),
        "total_fuel_liters": total_fuel_liters,
        "excess_fuel_liters": excess_fuel_liters,
        "total_co2_kg": total_co2_kg,
        "excess_co2_kg": excess_co2_kg,
        "fuel_penalty_pct": round((excess_fuel_liters / max(1.0, cruise_fuel_liters)) * 100.0, 1)
    }
