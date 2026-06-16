'use client';

import { useState } from 'react';
import { useTerminalStore } from '@/lib/store';
import { useCryptoWebSocket, useOrderBook, useFundingRate } from '@/lib/hooks';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  BookOpen, 
  Zap,
  BarChart3
} from 'lucide-react';
import { formatPrice, formatNumber, formatPercentage, formatTimeAgo } from '@/lib/api';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const TOP_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'DOTUSDT'];

export default function CryptoPanel() {
  const { cryptoAssets, selectedCrypto, setSelectedCrypto } = useTerminalStore();
  const [view, setView] = useState<'market' | 'detail'>('market');

  useCryptoWebSocket(TOP_SYMBOLS);

  const selectedAsset = cryptoAssets.find(a => a.id === selectedCrypto);
  const symbol = selectedAsset ? `${selectedAsset.symbol}USDT` : 'BTCUSDT';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="terminal-panel p-4">
        <div className="flex items-center justify-between">
          <h2 className="terminal-title flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Crypto Markets
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setView('market')}
              className={`px-3 py-1 text-xs rounded ${view === 'market' ? 'bg-terminal-accent text-black' : 'bg-terminal-border'}`}
            >
              Market
            </button>
            <button
              onClick={() => setView('detail')}
              className={`px-3 py-1 text-xs rounded ${view === 'detail' ? 'bg-terminal-accent text-black' : 'bg-terminal-border'}`}
            >
              Detail
            </button>
          </div>
        </div>
      </div>

      {view === 'market' ? (
        <CryptoMarketView assets={cryptoAssets} onSelect={(id) => {
          setSelectedCrypto(id);
          setView('detail');
        }} />
      ) : (
        <CryptoDetailView symbol={symbol} asset={selectedAsset} onBack={() => setView('market')} />
      )}
    </div>
  );
}

function CryptoMarketView({ assets, onSelect }: { assets: any[], onSelect: (id: string) => void }) {
  return (
    <div className="grid gap-3">
      {assets.map((asset) => (
        <button
          key={asset.id}
          onClick={() => onSelect(asset.id)}
          className="terminal-panel p-4 text-left hover:border-terminal-accent transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-terminal-border flex items-center justify-center text-lg font-bold">
                {asset.symbol[0]}
              </div>
              <div>
                <div className="font-semibold text-terminal-text">{asset.name}</div>
                <div className="text-xs text-terminal-muted">{asset.symbol}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-lg font-semibold">${formatPrice(asset.price)}</div>
              <div className={`flex items-center justify-end text-sm ${asset.change24h >= 0 ? 'text-terminal-accent' : 'text-terminal-danger'}`}>
                {asset.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {formatPercentage(asset.change24h)}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-terminal-muted">
            <span>Vol: ${formatNumber(asset.volume24h)}</span>
            <span>MCap: ${formatNumber(asset.marketCap)}</span>
          </div>

          {asset.sparkline && asset.sparkline.length > 0 && (
            <div className="mt-2 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={asset.sparkline.map((p: number, i: number) => ({ value: p, index: i }))}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={asset.change24h >= 0 ? '#00ff88' : '#ff4757'} 
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

function CryptoDetailView({ symbol, asset, onBack }: { symbol: string, asset: any, onBack: () => void }) {
  const orderBook = useOrderBook(symbol);
  const { cryptoTrades } = useTerminalStore();
  const funding = useFundingRate(symbol);

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-terminal-accent text-sm hover:underline">
        ← Back to Market
      </button>

      {asset && (
        <div className="terminal-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{asset.name} ({asset.symbol})</h3>
              <p className="text-3xl font-mono font-bold">${formatPrice(asset.price)}</p>
            </div>
            <div className={`text-right ${asset.change24h >= 0 ? 'text-terminal-accent' : 'text-terminal-danger'}`}>
              <p className="text-2xl font-mono">{formatPercentage(asset.change24h)}</p>
              <p className="text-sm text-terminal-muted">24h Change</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Book */}
      <div className="terminal-panel p-4">
        <h3 className="terminal-title flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4" />
          Order Book
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-terminal-accent mb-2">BIDS</p>
            {orderBook.bids.map(([price, qty]: [number, number], i: number) => (
              <div key={i} className="flex justify-between text-xs font-mono">
                <span className="text-terminal-accent">{formatPrice(price)}</span>
                <span className="text-terminal-muted">{qty.toFixed(4)}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-terminal-danger mb-2">ASKS</p>
            {orderBook.asks.map(([price, qty]: [number, number], i: number) => (
              <div key={i} className="flex justify-between text-xs font-mono">
                <span className="text-terminal-danger">{formatPrice(price)}</span>
                <span className="text-terminal-muted">{qty.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="terminal-panel p-4">
        <h3 className="terminal-title flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4" />
          Recent Trades
        </h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {cryptoTrades.slice(0, 20).map((trade, i) => (
            <div key={i} className="flex justify-between text-xs font-mono">
              <span className={trade.isBuyer ? 'text-terminal-accent' : 'text-terminal-danger'}>
                {trade.isBuyer ? 'BUY' : 'SELL'}
              </span>
              <span>{formatPrice(trade.price)}</span>
              <span className="text-terminal-muted">{trade.quantity.toFixed(4)}</span>
              <span className="text-terminal-muted">{formatTimeAgo(trade.time)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Funding Rate */}
      {funding && (
        <div className="terminal-panel p-4">
          <h3 className="terminal-title flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4" />
            Funding Rate
          </h3>
          <p className="font-mono text-lg">{(parseFloat(funding.fundingRate) * 100).toFixed(4)}%</p>
          <p className="text-xs text-terminal-muted">Next Funding: {new Date(funding.fundingTime).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
