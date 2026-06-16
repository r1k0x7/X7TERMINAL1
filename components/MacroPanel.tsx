'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { fetchFREDData, formatNumber } from '@/lib/api';

const FRED_SERIES = [
  { id: 'CPIAUCSL', name: 'CPI (Consumer Price Index)', unit: 'Index' },
  { id: 'GDP', name: 'GDP', unit: 'Billion USD' },
  { id: 'UNRATE', name: 'Unemployment Rate', unit: '%' },
  { id: 'FEDFUNDS', name: 'Fed Funds Rate', unit: '%' },
  { id: 'M2SL', name: 'M2 Money Supply', unit: 'Billion USD' },
  { id: 'PPIACO', name: 'PPI (Producer Price Index)', unit: 'Index' },
  { id: 'DTB3', name: '3-Month Treasury', unit: '%' },
  { id: 'DGS10', name: '10-Year Treasury', unit: '%' },
];

export default function MacroPanel() {
  const [macroData, setMacroData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results = await Promise.all(
        FRED_SERIES.map(async (series) => {
          const data = await fetchFREDData(series.id);
          const latest = data?.observations?.[0];
          const previous = data?.observations?.[1];
          const change = latest && previous 
            ? ((parseFloat(latest.value) - parseFloat(previous.value)) / parseFloat(previous.value)) * 100 
            : 0;

          return {
            ...series,
            value: latest ? parseFloat(latest.value) : 0,
            date: latest?.date || '',
            change,
          };
        })
      );
      setMacroData(results);
      setLoading(false);
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="terminal-panel p-8 text-center">
        <div className="animate-pulse text-terminal-muted">Loading macro data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="terminal-panel p-4">
        <h2 className="terminal-title flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Economic Indicators
        </h2>
      </div>

      <div className="grid gap-3">
        {macroData.map((item) => (
          <div key={item.id} className="terminal-panel p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-terminal-muted" />
                  <span className="text-xs text-terminal-muted">{item.date}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xl font-bold">
                  {item.unit === '%' ? `${item.value.toFixed(2)}%` : formatNumber(item.value)}
                </div>
                <div className={`flex items-center justify-end text-sm ${item.change >= 0 ? 'text-terminal-accent' : 'text-terminal-danger'}`}>
                  {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
