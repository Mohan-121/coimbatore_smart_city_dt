import React, { useState } from 'react';
import { api } from '@/services/api';
import { AlertCircle, CloudRain, Flame, Construction, RotateCcw, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

interface DemoControlBarProps {
  onEventTriggered: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({ onEventTriggered }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('RESET');
  const [loading, setLoading] = useState<boolean>(false);

  const triggerPreset = async (presetId: string) => {
    setLoading(true);
    setActivePreset(presetId);
    try {
      await api.applyDemoPreset(presetId);
      onEventTriggered();
    } catch (err) {
      console.error('Failed to trigger demo preset:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-300">
      <div className="glass-panel border border-slate-700/80 rounded-2xl shadow-2xl p-2 flex items-center gap-2 backdrop-blur-xl bg-slate-900/90">
        <div className="flex items-center gap-2 pl-2 pr-1 border-r border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Demo Mode
          </span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-white"
            title={collapsed ? 'Expand Demo Bar' : 'Collapse Demo Bar'}
          >
            {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!collapsed && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => triggerPreset('ACCIDENT_TIDEL')}
              disabled={loading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                activePreset === 'ACCIDENT_TIDEL'
                  ? 'bg-rose-500 text-white border border-rose-400'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Simulate TIDEL Accident</span>
            </button>

            <button
              onClick={() => triggerPreset('MONSOON_DOWNPOUR')}
              disabled={loading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                activePreset === 'MONSOON_DOWNPOUR'
                  ? 'bg-sky-500 text-white border border-sky-400'
                  : 'bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Monsoon Rainstorm</span>
            </button>

            <button
              onClick={() => triggerPreset('HEATWAVE_SPIKE')}
              disabled={loading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                activePreset === 'HEATWAVE_SPIKE'
                  ? 'bg-amber-500 text-white border border-amber-400'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Heatwave Grid Spike</span>
            </button>

            <button
              onClick={() => triggerPreset('FLYOVER_LANE_CLOSURE')}
              disabled={loading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                activePreset === 'FLYOVER_LANE_CLOSURE'
                  ? 'bg-indigo-500 text-white border border-indigo-400'
                  : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20'
              }`}
            >
              <Construction className="w-3.5 h-3.5" />
              <span>Flyover Construction</span>
            </button>

            <button
              onClick={() => triggerPreset('RESET')}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 flex items-center gap-1.5 transition-all shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
