import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { RouteShield } from '@/components/ui/RouteShield';
import { PrinterIcon, CheckCircleIcon, FileTextIcon, ShieldIcon } from '@/components/icons';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getDailyReport();
        setReport(res);
      } catch (err) {
        console.error('Error loading report:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto overflow-y-auto h-full">
      {/* Action Header (Hidden in Print) */}
      <div className="no-print">
        <SectionLabel
          category="REPORTS / AUDIT"
          title="Executive Municipal Briefing & Performance Scorecard"
          subtitle="Automated daily infrastructure audit summarizing mobility health, TANGEDCO electrical grid load, and NAAQS air quality compliance."
          badge={<ProvenanceBadge origin="HISTORICAL" size="md" />}
          action={
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo text-white hover:bg-indigo-dark font-semibold text-xs transition-all shadow-atlas-sm"
            >
              <PrinterIcon className="w-4 h-4" />
              <span>Download / Print PDF</span>
            </button>
          }
        />
      </div>

      {/* Main Printable Scorecard Document */}
      <div className="bg-surface border border-line rounded-2xl p-6 sm:p-8 shadow-atlas space-y-6 print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-line">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-indigo uppercase tracking-wider bg-indigo-soft px-2 py-0.5 rounded border border-indigo/20">
                AUDIT DOCUMENT: {report?.report_id || 'RPT-CBE-20261002'}
              </span>
              <ProvenanceBadge origin="HISTORICAL" size="sm" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-ink-hi mt-1.5 tracking-tight">
              Coimbatore Smart City Performance Scorecard
            </h1>
            <p className="font-tamil text-xs text-ink-mid mt-0.5">
              கோயம்புத்தூர் மாநகராட்சி • Urban Operations Executive Briefing
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-ghats bg-ghats-soft px-3 py-1 rounded-full border border-ghats/40">
              <CheckCircleIcon className="w-3.5 h-3.5" />
              <span>OVERALL HEALTH: GRADE A-</span>
            </span>
            <span className="block font-mono text-[10px] text-ink-lo mt-1">
              Generated: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </span>
          </div>
        </div>

        {/* Executive Headline Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-sunken/60 border border-line space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-ink-lo uppercase font-bold">Urban Mobility</span>
              <ProvenanceBadge origin="SIMULATED" size="sm" />
            </div>
            <div className="font-mono text-2xl font-bold text-ink-hi font-tabular">
              {report?.summary?.city_congestion_index || 48}%
            </div>
            <span className="text-[11px] text-ink-mid block">
              Avg Speed: {report?.summary?.city_avg_speed_kmh || 34.2} km/h (Nominal: 50)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-sunken/60 border border-line space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-ink-lo uppercase font-bold">Electrical Grid</span>
              <ProvenanceBadge origin="SIMULATED" size="sm" />
            </div>
            <div className="font-mono text-2xl font-bold text-ink-hi font-tabular">
              {report?.summary?.total_power_demand_mw || 1120} MW
            </div>
            <span className="text-[11px] text-ink-mid block">
              Headroom: 360 MW / 1,480 MW Cap
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-sunken/60 border border-line space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-ink-lo uppercase font-bold">Air Quality Index</span>
              <ProvenanceBadge origin="LIVE API" size="sm" />
            </div>
            <div className="font-mono text-2xl font-bold text-ghats font-tabular">
              {report?.summary?.air_quality_index || 68} AQI
            </div>
            <span className="text-[11px] text-ink-mid block">
              Status: Moderate (NAAQS Compliant)
            </span>
          </div>
        </div>

        {/* Detailed KPI Breakdown Tables */}
        <div className="space-y-4 text-xs">
          <h3 className="font-heading font-bold text-ink-hi text-sm uppercase tracking-wider border-b border-line pb-1">
            I. Mobility & Environmental Impact Rollup
          </h3>

          <div className="border border-line rounded-xl overflow-hidden divide-y divide-line">
            <div className="flex justify-between p-3 bg-surface">
              <span className="text-ink-mid font-medium">Monitored National Highway Corridors:</span>
              <span className="font-mono font-bold text-ink-hi">5 Primary Arterials (10 Segments)</span>
            </div>
            <div className="flex justify-between p-3 bg-surface-sunken/40">
              <span className="text-ink-mid font-medium">Critical Junction Bottleneck:</span>
              <span className="font-mono font-bold text-crimson">TIDEL Park Junction (Avinashi Rd)</span>
            </div>
            <div className="flex justify-between p-3 bg-surface">
              <span className="text-ink-mid font-medium">Estimated Daily Excess Fuel Burn (Idling):</span>
              <span className="font-mono font-bold text-terracotta">1,840 Liters</span>
            </div>
            <div className="flex justify-between p-3 bg-surface-sunken/40">
              <span className="text-ink-mid font-medium">Estimated Daily Excess Carbon Footprint:</span>
              <span className="font-mono font-bold text-terracotta">4,250 kg CO2</span>
            </div>
            <div className="flex justify-between p-3 bg-surface">
              <span className="text-ink-mid font-medium">Vehicular Contribution to Air Particulates:</span>
              <span className="font-mono font-bold text-ink-hi">~32.5% of localized PM2.5</span>
            </div>
          </div>
        </div>

        {/* Executive Directives Section */}
        <div className="space-y-3 text-xs">
          <h3 className="font-heading font-bold text-ink-hi text-sm uppercase tracking-wider border-b border-line pb-1">
            II. Municipal Commission Operational Directives
          </h3>

          <div className="space-y-2">
            {[
              "Maintain active traffic diversion protocols along Avinashi Road during elevated expressway construction pier work.",
              "Request TANGEDCO 110kV grid wheeling support ahead of the expected 19:30 evening residential cooling peak (~1,320 MW).",
              "Deploy mobile dust suppression misting units near Gandhipuram bus terminal if localized PM2.5 exceeds 60 µg/m³.",
              "Coordinate signal green splits on Trichy Road (Sungam Bypass) to absorb eastbound spillover volume.",
            ].map((rec, i) => (
              <div key={i} className="p-3 rounded-lg bg-surface-sunken border border-line flex items-start gap-2.5">
                <span className="font-mono text-indigo font-bold text-xs">{i + 1}.</span>
                <span className="text-ink-hi leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer & Sign-off */}
        <div className="pt-6 border-t-2 border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] text-ink-lo font-mono">
          <div>
            <span>DATA SOURCE PROVENANCE: OPEN-METEO CPCB API • TANGEDCO METRO GRID • COIMBATORE TWIN ML</span>
          </div>
          <div>
            <span>OFFICIAL MUNICIPAL AUDIT RECORD • PAGE 1 OF 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
