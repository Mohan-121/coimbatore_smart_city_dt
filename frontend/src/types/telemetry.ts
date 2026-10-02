export type DataOrigin = 'REAL_TIME' | 'HISTORICAL' | 'SIMULATED';
export type CongestionLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export interface RoadSegmentTelemetry {
  segment_id: string;
  corridor_name: string;
  average_speed_kmh: number;
  vehicle_count: number;
  congestion_score: number;
  congestion_level: CongestionLevel;
  queue_length_meters: number;
  travel_time_seconds: number;
  data_origin: DataOrigin;
}

export interface CorridorSummary {
  corridor_name: string;
  avg_speed_kmh: number;
  congestion_score: number;
  worst_level: CongestionLevel;
  segments: RoadSegmentTelemetry[];
  data_origin: DataOrigin;
}

export interface EnergyZoneTelemetry {
  zone_id: string;
  active_power_mw: number;
  reactive_power_mvar: number;
  voltage_kv: number;
  grid_frequency_hz: number;
  ambient_temp_c: number;
  solar_generation_mw: number;
  capacity_utilization_pct: number;
  data_origin: DataOrigin;
}

export interface EnvironmentalTelemetry {
  station_name: string;
  latitude: number;
  longitude: number;
  aqi: number;
  aqi_category: string;
  aqi_color: string;
  pollutants: {
    pm25_ugm3: number;
    pm10_ugm3: number;
    no2_ugm3: number;
    co_mgm3: number;
  };
  meteorological: {
    temperature_c: number;
    humidity_pct: number;
    precipitation_mm: number;
    wind_speed_kmh: number;
  };
  traffic_emission_contribution_pct: number;
  data_origin: DataOrigin;
}

export interface UrbanAlert {
  alert_id: string;
  created_at: string;
  domain: 'TRAFFIC' | 'ENERGY' | 'ENVIRONMENT' | 'ANOMALY';
  severity: 'INFO' | 'WARNING' | 'SEVERE' | 'CRITICAL';
  title: string;
  description: string;
  location_label: string;
  cause_summary: string;
  predicted_impact: string;
  recommended_action: string;
  status: 'UNRESOLVED' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface TrafficPrediction {
  segment_id: string;
  corridor_name: string;
  horizon_minutes: number;
  generated_at: string;
  target_time: string;
  predicted_congestion_score: number;
  predicted_level: CongestionLevel;
  predicted_speed_kmh: number;
  confidence_score: number;
  expected_travel_time_sec: number;
  data_origin: DataOrigin;
}

export interface CauseAnalysis {
  segment_id: string;
  corridor_name: string;
  predicted_congestion: number;
  primary_cause: string;
  confidence: number;
  contributions: {
    'Peak-Hour Pattern': number;
    'Upstream Junction Queue': number;
    'Incident / Lane Restriction': number;
    'Weather & Visibility': number;
  };
  explanation: string;
  disclaimer: string;
}

export interface DownstreamImpact {
  segment_id: string;
  corridor_name: string;
  impact_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  delay_factor: number;
  estimated_queue_spillover_meters: number;
  upstream_affected_zones: string[];
  alternate_routes_affected: string[];
  diverted_traffic_pct: number;
  environmental_impact: {
    excess_fuel_liters: number;
    excess_co2_kg: number;
    fuel_penalty_pct: number;
  };
  impact_narrative: string;
}

export interface TwinStateSnapshot {
  timestamp: string;
  city_congestion_index: number;
  avg_speed_kmh: number;
  total_energy_mw: number;
  aqi: number;
  corridors: Record<string, CorridorSummary>;
  segments: Record<string, RoadSegmentTelemetry>;
  zones: Record<string, EnergyZoneTelemetry>;
  environment: EnvironmentalTelemetry;
  active_incidents: any[];
}
