import React from 'react';
import { TrafficSignalIcon, RouteIcon, AlertTriangleIcon, CloudRainIcon } from '@/components/icons';

interface CauseRibbonProps {
  contributions: {
    'Peak-Hour Pattern'?: number;
    'Upstream Junction Queue'?: number;
    'Incident / Lane Restriction'?: number;
    'Weather & Visibility'?: number;
    [key: string]: number | undefined;
  };
  className?: string;
  onSelectCause?: (causeName: string) => void;
}

export const CauseRibbon: React.FC<CauseRibbonProps> = ({
  contributions,
  className = '',
  onSelectCause,
}) => {
  const peak = Math.max(0, contributions['Peak-Hour Pattern'] || 0);
  const upstream = Math.max(0, contributions['Upstream Junction Queue'] || 0);
  const incident = Math.max(0, contributions['Incident / Lane Restriction'] || 0);
  const weather = Math.max(0, contributions['Weather & Visibility'] || 0);

  const total = Math.max(1, peak + upstream + incident + weather);

  const segments = [
    {
      id: 'peak',
      name: 'Peak-Hour Surge',
      fullName: 'Peak-Hour Commuter Surge',
      pct: Math.round((peak / total) * 100),
      rawVal: peak,
      color: '#1F3A8A', // Indigo
      bgLight: '#EEF2FF',
      icon: TrafficSignalIcon,
    },
    {
      id: 'upstream',
      name: 'Upstream Queue',
      fullName: 'Upstream Junction Queue Spillover',
      pct: Math.round((upstream / total) * 100),
      rawVal: upstream,
      color: '#E8A317', // Turmeric
      bgLight: '#FEF9E7',
      icon: RouteIcon,
    },
    {
      id: 'incident',
      name: 'Lane Restriction',
      fullName: 'Active Incident / Capacity Loss',
      pct: Math.round((incident / total) * 100),
      rawVal: incident,
      color: '#C62839', // Crimson
      bgLight: '#FDF2F3',
      icon: AlertTriangleIcon,
    },
    {
      id: 'weather',
      name: 'Weather Impact',
      fullName: 'Weather & Monsoon Downpour',
      pct: Math.round((weather / total) * 100),
      rawVal: weather,
      color: '#2B7FD1', // Sky
      bgLight: '#EFF6FF',
      icon: CloudRainIcon,
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Transit-Line Map Ribbon Bar */}
      <div className="relative pt-2 pb-1">
        <div className="h-3 w-full bg-surface-sunken rounded-full overflow-hidden flex border border-line p-0.5">
          {segments.map((seg) => {
            const widthPct = Math.max(seg.pct, 4);
            return (
              <div
                key={seg.id}
                style={{ width: `${widthPct}%`, backgroundColor: seg.color }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 relative group cursor-pointer"
                title={`${seg.fullName}: ${seg.pct}%`}
                onClick={() => onSelectCause?.(seg.fullName)}
              />
            );
          })}
        </div>

        {/* Station Dots Track */}
        <div className="flex justify-between items-center px-2 mt-2">
          {segments.map((seg) => (
            <div
              key={seg.id}
              onClick={() => onSelectCause?.(seg.fullName)}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ring-1"
                style={{ backgroundColor: seg.color, outlineColor: seg.color }}
              />
              <span className="font-mono text-xs font-bold text-ink-hi group-hover:text-indigo">
                {seg.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cause Badges / Legend Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {segments.map((seg) => {
          const Icon = seg.icon;
          return (
            <div
              key={seg.id}
              onClick={() => onSelectCause?.(seg.fullName)}
              className="p-2.5 rounded-lg border border-line bg-surface hover:bg-surface-sunken transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="p-1 rounded" style={{ backgroundColor: seg.bgLight, color: seg.color }}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="font-mono text-xs font-bold" style={{ color: seg.color }}>
                  {seg.pct}%
                </span>
              </div>
              <span className="text-[11px] font-medium text-ink-hi line-clamp-1">
                {seg.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
