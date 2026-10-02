import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { TrafficPrediction, CauseAnalysis, DownstreamImpact } from '@/types/telemetry';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { RouteShield } from '@/components/ui/RouteShield';
import { CauseRibbon } from '@/components/ui/CauseRibbon';
import { HorizonSelector } from '@/components/ui/HorizonSelector';
import { TrafficSignalIcon, SlidersIcon, LeafIcon, ClockIcon, FuelIcon } from '@/components/icons';

interface PredictionCausePanelProps {
  segmentId: string;
}

export const PredictionCausePanel: React.FC<PredictionCausePanelProps> = ({ segmentId }) => {
  const [horizon, setHorizon] = useState<number>(30);
  const [prediction, setPrediction] = useState<TrafficPrediction | null>(null);
  const [cause, setCause] = useState<CauseAnalysis | null>(null);
  const [impact, setImpact] = useState<DownstreamImpact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'PREDICTION' | 'CAUSE' | 'IMPACT'>('PREDICTION');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [predRes, causeRes, impactRes] = await Promise.all([
          api.getPrediction(segmentId, horizon),
          api.getCauseAnalysis(segmentId, horizon),
          api.getImpact(segmentId),
        ]);
        if (isMounted) {
          setPrediction(predRes);
          setCause(causeRes);
          setImpact(impactRes);
        }
      } catch (err) {
        console.error('Failed to load predictions & cause:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [segmentId, horizon]);

  return (
    <div className="bg-surface rounded-xl p-4 flex flex-col h-full overflow-hidden border border-line shadow-atlas space-y-3">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-line">
        <div>
          <span className="text-[9px] font-mono text-indigo font-bold uppercase tracking-wider block">
            DIAGNOSTICS PANEL
          </span>
          <div className="mt-1">
            <RouteShield corridor={prediction?.corridor_name || segmentId} size="sm" />
          </div>
        </div>
        <ProvenanceBadge origin="SIMULATED" size="sm" />
      </div>

      {/* Segmented Sub-Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-surface-sunken p-1 rounded-lg border border-line text-xs">
        {[
          { id: 'PREDICTION', label: 'Forecast' },
          { id: 'CAUSE', label: 'Why? (XAI)' },
          { id: 'IMPACT', label: 'Spillover' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-1 rounded font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-surface text-ink-hi font-bold shadow-atlas-sm border border-line'
                : 'text-ink-mid hover:text-ink-hi'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Horizon Selector */}
      <HorizonSelector value={horizon} onChange={(h) => setHorizon(h)} />

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto pt-1 space-y-3">
        {activeTab === 'PREDICTION' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-surface-sunken border border-line">
                <span className="text-[10px] text-ink-lo uppercase font-mono block">Speed</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-xl font-bold text-ink-hi">{prediction?.predicted_speed_kmh || 32}</span>
                  <span className="text-[10px] text-ink-mid">km/h</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-sunken border border-line">
                <span className="text-[10px] text-ink-lo uppercase font-mono block">Congestion</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-xl font-bold text-terracotta">{prediction?.predicted_congestion_score || 55}</span>
                  <span className="text-[10px] text-ink-mid">/ 100</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-line space-y-1 text-[11px] text-ink-mid">
              <div className="flex justify-between">
                <span>Expected Commute Delay:</span>
                <span className="font-mono font-bold text-ink-hi">{prediction?.expected_travel_time_sec || 140}s</span>
              </div>
              <div className="flex justify-between">
                <span>Model Confidence:</span>
                <span className="font-mono font-bold text-ghats">{Math.round((prediction?.confidence_score || 0.89) * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'CAUSE' && cause && (
          <div className="space-y-3">
            <CauseRibbon contributions={cause.contributions} />
            <div className="p-3 rounded-lg bg-surface-sunken border border-line text-xs text-ink-hi leading-relaxed">
              <p>{cause.explanation}</p>
            </div>
          </div>
        )}

        {activeTab === 'IMPACT' && impact && (
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-surface-sunken border border-line space-y-1 text-ink-mid">
              <div className="flex justify-between">
                <span>Estimated Queue Length:</span>
                <span className="font-mono font-bold text-terracotta">
                  {impact.estimated_queue_spillover_meters || 320} m
                </span>
              </div>
              <div className="flex justify-between">
                <span>Wasted Fuel Burn:</span>
                <span className="font-mono font-bold text-ink-hi">
                  {impact.environmental_impact?.excess_fuel_liters || 24} L
                </span>
              </div>
              <div className="flex justify-between">
                <span>Excess Carbon Delta:</span>
                <span className="font-mono font-bold text-crimson">
                  {impact.environmental_impact?.excess_co2_kg || 56} kg
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
