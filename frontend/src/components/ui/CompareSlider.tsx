import React, { useState, useRef, useEffect } from 'react';
import { ProvenanceBadge } from './ProvenanceBadge';

interface CompareSliderProps {
  baselineContent: React.ReactNode;
  simulatedContent: React.ReactNode;
  baselineLabel?: string;
  simulatedLabel?: string;
  className?: string;
  initialPosition?: number; // 0 to 100
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  baselineContent,
  simulatedContent,
  baselineLabel = 'BASELINE (HISTORICAL)',
  simulatedLabel = 'WHAT-IF SIMULATION',
  className = '',
  initialPosition = 50,
}) => {
  const [dividerPos, setDividerPos] = useState<number>(initialPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setDividerPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
      className={`relative overflow-hidden select-none border border-line rounded-xl bg-surface shadow-atlas ${className}`}
    >
      {/* Underlying Simulated Layer (Full Width) */}
      <div className="w-full h-full relative">
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-terracotta/40 shadow-sm">
          <ProvenanceBadge origin="SIMULATED" size="sm" />
          <span className="font-mono text-[10px] font-bold text-terracotta">{simulatedLabel}</span>
        </div>
        {simulatedContent}
      </div>

      {/* Clipped Baseline Layer (Left side) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - dividerPos}% 0 0)` }}
      >
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-indigo/30 shadow-sm">
          <ProvenanceBadge origin="HISTORICAL" size="sm" />
          <span className="font-mono text-[10px] font-bold text-indigo">{baselineLabel}</span>
        </div>
        <div className="w-full h-full">
          {baselineContent}
        </div>
      </div>

      {/* Draggable Divider Handle Line */}
      <div
        className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex items-center justify-center"
        style={{ left: `${dividerPos}%`, transform: 'translateX(-50%)' }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="w-0.5 h-full bg-indigo shadow-md" />
        <div className="absolute w-8 h-8 rounded-full bg-white border-2 border-indigo shadow-atlas flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-indigo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="8 17 3 12 8 7" />
            <polyline points="16 7 21 12 16 17" />
          </svg>
        </div>
      </div>
    </div>
  );
};
