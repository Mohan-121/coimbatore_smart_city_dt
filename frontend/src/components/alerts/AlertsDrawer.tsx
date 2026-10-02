import React, { useState } from 'react';
import { UrbanAlert } from '@/types/telemetry';
import { api } from '@/services/api';
import { Drawer } from '@/components/ui/Drawer';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { RouteShield } from '@/components/ui/RouteShield';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { CheckCircleIcon, AlertTriangleIcon, RouteIcon } from '@/components/icons';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: UrbanAlert[];
  onRefresh: () => void;
  onInspectOnMap?: (location: string) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onRefresh,
  onInspectOnMap,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const handleAcknowledge = async (alertId: string) => {
    try {
      await api.acknowledgeAlert(alertId);
      onRefresh();
    } catch (e) {
      console.error('Error acknowledging alert:', e);
    }
  };

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'ALL' || a.severity === filterSeverity
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Urban Anomaly Alerts"
      subtitle={`${alerts.length} active conditions detected across city infrastructure`}
      width="w-full sm:w-[480px]"
    >
      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['ALL', 'CRITICAL', 'SEVERE', 'WARNING', 'INFO'].map((sev) => {
          const count = sev === 'ALL' ? alerts.length : alerts.filter((a) => a.severity === sev).length;
          return (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              type="button"
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                filterSeverity === sev
                  ? 'bg-indigo text-white font-bold shadow-sm'
                  : 'bg-surface-sunken text-ink-mid hover:text-ink-hi border border-line'
              }`}
            >
              {sev} ({count})
            </button>
          );
        })}
      </div>

      {/* Alert List */}
      <div className="space-y-3 mt-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center border border-dashed border-line rounded-xl bg-surface-sunken/40">
            <CheckCircleIcon className="w-8 h-8 text-ghats mb-2" />
            <h4 className="font-heading font-semibold text-ink-hi text-sm">Nominal Urban Stability</h4>
            <p className="text-xs text-ink-mid max-w-xs mt-1">
              No unresolved alerts matching this severity category. All monitored networks are operating within thresholds.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.alert_id}
              className="p-4 rounded-xl bg-surface border border-line shadow-atlas-sm space-y-3"
            >
              {/* Header with Severity, Timestamp, and Route Shield */}
              <div className="flex items-start justify-between gap-2">
                <SeverityBadge severity={alert.severity} size="sm" />
                <div className="flex items-center gap-2">
                  <ProvenanceBadge origin="LIVE API" size="sm" />
                  <span className="font-mono text-[10px] text-ink-lo">
                    {new Date(alert.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                  </span>
                </div>
              </div>

              {/* Title & Corridor */}
              <div>
                <h4 className="font-heading font-bold text-ink-hi text-xs">
                  {alert.title}
                </h4>
                <div className="mt-1.5 flex items-center gap-2">
                  <RouteShield corridor={alert.location_label} size="sm" />
                </div>
              </div>

              <p className="text-ink-mid text-xs leading-relaxed">
                {alert.description}
              </p>

              {/* Diagnostics Box */}
              <div className="p-3 rounded-lg bg-surface-sunken border border-line/60 space-y-1.5 text-[11px]">
                <div>
                  <span className="text-ink-lo uppercase font-mono text-[9px] block">Likely Cause:</span>
                  <span className="text-ink-hi font-medium">{alert.cause_summary}</span>
                </div>
                <div>
                  <span className="text-ink-lo uppercase font-mono text-[9px] block">Predicted Impact:</span>
                  <span className="text-terracotta font-medium">{alert.predicted_impact}</span>
                </div>
                <div>
                  <span className="text-ink-lo uppercase font-mono text-[9px] block">Recommended Action:</span>
                  <span className="text-ghats font-medium">{alert.recommended_action}</span>
                </div>
              </div>

              {/* Actions: Inspect on map, Acknowledge */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    onInspectOnMap?.(alert.location_label);
                    onClose();
                  }}
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-indigo font-semibold hover:underline"
                >
                  <RouteIcon className="w-3.5 h-3.5" />
                  <span>Inspect on map</span>
                </button>

                <button
                  onClick={() => handleAcknowledge(alert.alert_id)}
                  type="button"
                  className="px-2.5 py-1 rounded bg-surface border border-line hover:bg-surface-sunken text-xs font-mono text-ink-mid hover:text-ink-hi transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
};
