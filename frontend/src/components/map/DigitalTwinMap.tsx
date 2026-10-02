import React, { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as MapLibreMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { api } from '@/services/api';
import { RoadSegmentTelemetry } from '@/types/telemetry';
import { RouteShield } from '@/components/ui/RouteShield';
import { CongestionLegend } from '@/components/ui/CongestionLegend';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { CompassIcon, LayersIcon, CloseIcon, RouteIcon, TrafficSignalIcon } from '@/components/icons';

interface DigitalTwinMapProps {
  segments: Record<string, RoadSegmentTelemetry>;
  onSelectSegment?: (segmentId: string) => void;
  selectedSegmentId?: string | null;
  activeIncident?: any;
  forecastHorizon?: number;
  onNavigateTab?: (tab: string) => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  segments,
  onSelectSegment,
  selectedSegmentId: propSelectedId,
  activeIncident,
  forecastHorizon = 0,
  onNavigateTab,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const incidentMarkerRef = useRef<Marker | null>(null);

  const [corridorsGeoJson, setCorridorsGeoJson] = useState<any>(null);
  const [selectedSegId, setSelectedSegId] = useState<string | null>(propSelectedId || 'SEG_AVINASHI_02');
  const [viewMode, setViewMode] = useState<'2D' | '2.5D' | '3D'>('2.5D');
  const [showTrafficLayer, setShowTrafficLayer] = useState<boolean>(true);

  // Sync prop changes
  useEffect(() => {
    if (propSelectedId) setSelectedSegId(propSelectedId);
  }, [propSelectedId]);

  // Initialize MapLibre with light CARTO Positron basemap
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-positron': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors, CartoDB Positron',
          },
        },
        layers: [
          {
            id: 'carto-positron-layer',
            type: 'raster',
            source: 'carto-positron',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [76.9950, 11.0250], // Center over Avinashi Road & central junctions
      zoom: 12.4,
      pitch: 45, // 2.5D perspective
      bearing: -15,
      antialias: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    map.on('load', async () => {
      mapRef.current = map;

      try {
        const geojson = await api.getCorridorsGeoJson();
        setCorridorsGeoJson(geojson);

        // Add Corridors GeoJSON Source
        map.addSource('coimbatore-corridors', {
          type: 'geojson',
          data: geojson,
        });

        // Add Base Glow Corridor Line (Subtle blur behind)
        map.addLayer({
          id: 'corridor-glow',
          type: 'line',
          source: 'coimbatore-corridors',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#38BDF8',
            'line-width': 10,
            'line-opacity': 0.35,
            'line-blur': 3,
          },
        });

        // Add Main Corridor Line with Congestion Color
        map.addLayer({
          id: 'corridor-lines',
          type: 'line',
          source: 'coimbatore-corridors',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#10B981', // Emerald default
            'line-width': 5.5,
            'line-opacity': 0.95,
          },
        });

        // Handle Segment Click
        map.on('click', 'corridor-lines', (e) => {
          if (!e.features || !e.features[0]) return;
          const props = e.features[0].properties;
          const segId = props?.segment_id;
          if (segId) {
            setSelectedSegId(segId);
            onSelectSegment?.(segId);
          }
        });

        // Pointer Cursor
        map.on('mouseenter', 'corridor-lines', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'corridor-lines', () => {
          map.getCanvas().style.cursor = '';
        });
      } catch (err) {
        console.error('Failed to load corridor GeoJSON:', err);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Recolor map lines based on live segments and forecast horizon
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('corridor-lines')) return;

    if (!segments || Object.keys(segments).length === 0) return;

    const colorCases: any[] = ['match', ['get', 'segment_id']];

    Object.entries(segments).forEach(([segId, seg]) => {
      // If a horizon is selected, simulate predictive inflation factor
      let score = seg.congestion_score;
      if (forecastHorizon === 15) score = Math.min(100, score * 1.08);
      else if (forecastHorizon === 30) score = Math.min(100, score * 1.15);
      else if (forecastHorizon === 60) score = Math.min(100, score * 1.22);
      else if (forecastHorizon === 120) score = Math.min(100, score * 1.28);

      let color = '#10B981'; // Emerald < 30
      if (score >= 85) color = '#DC2626'; // Crimson Gridlock
      else if (score >= 60) color = '#F97316'; // Orange High
      else if (score >= 30) color = '#F59E0B'; // Amber Moderate

      colorCases.push(segId, color);
    });

    colorCases.push('#1F3A8A'); // Fallback indigo

    try {
      map.setPaintProperty('corridor-lines', 'line-color', colorCases);
    } catch (e) {
      console.warn('Could not update map line colors:', e);
    }
  }, [segments, forecastHorizon]);

  // Handle active incident marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up previous marker
    if (incidentMarkerRef.current) {
      incidentMarkerRef.current.remove();
      incidentMarkerRef.current = null;
    }

    if (activeIncident && activeIncident.latitude && activeIncident.longitude) {
      const el = document.createElement('div');
      el.className = 'relative flex items-center justify-center cursor-pointer';
      el.innerHTML = `
        <div class="absolute w-8 h-8 rounded-full bg-crimson opacity-30 animate-ping"></div>
        <div class="relative w-5 h-5 rounded-full bg-crimson border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">
          !
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([activeIncident.longitude, activeIncident.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div class="text-xs font-sans">
              <div class="font-bold text-crimson uppercase tracking-wide text-[10px] mb-1">INCIDENT ACTIVE</div>
              <div class="font-semibold text-ink-hi">${activeIncident.title || 'Road Obstruction'}</div>
              <div class="text-[11px] text-ink-mid mt-0.5">Capacity cut: ${activeIncident.capacity_reduction_pct || 50}%</div>
            </div>
          `)
        )
        .addTo(map);

      incidentMarkerRef.current = marker;
    }
  }, [activeIncident]);

  // Fly to camera controls
  const flyTo = (lng: number, lat: number, pitch = 45, zoom = 13.5) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [lng, lat],
      pitch,
      zoom,
      essential: true,
      duration: 1600,
    });
  };

  const handlePerspectiveChange = (mode: '2D' | '2.5D' | '3D') => {
    setViewMode(mode);
    if (!mapRef.current) return;
    if (mode === '2D') mapRef.current.easeTo({ pitch: 0, bearing: 0, duration: 600 });
    else if (mode === '2.5D') mapRef.current.easeTo({ pitch: 45, bearing: -15, duration: 600 });
    else if (mode === '3D') mapRef.current.easeTo({ pitch: 65, bearing: 20, duration: 600 });
  };

  const selectedSegment = selectedSegId && segments[selectedSegId] ? segments[selectedSegId] : null;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-line bg-surface shadow-atlas select-none">
      {/* Map Canvas */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top Left: Highway Quick Fly Buttons */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[80%]">
        <button
          onClick={() => flyTo(77.0250, 11.0310, 50, 13.5)}
          type="button"
          className="bg-surface/95 backdrop-blur-sm border border-line hover:border-ghats px-2.5 py-1 rounded-lg shadow-atlas-sm transition-all flex items-center gap-1.5"
        >
          <RouteShield corridor="Avinashi Road" size="sm" />
        </button>

        <button
          onClick={() => flyTo(77.0120, 10.9965, 45, 13.5)}
          type="button"
          className="bg-surface/95 backdrop-blur-sm border border-line hover:border-ghats px-2.5 py-1 rounded-lg shadow-atlas-sm transition-all flex items-center gap-1.5"
        >
          <RouteShield corridor="Trichy Road" size="sm" />
        </button>

        <button
          onClick={() => flyTo(76.9880, 11.0550, 45, 13.5)}
          type="button"
          className="bg-surface/95 backdrop-blur-sm border border-line hover:border-ghats px-2.5 py-1 rounded-lg shadow-atlas-sm transition-all flex items-center gap-1.5"
        >
          <RouteShield corridor="Sathy Road" size="sm" />
        </button>

        <button
          onClick={() => flyTo(76.9450, 11.0350, 40, 13.2)}
          type="button"
          className="bg-surface/95 backdrop-blur-sm border border-line hover:border-ghats px-2.5 py-1 rounded-lg shadow-atlas-sm transition-all flex items-center gap-1.5"
        >
          <RouteShield corridor="Mettupalayam Road" size="sm" />
        </button>

        <button
          onClick={() => flyTo(76.9600, 10.9850, 45, 13.2)}
          type="button"
          className="bg-surface/95 backdrop-blur-sm border border-line hover:border-ghats px-2.5 py-1 rounded-lg shadow-atlas-sm transition-all flex items-center gap-1.5"
        >
          <RouteShield corridor="Pollachi Road" size="sm" />
        </button>

        <button
          onClick={() => flyTo(76.9950, 11.0250, 45, 12.4)}
          type="button"
          className="bg-surface/95 backdrop-blur-sm border border-line hover:bg-surface-sunken px-2.5 py-1 rounded-lg shadow-atlas-sm text-xs font-mono text-ink-mid hover:text-ink-hi transition-all"
        >
          Overview
        </button>
      </div>

      {/* Top Right: Perspective & Layer Controls */}
      <div className="absolute top-3 right-12 z-10 flex items-center gap-1 bg-surface/95 backdrop-blur-sm border border-line p-1 rounded-lg shadow-atlas-sm text-xs font-mono">
        {(['2D', '2.5D', '3D'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => handlePerspectiveChange(mode)}
            type="button"
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              viewMode === mode
                ? 'bg-indigo text-white'
                : 'text-ink-mid hover:text-ink-hi hover:bg-surface-sunken'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Active Horizon Forecast Badge on Map */}
      {forecastHorizon > 0 && (
        <div className="absolute top-14 left-3 z-10 flex items-center gap-1.5 bg-indigo text-white px-2.5 py-1 rounded-md shadow-atlas text-xs font-mono font-bold animate-fade-in">
          <span>FORECAST ACTIVE: +{forecastHorizon}m</span>
          <ProvenanceBadge origin="SIMULATED" size="sm" />
        </div>
      )}

      {/* Bottom Left: Atlas Compass, Scale Bar, and Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-2">
        <CongestionLegend orientation="horizontal" showTitle={false} />
        <div className="flex items-center gap-2 text-[10px] font-mono text-ink-mid bg-surface/95 backdrop-blur-sm border border-line px-2.5 py-1 rounded-md shadow-atlas-sm">
          <CompassIcon className="w-3.5 h-3.5 text-indigo" />
          <span>CARTO POSITRON // 1:50,000</span>
          <span className="text-line">|</span>
          <span>1 km</span>
        </div>
      </div>

      {/* Slide-in Segment Inspector White Card (When Clicked) */}
      {selectedSegment && (
        <div className="absolute top-3 right-3 bottom-3 w-80 bg-surface/98 backdrop-blur-md rounded-xl border border-line shadow-atlas-lg p-4 z-20 flex flex-col justify-between animate-fade-in text-xs overflow-y-auto">
          <div>
            <div className="flex items-start justify-between pb-2 border-b border-line">
              <div>
                <span className="text-[9px] font-mono text-indigo uppercase tracking-wider font-bold block">
                  SEGMENT INSPECTOR
                </span>
                <h4 className="font-heading font-bold text-sm text-ink-hi mt-0.5">
                  {selectedSegment.corridor_name}
                </h4>
                <span className="font-mono text-[10px] text-ink-lo">
                  {selectedSegment.segment_id}
                </span>
              </div>
              <button
                onClick={() => setSelectedSegId(null)}
                type="button"
                className="p-1 rounded text-ink-lo hover:text-ink-hi hover:bg-surface-sunken"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="p-2.5 rounded-lg bg-surface-sunken border border-line/60">
                <span className="text-[10px] text-ink-lo uppercase font-mono block">Current Speed</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-lg font-bold text-ink-hi">
                    {selectedSegment.average_speed_kmh}
                  </span>
                  <span className="text-[10px] text-ink-mid">km/h</span>
                </div>
                <span className="text-[9px] text-ink-lo font-mono">Limit: 50 km/h</span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-sunken border border-line/60">
                <span className="text-[10px] text-ink-lo uppercase font-mono block">Congestion</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-lg font-bold text-ink-hi">
                    {Math.round(selectedSegment.congestion_score)}
                  </span>
                  <span className="text-[10px] text-ink-mid">/ 100</span>
                </div>
                <span className={`text-[9px] font-bold uppercase font-mono ${
                  selectedSegment.congestion_level === 'SEVERE' ? 'text-crimson' :
                  selectedSegment.congestion_level === 'HIGH' ? 'text-orange-500' :
                  selectedSegment.congestion_level === 'MODERATE' ? 'text-amber-500' : 'text-ghats'
                }`}>
                  {selectedSegment.congestion_level}
                </span>
              </div>
            </div>

            {/* Secondary Telemetry */}
            <div className="space-y-1.5 p-3 rounded-lg border border-line bg-surface text-[11px]">
              <div className="flex justify-between py-0.5">
                <span className="text-ink-mid">Vehicles Count:</span>
                <span className="font-mono font-bold text-ink-hi">{selectedSegment.vehicle_count} veh</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-ink-mid">Queue Buildup:</span>
                <span className="font-mono font-bold text-terracotta">{selectedSegment.queue_length_meters || 0} m</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-ink-mid">Estimated Travel Time:</span>
                <span className="font-mono font-bold text-ink-hi">{Math.round(selectedSegment.travel_time_seconds || 120)} s</span>
              </div>
              <div className="flex justify-between py-0.5 items-center">
                <span className="text-ink-mid">Data Origin:</span>
                <ProvenanceBadge origin={selectedSegment.data_origin || 'SIMULATED'} size="sm" />
              </div>
            </div>
          </div>

          {/* Quick Deep-Dive Links */}
          <div className="pt-3 border-t border-line space-y-1.5">
            <button
              onClick={() => onNavigateTab?.('CAUSE')}
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-indigo text-white font-semibold text-xs hover:bg-indigo-dark transition-colors flex items-center justify-between"
            >
              <span>Explain Congestion (TreeSHAP)</span>
              <RouteIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab?.('IMPACT')}
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-surface-sunken hover:bg-surface border border-line text-ink-hi font-medium text-xs transition-colors flex items-center justify-between"
            >
              <span>View Downstream Spillover</span>
              <TrafficSignalIcon className="w-3.5 h-3.5 text-indigo" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
