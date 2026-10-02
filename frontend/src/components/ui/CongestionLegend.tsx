import React from 'react';

interface CongestionLegendProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showTitle?: boolean;
}

export const CongestionLegend: React.FC<CongestionLegendProps> = ({
  className = '',
  orientation = 'horizontal',
  showTitle = true,
}) => {
  const levels = [
    { label: 'Free Flow', range: '< 30', color: '#10B981', border: '#059669' },
    { label: 'Moderate', range: '30–59', color: '#F59E0B', border: '#D97706' },
    { label: 'Heavy', range: '60–84', color: '#F97316', border: '#EA580C' },
    { label: 'Gridlock', range: '85–100', color: '#DC2626', border: '#B91C1C' },
  ];

  return (
    <div className={`bg-surface border border-line rounded-lg p-2.5 shadow-atlas-sm text-xs ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between gap-3 pb-1.5 mb-1.5 border-b border-line text-[10px] font-mono text-ink-mid uppercase tracking-wider font-semibold">
          <span>Congestion Index</span>
          <span>Greenshields Score</span>
        </div>
      )}
      <div className={`flex ${orientation === 'horizontal' ? 'flex-row items-center gap-3.5 flex-wrap' : 'flex-col gap-1.5'}`}>
        {levels.map((lvl) => (
          <div key={lvl.label} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm border shrink-0"
              style={{ backgroundColor: lvl.color, borderColor: lvl.border }}
            />
            <span className="font-medium text-ink-hi text-[11px]">{lvl.label}</span>
            <span className="font-mono text-ink-lo text-[10px]">({lvl.range})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
