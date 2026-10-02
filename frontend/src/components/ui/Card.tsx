import React from 'react';

interface CardProps {
  children: React.ReactNode;
  tabLabel?: string;
  contour?: boolean;
  className?: string;
  headerAction?: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  tabLabel,
  contour = false,
  className = '',
  headerAction,
  title,
  subtitle,
  badge,
}) => {
  return (
    <div
      className={`relative bg-surface rounded-xl border border-line shadow-atlas overflow-hidden transition-all duration-200 ${
        contour ? 'contour-bg' : ''
      } ${className}`}
    >
      {/* Index-card tab label (Atlas plate caption) */}
      {tabLabel && (
        <div className="inline-block bg-surface-sunken border-r border-b border-line px-3 py-1 text-[9px] font-mono font-semibold uppercase tracking-wider text-ink-mid rounded-br-md">
          {tabLabel}
        </div>
      )}

      {/* Header if title/action provided */}
      {(title || headerAction || badge) && (
        <div className="flex items-start justify-between gap-3 p-4 pb-2 border-b border-line/60">
          <div>
            {title && <h3 className="font-heading font-semibold text-ink-hi text-sm tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[11px] text-ink-mid mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {headerAction}
          </div>
        </div>
      )}

      {/* Main card body */}
      <div className="p-4">{children}</div>
    </div>
  );
};
