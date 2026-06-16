'use client';

import { useTerminalStore } from '@/lib/store';
import { ArrowUpRight, ArrowDownRight, Building2, Newspaper } from 'lucide-react';
import { formatPrice, formatPercentage, formatNumber } from '@/lib/api';

export default function StockPanel() {
  const { stockAssets, newsItems } = useTerminalStore();

  return (
    <div className="space-y-4">
      <div className="terminal-panel p-4">
        <h2 className="terminal-title flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Global Stocks
        </h2>
      </div>

      <div className="grid gap-3">
        {stockAssets.map((stock) => (
          <div key={stock.symbol} className="terminal-panel p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-terminal-text">{stock.symbol}</div>
                <div className="text-xs text-terminal-muted">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-semibold">${formatPrice(stock.price)}</div>
                <div className={`flex items-center justify-end text-sm ${stock.change >= 0 ? 'text-terminal-accent' : 'text-terminal-danger'}`}>
                  {stock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {formatPercentage(stock.changePercent)}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-terminal-muted">
              Volume: {formatNumber(stock.volume || 0)}
            </div>
          </div>
        ))}
      </div>

      {/* Stock News */}
      <div className="terminal-panel p-4">
        <h3 className="terminal-title flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4" />
          Market News
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {newsItems.slice(0, 10).map((news) => (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg bg-terminal-bg hover:bg-terminal-border transition-colors"
            >
              <p className="text-sm font-medium text-terminal-text line-clamp-2">{news.title}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-terminal-muted">
                <span>{news.source}</span>
                <span>•</span>
                <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
