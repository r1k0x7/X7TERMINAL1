'use client';

import { useEffect, useRef } from 'react';
import { useTerminalStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { formatPrice, formatPercentage } from '@/lib/api';

export default function TickerBar() {
  const { cryptoAssets, stockAssets, forexRates, isWsConnected } = useTerminalStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;

    const animate = () => {
      scrollPos += 0.5;
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const allTickers = [
    ...cryptoAssets.slice(0, 10).map(c => ({
      symbol: c.symbol,
      price: c.price,
      change: c.change24h,
      type: 'crypto' as const,
    })),
    ...stockAssets.slice(0, 5).map(s => ({
      symbol: s.symbol,
      price: s.price,
      change: s.changePercent,
      type: 'stock' as const,
    })),
    ...forexRates.slice(0, 5).map(f => ({
      symbol: f.pair,
      price: f.rate,
      change: 0,
      type: 'forex' as const,
    })),
  ];

  return (
    <div className="bg-terminal-panel border-b border-terminal-border h-10 flex items-center overflow-hidden">
      <div className="flex items-center px-3 border-r border-terminal-border shrink-0">
        {isWsConnected ? (
          <Wifi className="w-4 h-4 text-terminal-accent" />
        ) : (
          <WifiOff className="w-4 h-4 text-terminal-danger" />
        )}
        <span className="ml-2 text-xs font-mono text-terminal-accent">X7</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-hidden whitespace-nowrap">
        <div className="inline-flex items-center space-x-6 px-4">
          {[...allTickers, ...allTickers].map((ticker, i) => (
            <div key={`${ticker.symbol}-${i}`} className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold text-terminal-text">
                {ticker.symbol}
              </span>
              <span className="text-xs font-mono text-terminal-muted">
                {formatPrice(ticker.price)}
              </span>
              <span className={`flex items-center text-xs ${ticker.change >= 0 ? 'text-terminal-accent' : 'text-terminal-danger'}`}>
                {ticker.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatPercentage(ticker.change)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
