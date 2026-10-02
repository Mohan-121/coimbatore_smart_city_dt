import React, { useState, useEffect } from 'react';
import { SearchIcon, RouteIcon, BoltIcon, LeafIcon, SlidersIcon, FileTextIcon, AlertTriangleIcon, CloseIcon } from '@/components/icons';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onTriggerPreset?: (presetId: string) => void;
  onInspectCorridor?: (segmentId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onTriggerPreset,
  onInspectCorridor,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'OVERVIEW', label: 'Command Map Overview', category: 'Navigation', icon: RouteIcon },
    { id: 'TRAFFIC', label: 'Traffic Intelligence & Corridors', category: 'Navigation', icon: RouteIcon },
    { id: 'CAUSE', label: 'Explainable AI (TreeSHAP Cause Analysis)', category: 'Navigation', icon: SlidersIcon },
    { id: 'IMPACT', label: 'Spillover & Environmental Carbon Impact', category: 'Navigation', icon: LeafIcon },
    { id: 'ENERGY', label: 'Electrical Grid Demand (TANGEDCO 5-Zones)', category: 'Navigation', icon: BoltIcon },
    { id: 'ENVIRONMENT', label: 'Environmental Intelligence & AQI', category: 'Navigation', icon: LeafIcon },
    { id: 'SCENARIOS', label: 'What-If Scenario Lab', category: 'Navigation', icon: SlidersIcon },
    { id: 'ALERTS', label: 'Municipal Alerts & Emergency Incidents', category: 'Navigation', icon: AlertTriangleIcon },
    { id: 'REPORTS', label: 'Executive Municipal Scorecard Report', category: 'Navigation', icon: FileTextIcon },

    // Quick Corridors
    { id: 'corridor-avinashi', label: 'Avinashi Road (NH 544)', category: 'Corridor', segmentId: 'SEG_AVINASHI_02', icon: RouteIcon },
    { id: 'corridor-trichy', label: 'Trichy Road (NH 81)', category: 'Corridor', segmentId: 'SEG_TRICHY_02', icon: RouteIcon },
    { id: 'corridor-sathy', label: 'Sathy Road (NH 948)', category: 'Corridor', segmentId: 'SEG_SATHY_01', icon: RouteIcon },
    { id: 'corridor-mtp', label: 'Mettupalayam Road (NH 181)', category: 'Corridor', segmentId: 'SEG_MTP_01', icon: RouteIcon },
    { id: 'corridor-pollachi', label: 'Pollachi Road (NH 83)', category: 'Corridor', segmentId: 'SEG_POLLACHI_01', icon: RouteIcon },

    // Demo Actions
    { id: 'preset-accident', label: 'Demo Preset: Simulate TIDEL Park Accident', category: 'Demo', presetId: 'ACCIDENT_TIDEL', icon: AlertTriangleIcon },
    { id: 'preset-rain', label: 'Demo Preset: Trigger Monsoon Rainstorm', category: 'Demo', presetId: 'MONSOON_DOWNPOUR', icon: LeafIcon },
    { id: 'preset-heatwave', label: 'Demo Preset: Simulate Heatwave Spike', category: 'Demo', presetId: 'HEATWAVE_SPIKE', icon: BoltIcon },
    { id: 'preset-reset', label: 'Reset Digital Twin to Baseline', category: 'Demo', presetId: 'RESET', icon: SlidersIcon },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (action: typeof actions[0]) => {
    if (action.category === 'Navigation') {
      onNavigate(action.id);
    } else if (action.category === 'Corridor' && action.segmentId) {
      onNavigate('OVERVIEW');
      onInspectCorridor?.(action.segmentId);
    } else if (action.category === 'Demo' && action.presetId) {
      onTriggerPreset?.(action.presetId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div className="fixed inset-0 bg-ink-hi/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-auto max-w-xl rounded-xl bg-surface border border-line shadow-atlas-lg overflow-hidden animate-fade-in">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-line bg-surface-sunken/40">
          <SearchIcon className="w-4 h-4 text-ink-mid mr-3" />
          <input
            type="text"
            placeholder="Type a command, corridor, or scenario... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent py-3.5 text-sm text-ink-hi placeholder-ink-lo outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-ink-lo hover:text-ink-hi"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-line/40">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-ink-mid">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleSelect(action)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-surface-sunken transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-md bg-indigo-soft text-indigo group-hover:bg-indigo group-hover:text-white transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-medium text-ink-hi">{action.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-ink-lo uppercase bg-line/60 px-1.5 py-0.5 rounded">
                    {action.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-line bg-surface-sunken text-[10px] text-ink-mid font-mono">
          <span>Navigate with arrow keys</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
