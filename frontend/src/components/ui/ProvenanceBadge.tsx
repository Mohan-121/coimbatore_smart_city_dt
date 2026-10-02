import React from 'react';
import { ClockIcon, FlaskIcon } from '@/components/icons';

export type ProvenanceType = 'LIVE API' | 'REAL_TIME' | 'HISTORICAL' | 'SIMULATED';

interface ProvenanceBadgeProps {
  origin: ProvenanceType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  origin,
  size = 'sm',
  className = '',
  showIcon = true,
}) => {
  const normOrigin = origin.toUpperCase();

  const isLive = normOrigin.includes('LIVE') || normOrigin.includes('REAL');
  const isSim = normOrigin.includes('SIM');
  const isHist = !isLive && !isSim;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  if (isLive) {
    return (
      <span
        title="Live external API feed (Open-Meteo & calibrated sensors)"
        className={`inline-flex items-center font-mono font-medium rounded-full bg-ghats-soft text-ghats border border-ghats/30 tracking-wider shadow-sm select-none ${sizeClasses} ${className}`}
      >
        {showIcon && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ghats opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ghats"></span>
          </span>
        )}
        <span>LIVE API</span>
      </span>
    );
  }

  if (isSim) {
    return (
      <span
        title="Synthetic physics simulation / ML projection"
        className={`inline-flex items-center font-mono font-medium rounded-full bg-terracotta-soft text-terracotta border border-dashed border-terracotta/50 tracking-wider shadow-sm select-none ${sizeClasses} ${className}`}
      >
        {showIcon && <FlaskIcon className="w-2.5 h-2.5 text-terracotta" />}
        <span>SIMULATED</span>
      </span>
    );
  }

  return (
    <span
      title="Empirical baseline / calibrated historical record"
      className={`inline-flex items-center font-mono font-medium rounded-full bg-indigo-soft text-indigo border border-indigo/30 tracking-wider shadow-sm select-none ${sizeClasses} ${className}`}
    >
      {showIcon && <ClockIcon className="w-2.5 h-2.5 text-indigo" />}
      <span>HISTORICAL</span>
    </span>
  );
};
