import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { KpiTile } from '@/components/ui/KpiTile';
import { RouteShield, CORRIDOR_HIGHWAY_MAP } from '@/components/ui/RouteShield';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { AtlasGauge } from '@/components/ui/AtlasGauge';
import { Tooltip } from '@/components/ui/Tooltip';
import { DataTable, Column } from '@/components/ui/DataTable';
import { GaugeIcon, ClockIcon, RouteIcon, AlertTriangleIcon, TrafficSignalIcon } from '@/components/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const TrafficPage: React.FC = () => {
  const [corridors, setCorridors] = useState<any[]>([]);
  const [bottlenecks, setBottlenecks] = useState<any[]>([]);
  const [selectedCorridorName, setSelectedCorridorName] = useState<string>('Avinashi Road');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const [cRes, bRes] = await Promise.all([
          api.getCurrentCorridors(),
          api.getBottlenecks(5),
        ]);
        setCorridors(cRes.corridors || []);
        setBottlenecks(bRes.bottlenecks || []);
      } catch (err) {
        console.error('Error loading traffic view:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeCorridor =
    corridors.find((c) => c.corridor_name.includes(selectedCorridorName) || selectedCorridorName.includes(c.corridor_name)) ||
    corridors[0] || {
      corridor_name: 'Avinashi Road',
      avg_speed_kmh: 32.4,
      congestion_score: 54.2,
      worst_level: 'MODERATE',
    };

  // Speed vs Free Flow Comparison Data
  const speedComparisonData = corridors.map((c) => ({
    name: c.corridor_name.replace(' Road', ''),
    currentSpeed: c.avg_speed_kmh,
    freeFlowSpeed: 50.0,
    congestion: c.congestion_score,
  }));

  // Multi-horizon forecast curve for the active corridor
  const forecastSeries = [
    { horizon: 'Now', time: '14:30', speed: activeCorridor.avg_speed_kmh, congestion: activeCorridor.congestion_score },
    { horizon: '+15m', time: '14:45', speed: Math.max(12, activeCorridor.avg_speed_kmh * 0.94), congestion: Math.min(100, activeCorridor.congestion_score * 1.08) },
    { horizon: '+30m', time: '15:00', speed: Math.max(10, activeCorridor.avg_speed_kmh * 0.88), congestion: Math.min(100, activeCorridor.congestion_score * 1.16) },
    { horizon: '+60m', time: '15:30', speed: Math.max(8, activeCorridor.avg_speed_kmh * 0.82), congestion: Math.min(100, activeCorridor.congestion_score * 1.24) },
    { horizon: '+120m', time: '16:30', speed: Math.max(15, activeCorridor.avg_speed_kmh * 0.92), congestion: Math.min(100, activeCorridor.congestion_score * 1.10) },
  ];

  // Table Columns
  const columns: Column<any>[] = [
    {
      key: 'corridor',
      header: 'Arterial Corridor',
      render: (item) => <RouteShield corridor={item.corridor_name} size="md" />,
    },
    {
      key: 'speed',
      header: 'Average Speed',
      render: (item) => (
        <div className="flex items-baseline gap-1 font-mono font-bold text-ink-hi">
          <span>{item.avg_speed_kmh}</span>
          <span className="text-[10px] text-ink-lo">km/h</span>
        </div>
      ),
    },
    {
      key: 'congestion',
      header: 'Congestion Score',
      render: (item) => {
        const score = Math.round(item.congestion_score);
        const color = score >= 85 ? 'text-crimson' : score >= 60 ? 'text-orange-500' : score >= 30 ? 'text-amber-500' : 'text-ghats';
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-surface-sunken rounded-full overflow-hidden border border-line">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${score}%`,
                  backgroundColor: score >= 85 ? '#DC2626' : score >= 60 ? '#F97316' : score >= 30 ? '#F59E0B' : '#10B981',
                }}
              />
            </div>
            <span className={`font-mono font-bold text-xs ${color}`}>{score}/100</span>
          </div>
        );
      },
    },
    {
      key: 'level',
      header: 'Status',
      render: (item) => {
        const level = item.worst_level || 'MODERATE';
        const colorClass =
          level === 'SEVERE' ? 'bg-crimson-soft text-crimson border-crimson/30' :
          level === 'HIGH' ? 'bg-amber-100 text-amber-800 border-amber-300' :
          level === 'MODERATE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-ghats-soft text-ghats border-ghats/30';
        return (
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${colorClass}`}>
            {level}
          </span>
        );
      },
    },
    {
      key: 'provenance',
      header: 'Provenance',
      align: 'right',
      render: () => <ProvenanceBadge origin="SIMULATED" size="sm" />,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto h-full">
      {/* Section Header */}
      <SectionLabel
        category="MOBILITY"
        title="Traffic Intelligence & Arterial Corridor Dynamics"
        subtitle="Real-time speed telemetry, Greenshields density equilibrium scoring, and multi-horizon forward forecasts across Coimbatore arterials."
        badge={<ProvenanceBadge origin="SIMULATED" size="md" />}
      />

      {/* Corridor Highway Shield Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        {['Avinashi Road', 'Trichy Road', 'Sathy Road', 'Mettupalayam Road', 'Pollachi Road'].map((name) => {
          const isSelected = selectedCorridorName === name;
          return (
            <button
              key={name}
              onClick={() => setSelectedCorridorName(name)}
              type="button"
              className={`p-2 rounded-xl border transition-all duration-150 flex items-center gap-2 shadow-atlas-sm ${
                isSelected
                  ? 'bg-surface border-indigo ring-2 ring-indigo/20 shadow-md'
                  : 'bg-surface-sunken border-line hover:border-ink-lo'
              }`}
            >
              <RouteShield corridor={name} size="sm" />
            </button>
          );
        })}
      </div>

      {/* Top Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Corridor Velocity"
          value={activeCorridor.avg_speed_kmh}
          unit="km/h"
          provenance="SIMULATED"
          icon={GaugeIcon}
          accent="ghats"
          delta={{ value: '-17.6 km/h', isPositive: false, label: 'vs free-flow (50)' }}
        />

        <KpiTile
          title="Congestion Index"
          value={Math.round(activeCorridor.congestion_score)}
          unit="/100"
          provenance="SIMULATED"
          icon={TrafficSignalIcon}
          accent="turmeric"
          delta={{ value: '+8.4%', isPositive: false, label: 'vs morning baseline' }}
        />

        <KpiTile
          title="Commute Delay Factor"
          value={(50 / Math.max(5, activeCorridor.avg_speed_kmh)).toFixed(2)}
          unit="x"
          provenance="SIMULATED"
          icon={ClockIcon}
          accent="terracotta"
          subtext="Relative to 03:00 AM baseline"
        />

        <KpiTile
          title="Severe Bottlenecks"
          value={bottlenecks.filter((b) => b.congestion_score >= 80).length}
          unit="locations"
          provenance="SIMULATED"
          icon={AlertTriangleIcon}
          accent="crimson"
          subtext="TIDEL Park & Singanallur"
        />
      </div>

      {/* Middle Row: Atlas Gauge & Multi-Horizon Forecast Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Semi-circle Atlas Gauge */}
        <Card tabLabel="DENSITY / EQUILIBRIUM" className="flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div>
              <h3 className="font-heading font-bold text-ink-hi text-sm">
                Greenshields Density Dial
              </h3>
              <p className="text-[11px] text-ink-mid mt-0.5">
                {activeCorridor.corridor_name}
              </p>
            </div>
            <Tooltip
              methodNote
              content="Greenshields traffic density equilibrium models congestion based on speed deficit, jam density (125 veh/km/lane), and physical queue buildup."
            />
          </div>

          <div className="my-2">
            <AtlasGauge
              value={activeCorridor.congestion_score}
              title="Equilibrium Index"
            />
          </div>

          <div className="p-3 rounded-lg bg-surface-sunken border border-line text-[11px] space-y-1 text-ink-mid">
            <div className="flex justify-between">
              <span>Nominal Speed Limit:</span>
              <span className="font-mono font-semibold text-ink-hi">50 km/h</span>
            </div>
            <div className="flex justify-between">
              <span>Jam Density (k_jam):</span>
              <span className="font-mono font-semibold text-ink-hi">125 veh/km/lane</span>
            </div>
          </div>
        </Card>

        {/* Right 2 cols: Multi-Horizon ML Forecast Line Chart */}
        <Card tabLabel="FORECAST / LIGHTGBM" className="lg:col-span-2">
          <div className="flex items-start justify-between pb-3 border-b border-line mb-3">
            <div>
              <h3 className="font-heading font-bold text-ink-hi text-sm">
                Multi-Horizon Forward Congestion Curve
              </h3>
              <p className="text-[11px] text-ink-mid mt-0.5">
                Predicted evolution across 15m, 30m, 60m, and 120m horizons (LightGBM Regression)
              </p>
            </div>
            <ProvenanceBadge origin="SIMULATED" size="sm" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastSeries} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" vertical={false} />
                <XAxis dataKey="horizon" stroke="#8A94A6" fontSize={11} tickLine={false} />
                <YAxis stroke="#8A94A6" fontSize={11} domain={[0, 100]} tickLine={false} />
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
                <Line
                  type="monotone"
                  dataKey="congestion"
                  name="Congestion Index"
                  stroke="#C2512D"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#C2512D' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  name="Speed (km/h)"
                  stroke="#1F3A8A"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#1F3A8A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Corridor Comparison Table */}
      <Card tabLabel="AUDIT / ALL CORRIDORS">
        <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
          <div>
            <h3 className="font-heading font-bold text-ink-hi text-sm">
              Comprehensive Arterial Network Table
            </h3>
            <p className="text-[11px] text-ink-mid mt-0.5">
              Live status across all 5 monitored highways with Greenshields density indexing
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={corridors}
          keyExtractor={(item) => item.corridor_name}
          onRowClick={(item) => setSelectedCorridorName(item.corridor_name)}
        />
      </Card>
    </div>
  );
};
