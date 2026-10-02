import React, { useState } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { CompareSlider } from '@/components/ui/CompareSlider';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { RouteShield } from '@/components/ui/RouteShield';
import { KpiTile } from '@/components/ui/KpiTile';
import { SlidersIcon, BoltIcon, TrafficSignalIcon, LeafIcon, FuelIcon, ClockIcon, CheckCircleIcon, RefreshCwIcon } from '@/components/icons';

export const ScenariosPage: React.FC = () => {
  const [domain, setDomain] = useState<'traffic' | 'energy'>('traffic');

  // Traffic Scenario Controls
  const [trafficCorridor, setTrafficCorridor] = useState<string>('Avinashi Road');
  const [capacityReduction, setCapacityReduction] = useState<number>(50);
  const [surgeMultiplier, setSurgeMultiplier] = useState<number>(1.2);
  const [monsoonToggle, setMonsoonToggle] = useState<boolean>(false);

  // Energy Scenario Controls
  const [tempDelta, setTempDelta] = useState<number>(3.5);
  const [evCount, setEvCount] = useState<number>(5000);
  const [energyZone, setEnergyZone] = useState<string>('ZONE_METRO');

  // Execution state
  const [loading, setLoading] = useState<boolean>(false);
  const [trafficResult, setTrafficResult] = useState<any>(null);
  const [energyResult, setEnergyResult] = useState<any>(null);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);

  const handleRunScenario = async () => {
    setLoading(true);
    try {
      if (domain === 'traffic') {
        const res = await api.runTrafficScenario({
          scenario_type: monsoonToggle ? 'MONSOON_DOWNPOUR' : 'ROAD_CLOSURE',
          corridor_id: trafficCorridor,
          capacity_reduction_pct: capacityReduction,
          surge_multiplier: surgeMultiplier,
        });
        setTrafficResult(res);
      } else {
        const res = await api.runEnergyScenario({
          temp_delta_c: tempDelta,
          ev_count: evCount,
          industrial_shift_factor: 1.0,
          solar_penetration_pct: 10.0,
        });
        setEnergyResult(res);
      }
    } catch (err) {
      console.error('Error running scenario:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = () => {
    if (savedScenarios.length >= 3) return;
    const name = domain === 'traffic'
      ? `${trafficCorridor} (${capacityReduction}% cut)`
      : `Heatwave +${tempDelta}°C (${evCount} EVs)`;
    setSavedScenarios([...savedScenarios, { id: Date.now(), name, domain, timestamp: new Date().toLocaleTimeString('en-IN') }]);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto h-full">
      {/* Section Header */}
      <SectionLabel
        category="PLAN / SIMULATION"
        title="What-If Urban Scenario Lab & Equilibrium Sandbox"
        subtitle="Model infrastructure disruptions, road closures, monsoon weather, and EV grid load before execution with interactive split-view comparison."
        badge={<ProvenanceBadge origin="SIMULATED" size="md" />}
        action={
          <SegmentedControl
            options={[
              { id: 'traffic', label: 'Mobility & Traffic', icon: TrafficSignalIcon },
              { id: 'energy', label: 'Energy Grid & EVs', icon: BoltIcon },
            ]}
            value={domain}
            onChange={(d) => setDomain(d)}
          />
        }
      />

      {/* Two-Pane Workspace: Left Controls (360px), Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls Pane (360px equivalent: lg:col-span-4) */}
        <Card tabLabel="SCENARIO PARAMETERS" className="lg:col-span-4 space-y-5">
          <div className="border-b border-line pb-3">
            <h3 className="font-heading font-bold text-sm text-ink-hi">
              {domain === 'traffic' ? 'Mobility Disruption Controls' : 'Grid & Fleet Loading Controls'}
            </h3>
            <p className="text-[11px] text-ink-mid mt-0.5">
              Adjust levers to calculate network equilibrium deltas
            </p>
          </div>

          {domain === 'traffic' ? (
            /* Traffic Scenario Controls */
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-ink-hi block mb-1">Target Arterial Corridor</label>
                <select
                  value={trafficCorridor}
                  onChange={(e) => setTrafficCorridor(e.target.value)}
                  className="w-full bg-surface-sunken border border-line rounded-lg px-3 py-2 text-ink-hi outline-none focus:border-indigo"
                >
                  <option value="Avinashi Road">Avinashi Road (NH 544)</option>
                  <option value="Trichy Road">Trichy Road (NH 81)</option>
                  <option value="Sathy Road">Sathy Road (NH 948)</option>
                  <option value="Mettupalayam Road">Mettupalayam Road (NH 181)</option>
                  <option value="Pollachi Road">Pollachi Road (NH 83)</option>
                </select>
              </div>

              <Slider
                label="Flyover / Lane Capacity Restriction"
                value={capacityReduction}
                min={10}
                max={90}
                step={10}
                unit="%"
                onChange={(val) => setCapacityReduction(val)}
                helperText="Simulates expressway pier work or lane blocks"
              />

              <Slider
                label="Traffic Volume Surge Multiplier"
                value={surgeMultiplier}
                min={0.8}
                max={2.0}
                step={0.1}
                unit="x"
                onChange={(val) => setSurgeMultiplier(val)}
                helperText="Industrial shift or public festival demand"
              />

              <div className="pt-2 border-t border-line/60">
                <Toggle
                  label="Monsoon Flash Downpour"
                  checked={monsoonToggle}
                  onChange={(c) => setMonsoonToggle(c)}
                  subtext="Applies citywide 35% speed throttling and wet pavement delay"
                />
              </div>
            </div>
          ) : (
            /* Energy Scenario Controls */
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-ink-hi block mb-1">Target Substation Zone</label>
                <select
                  value={energyZone}
                  onChange={(e) => setEnergyZone(e.target.value)}
                  className="w-full bg-surface-sunken border border-line rounded-lg px-3 py-2 text-ink-hi outline-none focus:border-indigo"
                >
                  <option value="ZONE_METRO">Coimbatore Metro Central (Gandhipuram)</option>
                  <option value="ZONE_NORTH_IT">North IT (Saravanampatti)</option>
                  <option value="ZONE_EAST_IND">East Industrial (Peelamedu)</option>
                  <option value="ZONE_SOUTH_RES">South Residential (Sundarapuram)</option>
                  <option value="ZONE_KURICHI_SIDCO">Kurichi SIDCO Industrial</option>
                </select>
              </div>

              <Slider
                label="Heatwave Temperature Surge"
                value={tempDelta}
                min={1.0}
                max={8.0}
                step={0.5}
                unit="°C"
                onChange={(val) => setTempDelta(val)}
                helperText="Correlates to residential AC cooling power draw"
              />

              <Slider
                label="Fleet Commercial EV Fast Chargers"
                value={evCount}
                min={0}
                max={20000}
                step={1000}
                unit=" EVs"
                onChange={(val) => setEvCount(val)}
                helperText="Calculated at 50 kW concurrent commercial load"
              />
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={handleRunScenario}
            disabled={loading}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo text-white font-semibold text-xs hover:bg-indigo-dark disabled:opacity-50 transition-all shadow-atlas-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCwIcon className="w-4 h-4 animate-spin text-white" />
                <span>Simulating Network Equilibrium...</span>
              </>
            ) : (
              <>
                <SlidersIcon className="w-4 h-4 text-white" />
                <span>Run What-If Scenario</span>
              </>
            )}
          </button>

          {/* Saved Scenarios Strip */}
          {savedScenarios.length > 0 && (
            <div className="pt-3 border-t border-line space-y-1.5">
              <span className="text-[10px] font-mono text-ink-lo uppercase tracking-wider block">
                Saved Lab Scenarios ({savedScenarios.length}/3)
              </span>
              {savedScenarios.map((s) => (
                <div key={s.id} className="p-2 rounded bg-surface-sunken border border-line text-xs flex justify-between">
                  <span className="font-medium text-ink-hi truncate">{s.name}</span>
                  <span className="font-mono text-[10px] text-ink-lo">{s.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right Results Pane (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Baseline vs. Simulated Comparison Banner */}
          <div className="p-4 rounded-xl bg-terracotta-soft/50 border-2 border-dashed border-terracotta/60 shadow-atlas-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-terracotta text-white flex items-center justify-center shadow-sm">
                <SlidersIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-xs text-ink-hi uppercase tracking-wide">
                    Simulated Projection Active
                  </h4>
                  <ProvenanceBadge origin="SIMULATED" size="sm" />
                </div>
                <p className="text-[11px] text-ink-mid mt-0.5">
                  Clear terracotta dashed border confirms this data is model-projected and not live observation.
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveScenario}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-surface border border-line hover:bg-surface-sunken text-xs font-semibold text-ink-hi shadow-atlas-sm transition-all"
            >
              Save Scenario
            </button>
          </div>

          {/* Draggable Swipe CompareSlider Component */}
          <Card tabLabel="SPLIT VIEW / BASELINE VS SIMULATED">
            <div className="mb-3 flex items-center justify-between pb-2 border-b border-line">
              <div>
                <h3 className="font-heading font-bold text-sm text-ink-hi">
                  Swipe Divider: Baseline vs. Simulated Network State
                </h3>
                <p className="text-[11px] text-ink-mid mt-0.5">
                  Drag the center slider handle left/right to compare baseline empirical flow vs. projected shockwave
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <CompareSlider
                initialPosition={50}
                baselineLabel="EMPIRICAL BASELINE"
                simulatedLabel="WHAT-IF PROJECTION"
                baselineContent={
                  <div className="h-full w-full bg-surface-sunken p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-indigo font-bold block mb-1">
                        NOMINAL FLOW PROFILE
                      </span>
                      <h4 className="font-heading font-bold text-base text-ink-hi">
                        Average Speed: 38.4 km/h
                      </h4>
                      <p className="text-xs text-ink-mid mt-1">
                        Corridor Congestion Index: <strong>44 / 100 [MODERATE]</strong>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface border border-line text-xs text-ink-mid">
                      Nominal vehicle throughput: 2,100 veh/hr. Free-flow conditions across adjacent bypass arterials.
                    </div>
                  </div>
                }
                simulatedContent={
                  <div className="h-full w-full bg-terracotta-soft p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-terracotta font-bold block mb-1">
                        PROJECTED CONGESTION DELTA
                      </span>
                      <h4 className="font-heading font-bold text-base text-crimson">
                        Average Speed: {trafficResult?.simulated?.avg_speed_kmh || '18.2'} km/h
                      </h4>
                      <p className="text-xs text-terracotta mt-1">
                        Projected Congestion Index: <strong>{trafficResult?.simulated?.city_congestion_index || '82'} / 100 [SEVERE]</strong>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface border border-terracotta/40 text-xs text-ink-hi">
                      Estimated travel time inflation: <strong>+{trafficResult?.delta?.travel_time_inflation_pct || '110'}%</strong>. Queue spillover into upstream junctions active.
                    </div>
                  </div>
                }
              />
            </div>
          </Card>

          {/* Delta KPI Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiTile
              title="Velocity Deficit"
              value={trafficResult?.delta?.average_speed_delta_kmh || '-14.8'}
              unit="km/h"
              provenance="SIMULATED"
              icon={TrafficSignalIcon}
              accent="crimson"
              delta={{ value: '-38%', isPositive: false, label: 'speed drop' }}
            />

            <KpiTile
              title="Congestion Shift"
              value={`+${trafficResult?.delta?.congestion_index_delta || '34.0'}`}
              unit="pts"
              provenance="SIMULATED"
              icon={SlidersIcon}
              accent="terracotta"
              subtext="Elevated to HIGH/SEVERE"
            />

            <KpiTile
              title="Extra Wasted Fuel"
              value={trafficResult?.delta?.estimated_extra_fuel_liters || '162'}
              unit="Liters"
              provenance="SIMULATED"
              icon={FuelIcon}
              accent="turmeric"
              subtext="Stop-and-go vehicular idling penalty"
            />

            <KpiTile
              title="Excess Carbon"
              value={trafficResult?.delta?.estimated_excess_co2_kg || '374'}
              unit="kg CO2"
              provenance="SIMULATED"
              icon={LeafIcon}
              accent="crimson"
              subtext="EPA VSP emission projection"
            />
          </div>

          {/* Actionable Municipal Recommendation Card */}
          <Card tabLabel="RECOMMENDATION / POLICY ACTION">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-ghats-soft text-ghats flex items-center justify-center shrink-0 border border-ghats/30">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-heading font-bold text-xs text-ink-hi uppercase tracking-wider">
                  Automated Municipal Traffic Mitigation Directive:
                </span>
                <p className="text-xs text-ink-mid leading-relaxed">
                  {trafficResult?.recommendation ||
                    'Deploy dynamic VMS (Variable Message Signboards) at Hope College directing eastbound commuter traffic via Trichy Road, and extend arterial green splits by +18 seconds on Sungam Bypass.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
