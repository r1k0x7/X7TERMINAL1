const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BINANCE_API = 'https://api.binance.com/api/v3';
const BINANCE_FAPI = 'https://fapi.binance.com/fapi/v1';
const BINANCE_WS = 'wss://stream.binance.com:9443/ws';
const BINANCE_FWS = 'wss://fstream.binance.com/ws';
const FINNHUB_API = 'https://finnhub.io/api/v1';
const FINNHUB_KEY = process.env.NEXT_PUBLIC_FINNHUB_KEY || '';
const FRANKFURTER_API = 'https://api.frankfurter.app';
const FRED_API = 'https://api.stlouisfed.org/fred';
const FRED_KEY = process.env.NEXT_PUBLIC_FRED_KEY || '';
const NEWS_API = 'https://newsapi.org/v2';
const NEWS_KEY = process.env.NEXT_PUBLIC_NEWS_KEY || '';
const USGS_API = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0';
const OWM_API = 'https://api.openweathermap.org/data/2.5';
const OWM_KEY = process.env.NEXT_PUBLIC_OWM_KEY || '';

export async function fetchCryptoMarkets(page = 1, perPage = 50) {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`,
      { next: { revalidate: 30 } }
    );
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function fetchStockQuote(symbol) {
  if (!FINNHUB_KEY) return null;
  try {
    const response = await fetch(`${FINNHUB_API}/quote?symbol=${symbol}&token=${FINNHUB_KEY}`, { next: { revalidate: 30 } });
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function fetchForexRates(base = 'USD') {
  try {
    const response = await fetch(`${FRANKFURTER_API}/latest?from=${base}`, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function fetchFREDData(seriesId) {
  if (!FRED_KEY) return null;
  try {
    const response = await fetch(`${FRED_API}/series/observations?series_id=${seriesId}&api_key=${FRED_KEY}&file_type=json&sort_order=desc&limit=100`, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function fetchNewsAPI(query = 'finance', pageSize = 20) {
  if (!NEWS_KEY) return [];
  try {
    const response = await fetch(`${NEWS_API}/everything?q=${query}&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_KEY}`, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error('Failed');
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    return [];
  }
}

export async function fetchEarthquakes(timeRange = 'day') {
  try {
    const response = await fetch(`${USGS_API}/summary/${timeRange}_m25.geojson`, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error('Failed');
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    return [];
  }
}

export async function fetchWeather(city) {
  if (!OWM_KEY) return null;
  try {
    const response = await fetch(`${OWM_API}/weather?q=${city}&appid=${OWM_KEY}&units=metric`, { next: { revalidate: 600 } });
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function fetchFundingRate(symbol) {
  try {
    const response = await fetch(`${BINANCE_FAPI}/fundingRate?symbol=${symbol}&limit=1`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Failed');
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    return null;
  }
}

export function createBinanceWebSocket(symbols) {
  const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
  return new WebSocket(`${BINANCE_WS}/${streams}`);
}

export function createBinanceTradeSocket(symbol) {
  return new WebSocket(`${BINANCE_WS}/${symbol.toLowerCase()}@trade`);
}

export function createBinanceDepthSocket(symbol) {
  return new WebSocket(`${BINANCE_WS}/${symbol.toLowerCase()}@depth20@100ms`);
}

export function formatNumber(num, decimals = 2) {
  if (num >= 1e12) return (num / 1e12).toFixed(decimals) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
  return num.toFixed(decimals);
}

export function formatPrice(price) {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  return price.toFixed(6);
}

export function formatPercentage(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
