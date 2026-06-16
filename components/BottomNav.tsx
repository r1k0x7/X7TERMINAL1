'use client';

import { useTerminalStore } from '@/lib/store';
import { 
  Bitcoin, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Newspaper, 
  Globe,
  Battery,
  BatteryCharging
} from 'lucide-react';

const tabs = [
  { id: 'crypto', label: 'Crypto', icon: Bitcoin },
  { id: 'stocks', label: 'Stocks', icon: TrendingUp },
  { id: 'forex', label: 'Forex', icon: DollarSign },
  { id: 'macro', label: 'Macro', icon: BarChart3 },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'world', label: 'World', icon: Globe },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, batterySaver, toggleBatterySaver } = useTerminalStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-terminal-panel border-t border-terminal-border z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-terminal-accent bg-terminal-accent/10' 
                  : 'text-terminal-muted hover:text-terminal-text'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={toggleBatterySaver}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            batterySaver 
              ? 'text-terminal-warning bg-terminal-warning/10' 
              : 'text-terminal-muted hover:text-terminal-text'
          }`}
        >
          {batterySaver ? <BatteryCharging className="w-5 h-5" /> : <Battery className="w-5 h-5" />}
          <span className="text-[10px] mt-1 font-medium">Save</span>
        </button>
      </div>
    </nav>
  );
      }
            
