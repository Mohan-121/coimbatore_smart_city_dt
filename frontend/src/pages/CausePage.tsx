import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { RouteShield } from '@/components/ui/RouteShield';
import { CauseRibbon } from '@/components/ui/CauseRibbon';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { Tooltip } from '@/components/ui/Tooltip';
import { HorizonSelector } from '@/components/ui/HorizonSelector';
import { SlidersIcon, InfoIcon, TrendingUpIcon, CheckCircleIcon } from '@/components/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

export const CausePage: React.FC = () => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('SEG_AVINASHI_02');
  const [horizon, setHorizon] = useState<number>(30);
  const [causeData, setCauseData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedExplanation, setExpandedExplanation] = useState<boolean>(false);

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
        const res = await api.getCauseAnalysis(selectedSegmentId, horizon);
        setCauseData(res);
      } catch (err) {
        console.error('Error loading cause analysis:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedSegmentId, horizon]);

  const contributions = causeData?.contributions || {
    'Peak-Hour Pattern': 52,
    'Upstream Junction Queue': 28,
    'Incident / Lane Restriction': 12,
    'Weather & Visibility': 8,
  };

  // Waterfall chart data
  const baseCongestion = 35.0; // historical free-flow baseline
  const peakDelta = (contributions['Peak-Hour Pattern'] || 0) * 0.42;
  const upstreamDelta = (contributions['Upstream Junction Queue'] || 0) * 0.35;
  const incidentDelta = (contributions['Incident / Lane Restriction'] || 0) * 0.28;
  const weatherDelta = (contributions['Weather & Visibility'] || 0) * 0.15;

  const waterfallData = [
    { name: 'Baseline', value: baseCongestion, delta: baseCongestion, isTotal: true },
    { name: 'Peak Hour', value: peakDelta, delta: peakDelta, isPositive: true },
    { name: 'Upstream Queue', value: upstreamDelta, delta: upstreamDelta, isPositive: true },
    { name: 'Incident/Lanes', value: incidentDelta, delta: incidentDelta, isPositive: true },
    { name: 'Weather/Rain', value: weatherDelta, delta: weatherDelta, isPositive: true },
    { name: 'Predicted Total', value: Math.round(baseCongestion + peakDelta + upstreamDelta + incidentDelta + weatherDelta), delta: 0, isTotal: true },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto h-full">
      {/* Section Label */}
      <SectionLabel
        category="MOBILITY / XAI"
        title="Explainable AI (TreeSHAP) Root Cause Attribution"
        subtitle="Decomposing forward congestion forecasts into four verifiable municipal causal factors using local additive feature attributions."
        badge={<ProvenanceBadge origin="SIMULATED" size="md" />}
      />

      {/* Corridor Segment Shield Picker & Horizon Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        <div className="lg:col-span-2 flex items-center gap-2 overflow-x-auto pb-1 select-none">
          {corridorSegments.map((seg) => {
            const isSelected = selectedSegmentId === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => setSelectedSegmentId(seg.id)}
                type="button"
                className={`p-2.5 rounded-xl border transition-all duration-150 flex items-center gap-2 shadow-atlas-sm shrink-0 ${
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

        <div>
          <HorizonSelector value={horizon} onChange={(h) => setHorizon(h)} />
        </div>
      </div>

      {/* Main Cause Ribbon (Stacked Transit Line Ribbon) */}
      <Card tabLabel="ROOT CAUSE / TREESHAP RIBBON" contour>
        <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
          <div>
            <h3 className="font-heading font-bold text-ink-hi text-base">
              Four-Factor Causal Attribution Ribbon
            </h3>
            <p className="text-xs text-ink-mid mt-0.5">
              Additive percentage distribution for {causeData?.corridor_name || selectedSegmentId} at +{horizon}m
            </p>
          </div>
          <Tooltip
            methodNote
            content="TreeSHAP decomposes complex decision trees into local Shapley additive explanations, guaranteeing mathematical consistency and additive sum totals."
          />
        </div>

        <CauseRibbon contributions={contributions} />
      </Card>

      {/* Waterfall Additive Impact Chart & Natural Language Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waterfall Chart */}
        <Card tabLabel="ADDITIVE / WATERFALL" className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
            <div>
              <h3 className="font-heading font-bold text-ink-hi text-sm">
                Waterfall Additive Congestion Delta (Score: 0 to 100)
              </h3>
              <p className="text-[11px] text-ink-mid mt-0.5">
                From historical baseline (35.0) to multi-horizon predicted score
              </p>
            </div>
            <ProvenanceBadge origin="SIMULATED" size="sm" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" vertical={false} />
                <XAxis dataKey="name" stroke="#8A94A6" fontSize={11} angle={-10} textAnchor="end" />
                <YAxis stroke="#8A94A6" fontSize={11} domain={[0, 100]} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E1DDD2',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'IBM Plex Mono',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {waterfallData.map((entry, index) => {
                    let fillColor = '#1F3A8A'; // Indigo for total
                    if (entry.name === 'Peak Hour') fillColor = '#1F3A8A';
                    else if (entry.name === 'Upstream Queue') fillColor = '#E8A317';
                    else if (entry.name === 'Incident/Lanes') fillColor = '#C2512D';
                    else if (entry.name === 'Weather/Rain') fillColor = '#2B7FD1';
                    else if (entry.name === 'Predicted Total') fillColor = '#C62839';
                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Narrative Card */}
        <Card tabLabel="EXECUTIVE BRIEFING" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-line mb-3">
              <span className="font-heading font-bold text-sm text-ink-hi">
                Synthesized Narrative
              </span>
              <span className="font-mono text-[10px] text-ghats font-bold bg-ghats-soft px-2 py-0.5 rounded border border-ghats/30">
                Confidence: {Math.round((causeData?.confidence || 0.89) * 100)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-sunken border border-line text-xs text-ink-hi leading-relaxed space-y-2">
              <p className="font-medium">
                {causeData?.explanation ||
                  `Congestion is predicted to escalate primarily due to peak-hour commuter demand (52%), coupled with upstream traffic propagation from Hope College (28%).`}
              </p>
              <div className="pt-2 border-t border-line/60 text-[11px] text-ink-mid">
                <span>Primary Driver: </span>
                <strong className="text-indigo">{causeData?.primary_cause || 'Peak-Hour Commuter Surge'}</strong>
              </div>
            </div>
          </div>

          {/* TreeSHAP Plain Language Expander */}
          <div className="mt-4 pt-3 border-t border-line">
            <button
              onClick={() => setExpandedExplanation(!expandedExplanation)}
              type="button"
              className="text-xs text-indigo font-semibold hover:underline flex items-center justify-between w-full"
            >
              <span>Why this explanation? (TreeSHAP Method)</span>
              <span className="font-mono text-[11px]">{expandedExplanation ? '−' : '+'}</span>
            </button>

            {expandedExplanation && (
              <div className="mt-2 p-3 rounded-lg bg-surface-sunken border border-line text-[11px] text-ink-mid leading-relaxed animate-fade-in space-y-1">
                <p>
                  TreeSHAP calculates exact Shapley values for tree ensemble models. Each factor represents the marginal contribution to the prediction compared to average historical conditions.
                </p>
                <p className="font-mono text-[10px] text-ink-lo">
                  Reference: Lundberg et al., Nature Machine Intelligence (2020)
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
