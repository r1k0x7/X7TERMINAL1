'use client';

import { useTerminalStore } from '@/lib/store';
import { DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/api';

export default function ForexPanel() {
  const { forexRates } = useTerminalStore();

  return (
    <div className="space-y-4">
      <div className="terminal-panel p-4">
        <h2 className="terminal-title flex items-center gap-2"><DollarSign className="w-4 h-4" />Forex Rates (USD Base)</h2>
      </div>
      <div className="grid gap-3">
        {forexRates.map((rate) => (
          <div key={rate.pair} className="terminal-panel p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 rounded bg-terminal-border flex items-center justify-center text-xs font-bold">{rate.pair}</div>
                <div>
                  <div className="font-semibold">{rate.pair.slice(0, 3)}/{rate.pair.slice(3)}</div>
                  <div className="text-xs text-terminal-muted">Spot Rate</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xl font-bold">{formatPrice(rate.rate)}</div>
                <div className="flex items-center justify-end gap-4 mt-1 text-xs">
                  <span className="text-terminal-accent">Bid: {formatPrice(rate.bid)}</span>
                  <span className="text-terminal-danger">Ask: {formatPrice(rate.ask)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="terminal-panel p-4">
        <h3 className="terminal-title mb-3">Cross Rates Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-terminal-muted border-b border-terminal-border">
                <th className="text-left p-2">Pair</th><th className="text-right p-2">Rate</th><th className="text-right p-2">1D</th><th className="text-right p-2">1W</th><th className="text-right p-2">1M</th>
              </tr>
            </thead>
            <tbody>
              {forexRates.map((rate) => (
                <tr key={rate.pair} className="border-b border-terminal-border/50">
                  <td className="p-2 font-mono font-semibold">{rate.pair}</td>
                  <td className="p-2 text-right font-mono">{formatPrice(rate.rate)}</td>
                  <td className="p-2 text-right"><span className={rate.change >= 0 ? 'text-terminal-accent' : 'text-terminal-danger'}>{rate.change >= 0 ? '+' : ''}{rate.change.toFixed(2)}%</span></td>
                  <td className="p-2 text-right text-terminal-muted">-</td>
                  <td className="p-2 text-right text-terminal-muted">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
