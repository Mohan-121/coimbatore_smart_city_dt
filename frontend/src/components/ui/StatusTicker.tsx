import React from 'react';
import { GaugeIcon, BoltIcon, LeafIcon, AlertTriangleIcon } from '@/components/icons';

interface StatusTickerProps {
  avgSpeed: number;
  cityCongestion: number;
  totalEnergyMw: number;
  aqi: number;
  alertCount: number;
  isSimulated?: boolean;
}

export const StatusTicker: React.FC<StatusTickerProps> = ({
  avgSpeed,
  cityCongestion,
  totalEnergyMw,
  aqi,
  alertCount,
  isSimulated = false,
}) => {
  return (
    <div className="status-ticker h-8 bg-ticker text-slate-200 border-b border-slate-800 px-4 flex items-center justify-between text-xs font-mono select-none z-30 shrink-0">
      {/* City Identification Lockup */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-slate-300 font-bold tracking-wider text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          COIMBATORE TWIN // TELEMETRY STREAM
        </span>
        <span className="hidden md:inline text-slate-600">|</span>
        <span className="hidden md:inline text-slate-400 text-[10px]">
          76°58'E, 11°01'N
        </span>
      </div>

      {/* Aggregate Metric Marquee / Counters */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-0.5 no-scrollbar">
        {/* Speed */}
        <div className="flex items-center gap-1.5">
          <GaugeIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Speed:</span>
          <span className="font-bold text-white font-tabular">{avgSpeed.toFixed(1)}</span>
          <span className="text-[10px] text-slate-400">km/h</span>
        </div>

        {/* Congestion */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Congestion:</span>
          <span
            className={`font-bold font-tabular ${
              cityCongestion >= 70
                ? 'text-rose-400'
                : cityCongestion >= 40
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {Math.round(cityCongestion)}%
          </span>
        </div>

        {/* Energy Grid */}
        <div className="flex items-center gap-1.5">
          <BoltIcon className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Grid:</span>
          <span className="font-bold text-white font-tabular">{Math.round(totalEnergyMw)}</span>
          <span className="text-[10px] text-slate-400">MW</span>
        </div>

        {/* AQI */}
        <div className="flex items-center gap-1.5">
          <LeafIcon className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">AQI:</span>
          <span className="font-bold text-white font-tabular">{aqi}</span>
        </div>

        {/* Active Alerts */}
        <div className="flex items-center gap-1.5">
          <AlertTriangleIcon
            className={`w-3.5 h-3.5 ${alertCount > 0 ? 'text-amber-400' : 'text-slate-500'}`}
          />
          <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Alerts:</span>
          <span
            className={`font-bold font-tabular ${
              alertCount > 0 ? 'text-amber-300' : 'text-slate-400'
            }`}
          >
            {alertCount}
          </span>
        </div>
      </div>

      {/* Twin Mode Chip */}
      <div className="hidden lg:flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
            isSimulated
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {isSimulated ? 'SIMULATION' : 'LIVE TWIN'}
        </span>
      </div>
    </div>
  );
};
