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
  marketCap?: number;
}

export interface ForexRate {
  pair: string;
  rate: number;
  change: number;
  bid: number;
  ask: number;
}

export interface MacroData {
  indicator: string;
  value: number;
  unit: string;
  date: string;
  change?: number;
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

export interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  type: 'crypto' | 'stock' | 'forex';
}

interface TerminalState {
  // Crypto
  cryptoAssets: CryptoAsset[];
  selectedCrypto: string;
  cryptoOrderbook: { bids: [number, number][]; asks: [number, number][] };
  cryptoTrades: { price: number; quantity: number; time: number; isBuyer: boolean }[];
  fundingRate: number;
  openInterest: number;
  liquidationFeed: { symbol: string; side: string; quantity: number; price: number; time: number }[];

  // Stocks
  stockAssets: StockAsset[];
  selectedStock: string;
  stockNews: NewsItem[];

  // Forex
  forexRates: ForexRate[];

  // Macro
  macroData: MacroData[];

  // News
  newsItems: NewsItem[];

  // World Monitor
  earthquakes: { mag: number; place: string; time: number; lat: number; lon: number }[];
  weatherData: { city: string; temp: number; condition: string; humidity: number }[];

  // UI
  activeTab: string;
  isWsConnected: boolean;
  batterySaver: boolean;
  isLoading: boolean;

  // Actions
  setCryptoAssets: (assets: CryptoAsset[]) => void;
  setSelectedCrypto: (id: string) => void;
  setStockAssets: (assets: StockAsset[]) => void;
  setForexRates: (rates: ForexRate[]) => void;
  setMacroData: (data: MacroData[]) => void;
  setNewsItems: (news: NewsItem[]) => void;
  setActiveTab: (tab: string) => void;
  setWsConnected: (connected: boolean) => void;
  toggleBatterySaver: () => void;
  setLoading: (loading: boolean) => void;
  addTrade: (trade: any) => void;
  addLiquidation: (liq: any) => void;
  updateCryptoPrice: (symbol: string, price: number, change: number) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  cryptoAssets: [],
  selectedCrypto: 'bitcoin',
  cryptoOrderbook: { bids: [], asks: [] },
  cryptoTrades: [],
  fundingRate: 0.01,
  openInterest: 0,
  liquidationFeed: [],

  stockAssets: [],
  selectedStock: 'AAPL',
  stockNews: [],

  forexRates: [],

  macroData: [],

  newsItems: [],

  earthquakes: [],
  weatherData: [],

  activeTab: 'crypto',
  isWsConnected: false,
  batterySaver: false,
  isLoading: true,

  setCryptoAssets: (assets) => set({ cryptoAssets: assets }),
  setSelectedCrypto: (id) => set({ selectedCrypto: id }),
  setStockAssets: (assets) => set({ stockAssets: assets }),
  setForexRates: (rates) => set({ forexRates: rates }),
  setMacroData: (data) => set({ macroData: data }),
  setNewsItems: (news) => set({ newsItems: news }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setWsConnected: (connected) => set({ isWsConnected: connected }),
  toggleBatterySaver: () => set((state) => ({ batterySaver: !state.batterySaver })),
  setLoading: (loading) => set({ isLoading: loading }),

  addTrade: (trade) => set((state) => ({
    cryptoTrades: [trade, ...state.cryptoTrades].slice(0, 100)
  })),

  addLiquidation: (liq) => set((state) => ({
    liquidationFeed: [liq, ...state.liquidationFeed].slice(0, 50)
  })),

  updateCryptoPrice: (symbol, price, change) => set((state) => ({
    cryptoAssets: state.cryptoAssets.map(asset =>
      asset.symbol === symbol ? { ...asset, price, change24h: change } : asset
    )
  })),
}));
