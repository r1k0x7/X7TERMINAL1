import { create } from 'zustand';

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
}

export interface StockAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface ForexRate {
  pair: string;
  rate: number;
  change: number;
  bid: number;
  ask: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  url?: string;
}

interface TerminalState {
  cryptoAssets: CryptoAsset[];
  selectedCrypto: string;
  cryptoTrades: { price: number; quantity: number; time: number; isBuyer: boolean }[];
  stockAssets: StockAsset[];
  selectedStock: string;
  forexRates: ForexRate[];
  newsItems: NewsItem[];
  activeTab: string;
  isWsConnected: boolean;
  batterySaver: boolean;
  isLoading: boolean;
  setCryptoAssets: (assets: CryptoAsset[]) => void;
  setSelectedCrypto: (id: string) => void;
  setStockAssets: (assets: StockAsset[]) => void;
  setForexRates: (rates: ForexRate[]) => void;
  setNewsItems: (news: NewsItem[]) => void;
  setActiveTab: (tab: string) => void;
  setWsConnected: (connected: boolean) => void;
  toggleBatterySaver: () => void;
  setLoading: (loading: boolean) => void;
  addTrade: (trade: { price: number; quantity: number; time: number; isBuyer: boolean }) => void;
  updateCryptoPrice: (symbol: string, price: number, change: number) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  cryptoAssets: [],
  selectedCrypto: 'bitcoin',
  cryptoTrades: [],
  stockAssets: [],
  selectedStock: 'AAPL',
  forexRates: [],
  newsItems: [],
  activeTab: 'crypto',
  isWsConnected: false,
  batterySaver: false,
  isLoading: true,
  setCryptoAssets: (assets) => set({ cryptoAssets: assets }),
  setSelectedCrypto: (id) => set({ selectedCrypto: id }),
  setStockAssets: (assets) => set({ stockAssets: assets }),
  setForexRates: (rates) => set({ forexRates: rates }),
  setNewsItems: (news) => set({ newsItems: news }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setWsConnected: (connected) => set({ isWsConnected: connected }),
  toggleBatterySaver: () => set((state) => ({ batterySaver: !state.batterySaver })),
  setLoading: (loading) => set({ isLoading: loading }),
  addTrade: (trade) => set((state) => ({
    cryptoTrades: [trade, ...state.cryptoTrades].slice(0, 100)
  })),
  updateCryptoPrice: (symbol, price, change) => set((state) => ({
    cryptoAssets: state.cryptoAssets.map(asset =>
      asset.symbol === symbol ? { ...asset, price, change24h: change } : asset
    )
  })),
}));
