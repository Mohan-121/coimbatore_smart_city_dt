import React from 'react';
import { ProvenanceBadge, ProvenanceType } from './ProvenanceBadge';
import { TrendingUpIcon, TrendingDownIcon } from '@/components/icons';

interface KpiTileProps {
  title: string;
  value: string | number;
  unit?: string;
  delta?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  provenance: ProvenanceType | string;
  icon?: React.ComponentType<{ className?: string }>;
  subtext?: string;
  className?: string;
  accent?: 'indigo' | 'ghats' | 'terracotta' | 'turmeric' | 'crimson' | 'sky';
}

export const KpiTile: React.FC<KpiTileProps> = ({
  title,
  value,
  unit,
  delta,
  provenance,
  icon: Icon,
  subtext,
  className = '',
  accent = 'indigo',
}) => {
  const accentClasses = {
    indigo: 'text-indigo border-indigo/20',
    ghats: 'text-ghats border-ghats/20',
    terracotta: 'text-terracotta border-terracotta/20',
    turmeric: 'text-turmeric-dark border-turmeric/20',
    crimson: 'text-crimson border-crimson/20',
    sky: 'text-sky border-sky/20',
  }[accent];

  return (
    <div className={`bg-surface rounded-xl border border-line p-3.5 shadow-atlas-sm flex flex-col justify-between hover:border-ink-mid/30 transition-all ${className}`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[11px] font-medium text-ink-mid tracking-tight line-clamp-1">{title}</span>
        <ProvenanceBadge origin={provenance} size="sm" />
      </div>

      {/* Primary Value Readout */}
      <div className="flex items-baseline justify-between gap-2 my-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-ink-hi font-tabular">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-mono text-ink-mid font-medium">{unit}</span>
          )}
        </div>
        {Icon && (
          <div className={`p-1.5 rounded-lg bg-surface-sunken ${accentClasses}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Footer / Delta & Subtext */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-line/50 text-[11px]">
        {delta ? (
          <span
            className={`inline-flex items-center gap-0.5 font-mono font-semibold ${
              delta.isPositive ? 'text-ghats' : 'text-crimson'
            }`}
          >
            {delta.isPositive ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
            <span>{delta.value}</span>
            {delta.label && <span className="text-[10px] text-ink-lo ml-1">{delta.label}</span>}
          </span>
        ) : (
          <span className="text-[10px] text-ink-lo truncate">{subtext || 'Nominal baseline'}</span>
        )}
      </div>
    </div>
  );
};
