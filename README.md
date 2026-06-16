# 🖥️ X7 Terminal

> **Bloomberg Terminal inspired Real-time Financial Dashboard** — Built entirely with FREE APIs & Open Data.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Live Demo

**[x7-terminal.vercel.app](https://x7-terminal.vercel.app)** *(deploy your own!)*

---

## ✨ Features

| Module | Features | Data Source |
|--------|----------|-------------|
| **💰 Crypto** | Real-time prices, Order Book, Trade Stream, Funding Rate, Open Interest, Liquidations | CoinGecko + Binance WebSocket |
| **📈 Stocks** | Live quotes, Market news, Earnings calendar, Stock screener | Finnhub + FMP + Alpha Vantage |
| **💱 Forex** | Major pairs, Cross rates matrix, Historical charts | Frankfurter (ECB) |
| **📊 Macro** | CPI, GDP, Unemployment, Fed Funds, M2, PPI, Treasury yields | FRED + World Bank |
| **📰 News** | Breaking financial news, Category filter, Sentiment analysis | NewsAPI + Finnhub |
| **🌍 World Monitor** | Earthquakes (USGS), Global weather, Storm tracking | USGS + OpenWeatherMap |
| **⚡ Real-time** | WebSocket streaming, Auto-reconnect, Ticker bar | Binance WebSocket |
| **📱 Mobile** | Bottom navigation, PWA installable, Battery saver mode, Offline support |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Static Export)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [SWR](https://swr.vercel.app/) + Custom Hooks
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** Framer Motion
- **PWA:** Service Worker + Web App Manifest

---

## 📡 Free APIs Used

### ✅ No API Key Required
| API | Endpoint | Data | Rate Limit |
|-----|----------|------|------------|
| **CoinGecko** | `api.coingecko.com` | Crypto prices, market cap, volume, sparklines | 10-30 calls/min |
| **Binance** | `api.binance.com` + WebSocket | Real-time prices, order book, trades, funding rate | Unlimited (public) |
| **Frankfurter** | `api.frankfurter.app` | Forex rates, historical data | Unlimited |
| **USGS** | `earthquake.usgs.gov` | Earthquakes (real-time) | Unlimited |

### 🔑 API Key Required (Free Tier)
| API | Get Key At | Free Tier | Data |
|-----|-----------|-----------|------|
| **Finnhub** | [finnhub.io](https://finnhub.io) | 60 calls/min | Stock quotes, news, earnings |
| **FRED** | [fred.stlouisfed.org](https://fred.stlouisfed.org/docs/api/api_key.html) | 120 calls/min | Economic indicators |
| **NewsAPI** | [newsapi.org](https://newsapi.org) | 100 requests/day | Financial news |
| **OpenWeatherMap** | [openweathermap.org](https://openweathermap.org/api) | 1,000 calls/day | Global weather |
| **Financial Modeling Prep** | [financialmodelingprep.com](https://financialmodelingprep.com) | 250 calls/day | Stock fundamentals |
| **Alpha Vantage** | [alphavantage.co](https://alphavantage.co) | 25 calls/day | Stock time series |

> **💡 Tip:** The app works **without any API keys** for Crypto, Forex, and Earthquake data!

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/x7-terminal.git
cd x7-terminal
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your free API keys:
```env
# Optional - App works without these for crypto/forex
NEXT_PUBLIC_FINNHUB_KEY=your_finnhub_key
NEXT_PUBLIC_FRED_KEY=your_fred_key
NEXT_PUBLIC_NEWS_KEY=your_newsapi_key
NEXT_PUBLIC_OWM_KEY=your_openweather_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production
```bash
npm run build
```
Static files will be in `/dist` folder.

---

## 🌐 Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/x7-terminal)

### Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.local`
3. Redeploy

---

## 📱 PWA Installation

### iOS (Safari)
1. Open the site in Safari
2. Tap **Share** → **Add to Home Screen**
3. Launch from home screen like a native app

### Android (Chrome)
1. Open the site in Chrome
2. Tap **⋮** → **Add to Home Screen**
3. Or accept the install prompt

### Desktop (Chrome/Edge)
1. Click **⊕** icon in address bar
2. Click **Install**

---

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  terminal: {
    bg: '#0a0a0f',      // Background
    panel: '#12121a',    // Card background
    border: '#1e1e2e',   // Borders
    accent: '#00ff88',   // Primary accent (green)
    accent2: '#00d4ff',  // Secondary accent (cyan)
    danger: '#ff4757',   // Red (down)
    warning: '#ffa502',  // Orange
    text: '#e0e0e0',     // Primary text
    muted: '#6b7280',    // Secondary text
  }
}
```

### Add More Crypto Pairs
Edit `lib/hooks.ts`:
```typescript
const TOP_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
```

### Add More Stocks
Edit `app/page.tsx`:
```typescript
useStockData(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA']);
```

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        X7 Terminal                          │
├─────────────────────────────────────────────────────────────┤
│  UI Layer                                                   │
│  ├── CryptoPanel.tsx    ←→  Zustand Store  ←→  API/Hooks   │
│  ├── StockPanel.tsx     ←→  Zustand Store  ←→  API/Hooks   │
│  ├── ForexPanel.tsx     ←→  Zustand Store  ←→  API/Hooks   │
│  ├── MacroPanel.tsx     ←→  Zustand Store  ←→  API/Hooks   │
│  ├── NewsPanel.tsx      ←→  Zustand Store  ←→  API/Hooks   │
│  └── WorldMonitorPanel  ←→  Zustand Store  ←→  API/Hooks   │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (Free APIs)                                     │
│  ├── CoinGecko     (REST)     → Crypto markets             │
│  ├── Binance WS    (WebSocket) → Real-time prices/trades   │
│  ├── Finnhub       (REST)     → Stock quotes & news        │
│  ├── Frankfurter   (REST)     → Forex rates                │
│  ├── FRED          (REST)     → Economic indicators        │
│  ├── NewsAPI       (REST)     → Financial news             │
│  ├── USGS          (REST)     → Earthquake data            │
│  └── OpenWeather   (REST)     → Weather data               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔋 Battery Saver Mode

When enabled:
- Reduces animation frame rate to 10 FPS
- Increases polling intervals
- Disables WebSocket streams (switches to REST polling)
- Reduces chart rendering quality

Toggle via the **Battery** button in bottom navigation.

---

## 🌙 WebSocket Auto-Reconnect

All WebSocket connections automatically reconnect on disconnect:
```typescript
ws.onclose = () => {
  console.log('Reconnecting in 5s...');
  setTimeout(() => createNewConnection(), 5000);
};
```

---

## 🐛 Troubleshooting

### Issue: "API rate limit exceeded"
**Solution:** The app uses caching and respects rate limits. Wait a few minutes or add your own API keys.

### Issue: "WebSocket connection failed"
**Solution:** Binance WebSocket may be blocked in some regions. The app falls back to REST polling automatically.

### Issue: "Build fails with TypeScript errors"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: "Charts not rendering"
**Solution:** Ensure `recharts` is installed:
```bash
npm install recharts
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new files
- Follow existing component structure
- Add JSDoc comments for API functions
- Test on mobile before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **CoinGecko** for comprehensive crypto data
- **Binance** for real-time WebSocket streams
- **Frankfurter** for free forex rates
- **FRED** for economic data
- **USGS** for earthquake data
- **OpenWeatherMap** for weather data
- **Finnhub** for stock market data
- **NewsAPI** for financial news

---

## 📞 Support

- 🐛 [Report Bug](../../issues)
- 💡 [Request Feature](../../issues)
- 📧 Email: your-email@example.com

---

<p align="center">
  <strong>⭐ Star this repo if you find it useful! ⭐</strong>
</p>

<p align="center">
  Built with ❤️ using only FREE APIs
</p>
