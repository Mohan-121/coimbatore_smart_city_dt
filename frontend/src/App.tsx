import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { RoadSegmentTelemetry, UrbanAlert } from '@/types/telemetry';

import { StatusTicker } from '@/components/ui/StatusTicker';
import { CommandHeader } from '@/components/layout/CommandHeader';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { SidebarNav, NavTab } from '@/components/layout/SidebarNav';
import { AlertsDrawer } from '@/components/alerts/AlertsDrawer';
import { AssistantChatDrawer } from '@/components/assistant/AssistantChatDrawer';
import { CommandPalette } from '@/components/ui/CommandPalette';

import { CommandMapPage } from '@/pages/CommandMapPage';
import { TrafficPage } from '@/pages/TrafficPage';
import { CausePage } from '@/pages/CausePage';
import { ImpactPage } from '@/pages/ImpactPage';
import { EnergyPage } from '@/pages/EnergyPage';
import { EnvironmentPage } from '@/pages/EnvironmentPage';
import { ScenariosPage } from '@/pages/ScenariosPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { ReportsPage } from '@/pages/ReportsPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('OVERVIEW');
  const [wsConnected, setWsConnected] = useState<boolean>(true);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('SEG_AVINASHI_02');

  const [cityCongestion, setCityCongestion] = useState<number>(48.2);
  const [avgSpeed, setAvgSpeed] = useState<number>(34.2);
  const [totalEnergyMw, setTotalEnergyMw] = useState<number>(1120.0);
  const [aqi, setAqi] = useState<number>(68);

  const [segments, setSegments] = useState<Record<string, RoadSegmentTelemetry>>({});
  const [bottlenecks, setBottlenecks] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<UrbanAlert[]>([]);
  const [currentRole, setCurrentRole] = useState<string>('ADMIN');

  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [activeIncident, setActiveIncident] = useState<any>(null);

  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sync latest digital twin state
  const syncTwinState = async () => {
    try {
      const [segRes, alertsRes, energyRes, envRes, bRes] = await Promise.all([
        api.getAllSegments(),
        api.getActiveAlerts(),
        api.getCurrentEnergy(),
        api.getCurrentEnvironment(),
        api.getBottlenecks(5),
      ]);

      const segMap: Record<string, RoadSegmentTelemetry> = {};
      let totalSpeed = 0;
      let totalCong = 0;

      (segRes.segments || []).forEach((s: any) => {
        segMap[s.segment_id] = s;
        totalSpeed += s.average_speed_kmh;
        totalCong += s.congestion_score;
      });

      const count = Math.max(1, segRes.segments?.length || 1);
      setSegments(segMap);
      setCityCongestion(Math.round(totalCong / count));
      setAvgSpeed(Math.round((totalSpeed / count) * 10) / 10);
      setAlerts(alertsRes.alerts || []);
      setBottlenecks(bRes.bottlenecks || []);
      setTotalEnergyMw(energyRes.total_active_power_mw || 1120);
      setAqi(envRes.aqi || 68);
      setWsConnected(true);
    } catch (err) {
      console.warn('Telemetry sync fallback:', err);
      setWsConnected(false);
    }
  };

  useEffect(() => {
    syncTwinState();
    // Poll every 3 seconds for continuous live telemetry
    const interval = setInterval(syncTwinState, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle Demo Mode Presets
  const handleTriggerPreset = async (presetId: string) => {
    try {
      const res = await api.applyDemoPreset(presetId);
      setActivePreset(presetId === 'RESET' ? null : presetId);
      if (res?.incident) {
        setActiveIncident(res.incident);
      } else if (presetId === 'RESET') {
        setActiveIncident(null);
      }
      syncTwinState();
    } catch (e) {
      console.error('Error applying demo preset:', e);
    }
  };

  const handleResetTwin = async () => {
    await handleTriggerPreset('RESET');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-paper text-ink-hi overflow-hidden font-sans select-none survey-grid-bg">
      {/* Top 32px Status Ticker (10% Dark) */}
      <StatusTicker
        avgSpeed={avgSpeed}
        cityCongestion={cityCongestion}
        totalEnergyMw={totalEnergyMw}
        aqi={aqi}
        alertCount={alerts.length}
        isSimulated={Boolean(activePreset)}
      />

      {/* Top 64px White Header */}
      <CommandHeader
        activeTab={activeTab}
        wsConnected={wsConnected}
        alertCount={alerts.length}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentRole={currentRole}
        onSelectRole={(r) => setCurrentRole(r)}
        onTriggerPreset={handleTriggerPreset}
        activePresetLabel={activePreset}
      />

      {/* Demo Scenario Active Banner (Part of 10% Dark) */}
      <DemoBanner activePreset={activePreset} onReset={handleResetTwin} />

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Collapsible Light Sidebar */}
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={(t) => setActiveTab(t)}
          lastSyncSeconds={3}
          alertCount={alerts.length}
        />

        {/* Center Main Stage View Container */}
        <main className="flex-1 overflow-hidden relative bg-paper">
          {activeTab === 'OVERVIEW' && (
            <CommandMapPage
              segments={segments}
              cityCongestion={cityCongestion}
              avgSpeed={avgSpeed}
              totalEnergyMw={totalEnergyMw}
              aqi={aqi}
              bottlenecks={bottlenecks}
              selectedSegmentId={selectedSegmentId}
              onSelectSegment={(id) => setSelectedSegmentId(id)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              activeIncident={activeIncident}
            />
          )}

          {activeTab === 'TRAFFIC' && <TrafficPage />}

          {activeTab === 'CAUSE' && <CausePage />}

          {activeTab === 'IMPACT' && <ImpactPage />}

          {activeTab === 'ENERGY' && <EnergyPage />}

          {activeTab === 'ENVIRONMENT' && <EnvironmentPage />}

          {activeTab === 'SCENARIOS' && <ScenariosPage />}

          {activeTab === 'ALERTS' && (
            <AlertsPage
              alerts={alerts}
              onAcknowledge={syncTwinState}
              onInspectOnMap={(loc) => {
                setActiveTab('OVERVIEW');
              }}
            />
          )}

          {activeTab === 'REPORTS' && <ReportsPage />}
        </main>
      </div>

      {/* Slide-out Drawers */}
      <AssistantChatDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSelectCorridor={(segId) => {
          setSelectedSegmentId(segId);
          setActiveTab('OVERVIEW');
          setIsAssistantOpen(false);
        }}
      />

      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onRefresh={syncTwinState}
        onInspectOnMap={(loc) => {
          setActiveTab('OVERVIEW');
        }}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab as NavTab)}
        onTriggerPreset={handleTriggerPreset}
        onInspectCorridor={(segId) => {
          setSelectedSegmentId(segId);
          setActiveTab('OVERVIEW');
        }}
      />
    </div>
  );
};

export default App;
