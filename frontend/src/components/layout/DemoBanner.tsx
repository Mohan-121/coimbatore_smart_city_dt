import React from 'react';
import { SlidersIcon, RefreshCwIcon, AlertTriangleIcon } from '@/components/icons';

interface DemoBannerProps {
  activePreset: string | null;
  onReset: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ activePreset, onReset }) => {
  if (!activePreset || activePreset === 'RESET') return null;

  const presetLabels: Record<string, string> = {
    ACCIDENT_TIDEL: 'TIDEL Park Multi-Vehicle Accident (65% capacity reduction on Avinashi Rd)',
    MONSOON_DOWNPOUR: 'Monsoon Flash Rainstorm (Citywide speeds throttled by 35%)',
    HEATWAVE_SPIKE: 'Extreme Heatwave (+4.5°C with residential cooling surge)',
    FLYOVER_LANE_CLOSURE: 'Avinashi Elevated Expressway Pier Erection (2-lane closure)',
  };

  const label = presetLabels[activePreset] || activePreset;

  return (
    <div className="demo-banner h-9 bg-ticker text-slate-100 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between text-xs select-none z-20 shrink-0">
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <span className="font-mono text-[10px] text-amber-300 font-bold uppercase tracking-wider shrink-0">
          DEMO SCENARIO ACTIVE //
        </span>
        <span className="text-slate-200 text-xs truncate font-medium">
          {label}
        </span>
      </div>

      <button
        onClick={onReset}
        type="button"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-[11px] font-mono font-semibold transition-all shrink-0 ml-3"
      >
        <RefreshCwIcon className="w-3 h-3 text-emerald-400" />
        <span>Reset Twin</span>
      </button>
    </div>
  );
};
