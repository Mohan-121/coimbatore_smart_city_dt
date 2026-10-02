import React, { useState } from 'react';
import { UrbanAlert } from '@/types/telemetry';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SeverityBadge, AlertSeverity } from '@/components/ui/SeverityBadge';
import { RouteShield } from '@/components/ui/RouteShield';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { AlertTriangleIcon, CheckCircleIcon, RouteIcon, ClockIcon } from '@/components/icons';

interface AlertsPageProps {
  alerts: UrbanAlert[];
  onAcknowledge?: (alertId: string) => void;
  onInspectOnMap?: (location: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onAcknowledge,
  onInspectOnMap,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(
    alerts.length > 0 ? alerts[0].alert_id : null
  );

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'ALL' || a.severity === filterSeverity
  );

  const selectedAlert = alerts.find((a) => a.alert_id === selectedAlertId) || filteredAlerts[0];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto h-full">
      {/* Section Header */}
      <SectionLabel
        category="CITY / INCIDENTS"
        title="Urban Anomaly Detection & Emergency Incident Management"
        subtitle="Continuous multi-domain telemetry evaluation detecting critical corridor congestion, electrical grid overloads, and atmospheric pollution anomalies."
        badge={<ProvenanceBadge origin="LIVE API" size="md" />}
      />

      {/* Severity Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        {['ALL', 'CRITICAL', 'SEVERE', 'WARNING', 'INFO'].map((sev) => {
          const count = sev === 'ALL' ? alerts.length : alerts.filter((a) => a.severity === sev).length;
          return (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              type="button"
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                filterSeverity === sev
                  ? 'bg-indigo text-white font-bold shadow-atlas-sm'
                  : 'bg-surface border border-line text-ink-mid hover:text-ink-hi shadow-sm'
              }`}
            >
              {sev} ({count})
            </button>
          );
        })}
      </div>

      {/* Two-Pane Layout: Left Timeline List, Right Incident Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Incident Timeline List (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredAlerts.length === 0 ? (
            <EmptyState
              title="Zero Unresolved Anomalies"
              description="All monitored road networks, electrical substations, and air quality stations are currently within safety limits."
              icon={CheckCircleIcon}
            />
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.alert_id === alert.alert_id;
              return (
                <div
                  key={alert.alert_id}
                  onClick={() => setSelectedAlertId(alert.alert_id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-atlas-sm space-y-2 ${
                    isSelected
                      ? 'bg-surface border-indigo ring-2 ring-indigo/20 shadow-md'
                      : 'bg-surface border-line hover:border-ink-lo'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <SeverityBadge severity={alert.severity} size="sm" />
                    <span className="font-mono text-[10px] text-ink-lo">
                      {new Date(alert.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                    </span>
                  </div>

                  <h4 className="font-heading font-semibold text-xs text-ink-hi line-clamp-1">
                    {alert.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-line/50">
                    <RouteShield corridor={alert.location_label} size="sm" />
                    <span className="text-indigo font-semibold hover:underline">View diagnostics &rarr;</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Diagnostic & Action Pane (lg:col-span-7) */}
        <div className="lg:col-span-7">
          {selectedAlert ? (
            <Card tabLabel={`ALERT / ${selectedAlert.severity}`} className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-line">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge severity={selectedAlert.severity} size="md" />
                    <ProvenanceBadge origin="LIVE API" size="sm" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-ink-hi">
                    {selectedAlert.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <RouteShield corridor={selectedAlert.location_label} size="md" />
                  </div>
                </div>

                <button
                  onClick={() => onAcknowledge?.(selectedAlert.alert_id)}
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-surface border border-line hover:bg-surface-sunken text-xs font-semibold text-ink-hi shadow-atlas-sm"
                >
                  Acknowledge Alert
                </button>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-surface-sunken border border-line text-xs text-ink-hi leading-relaxed">
                <p className="font-medium">{selectedAlert.description}</p>
              </div>

              {/* Diagnosis Details Grid */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-surface border border-line space-y-1">
                  <span className="font-mono text-[10px] text-ink-lo uppercase font-bold block">
                    Likely Root Cause Analysis:
                  </span>
                  <p className="text-ink-hi">{selectedAlert.cause_summary}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-terracotta-soft border border-terracotta/40 space-y-1">
                  <span className="font-mono text-[10px] text-terracotta uppercase font-bold block">
                    Projected Downstream Impact:
                  </span>
                  <p className="text-ink-hi font-medium">{selectedAlert.predicted_impact}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-ghats-soft border border-ghats/40 space-y-1">
                  <span className="font-mono text-[10px] text-ghats uppercase font-bold block">
                    Standard Operating Procedure Directive:
                  </span>
                  <p className="text-ink-hi font-semibold">{selectedAlert.recommended_action}</p>
                </div>
              </div>

              {/* Map Inspection Action */}
              <div className="pt-3 border-t border-line flex justify-end">
                <button
                  onClick={() => onInspectOnMap?.(selectedAlert.location_label)}
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo text-white font-semibold text-xs hover:bg-indigo-dark transition-all shadow-atlas-sm"
                >
                  <RouteIcon className="w-3.5 h-3.5" />
                  <span>Inspect on Command Map</span>
                </button>
              </div>
            </Card>
          ) : (
            <Card tabLabel="ALERT / NONE SELECTED">
              <EmptyState
                title="Select an Alert"
                description="Choose any alert from the timeline list to review root cause attributions, downstream impacts, and municipal directives."
                icon={AlertTriangleIcon}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
