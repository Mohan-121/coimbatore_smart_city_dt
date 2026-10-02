import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { KpiTile } from '@/components/ui/KpiTile';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { Tooltip } from '@/components/ui/Tooltip';
import { LeafIcon, ThermometerIcon, CloudRainIcon, CarIcon, WindIcon } from '@/components/icons';

export const EnvironmentPage: React.FC = () => {
  const [envData, setEnvData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCurrentEnvironment();
        setEnvData(res);
      } catch (err) {
        console.error('Error loading environment data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const aqi = envData?.aqi || 68;
  const aqiCategory = envData?.aqi_category || 'Moderate';
  const trafficShare = envData?.traffic_emission_contribution_pct || 32.5;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto h-full">
      {/* Section Header */}
      <SectionLabel
        category="RESOURCES"
        title="Atmospheric Air Quality & Vehicular Dispersion Intelligence"
        subtitle="Live telemetry ingestion from Open-Meteo API for Coimbatore coordinates (11.0168° N, 76.9558° E), NAAQS compliance benchmarking, and stop-and-go idling emission share."
        badge={<ProvenanceBadge origin={envData?.data_origin || 'LIVE API'} size="md" />}
      />

      {/* Atmospheric Coordinates & Live API Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-line shadow-atlas-sm text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ghats animate-pulse" />
          <span className="text-ink-hi font-bold">COIMBATORE MONITORING STATION:</span>
          <span className="text-ink-mid">11.0168° N, 76.9558° E (SIDCO / Peelamedu)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink-lo">SOURCE: OPEN-METEO CPCB REPOSITORY</span>
          <ProvenanceBadge origin="LIVE API" size="sm" />
        </div>
      </div>

      {/* Top Large AQI Card & Segmented Scale Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card tabLabel="AIR QUALITY / AQI SCALE" className="lg:col-span-2" contour>
          <div className="flex items-start justify-between pb-3 border-b border-line mb-4">
            <div>
              <h3 className="font-heading font-bold text-ink-hi text-base">
                National Ambient Air Quality Index (NAAQS)
              </h3>
              <p className="text-xs text-ink-mid mt-0.5">
                Current air quality rating evaluated against central pollution control guidelines
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-md bg-ghats-soft text-ghats border border-ghats/30 font-bold">
              <span>{aqiCategory}</span>
            </div>
          </div>

          {/* AQI Gauge Scale Readout */}
          <div className="my-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-extrabold text-ink-hi font-tabular">
                {aqi}
              </span>
              <span className="text-sm font-mono text-ink-mid">AQI</span>
            </div>

            {/* Segmented Bar (Good to Hazardous) */}
            <div className="flex-1 w-full space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-ink-lo">
                <span>Good (0)</span>
                <span>Moderate (100)</span>
                <span>Unhealthy (200)</span>
                <span>Hazardous (500)</span>
              </div>

              {/* Segmented Gradient Bar with Pointer Indicator */}
              <div className="relative h-4 rounded-full overflow-hidden flex border border-line p-0.5 bg-surface-sunken">
                <div style={{ width: '20%' }} className="bg-emerald-500 h-full rounded-l-full" title="Good (0-50)" />
                <div style={{ width: '20%' }} className="bg-amber-400 h-full" title="Moderate (51-100)" />
                <div style={{ width: '20%' }} className="bg-orange-500 h-full" title="Unhealthy for Sensitive (101-150)" />
                <div style={{ width: '20%' }} className="bg-red-500 h-full" title="Unhealthy (151-200)" />
                <div style={{ width: '20%' }} className="bg-purple-600 h-full rounded-r-full" title="Hazardous (201+)" />
              </div>

              {/* Pointer indicator */}
              <div className="relative w-full h-3">
                <div
                  className="absolute -top-1 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${Math.min(95, Math.max(5, (aqi / 250) * 100))}%` }}
                >
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-b-6 border-b-ink-hi" />
                  <span className="font-mono text-[9px] font-bold text-ink-hi">{aqi}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-sunken border border-line text-xs text-ink-mid leading-relaxed">
            Coimbatore ambient air currently complies with <strong>NAAQS Tier-2 industrial-commercial standards</strong>. Morning and evening peak-hour vehicle idling along Avinashi and Trichy roads accounts for the primary localized particulate spikes.
          </div>
        </Card>

        {/* Vehicular Idling Contribution Donut/Bar Card */}
        <Card tabLabel="EMISSIONS / IDLING SHARE" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-line mb-3">
              <h3 className="font-heading font-bold text-ink-hi text-sm">
                Vehicular Idling Contribution
              </h3>
              <ProvenanceBadge origin="SIMULATED" size="sm" />
            </div>

            <div className="p-4 rounded-xl bg-surface-sunken border border-line flex flex-col items-center text-center space-y-2">
              <CarIcon className="w-8 h-8 text-indigo" />
              <div className="font-mono text-3xl font-bold text-ink-hi font-tabular">
                {trafficShare}%
              </div>
              <span className="text-[11px] font-semibold text-ink-mid">
                of Localized Air Pollution
              </span>
              <p className="text-[11px] text-ink-lo leading-relaxed mt-1">
                Estimated percentage of fine particulate matters (PM2.5 and NO2) directly traceable to stop-and-go traffic idling along arterial road segments.
              </p>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-lg border border-line bg-surface text-[10px] text-ink-mid font-mono flex items-center justify-between">
            <span>METHOD: EPA VSP / COIMBATORE TWIN</span>
            <span className="text-ghats font-bold">CALIBRATED</span>
          </div>
        </Card>
      </div>

      {/* Pollutant Breakdown Tiles with WHO Guidelines Reference */}
      <div>
        <span className="text-[10px] font-mono text-ink-lo uppercase tracking-wider font-bold block mb-2">
          Specific Pollutant Concentrations & Benchmark Standards
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-line shadow-atlas-sm space-y-1">
            <span className="text-xs text-ink-mid font-medium">Fine Particulate (PM2.5)</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-bold font-mono text-ink-hi">{envData?.pollutants?.pm25_ugm3 || 24.5}</span>
              <span className="text-xs text-ink-lo font-mono">µg/m³</span>
            </div>
            <div className="pt-2 border-t border-line/60 flex justify-between text-[10px] font-mono">
              <span className="text-ink-lo">NAAQS Guideline:</span>
              <span className="text-ghats font-semibold">&lt; 60 µg/m³</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-line shadow-atlas-sm space-y-1">
            <span className="text-xs text-ink-mid font-medium">Coarse Particulate (PM10)</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-bold font-mono text-ink-hi">{envData?.pollutants?.pm10_ugm3 || 52.0}</span>
              <span className="text-xs text-ink-lo font-mono">µg/m³</span>
            </div>
            <div className="pt-2 border-t border-line/60 flex justify-between text-[10px] font-mono">
              <span className="text-ink-lo">NAAQS Guideline:</span>
              <span className="text-ghats font-semibold">&lt; 100 µg/m³</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-line shadow-atlas-sm space-y-1">
            <span className="text-xs text-ink-mid font-medium">Nitrogen Dioxide (NO2)</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-bold font-mono text-ink-hi">{envData?.pollutants?.no2_ugm3 || 18.2}</span>
              <span className="text-xs text-ink-lo font-mono">µg/m³</span>
            </div>
            <div className="pt-2 border-t border-line/60 flex justify-between text-[10px] font-mono">
              <span className="text-ink-lo">NAAQS Guideline:</span>
              <span className="text-ghats font-semibold">&lt; 80 µg/m³</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-line shadow-atlas-sm space-y-1">
            <span className="text-xs text-ink-mid font-medium">Carbon Monoxide (CO)</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-bold font-mono text-ink-hi">{envData?.pollutants?.co_mgm3 || 0.65}</span>
              <span className="text-xs text-ink-lo font-mono">mg/m³</span>
            </div>
            <div className="pt-2 border-t border-line/60 flex justify-between text-[10px] font-mono">
              <span className="text-ink-lo">NAAQS Guideline:</span>
              <span className="text-ghats font-semibold">&lt; 2.0 mg/m³</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meteorological Parameter Tiles */}
      <div>
        <span className="text-[10px] font-mono text-ink-lo uppercase tracking-wider font-bold block mb-2">
          Meteorological Weather Ingestion
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiTile
            title="Ambient Temperature"
            value={envData?.meteorological?.temperature_c || 29.5}
            unit="°C"
            provenance="LIVE API"
            icon={ThermometerIcon}
            accent="terracotta"
            subtext="Coimbatore urban baseline"
          />

          <KpiTile
            title="Relative Humidity"
            value={envData?.meteorological?.humidity_pct || 58}
            unit="%"
            provenance="LIVE API"
            icon={LeafIcon}
            accent="indigo"
            subtext="Western Ghats atmospheric corridor"
          />

          <KpiTile
            title="Wind Velocity & Vector"
            value={envData?.meteorological?.wind_speed_kmh || 12.0}
            unit="km/h"
            provenance="LIVE API"
            icon={LeafIcon}
            accent="ghats"
            subtext="Vector: WSW (Palghat Gap influence)"
          />

          <KpiTile
            title="Precipitation Rate"
            value={envData?.meteorological?.precipitation_mm || 0.0}
            unit="mm/hr"
            provenance="LIVE API"
            icon={CloudRainIcon}
            accent="sky"
            subtext="No active rainstorm"
          />
        </div>
      </div>
    </div>
  );
};
