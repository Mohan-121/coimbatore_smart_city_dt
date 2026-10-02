import React from 'react';
import { InfoIcon, AlertTriangleIcon } from '@/components/icons';

export type AlertSeverity = 'INFO' | 'WARNING' | 'SEVERE' | 'CRITICAL';

interface SeverityBadgeProps {
  severity: AlertSeverity | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  className = '',
  size = 'md',
}) => {
  const norm = severity.toUpperCase() as AlertSeverity;

  const config = {
    INFO: {
      bg: 'bg-sky-soft',
      text: 'text-sky',
      border: 'border-sky/40',
      icon: InfoIcon,
      label: 'INFO',
    },
    WARNING: {
      bg: 'bg-turmeric-soft',
      text: 'text-turmeric-dark',
      border: 'border-turmeric/40',
      icon: AlertTriangleIcon,
      label: 'WARNING',
    },
    SEVERE: {
      bg: 'bg-terracotta-soft',
      text: 'text-terracotta',
      border: 'border-terracotta/40',
      icon: AlertTriangleIcon,
      label: 'SEVERE',
    },
    CRITICAL: {
      bg: 'bg-crimson-soft',
      text: 'text-crimson',
      border: 'border-crimson/40',
      icon: AlertTriangleIcon,
      label: 'CRITICAL',
    },
  }[norm] || {
    bg: 'bg-sky-soft',
    text: 'text-sky',
    border: 'border-sky/40',
    icon: InfoIcon,
    label: norm,
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-mono font-semibold rounded-md border shadow-sm ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}>
      <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      <span>{config.label}</span>
    </span>
  );
};
