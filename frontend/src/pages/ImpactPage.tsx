import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { KpiTile } from '@/components/ui/KpiTile';
import { RouteShield } from '@/components/ui/RouteShield';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { Tooltip } from '@/components/ui/Tooltip';
import { LeafIcon, FuelIcon, ClockIcon, RouteIcon, TrafficSignalIcon } from '@/components/icons';

export const ImpactPage: React.FC = () => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('SEG_AVINASHI_02');
  const [impactData, setImpactData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const corridorSegments = [
    { id: 'SEG_AVINASHI_02', label: 'Avinashi Road (TIDEL Park)' },
    { id: 'SEG_TRICHY_02', label: 'Trichy Road (Singanallur)' },
    { id: 'SEG_SATHY_01', label: 'Sathy Road (Gandhipuram)' },
    { id: 'SEG_MTP_01', label: 'MTP Road (Saibaba Colony)' },
    { id: 'SEG_POLLACHI_01', label: 'Pollachi Road (Ukkadam)' },
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getImpact(selectedSegmentId);
        setImpactData(res);
      } catch (err) {
        console.error('Error loading impact analysis:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedSegmentId]);

  const fuelLiters = impactData?.fuel_wasted_liters || 24.5;
  const co2Kg = impactData?.co2_excess_kg || 56.6;
  const queueMeters = impactData?.queue_length_meters || 480;
  const treesEquiv = Math.round(co2Kg / 0.06); // ~22kg CO2/year per tree ≈ 0.06kg/day

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto h-full">
      {/* Section Header */}
      <SectionLabel
        category="MOBILITY / IMPACT"
        title="Network Flow Spillover & Carbon Emission Assessment"
        subtitle="Downstream queue propagation, alternate arterial diversion pressure, and EPA Vehicle Specific Power (VSP) idling emissions."
        badge={<ProvenanceBadge origin="SIMULATED" size="md" />}
      />

      {/* Corridor Picker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        {corridorSegments.map((seg) => {
          const isSelected = selectedSegmentId === seg.id;
          return (
            <button
              key={seg.id}
              onClick={() => setSelectedSegmentId(seg.id)}
              type="button"
              className={`p-2.5 rounded-xl border transition-all duration-150 flex items-center gap-2 shadow-atlas-sm ${
                isSelected
                  ? 'bg-surface border-indigo ring-2 ring-indigo/20 shadow-md'
                  : 'bg-surface-sunken border-line hover:border-ink-lo'
              }`}
            >
              <RouteShield corridor={seg.label} size="sm" />
            </button>
          );
        })}
      </div>

      {/* Core Environmental Impact KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Physical Queue Spillover"
          value={queueMeters}
          unit="meters"
          provenance="SIMULATED"
          icon={TrafficSignalIcon}
          accent="terracotta"
          subtext="Propagating into upstream feeder nodes"
        />

        <KpiTile
          title="Excess Fuel Burn (Idling)"
          value={fuelLiters}
          unit="Liters/hr"
          provenance="SIMULATED"
          icon={FuelIcon}
          accent="turmeric"
          delta={{ value: '+42%', isPositive: false, label: 'vs nominal flow' }}
        />

        <KpiTile
          title="Excess Carbon Emission"
          value={co2Kg}
          unit="kg CO2/hr"
          provenance="SIMULATED"
          icon={LeafIcon}
          accent="crimson"
          subtext="EPA VSP vehicular idling model"
        />

        <KpiTile
          title="Commute Delay Factor"
          value={impactData?.delay_factor || '1.85'}
          unit="x"
          provenance="SIMULATED"
          icon={ClockIcon}
          accent="indigo"
          subtext="Multiplier over free-flow travel time"
        />
      </div>

      {/* Node-Link Network Spillover Diagram & Environmental Equivalence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node-Link Spillover View */}
        <Card tabLabel="NETWORK / SPILLOVER TOPOLOGY" className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
            <div>
              <h3 className="font-heading font-bold text-ink-hi text-sm">
                Corridor Flow Diversion & Adjacency Graph
              </h3>
              <p className="text-[11px] text-ink-mid mt-0.5">
                Upstream queue accumulation and motorist rerouting onto parallel corridors
              </p>
            </div>
            <Tooltip
              methodNote
              content="Logit Choice diversion probability models driver rerouting based on travel time differentials across parallel arterial corridors."
            />
          </div>

          {/* Clean Node-Link Diagram */}
          <div className="p-6 bg-surface-sunken/60 rounded-xl border border-line relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Upstream Node */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-surface border border-line shadow-atlas-sm text-center w-48">
              <span className="text-[9px] font-mono text-ink-lo uppercase">Upstream Link</span>
              <span className="font-heading font-bold text-ink-hi text-xs mt-1">Hope College / Peelamedu</span>
              <span className="font-mono text-[10px] text-terracotta mt-1 font-semibold">Queue +320m</span>
            </div>

            {/* Connecting Arrow */}
            <div className="flex flex-col items-center">
              <span className="font-mono text-[10px] text-ink-mid mb-1">Queue Shockwave</span>
              <div className="w-16 h-1 bg-terracotta relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-terracotta rotate-45" />
              </div>
            </div>

            {/* Bottleneck Node (Crimson Outline) */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-surface border-2 border-crimson shadow-atlas text-center w-56 relative">
              <span className="absolute -top-2.5 px-2 py-0.2 rounded-full bg-crimson text-white font-mono text-[9px] font-bold">
                BOTTLENECK ACTIVE
              </span>
              <span className="font-heading font-bold text-ink-hi text-xs mt-1">TIDEL Park Junction</span>
              <span className="font-mono text-xs font-bold text-crimson mt-0.5">Capacity Loss: -50%</span>
              <span className="text-[10px] text-ink-mid mt-1">Avinashi Road NH 544</span>
            </div>

            {/* Diverted Arrow */}
            <div className="flex flex-col items-center">
              <span className="font-mono text-[10px] text-indigo mb-1">Diverting 34%</span>
              <div className="w-16 h-1 bg-indigo relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-indigo rotate-45" />
              </div>
            </div>

            {/* Alternate Corridors Node */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-surface border border-indigo/40 shadow-atlas-sm text-center w-52">
              <span className="text-[9px] font-mono text-indigo uppercase font-semibold">Absorbing Corridors</span>
              <span className="font-heading font-bold text-ink-hi text-xs mt-1">Trichy Road via Singanallur</span>
              <span className="font-mono text-[10px] text-ink-mid mt-1 font-semibold">Surge +18% Veh/hr</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-surface border border-line flex items-center justify-between text-xs">
            <span className="text-ink-mid">Automated Traffic Police Recommendation:</span>
            <span className="font-medium text-ink-hi text-right">
              Activate priority green wave along Sungam Bypass to absorb Avinashi eastbound overflow.
            </span>
          </div>
        </Card>

        {/* Environmental Equivalence Card */}
        <Card tabLabel="ECOLOGICAL / EQUIVALENCE" className="flex flex-col justify-between" contour>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-line mb-3">
              <span className="font-heading font-bold text-sm text-ink-hi">
                Ecological Impact Helper
              </span>
              <ProvenanceBadge origin="SIMULATED" size="sm" />
            </div>

            <div className="p-4 rounded-xl bg-surface-sunken border border-line space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ghats-soft text-ghats flex items-center justify-center shrink-0 border border-ghats/30">
                  <LeafIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-lo block">Equivalent Forestry Offset</span>
                  <span className="font-heading font-bold text-sm text-ink-hi">
                    Equal to {treesEquiv} Urban Trees
                  </span>
                </div>
              </div>
              <p className="text-xs text-ink-mid leading-relaxed">
                The current vehicular delay along this corridor produces excess carbon equal to the total daily CO2 absorption capacity of approximately <strong>{treesEquiv} mature neem/banyan trees</strong> in Coimbatore.
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-surface border border-line text-[11px] text-ink-mid space-y-1">
            <div className="flex justify-between">
              <span>Conversion Factor:</span>
              <span className="font-mono font-semibold text-ink-hi">1 L fuel ≈ 2.31 kg CO2</span>
            </div>
            <div className="flex justify-between">
              <span>Emission Methodology:</span>
              <span className="font-mono font-semibold text-ink-hi">EPA VSP Idling Tier-3</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
