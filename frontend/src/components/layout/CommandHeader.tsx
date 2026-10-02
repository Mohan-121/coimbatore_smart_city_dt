import React, { useState, useEffect, useRef } from 'react';
import {
  BellIcon,
  BotIcon,
  SearchIcon,
  ShieldIcon,
  SlidersIcon,
  ChevronDownIcon,
  RefreshCwIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '@/components/icons';

interface CommandHeaderProps {
  activeTab: string;
  wsConnected: boolean;
  alertCount: number;
  onOpenAlerts: () => void;
  onOpenAssistant: () => void;
  onOpenSearch: () => void;
  currentRole: string;
  onSelectRole: (role: string) => void;
  onTriggerPreset: (presetId: string) => void;
  activePresetLabel?: string | null;
}

export const CommandHeader: React.FC<CommandHeaderProps> = ({
  activeTab,
  wsConnected,
  alertCount,
  onOpenAlerts,
  onOpenAssistant,
  onOpenSearch,
  currentRole,
  onSelectRole,
  onTriggerPreset,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [demoMenuOpen, setDemoMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDemoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabLabels: Record<string, { plate: string; title: string }> = {
    OVERVIEW: { plate: 'CITY / COMMAND MAP', title: 'Geospatial Command Map' },
    TRAFFIC: { plate: 'MOBILITY / ARTERIALS', title: 'Traffic Intelligence' },
    CAUSE: { plate: 'MOBILITY / XAI', title: 'TreeSHAP Cause Analysis' },
    IMPACT: { plate: 'MOBILITY / SPILLOVER', title: 'Spillover & Emissions' },
    ENERGY: { plate: 'RESOURCES / GRID', title: 'TANGEDCO Energy Grid' },
    ENVIRONMENT: { plate: 'RESOURCES / AQI', title: 'Environment & Air Quality' },
    SCENARIOS: { plate: 'PLAN / SIMULATION', title: 'What-If Scenario Lab' },
    ALERTS: { plate: 'CITY / INCIDENTS', title: 'Alerts & Emergency Response' },
    REPORTS: { plate: 'REPORTS / AUDIT', title: 'Executive Municipal Briefing' },
  };

  const currentTabInfo = tabLabels[activeTab] || { plate: 'CIVIC ATLAS', title: activeTab };

  const presets = [
    { id: 'ACCIDENT_TIDEL', label: 'Simulate TIDEL Park Accident', desc: 'Critical collision on Avinashi Rd (65% capacity cut)' },
    { id: 'MONSOON_DOWNPOUR', label: 'Trigger Monsoon Rainstorm', desc: 'Flash flooding, speed throttling by 35%' },
    { id: 'HEATWAVE_SPIKE', label: 'Simulate Heatwave Spike', desc: '+4.5°C temperature rise with AC demand surge' },
    { id: 'FLYOVER_LANE_CLOSURE', label: 'Flyover Lane Closure', desc: 'Avinashi Elevated Expressway construction pier work' },
    { id: 'RESET', label: 'Reset Digital Twin to Baseline', desc: 'Restores baseline empirical equilibrium' },
  ];

  return (
    <header className="h-16 px-4 md:px-6 bg-surface border-b border-line flex items-center justify-between z-20 shrink-0 select-none shadow-atlas-sm">
      {/* Left: Breadcrumbs / Atlas Plate Title */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-indigo uppercase tracking-wider">
              {currentTabInfo.plate}
            </span>
            <span className="text-line">/</span>
            <h2 className="font-heading font-bold text-sm text-ink-hi tracking-tight hidden sm:inline">
              {currentTabInfo.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-mid">
            <span className="font-mono text-ink-lo text-[10px] font-tabular">{timeStr} IST</span>
            <span className="text-line">•</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-ghats' : 'bg-turmeric'}`} />
              <span className="text-[10px] font-mono text-ink-mid">
                {wsConnected ? 'LIVE SYNC (3s)' : 'RECONNECTING...'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Center Search / Command Palette Trigger */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={onOpenSearch}
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-sunken hover:bg-line/60 border border-line text-xs text-ink-mid hover:text-ink-hi transition-all shadow-sm w-72"
        >
          <SearchIcon className="w-3.5 h-3.5 text-ink-mid" />
          <span className="flex-1 text-left truncate">Search corridors, views, actions...</span>
          <kbd className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-line text-ink-lo">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Demo Presets, Alerts, Assistant, Persona */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          type="button"
          className="lg:hidden p-2 rounded-lg text-ink-mid hover:text-ink-hi hover:bg-surface-sunken border border-line"
          title="Search (Ctrl+K)"
        >
          <SearchIcon className="w-4 h-4" />
        </button>

        {/* Demo Mode Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDemoMenuOpen(!demoMenuOpen)}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-terracotta-soft text-terracotta border border-terracotta/30 text-xs font-semibold hover:bg-terracotta/10 transition-all shadow-sm"
          >
            <SlidersIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Demo Presets</span>
            <ChevronDownIcon className="w-3 h-3 opacity-70" />
          </button>

          {demoMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-surface rounded-xl border border-line shadow-atlas-lg p-2 z-50 animate-fade-in divide-y divide-line/40">
              <div className="px-2 py-1.5 text-[10px] font-mono text-ink-mid uppercase tracking-wider font-semibold">
                Interactive Demonstration Presets
              </div>
              <div className="py-1 space-y-1">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onTriggerPreset(preset.id);
                      setDemoMenuOpen(false);
                    }}
                    type="button"
                    className="w-full text-left p-2 rounded-lg hover:bg-surface-sunken transition-colors group flex flex-col"
                  >
                    <span className="text-xs font-semibold text-ink-hi group-hover:text-indigo">
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-ink-mid mt-0.5">
                      {preset.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          type="button"
          className="relative p-2 rounded-lg text-ink-mid hover:text-ink-hi hover:bg-surface-sunken border border-line transition-all shadow-sm"
          title="Urban Alerts"
        >
          <BellIcon className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4.5 h-4.5 rounded-full bg-crimson text-white font-mono text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
              {alertCount}
            </span>
          )}
        </button>

        {/* Grounded AI Assistant Button */}
        <button
          onClick={onOpenAssistant}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo text-white hover:bg-indigo-dark transition-all text-xs font-semibold shadow-atlas-sm"
        >
          <SparklesIcon className="w-3.5 h-3.5 text-sky-light" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* Persona Role Switcher */}
        <div className="hidden xl:flex items-center gap-1.5 bg-surface-sunken px-2.5 py-1 rounded-lg border border-line text-xs">
          <ShieldIcon className="w-3.5 h-3.5 text-indigo" />
          <select
            value={currentRole}
            onChange={(e) => onSelectRole(e.target.value)}
            className="bg-transparent text-ink-hi font-medium outline-none cursor-pointer text-xs"
          >
            <option value="ADMIN">ADMIN (Collector)</option>
            <option value="CITY_PLANNER">CITY PLANNER</option>
            <option value="TRAFFIC_POLICE">TRAFFIC POLICE</option>
            <option value="ENERGY_OPERATOR">TANGEDCO OPERATOR</option>
            <option value="EMERGENCY_RESPONSE">EMERGENCY RESPONSE</option>
          </select>
        </div>
      </div>
    </header>
  );
};
