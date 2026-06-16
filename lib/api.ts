// ==========================================
// FREE API CONFIGURATION - X7 Terminal
// ==========================================

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BINANCE_API = 'https://api.binance.com/api/v3';
const BINANCE_FAPI = 'https://fapi.binance.com/fapi/v1';
const BINANCE_WS = 'wss://stream.binance.com:9443/ws';
const BINANCE_FWS = 'wss://fstream.binance.com/ws';
const FINNHUB_API = 'https://finnhub.io/api/v1';
const FINNHUB_KEY = process.env.NEXT_PUBLIC_FINNHUB_KEY || '';
const FMP_API = 'https://financialmodelingprep.com/api/v3';
const FMP_KEY = process.env.NEXT_PUBLIC_FMP_KEY || '';
const FRANKFURTER_API = 'https://api.frankfurter.app';
const FRED_API = 'https://api.stlouisfed.org/fred';
const FRED_KEY = process.env.NEXT_PUBLIC_FRED_KEY || '';
const WB_API = 'https://api.worldbank.org/v2';
const NEWS_API = 'https://newsapi.org/v2';
const NEWS_KEY = process.env.NEXT_PUBLIC_NEWS_KEY || '';
const USGS_API = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0';
const OWM_API = 'https://api.openweathermap.org/data/2.5';
const OWM_KEY = process.env.NEXT_PUBLIC_OWM_KEY || '';

// ==========================================
// CRYPTO APIs
// ==========================================

export async function fetchCryptoMarkets(page = 1, perPage = 50) {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`,
      { next: { revalidate: 30 } }
    );
    if (!response.ok) throw new Error('Failed to fetch crypto markets');
    return await response.json();
  } catch (error) {
    console.error('Crypto markets error:', error);
    return [];
  }
}

export async function fetchCryptoDetails(id: string) {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) throw new Error('Failed to fetch crypto details');
    return await response.json();
  } catch (error) {
    console.error('Crypto details error:', error);
    return null;
  }
}

export async function fetchBinanceTicker(symbol: string) {
  try {
    const response = await fetch(`${BINANCE_API}/ticker/24hr?symbol=${symbol}`, {
      next: { revalidate: 10 }
    });
    if (!response.ok) throw new Error('Failed to fetch Binance ticker');
    return await response.json();
  } catch (error) {
    console.error('Binance ticker error:', error);
    return null;
  }
}

export async function fetchBinanceOrderBook(symbol: string, limit = 20) {
  try {
    const response = await fetch(`${BINANCE_API}/depth?symbol=${symbol}&limit=${limit}`, {
      next: { revalidate: 5 }
    });
    if (!response.ok) throw new Error('Failed to fetch order book');
    return await response.json();
  } catch (error) {
    console.error('Order book error:', error);
    return { bids: [], asks: [] };
  }
}

export async function fetchFundingRate(symbol: string) {
  try {
    const response = await fetch(`${BINANCE_FAPI}/fundingRate?symbol=${symbol}&limit=1`, {
      next: { revalidate: 60 }
    });
    if (!response.ok) throw new Error('Failed to fetch funding rate');
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Funding rate error:', error);
    return null;
  }
}

export async function fetchOpenInterest(symbol: string) {
  try {
    const response = await fetch(`${BINANCE_FAPI}/openInterest?symbol=${symbol}`, {
      next: { revalidate: 30 }
    });
    if (!response.ok) throw new Error('Failed to fetch open interest');
    return await response.json();
  } catch (error) {
    console.error('Open interest error:', error);
    return null;
  }
}

export async function fetchLiquidations(symbol: string) {
  try {
    const response = await fetch(`${BINANCE_FAPI}/forceOrders?symbol=${symbol}&limit=50`, {
      next: { revalidate: 30 }
    });
    if (!response.ok) throw new Error('Failed to fetch liquidations');
    return await response.json();
  } catch (error) {
    console.error('Liquidations error:', error);
    return [];
  }
}

// ==========================================
// STOCK APIs
// ==========================================

export async function fetchStockQuote(symbol: string) {
  if (!FINNHUB_KEY) return null;
  try {
    const response = await fetch(
      `${FINNHUB_API}/quote?symbol=${symbol}&token=${FINNHUB_KEY}`,
      { next: { revalidate: 30 } }
    );
    if (!response.ok) throw new Error('Failed to fetch stock quote');
    return await response.json();
  } catch (error) {
    console.error('Stock quote error:', error);
    return null;
  }
}

export async function fetchStockProfile(symbol: string) {
  if (!FINNHUB_KEY) return null;
  try {
    const response = await fetch(
      `${FINNHUB_API}/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error('Failed to fetch stock profile');
    return await response.json();
  } catch (error) {
    console.error('Stock profile error:', error);
    return null;
  }
}

export async function fetchStockNews(category = 'general') {
  if (!FINNHUB_KEY) return [];
  try {
    const response = await fetch(
      `${FINNHUB_API}/news?category=${category}&token=${FINNHUB_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error('Failed to fetch stock news');
    return await response.json();
  } catch (error) {
    console.error('Stock news error:', error);
    return [];
  }
}

export async function fetchStockPeers(symbol: string) {
  if (!FINNHUB_KEY) return [];
  try {
    const response = await fetch(
      `${FINNHUB_API}/stock/peers?symbol=${symbol}&token=${FINNHUB_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error('Failed to fetch stock peers');
    return await response.json();
  } catch (error) {
    console.error('Stock peers error:', error);
    return [];
  }
}

export async function fetchFMPQuote(symbol: string) {
  if (!FMP_KEY) return null;
  try {
    const response = await fetch(
      `${FMP_API}/quote/${symbol}?apikey=${FMP_KEY}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) throw new Error('Failed to fetch FMP quote');
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('FMP quote error:', error);
    return null;
  }
}

export async function fetchFMPStockList() {
  if (!FMP_KEY) return [];
  try {
    const response = await fetch(
      `${FMP_API}/stock/list?apikey=${FMP_KEY}`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error('Failed to fetch stock list');
    return await response.json();
  } catch (error) {
    console.error('Stock list error:', error);
    return [];
  }
}

// ==========================================
// FOREX APIs
// ==========================================

export async function fetchForexRates(base = 'USD') {
  try {
    const response = await fetch(`${FRANKFURTER_API}/latest?from=${base}`, {
      next: { revalidate: 300 }
    });
    if (!response.ok) throw new Error('Failed to fetch forex rates');
    return await response.json();
  } catch (error) {
    console.error('Forex rates error:', error);
    return null;
  }
}

export async function fetchForexHistory(base: string, target: string, days = 30) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const response = await fetch(
      `${FRANKFURTER_API}/${startDate}..${endDate}?from=${base}&to=${target}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error('Failed to fetch forex history');
    return await response.json();
  } catch (error) {
    console.error('Forex history error:', error);
    return null;
  }
}

// ==========================================
// MACRO APIs
// ==========================================

export async function fetchFREDData(seriesId: string) {
  if (!FRED_KEY) return null;
  try {
    const response = await fetch(
      `${FRED_API}/series/observations?series_id=${seriesId}&api_key=${FRED_KEY}&file_type=json&sort_order=desc&limit=100`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error('Failed to fetch FRED data');
    return await response.json();
  } catch (error) {
    console.error('FRED data error:', error);
    return null;
  }
}

export async function fetchWorldBankIndicator(indicator: string, country = 'US') {
  try {
    const response = await fetch(
      `${WB_API}/country/${country}/indicator/${indicator}?format=json&per_page=20&date=2015:2026`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) throw new Error('Failed to fetch World Bank data');
    const data = await response.json();
    return data[1] || [];
  } catch (error) {
    console.error('World Bank error:', error);
    return [];
  }
}

// ==========================================
// NEWS APIs
// ==========================================

export async function fetchNewsAPI(query = 'finance', pageSize = 20) {
  if (!NEWS_KEY) return [];
  try {
    const response = await fetch(
      `${NEWS_API}/everything?q=${query}&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error('Failed to fetch news');
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('News API error:', error);
    return [];
  }
}

export async function fetchFinnhubNews(category = 'general') {
  if (!FINNHUB_KEY) return [];
  try {
    const response = await fetch(
      `${FINNHUB_API}/news?category=${category}&token=${FINNHUB_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error('Failed to fetch Finnhub news');
    return await response.json();
  } catch (error) {
    console.error('Finnhub news error:', error);
    return [];
  }
}

// ==========================================
// WORLD MONITOR APIs
// ==========================================

export async function fetchEarthquakes(timeRange = 'day') {
  try {
    const response = await fetch(
      `${USGS_API}/summary/${timeRange}_m25.geojson`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error('Failed to fetch earthquakes');
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('Earthquakes error:', error);
    return [];
  }
}

export async function fetchWeather(city: string) {
  if (!OWM_KEY) return null;
  try {
    const response = await fetch(
      `${OWM_API}/weather?q=${city}&appid=${OWM_KEY}&units=metric`,
      { next: { revalidate: 600 } }
    );
    if (!response.ok) throw new Error('Failed to fetch weather');
    return await response.json();
  } catch (error) {
    console.error('Weather error:', error);
    return null;
  }
}

// ==========================================
// WEBSOCKET HELPERS
// ==========================================

export function createBinanceWebSocket(symbols: string[]) {
  const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
  return new WebSocket(`${BINANCE_WS}/${streams}`);
}

export function createBinanceTradeSocket(symbol: string) {
  return new WebSocket(`${BINANCE_WS}/${symbol.toLowerCase()}@trade`);
}

export function createBinanceDepthSocket(symbol: string) {
  return new WebSocket(`${BINANCE_WS}/${symbol.toLowerCase()}@depth20@100ms`);
}

export function createBinanceFuturesSocket(symbol: string) {
  return new WebSocket(`${BINANCE_FWS}/${symbol.toLowerCase()}@markPrice@1s`);
}

export function createBinanceLiquidationSocket() {
  return new WebSocket(`${BINANCE_FWS}/!forceOrder@arr`);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function formatNumber(num: number, decimals = 2): string {
  if (num >= 1e12) return (num / 1e12).toFixed(decimals) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
  return num.toFixed(decimals);
}

export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  return price.toFixed(6);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'positive': return 'text-terminal-accent';
    case 'negative': return 'text-terminal-danger';
    default: return 'text-terminal-muted';
  }
}

export function getChangeColor(value: number): string {
  return value >= 0 ? 'text-terminal-accent' : 'text-terminal-danger';
}

export function getChangeBg(value: number): string {
  return value >= 0 ? 'bg-terminal-accent/10' : 'bg-terminal-danger/10';
}
