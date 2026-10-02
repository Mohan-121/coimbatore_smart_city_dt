import React, { useState } from 'react';
import {
  RouteIcon,
  BoltIcon,
  LeafIcon,
  SlidersIcon,
  FileTextIcon,
  AlertTriangleIcon,
  TrafficSignalIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@/components/icons';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';

export type NavTab =
  | 'OVERVIEW'
  | 'TRAFFIC'
  | 'CAUSE'
  | 'IMPACT'
  | 'ENERGY'
  | 'ENVIRONMENT'
  | 'SCENARIOS'
  | 'ALERTS'
  | 'REPORTS';

interface SidebarNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lastSyncSeconds?: number;
  alertCount?: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  lastSyncSeconds = 3,
  alertCount = 0,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const sections = [
    {
      group: 'CITY',
      items: [
        { id: 'OVERVIEW' as NavTab, label: 'Command Map', icon: RouteIcon },
        { id: 'ALERTS' as NavTab, label: 'Alerts & Incidents', icon: AlertTriangleIcon, badge: alertCount },
      ],
    },
    {
      group: 'MOBILITY',
      items: [
        { id: 'TRAFFIC' as NavTab, label: 'Traffic Intelligence', icon: TrafficSignalIcon },
        { id: 'CAUSE' as NavTab, label: 'Cause Analysis (XAI)', icon: SlidersIcon },
        { id: 'IMPACT' as NavTab, label: 'Spillover & Emissions', icon: LeafIcon },
      ],
    },
    {
      group: 'RESOURCES',
      items: [
        { id: 'ENERGY' as NavTab, label: 'Energy Grid (TANGEDCO)', icon: BoltIcon },
        { id: 'ENVIRONMENT' as NavTab, label: 'Environment & AQI', icon: LeafIcon },
      ],
    },
    {
      group: 'PLAN',
      items: [
        { id: 'SCENARIOS' as NavTab, label: 'Scenario Lab', icon: SlidersIcon },
      ],
    },
    {
      group: 'REPORTS',
      items: [
        { id: 'REPORTS' as NavTab, label: 'Executive Scorecard', icon: FileTextIcon },
      ],
    },
  ];

  return (
    <aside
      className={`bg-surface border-r border-line flex flex-col justify-between transition-all duration-200 z-10 shrink-0 select-none shadow-atlas-sm ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Brand Lockup */}
      <div>
        <div className="p-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* City Grid Cartographic Logo */}
            <div className="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center text-white shrink-0 shadow-sm border border-indigo-dark">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-heading font-bold text-xs text-ink-hi uppercase tracking-wider truncate">
                  Coimbatore
                </h1>
                <p className="font-tamil text-[10px] text-ink-mid truncate leading-tight">
                  கோயம்புத்தூர் ஸ்மார்ட் சிட்டி
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            type="button"
            className="p-1 rounded text-ink-lo hover:text-ink-hi hover:bg-surface-sunken"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRightIcon className={`w-3.5 h-3.5 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Grouped Navigation Links */}
        <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
          {sections.map((section) => (
            <div key={section.group} className="space-y-1">
              {!collapsed && (
                <span className="block px-2.5 text-[9px] font-mono font-bold uppercase tracking-wider text-ink-lo mb-1">
                  {section.group}
                </span>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    type="button"
                    title={item.label}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all relative ${
                      isActive
                        ? 'bg-indigo-soft text-indigo font-semibold border-l-3 border-indigo shadow-sm'
                        : 'text-ink-mid hover:text-ink-hi hover:bg-surface-sunken'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo' : 'text-ink-mid'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold bg-crimson-soft text-crimson border border-crimson/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Data Freshness & Provenance Legend */}
      {!collapsed && (
        <div className="p-3 border-t border-line bg-surface-sunken/40 space-y-2 text-[10px]">
          <div className="flex items-center justify-between text-ink-mid font-mono">
            <span>DATA FRESHNESS</span>
            <span className="text-ghats font-bold font-tabular">Sync {lastSyncSeconds}s ago</span>
          </div>

          <div className="space-y-1 pt-1 border-t border-line/60">
            <div className="flex items-center justify-between text-ink-lo">
              <span className="font-mono text-[9px]">PROVENANCE SEALS</span>
            </div>
            <div className="flex flex-col gap-1 text-[9px]">
              <div className="flex items-center gap-1.5">
                <ProvenanceBadge origin="LIVE API" size="sm" />
                <span className="text-ink-mid truncate">Live Sensor / API</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ProvenanceBadge origin="HISTORICAL" size="sm" />
                <span className="text-ink-mid truncate">Empirical Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ProvenanceBadge origin="SIMULATED" size="sm" />
                <span className="text-ink-mid truncate">ML / Simulation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
