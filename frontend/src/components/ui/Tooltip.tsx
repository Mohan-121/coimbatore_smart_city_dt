import React, { useState } from 'react';
import { InfoIcon } from '@/components/icons';

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  methodNote?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  methodNote = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        <button
          type="button"
          className="text-ink-lo hover:text-indigo transition-colors ml-1 p-0.5"
          aria-label="More information"
        >
          <InfoIcon className="w-3.5 h-3.5" />
        </button>
      )}

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-ink-hi text-white text-[11px] rounded-lg shadow-atlas-lg z-50 pointer-events-none animate-fade-in font-sans leading-relaxed">
          {methodNote && (
            <div className="text-[9px] font-mono uppercase text-sky tracking-wider font-bold mb-1">
              METHOD SPECIFICATION
            </div>
          )}
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-ink-hi" />
        </div>
      )}
    </span>
  );
};
