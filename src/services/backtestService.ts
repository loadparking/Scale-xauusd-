import { BacktestConfig, BacktestResult, PriceData, Trade } from "../types";

// Helper to generate more extensive historical data
export const generateHistoricalData = (basePrice: number, days: number, timeframe: '1H' | '4H' | '1D'): PriceData[] => {
  const history: PriceData[] = [];
  const now = new Date();
  const intervalsPerDay = timeframe === '1H' ? 24 : timeframe === '4H' ? 6 : 1;
  const totalIntervals = days * intervalsPerDay;
  
  let currentPrice = basePrice;
  for (let i = totalIntervals; i >= 0; i--) {
    const time = new Date(now.getTime() - i * (24 / intervalsPerDay) * 60 * 60 * 1000);
    const volatility = 0.005; // 0.5% volatility per interval
    const change = currentPrice * volatility * (Math.random() - 0.48); // Slight upward bias
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + (Math.random() * currentPrice * 0.002);
    const low = Math.min(open, close) - (Math.random() * currentPrice * 0.002);
    currentPrice = close;
    
    history.push({
      time: time.toISOString(),
      price: currentPrice,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000,
    });
  }
  return history;
};

// Simple RSI calculation
const calculateRSI = (prices: number[], period: number = 14): number[] => {
  const rsi: number[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;

    if (i >= period) {
      if (i > period) {
        const prevDiff = prices[i - 1] - prices[i - 2];
        if (prevDiff >= 0) {
          gains = (gains * (period - 1) + (diff >= 0 ? diff : 0)) / period;
          losses = (losses * (period - 1) + (diff < 0 ? -diff : 0)) / period;
        }
      }
      const rs = gains / (losses || 1);
      rsi.push(100 - (100 / (1 + rs)));
    } else {
      rsi.push(50); // Default
    }
  }
  return rsi;
};

export const runBacktest = async (config: BacktestConfig): Promise<BacktestResult> => {
  // Simulate a delay for the "processing" feel
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const data = generateHistoricalData(2345.60, config.period, config.timeframe);
  const prices = data.map(d => d.price);
  const rsiValues = calculateRSI(prices);
  
  const trades: Trade[] = [];
  let balance = config.initialCapital;
  const equityCurve: { time: string; balance: number }[] = [{ time: data[0].time, balance }];
  
  let currentPosition: { type: 'BUY' | 'SELL'; entryPrice: number; size: number; entryTime: string } | null = null;
  
  // Simple RSI Strategy: Buy < 30, Sell > 70
  for (let i = 14; i < data.length; i++) {
    const rsi = rsiValues[i - 1];
    const price = data[i].price;
    const time = data[i].time;
    
    if (!currentPosition) {
      if (rsi < 30) {
        currentPosition = { type: 'BUY', entryPrice: price, size: 1, entryTime: time };
      } else if (rsi > 70) {
        currentPosition = { type: 'SELL', entryPrice: price, size: 1, entryTime: time };
      }
    } else {
      // Exit conditions
      const shouldExit = (currentPosition.type === 'BUY' && rsi > 50) || 
                         (currentPosition.type === 'SELL' && rsi < 50);
      
      if (shouldExit) {
        const pnl = currentPosition.type === 'BUY' 
          ? (price - currentPosition.entryPrice) * currentPosition.size * 100 // 100x multiplier for gold pips
          : (currentPosition.entryPrice - price) * currentPosition.size * 100;
        
        balance += pnl;
        trades.push({
          id: Math.random().toString(36).substr(2, 9),
          symbol: config.symbol,
          type: currentPosition.type,
          entryPrice: currentPosition.entryPrice,
          exitPrice: price,
          size: currentPosition.size,
          pnl,
          timestamp: time,
          status: 'CLOSED'
        });
        currentPosition = null;
      }
    }
    equityCurve.push({ time, balance });
  }
  
  const totalPnL = balance - config.initialCapital;
  const winRate = (trades.filter(t => t.pnl > 0).length / trades.length) * 100;
  
  // Calculate Max Drawdown
  let peak = config.initialCapital;
  let maxDD = 0;
  for (const point of equityCurve) {
    if (point.balance > peak) peak = point.balance;
    const dd = (peak - point.balance) / peak;
    if (dd > maxDD) maxDD = dd;
  }

  return {
    config,
    totalReturn: (totalPnL / config.initialCapital) * 100,
    totalPnL,
    winRate: isNaN(winRate) ? 0 : winRate,
    maxDrawdown: maxDD * 100,
    trades,
    equityCurve
  };
};
