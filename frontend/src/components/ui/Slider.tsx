import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  helperText?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  helperText,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline justify-between text-xs">
        <label className="font-medium text-ink-hi">{label}</label>
        <div className="font-mono text-xs font-bold text-indigo bg-indigo-soft px-2 py-0.5 rounded border border-indigo/20 font-tabular">
          {value}
          {unit && <span className="ml-0.5 text-ink-mid font-normal">{unit}</span>}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-line rounded-lg appearance-none cursor-pointer accent-indigo"
      />

      <div className="flex justify-between text-[10px] font-mono text-ink-lo px-0.5">
        <span>{min}{unit}</span>
        {helperText && <span className="text-ink-mid font-sans">{helperText}</span>}
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};
