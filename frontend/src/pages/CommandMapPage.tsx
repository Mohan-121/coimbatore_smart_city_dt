import React, { useState, useEffect } from 'react';
import { DigitalTwinMap } from '@/components/map/DigitalTwinMap';
import { Card } from '@/components/ui/Card';
import { KpiTile } from '@/components/ui/KpiTile';
import { RouteShield } from '@/components/ui/RouteShield';
import { HorizonSelector } from '@/components/ui/HorizonSelector';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { RoadSegmentTelemetry } from '@/types/telemetry';
import { GaugeIcon, BoltIcon, LeafIcon, TrafficSignalIcon, AlertTriangleIcon, TrendingUpIcon, RouteIcon } from '@/components/icons';

interface CommandMapPageProps {
  segments: Record<string, RoadSegmentTelemetry>;
  cityCongestion: number;
  avgSpeed: number;
  totalEnergyMw: number;
  aqi: number;
  bottlenecks: any[];
  selectedSegmentId: string;
  onSelectSegment: (segmentId: string) => void;
  onNavigateTab: (tab: any) => void;
  activeIncident?: any;
}

export const CommandMapPage: React.FC<CommandMapPageProps> = ({
  segments,
  cityCongestion,
  avgSpeed,
  totalEnergyMw,
  aqi,
  bottlenecks,
  selectedSegmentId,
  onSelectSegment,
  onNavigateTab,
  activeIncident,
}) => {
  const [forecastHorizon, setForecastHorizon] = useState<number>(0);

  const selectedSegment = segments[selectedSegmentId] || Object.values(segments)[0];

  return (
    <div className="p-4 md:p-5 flex flex-col h-full space-y-4 overflow-y-auto lg:overflow-hidden max-w-[1700px] mx-auto">
      {/* 2-Column Command Map Workspace: Map (65% / lg:col-span-8), Right Rail (35% / lg:col-span-4) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Column: 65% Width Map + Under-Map Horizon Selector */}
        <div className="lg:col-span-8 flex flex-col h-full space-y-3 min-h-[460px]">
          {/* Map Container */}
          <div className="flex-1 relative min-h-[380px]">
            <DigitalTwinMap
              segments={segments}
              onSelectSegment={onSelectSegment}
              selectedSegmentId={selectedSegmentId}
              activeIncident={activeIncident}
              forecastHorizon={forecastHorizon}
              onNavigateTab={onNavigateTab}
            />
          </div>

          {/* Under-Map Timetable Forecast Strip */}
          <div className="shrink-0">
            <HorizonSelector
              value={forecastHorizon}
              onChange={(h) => setForecastHorizon(h === forecastHorizon ? 0 : h)}
            />
          </div>
        </div>

        {/* Right Rail: 35% Width Light Rail with City KPIs and Top 5 Bottlenecks */}
        <div className="lg:col-span-4 flex flex-col h-full space-y-4 overflow-y-auto pr-0.5">
          {/* Top 4 City KPI Tiles */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <KpiTile
              title="Citywide Speed"
              value={avgSpeed.toFixed(1)}
              unit="km/h"
              provenance="SIMULATED"
              icon={GaugeIcon}
              accent="ghats"
              delta={{ value: '-15.8', isPositive: false, label: 'vs 50 cap' }}
            />

            <KpiTile
              title="Congestion Index"
              value={Math.round(cityCongestion)}
              unit="/100"
              provenance="SIMULATED"
              icon={TrafficSignalIcon}
              accent="turmeric"
              delta={{ value: '+6.2%', isPositive: false, label: 'rush trend' }}
            />

            <KpiTile
              title="TANGEDCO Load"
              value={Math.round(totalEnergyMw)}
              unit="MW"
              provenance="SIMULATED"
              icon={BoltIcon}
              accent="indigo"
              subtext="1,480 MW total cap"
            />

            <KpiTile
              title="Air Quality Index"
              value={aqi}
              unit="AQI"
              provenance="LIVE API"
              icon={LeafIcon}
              accent={aqi <= 50 ? 'ghats' : aqi <= 100 ? 'turmeric' : 'crimson'}
              subtext="Open-Meteo Live feed"
            />
          </div>

          {/* Top 5 Bottlenecks Ranked List Card */}
          <Card tabLabel="CONGESTION / TOP BOTTLENECKS" className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-line mb-3">
                <div>
                  <h3 className="font-heading font-bold text-sm text-ink-hi">
                    Top Critical Bottlenecks
                  </h3>
                  <p className="text-[11px] text-ink-mid mt-0.5">
                    Live rank order by Greenshields congestion equilibrium
                  </p>
                </div>
                <ProvenanceBadge origin="SIMULATED" size="sm" />
              </div>

              <div className="space-y-2">
                {bottlenecks.slice(0, 5).map((b, idx) => {
                  const isSelected = selectedSegmentId === b.segment_id;
                  const score = Math.round(b.congestion_score);
                  const isSevere = score >= 85;
                  const isHigh = score >= 60;

                  return (
                    <div
                      key={b.segment_id || idx}
                      onClick={() => onSelectSegment(b.segment_id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                        isSelected
                          ? 'bg-indigo-soft/60 border-indigo ring-1 ring-indigo'
                          : 'bg-surface border-line hover:border-ink-lo hover:bg-surface-sunken'
                      }`}
                    >
                      {/* Rank & Route Shield */}
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                            idx === 0
                              ? 'bg-crimson text-white'
                              : idx === 1
                              ? 'bg-terracotta text-white'
                              : 'bg-surface-sunken text-ink-mid border border-line'
                          }`}
                        >
                          #{idx + 1}
                        </span>

                        <div className="overflow-hidden">
                          <RouteShield corridor={b.corridor_name} size="sm" />
                          <span className="font-mono text-[10px] text-ink-lo block truncate mt-0.5">
                            Speed: {b.average_speed_kmh} km/h • {b.segment_id}
                          </span>
                        </div>
                      </div>

                      {/* Congestion Bar & Score */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-14 h-2 bg-surface-sunken rounded-full overflow-hidden border border-line">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${score}%`,
                              backgroundColor: isSevere ? '#DC2626' : isHigh ? '#F97316' : '#F59E0B',
                            }}
                          />
                        </div>
                        <span
                          className={`font-mono text-xs font-bold ${
                            isSevere ? 'text-crimson' : isHigh ? 'text-orange-500' : 'text-amber-500'
                          }`}
                        >
                          {score}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Segment Diagnostic Summary */}
            {selectedSegment && (
              <div className="mt-4 pt-3 border-t border-line space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-ink-mid">Active Inspection:</span>
                  <span className="font-semibold text-ink-hi truncate max-w-[180px]">
                    {selectedSegment.corridor_name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigateTab('CAUSE')}
                    type="button"
                    className="py-1.5 px-2 rounded-lg bg-surface border border-line hover:bg-surface-sunken text-indigo font-semibold text-[11px] transition-colors text-center"
                  >
                    Why? (TreeSHAP) &rarr;
                  </button>

                  <button
                    onClick={() => onNavigateTab('IMPACT')}
                    type="button"
                    className="py-1.5 px-2 rounded-lg bg-surface border border-line hover:bg-surface-sunken text-indigo font-semibold text-[11px] transition-colors text-center"
                  >
                    Spillover & Emissions &rarr;
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
