import React from 'react';
import { RouteIcon } from '@/components/icons';
import { ProvenanceBadge } from './ProvenanceBadge';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  showFallbackBadge?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = RouteIcon,
  actionLabel,
  onAction,
  className = '',
  showFallbackBadge = false,
}) => {
  return (
    <div className={`p-8 text-center flex flex-col items-center justify-center border border-dashed border-line rounded-xl bg-surface-sunken/40 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-surface border border-line flex items-center justify-center text-ink-mid shadow-atlas-sm mb-3">
        <Icon className="w-6 h-6 text-indigo" />
      </div>

      <h4 className="font-heading font-semibold text-ink-hi text-sm mb-1">{title}</h4>
      <p className="text-xs text-ink-mid max-w-sm mb-3">{description}</p>

      {showFallbackBadge && (
        <div className="mb-3">
          <ProvenanceBadge origin="HISTORICAL" size="sm" />
        </div>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          type="button"
          className="px-3.5 py-1.5 rounded-lg bg-indigo text-white text-xs font-semibold hover:bg-indigo-dark shadow-atlas-sm transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
