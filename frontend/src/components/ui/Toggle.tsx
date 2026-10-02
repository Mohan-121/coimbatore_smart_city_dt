import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  subtext?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  subtext,
  className = '',
}) => {
  return (
    <label className={`flex items-start justify-between gap-3 cursor-pointer select-none ${className}`}>
      <div>
        <span className="text-xs font-medium text-ink-hi block">{label}</span>
        {subtext && <span className="text-[11px] text-ink-mid block mt-0.5">{subtext}</span>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo/20 ${
          checked ? 'bg-indigo' : 'bg-line'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
};
