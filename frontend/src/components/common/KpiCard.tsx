import React from 'react';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  origin: string;
  icon: any;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtext,
  origin,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="bg-surface rounded-xl p-3.5 border border-line shadow-atlas-sm flex flex-col justify-between hover:border-ink-lo transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[11px] font-medium text-ink-mid truncate">{title}</span>
        <ProvenanceBadge origin={origin} size="sm" />
      </div>

      <div className="flex items-baseline justify-between my-1">
        <div className="flex items-baseline gap-1 font-mono font-bold text-ink-hi text-2xl font-tabular">
          <span>{value}</span>
          {unit && <span className="text-xs text-ink-lo font-medium">{unit}</span>}
        </div>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-surface-sunken text-indigo">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="pt-1 border-t border-line/60 flex items-center justify-between text-[10px] text-ink-lo">
        <span className="truncate">{subtext || 'Nominal baseline'}</span>
        {trend && (
          <span className={`font-mono font-bold ${trend.isPositive ? 'text-ghats' : 'text-crimson'}`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
