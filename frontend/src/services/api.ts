const API_BASE = '/api/v1';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  return res.json();
}

export const api = {
  // GIS
  getCorridorsGeoJson: () => fetchJson<any>('/gis/corridors'),
  getEnergyZonesGeoJson: () => fetchJson<any>('/gis/energy-zones'),

  // Traffic
  getCurrentCorridors: () => fetchJson<{ timestamp: string; city_congestion_index: number; average_speed_kmh: number; corridors: any[] }>('/traffic/corridors/current'),
  getAllSegments: () => fetchJson<{ timestamp: string; segments: any[] }>('/traffic/segments/current'),
  getBottlenecks: (limit = 5) => fetchJson<{ timestamp: string; bottlenecks: any[] }>(`/traffic/bottlenecks?limit=${limit}`),
  getPrediction: (segmentId: string, horizon = 30) => fetchJson<any>(`/traffic/predictions?segment_id=${segmentId}&horizon=${horizon}`),
  getCauseAnalysis: (segmentId: string, horizon = 30) => fetchJson<any>(`/traffic/cause/${segmentId}?horizon=${horizon}`),
  getImpact: (segmentId: string) => fetchJson<any>(`/traffic/impact/${segmentId}`),

  // Energy
  getCurrentEnergy: () => fetchJson<any>('/energy/current'),
  getEnergyForecast: (zoneId?: string) => fetchJson<any>(`/energy/forecast${zoneId ? `?zone_id=${zoneId}` : ''}`),

  // Environment
  getCurrentEnvironment: () => fetchJson<any>('/environment/current'),

  // Alerts
  getActiveAlerts: () => fetchJson<{ timestamp: string; count: number; alerts: any[] }>('/alerts/active'),
  acknowledgeAlert: (alertId: string) => fetchJson<any>(`/alerts/${alertId}/acknowledge`, { method: 'POST' }),

  // Scenarios
  runTrafficScenario: (body: any) => fetchJson<any>('/scenarios/traffic/run', { method: 'POST', body: JSON.stringify(body) }),
  runEnergyScenario: (body: any) => fetchJson<any>('/scenarios/energy/run', { method: 'POST', body: JSON.stringify(body) }),

  // Simulation & Demo
  triggerTick: () => fetchJson<any>('/simulation/tick', { method: 'POST' }),
  applyDemoPreset: (presetId: string) => fetchJson<any>('/simulation/demo-preset', { method: 'POST', body: JSON.stringify({ preset_id: presetId }) }),
  resetSimulation: () => fetchJson<any>('/simulation/reset', { method: 'POST' }),

  // AI Assistant
  chatAssistant: (message: string, history: any[] = []) => fetchJson<any>('/assistant/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),

  // Reports
  getDailyReport: () => fetchJson<any>('/reports/daily'),

  // Auth & Personas
  getDemoPersonas: () => fetchJson<{ personas: any[] }>('/auth/demo-personas'),
  login: (credentials: { username: string; password: string }) => fetchJson<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
};
