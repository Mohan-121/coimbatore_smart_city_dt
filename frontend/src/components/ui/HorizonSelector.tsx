import React from 'react';
import { ClockIcon } from '@/components/icons';

interface HorizonSelectorProps {
  value: number; // 15, 30, 60, 120
  onChange: (horizon: number) => void;
  className?: string;
}

export const HorizonSelector: React.FC<HorizonSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const horizons = [
    { mins: 15, label: '+15m', desc: 'Shockwave warning' },
    { mins: 30, label: '+30m', desc: 'Signal retiming' },
    { mins: 60, label: '+60m', desc: 'Route diversion' },
    { mins: 120, label: '+120m', desc: 'Shift clearance' },
  ];

  return (
    <div className={`bg-surface border border-line rounded-xl p-1.5 shadow-atlas-sm ${className}`}>
      <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-line/60 text-[10px] font-mono text-ink-mid uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <ClockIcon className="w-3 h-3 text-indigo" />
          <span>Forecast Horizon Timetable</span>
        </span>
        <span className="text-ink-lo">ML LightGBM</span>
      </div>

      {/* Train-timetable strip */}
      <div className="grid grid-cols-4 gap-1 relative">
        {horizons.map((h) => {
          const isActive = value === h.mins;
          return (
            <button
              key={h.mins}
              onClick={() => onChange(h.mins)}
              type="button"
              className={`relative px-3 py-2 rounded-lg text-left transition-all duration-150 flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo text-white shadow-sm ring-1 ring-indigo'
                  : 'bg-surface-sunken hover:bg-surface text-ink-mid hover:text-ink-hi'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold font-tabular">
                  {h.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </div>
              <span className={`text-[9px] truncate mt-0.5 ${isActive ? 'text-indigo-soft' : 'text-ink-lo'}`}>
                {h.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
