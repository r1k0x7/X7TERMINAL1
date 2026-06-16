'use client';

import { Activity } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-terminal-bg flex flex-col items-center justify-center z-50">
      <div className="relative">
        <Activity className="w-16 h-16 text-terminal-accent animate-pulse" />
        <div className="absolute inset-0 w-16 h-16 bg-terminal-accent/20 rounded-full animate-ping" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-terminal-text tracking-wider">X7 TERMINAL</h1>
      <p className="mt-2 text-sm text-terminal-muted">Initializing market data...</p>
      <div className="mt-4 w-48 h-1 bg-terminal-border rounded-full overflow-hidden">
        <div className="h-full bg-terminal-accent animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  );
}
