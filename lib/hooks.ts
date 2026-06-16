import { useEffect, useRef, useState } from 'react';
import { useTerminalStore } from './store';
import { 
  createBinanceWebSocket, 
  createBinanceTradeSocket,
  createBinanceDepthSocket,
  fetchCryptoMarkets,
  fetchStockQuote,
  fetchForexRates,
  fetchNewsAPI,
  fetchFundingRate,
} from './api';

export function useCryptoWebSocket(symbols: string[]) {
  const wsRef = useRef<WebSocket | null>(null);
  const { updateCryptoPrice, setWsConnected } = useTerminalStore();

  useEffect(() => {
    if (symbols.length === 0) return;
    const ws = createBinanceWebSocket(symbols);
    wsRef.current = ws;
    ws.onopen = () => setWsConnected(true);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.c) updateCryptoPrice(data.s, parseFloat(data.c), parseFloat(data.P));
    };
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);
    return () => ws.close();
  }, [symbols.join(','), updateCryptoPrice, setWsConnected]);

  return wsRef;
}

export function useTradeStream(symbol: string) {
  const { addTrade } = useTerminalStore();
  useEffect(() => {
    const ws = createBinanceTradeSocket(symbol);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addTrade({ price: parseFloat(data.p), quantity: parseFloat(data.q), time: data.T, isBuyer: data.m === false });
    };
    return () => ws.close();
  }, [symbol, addTrade]);
}

export function useOrderBook(symbol: string) {
  const [orderBook, setOrderBook] = useState<{ bids: [number, number][]; asks: [number, number][] }>({ bids: [], asks: [] });
  useEffect(() => {
    const ws = createBinanceDepthSocket(symbol);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrderBook({
        bids: data.bids.slice(0, 10).map(([p, q]: [string, string]) => [parseFloat(p), parseFloat(q)]),
        asks: data.asks.slice(0, 10).map(([p, q]: [string, string]) => [parseFloat(p), parseFloat(q)]),
      });
    };
    return () => ws.close();
  }, [symbol]);
  return orderBook;
}

export function useFundingRate(symbol: string) {
  const [funding, setFunding] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => { const data = await fetchFundingRate(symbol); if (data) setFunding(data); };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [symbol]);
  return funding;
}

export function useCryptoMarkets() {
  const { setCryptoAssets, setLoading } = useTerminalStore();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchCryptoMarkets(1, 50);
      const assets = data.map((coin: any) => ({
        id: coin.id, symbol: coin.symbol.toUpperCase(), name: coin.name,
        price: coin.current_price, change24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap, volume24h: coin.total_volume,
        sparkline: coin.sparkline_in_7d?.price || [],
      }));
      setCryptoAssets(assets);
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [setCryptoAssets, setLoading]);
}

export function useStockData(symbols: string[]) {
  const { setStockAssets } = useTerminalStore();
  useEffect(() => {
    const fetchData = async () => {
      const stocks = await Promise.all(symbols.map(async (symbol) => {
        const quote = await fetchStockQuote(symbol);
        if (!quote) return null;
        return { symbol, name: symbol, price: quote.c, change: quote.d, changePercent: quote.dp, volume: quote.v };
      }));
      setStockAssets(stocks.filter(Boolean) as any[]);
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [symbols.join(','), setStockAssets]);
}

export function useForexData() {
  const { setForexRates } = useTerminalStore();
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchForexRates('USD');
      if (!data) return;
      const pairs = ['EUR', 'GBP', 'JPY', 'IDR', 'CHF', 'CAD', 'AUD', 'CNY'];
      const rates = pairs.map((pair) => ({ pair: `USD${pair}`, rate: data.rates[pair], change: 0, bid: data.rates[pair] * 0.9995, ask: data.rates[pair] * 1.0005 }));
      setForexRates(rates);
    };
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [setForexRates]);
}

export function useNewsData() {
  const { setNewsItems } = useTerminalStore();
  useEffect(() => {
    const fetchData = async () => {
      const articles = await fetchNewsAPI('finance cryptocurrency stock market', 20);
      const news = articles.map((article: any, index: number) => ({
        id: `news-${index}`, title: article.title, source: article.source.name,
        publishedAt: article.publishedAt, category: 'finance', sentiment: 'neutral' as const, url: article.url,
      }));
      setNewsItems(news);
    };
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [setNewsItems]);
}
