import React, { useEffect } from 'react';
import { CloseIcon } from '@/components/icons';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  width?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  width = 'w-full max-w-md',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dim Backdrop */}
      <div
        className="absolute inset-0 bg-ink-hi/30 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex pl-10 max-w-full">
        <div className={`relative ${width} bg-surface shadow-atlas-lg border-l border-line flex flex-col h-full animate-fade-in`}>
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-line bg-surface-sunken/40">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-ink-hi text-base tracking-tight">{title}</h3>
                {badge}
              </div>
              {subtitle && <p className="text-xs text-ink-mid mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-ink-mid hover:text-ink-hi hover:bg-surface-sunken border border-transparent hover:border-line transition-all"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
