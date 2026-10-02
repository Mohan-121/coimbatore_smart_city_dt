import React from 'react';

interface SectionLabelProps {
  category?: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  category,
  title,
  subtitle,
  badge,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-start justify-between gap-4 pb-2 border-b border-line mb-4 ${className}`}>
      <div>
        {category && (
          <span className="block text-[10px] font-mono uppercase tracking-widest text-indigo font-bold mb-0.5">
            PLATE // {category}
          </span>
        )}
        <h2 className="font-heading text-lg font-bold text-ink-hi tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-ink-mid mt-0.5 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {badge}
        {action}
      </div>
    </div>
  );
};
