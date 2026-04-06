import { MarketAsset, PriceData, NewsItem, Trade } from "./types";

export const MOCK_TRADES: Trade[] = [
  {
    id: "1",
    symbol: "XAUUSD",
    type: "BUY",
    entryPrice: 2310.50,
    exitPrice: 2345.60,
    size: 0.1,
    pnl: 351.00,
    timestamp: "2024-04-05T14:30:00Z",
    status: "CLOSED"
  },
  {
    id: "2",
    symbol: "XAUUSD",
    type: "SELL",
    entryPrice: 2355.20,
    exitPrice: 2340.10,
    size: 0.05,
    pnl: 75.50,
    timestamp: "2024-04-04T10:15:00Z",
    status: "CLOSED"
  },
  {
    id: "3",
    symbol: "XAUUSD",
    type: "BUY",
    entryPrice: 2330.00,
    exitPrice: 2325.50,
    size: 0.1,
    pnl: -45.00,
    timestamp: "2024-04-03T16:45:00Z",
    status: "CLOSED"
  }
];

export const MOCK_ASSETS: MarketAsset[] = [
  { symbol: "XAUUSD", name: "Gold / US Dollar", price: 2345.60, change24h: 1.25, marketCap: "N/A", type: 'stock' },
];

export const generateMockPriceHistory = (basePrice: number): PriceData[] => {
  const history: PriceData[] = [];
  const now = new Date();
  let currentPrice = basePrice;
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const volatility = basePrice * 0.01;
    const open = currentPrice + (Math.random() - 0.5) * volatility;
    const close = open + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.5);
    
    currentPrice = close;
    
    history.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: close,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000,
    });
  }
  return history;
};

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "SEC Approves New Bitcoin ETF Options",
    source: "Reuters",
    timestamp: "2h ago",
    sentiment: "positive",
    summary: "The SEC has granted approval for several exchanges to list and trade options on spot Bitcoin ETFs, a move expected to increase institutional liquidity."
  },
  {
    id: "2",
    title: "NVIDIA Announces Next-Gen AI Chips",
    source: "Bloomberg",
    timestamp: "4h ago",
    sentiment: "positive",
    summary: "NVIDIA unveiled its latest Blackwell architecture, promising a 30x performance increase for AI inference tasks."
  },
  {
    id: "3",
    title: "Inflation Data Higher Than Expected",
    source: "CNBC",
    timestamp: "6h ago",
    sentiment: "negative",
    summary: "The latest CPI report shows inflation holding steady at 3.2%, dampening hopes for an early interest rate cut by the Fed."
  }
];
