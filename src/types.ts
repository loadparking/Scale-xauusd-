export interface PriceData {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: string;
  type: 'crypto' | 'stock';
}

export interface TradingSignal {
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  timestamp: string;
  entry?: number;
  target?: number;
  stopLoss?: number;
  indicators: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    bollingerBands?: {
      upper: number;
      middle: number;
      lower: number;
    };
    supportLevels?: number[];
    resistanceLevels?: number[];
    movingAverage: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  timestamp: string;
  status: 'OPEN' | 'CLOSED';
}

export interface TradeMetrics {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
}

export interface BacktestConfig {
  strategy: 'RSI' | 'MACD' | 'EMA_CROSS';
  initialCapital: number;
  symbol: string;
  timeframe: '1H' | '4H' | '1D';
  period: number; // Days
}

export interface BacktestResult {
  config: BacktestConfig;
  totalReturn: number;
  totalPnL: number;
  winRate: number;
  maxDrawdown: number;
  trades: Trade[];
  equityCurve: { time: string; balance: number }[];
}
