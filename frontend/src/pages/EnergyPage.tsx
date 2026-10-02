import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { KpiTile } from '@/components/ui/KpiTile';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { BoltIcon, GaugeIcon, AlertTriangleIcon, EvPlugIcon, ClockIcon } from '@/components/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';

export const EnergyPage: React.FC = () => {
  const [currentEnergy, setCurrentEnergy] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const [cRes, fRes] = await Promise.all([
          api.getCurrentEnergy(),
          api.getEnergyForecast(),
        ]);
        setCurrentEnergy(cRes);
        setForecast(fRes);
      } catch (err) {
        console.error('Error loading energy data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const zones = currentEnergy?.zones || [
    { zone_id: 'ZONE_METRO', name: 'Coimbatore Metro Central', active_power_mw: 242.5, capacity_utilization_pct: 80.8 },
    { zone_id: 'ZONE_NORTH_IT', name: 'North IT (Saravanampatti)', active_power_mw: 215.0, capacity_utilization_pct: 71.6 },
    { zone_id: 'ZONE_EAST_IND', name: 'East Industrial (Peelamedu)', active_power_mw: 268.4, capacity_utilization_pct: 89.4 },
    { zone_id: 'ZONE_SOUTH_RES', name: 'South Residential (Sundarapuram)', active_power_mw: 198.2, capacity_utilization_pct: 66.0 },
    { zone_id: 'ZONE_KURICHI_SIDCO', name: 'Kurichi SIDCO Industrial Estate', active_power_mw: 195.9, capacity_utilization_pct: 65.3 },
  ];

  const totalMw = currentEnergy?.total_active_power_mw || 1120.0;
  const gridCapacityMw = currentEnergy?.total_grid_capacity_mw || 1480.0;
  const utilizationPct = currentEnergy?.grid_utilization_pct || 75.6;

  // 24h Forecast Series Data with 95% confidence bands
  const forecastSeries = forecast?.forecast_series || Array.from({ length: 24 }, (_, i) => {
    const hour = (i + 14) % 24;
    const isPeak = hour >= 19 && hour <= 21;
    const baseMw = 980 + Math.sin((hour - 6) / 3.8) * 220 + (isPeak ? 140 : 0);
    const mw = Math.round(baseMw);
    return {
      hourLabel: `${hour < 10 ? '0' : ''}${hour}:00`,
      hourNum: hour,
      predicted_mw: mw,
      lower_bound_mw: Math.round(mw * 0.965),
      upper_bound_mw: Math.round(mw * 1.035),
    };
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto h-full">
      {/* Section Header */}
      <SectionLabel
        category="RESOURCES"
        title="TANGEDCO Electrical Grid & Power Demand Digital Twin"
        subtitle="Real-time substation load telemetry, 24-hour predictive XGBoost load curves with 95% confidence intervals, and evening cooling peak warnings."
        badge={<ProvenanceBadge origin="SIMULATED" size="md" />}
      />

      {/* Top Grid KPI Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Total City Power Draw"
          value={Math.round(totalMw)}
          unit="MW"
          provenance="SIMULATED"
          icon={BoltIcon}
          accent="indigo"
          subtext={`Grid Capacity: ${gridCapacityMw} MW`}
        />

        <KpiTile
          title="Grid Reserve Headroom"
          value={Math.round(gridCapacityMw - totalMw)}
          unit="MW"
          provenance="SIMULATED"
          icon={EvPlugIcon}
          accent="ghats"
          subtext="Available spinning reserve"
        />

        <KpiTile
          title="Grid Frequency"
          value={currentEnergy?.grid_frequency_hz || '50.02'}
          unit="Hz"
          provenance="SIMULATED"
          icon={GaugeIcon}
          accent="turmeric"
          subtext="Nominal Indian Band (50.0 ± 0.05)"
        />

        <KpiTile
          title="Capacity Utilization"
          value={utilizationPct}
          unit="%"
          provenance="SIMULATED"
          icon={AlertTriangleIcon}
          accent="terracotta"
          subtext="5 Distribution Feeders"
        />
      </div>

      {/* 5-Zone Selector Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-ink-lo uppercase tracking-wider font-bold">
            TANGEDCO Substation Distribution Zones
          </span>
          <button
            onClick={() => setSelectedZoneId('ALL')}
            type="button"
            className={`text-xs font-mono px-2 py-0.5 rounded ${
              selectedZoneId === 'ALL' ? 'bg-indigo text-white font-bold' : 'text-ink-mid hover:text-ink-hi'
            }`}
          >
            All Zones View
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {zones.map((z: any) => {
            const isSelected = selectedZoneId === z.zone_id;
            const util = Math.round(z.capacity_utilization_pct || 70);
            return (
              <div
                key={z.zone_id}
                onClick={() => setSelectedZoneId(z.zone_id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-atlas-sm flex flex-col justify-between ${
                  isSelected
                    ? 'bg-surface border-indigo ring-2 ring-indigo/20 shadow-md'
                    : 'bg-surface border-line hover:border-ink-lo'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-mono text-[9px] text-ink-lo truncate">{z.zone_id}</span>
                    <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold ${
                      util >= 85 ? 'bg-crimson-soft text-crimson' : util >= 75 ? 'bg-turmeric-soft text-turmeric-dark' : 'bg-ghats-soft text-ghats'
                    }`}>
                      {util}%
                    </span>
                  </div>
                  <h4 className="font-heading font-semibold text-xs text-ink-hi line-clamp-1">{z.name}</h4>
                </div>

                <div className="mt-3 pt-2 border-t border-line/60 flex items-baseline justify-between">
                  <span className="text-[10px] text-ink-lo uppercase font-mono">Load</span>
                  <div className="flex items-baseline gap-1 font-mono font-bold text-ink-hi">
                    <span>{Math.round(z.active_power_mw || 200)}</span>
                    <span className="text-[10px] text-ink-lo">MW</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Heat-Strip Bar */}
      <Card tabLabel="HEAT-STRIP / RELATIVE LOAD">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-line text-[11px]">
          <span className="font-medium text-ink-hi">Zone Load Distribution Heat-Strip</span>
          <span className="font-mono text-ink-mid">1,120 MW / 1,480 MW Total Draw</span>
        </div>
        <div className="h-4 w-full bg-surface-sunken rounded-lg overflow-hidden flex border border-line p-0.5">
          {zones.map((z: any, idx: number) => {
            const widthPct = Math.round(((z.active_power_mw || 200) / totalMw) * 100);
            const colors = ['#1F3A8A', '#0E7C66', '#C2512D', '#2B7FD1', '#E8A317'];
            return (
              <div
                key={z.zone_id}
                style={{ width: `${widthPct}%`, backgroundColor: colors[idx % colors.length] }}
                className="h-full first:rounded-l-md last:rounded-r-md transition-all hover:opacity-90"
                title={`${z.name}: ${z.active_power_mw} MW (${widthPct}%)`}
              />
            );
          })}
        </div>
      </Card>

      {/* 24-Hour Predictive Load Curve with Shaded 95% Confidence Band & Evening Peak Alert */}
      <Card tabLabel="FORECAST / 24-HOUR LOAD CURVE" contour>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line mb-3">
          <div>
            <h3 className="font-heading font-bold text-ink-hi text-sm">
              24-Hour Electricity Demand Load Curve (MW)
            </h3>
            <p className="text-[11px] text-ink-mid mt-0.5">
              Multi-Output XGBoost Regression with shaded 95% confidence intervals and Evening Cooling Peak window
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-turmeric-soft border border-turmeric/40 text-turmeric-dark font-mono font-semibold">
            <AlertTriangleIcon className="w-3.5 h-3.5 text-turmeric" />
            <span>Evening Cooling Peak: 19:30 – 21:00 IST (~1,320 MW)</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastSeries} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" vertical={false} />
              <XAxis dataKey="hourLabel" stroke="#8A94A6" fontSize={11} tickLine={false} />
              <YAxis stroke="#8A94A6" fontSize={11} domain={[700, 1500]} tickLine={false} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E1DDD2',
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(20,33,61,0.08)',
                  fontSize: '11px',
                  fontFamily: 'IBM Plex Mono',
                }}
              />

              {/* Shaded Evening Cooling Peak Callout Window (Turmeric) */}
              <ReferenceArea
                x1="19:00"
                x2="21:00"
                fill="#E8A317"
                fillOpacity={0.12}
                stroke="#E8A317"
                strokeDasharray="3 3"
                label={{ value: 'PEAK DEMAND WINDOW', fill: '#B87E0E', fontSize: 10, position: 'top' }}
              />

              {/* Shaded 95% Confidence Band in Pale Indigo */}
              <Area
                type="monotone"
                dataKey="upper_bound_mw"
                stroke="none"
                fill="#EEF2FF"
                fillOpacity={0.8}
                name="95% Upper Bound"
              />
              <Area
                type="monotone"
                dataKey="lower_bound_mw"
                stroke="none"
                fill="#FFFFFF"
                fillOpacity={1.0}
                name="95% Lower Bound"
              />

              {/* Predicted Demand Line */}
              <Area
                type="monotone"
                dataKey="predicted_mw"
                stroke="#1F3A8A"
                strokeWidth={2.5}
                fill="none"
                name="Predicted Demand (MW)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
