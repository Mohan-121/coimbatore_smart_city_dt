import React from 'react';

interface AtlasGaugeProps {
  value: number; // 0 to 100
  title?: string;
  label?: string;
  size?: number;
  className?: string;
}

export const AtlasGauge: React.FC<AtlasGaugeProps> = ({
  value,
  title = 'Congestion Score',
  label,
  size = 180,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  // Determine color category
  let color = '#10B981'; // Emerald
  let category = 'Free Flow';
  if (clamped >= 85) {
    color = '#DC2626'; // Crimson
    category = 'Gridlock';
  } else if (clamped >= 60) {
    color = '#F97316'; // Orange
    category = 'Heavy';
  } else if (clamped >= 30) {
    color = '#F59E0B'; // Amber
    category = 'Moderate';
  }

  // Calculate arc angles (-180deg to 0deg)
  const angle = (clamped / 100) * 180 - 180; // from -180 to 0 degrees
  const radius = 68;
  const strokeWidth = 10;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center p-3 ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size / 1.75 }}>
        <svg
          viewBox="0 0 160 95"
          className="w-full h-full overflow-visible"
        >
          {/* Background track */}
          <path
            d="M 12 80 A 68 68 0 0 1 148 80"
            fill="none"
            stroke="#EFEDE6"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active colored arc */}
          <path
            d="M 12 80 A 68 68 0 0 1 148 80"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />

          {/* Dial ticks */}
          <circle cx="12" cy="80" r="2.5" fill="#8A94A6" />
          <circle cx="80" cy="12" r="2.5" fill="#8A94A6" />
          <circle cx="148" cy="80" r="2.5" fill="#8A94A6" />

          {/* Value Display */}
          <text
            x="80"
            y="65"
            textAnchor="middle"
            className="font-mono text-2xl font-bold fill-ink-hi"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {Math.round(clamped)}
          </text>
          <text
            x="80"
            y="80"
            textAnchor="middle"
            className="text-[9px] font-sans font-medium fill-ink-mid uppercase tracking-wider"
          >
            / 100 INDEX
          </text>
        </svg>
      </div>

      <div className="flex flex-col items-center mt-1">
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono tracking-wide"
          style={{ backgroundColor: `${color}18`, color: color, border: `1px solid ${color}40` }}
        >
          {label || category}
        </span>
        {title && <span className="text-[11px] text-ink-mid mt-1 font-medium">{title}</span>}
      </div>
    </div>
  );
};
