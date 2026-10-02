import React from 'react';

interface RouteShieldProps {
  corridor: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

// Maps corridor names to standard Indian National Highway designations
export const CORRIDOR_HIGHWAY_MAP: Record<string, { code: string; label: string }> = {
  'Avinashi Road': { code: 'NH 544', label: 'Avinashi Road' },
  'Trichy Road': { code: 'NH 81', label: 'Trichy Road' },
  'Sathy Road': { code: 'NH 948', label: 'Sathy Road' },
  'Mettupalayam Road': { code: 'NH 181', label: 'Mettupalayam Road' },
  'Pollachi Road': { code: 'NH 83', label: 'Pollachi Road' },
  'SEG_AVINASHI_01': { code: 'NH 544', label: 'Avinashi Rd (Hope College)' },
  'SEG_AVINASHI_02': { code: 'NH 544', label: 'Avinashi Rd (TIDEL Park)' },
  'SEG_AVINASHI_03': { code: 'NH 544', label: 'Avinashi Rd (Airport Link)' },
  'SEG_TRICHY_01': { code: 'NH 81', label: 'Trichy Rd (Ramanathapuram)' },
  'SEG_TRICHY_02': { code: 'NH 81', label: 'Trichy Rd (Singanallur)' },
  'SEG_TRICHY_03': { code: 'NH 81', label: 'Trichy Rd (Ondipudur)' },
  'SEG_SATHY_01': { code: 'NH 948', label: 'Sathy Rd (Gandhipuram)' },
  'SEG_SATHY_02': { code: 'NH 948', label: 'Sathy Rd (Saravanampatti)' },
  'SEG_MTP_01': { code: 'NH 181', label: 'MTP Rd (Saibaba Colony)' },
  'SEG_POLLACHI_01': { code: 'NH 83', label: 'Pollachi Rd (Ukkadam)' },
};

export const RouteShield: React.FC<RouteShieldProps> = ({
  corridor,
  className = '',
  size = 'md',
  showSubtext = true,
}) => {
  // Extract or match highway info
  let info = CORRIDOR_HIGHWAY_MAP[corridor];
  if (!info) {
    const key = Object.keys(CORRIDOR_HIGHWAY_MAP).find((k) => corridor.includes(k) || k.includes(corridor));
    info = key ? CORRIDOR_HIGHWAY_MAP[key] : { code: 'NH', label: corridor };
  }

  const sizeClasses = {
    sm: {
      shield: 'px-1.5 py-0.5 text-[9px]',
      text: 'text-[11px]',
      container: 'gap-1.5',
    },
    md: {
      shield: 'px-2 py-0.5 text-[10px]',
      text: 'text-xs',
      container: 'gap-2',
    },
    lg: {
      shield: 'px-2.5 py-1 text-xs',
      text: 'text-sm font-semibold',
      container: 'gap-2.5',
    },
  }[size];

  return (
    <div className={`inline-flex items-center ${sizeClasses.container} select-none ${className}`}>
      {/* Indian National Highway Green Signboard */}
      <span className={`inline-flex items-center justify-center font-mono font-bold tracking-wider bg-[#0E7C66] text-white border border-[#085344] rounded shadow-sm ${sizeClasses.shield}`}>
        {info.code}
      </span>
      {showSubtext && (
        <span className={`font-medium text-ink-hi truncate ${sizeClasses.text}`}>
          {info.label}
        </span>
      )}
    </div>
  );
};
