import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, TrendingUp, TrendingDown, Activity, BarChart3, Clock, Wallet, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { BacktestConfig, BacktestResult } from '../types';
import { runBacktest } from '../services/backtestService';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BacktestPanel: React.FC = () => {
  const [config, setConfig] = useState<BacktestConfig>({
    strategy: 'RSI',
    initialCapital: 10000,
    symbol: 'XAUUSD',
    timeframe: '1H',
    period: 30
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await runBacktest(config);
      setResult(res);
    } catch (error) {
      console.error('Backtest failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Configuration Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Strategy Config
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Strategy</label>
              <select 
                value={config.strategy}
                onChange={(e) => setConfig({ ...config, strategy: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              >
                <option value="RSI">RSI Mean Reversion</option>
                <option value="MACD">MACD Crossover</option>
                <option value="EMA_CROSS">EMA 50/200 Cross</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Initial Capital ($)</label>
              <input 
                type="number"
                value={config.initialCapital}
                onChange={(e) => setConfig({ ...config, initialCapital: Number(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Timeframe</label>
                <select 
                  value={config.timeframe}
                  onChange={(e) => setConfig({ ...config, timeframe: e.target.value as any })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
                  <option value="1H">1H</option>
                  <option value="4H">4H</option>
                  <option value="1D">1D</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Period (Days)</label>
                <input 
                  type="number"
                  value={config.period}
                  onChange={(e) => setConfig({ ...config, period: Number(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              onClick={handleRun}
              disabled={loading}
              className={cn(
                "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 mt-4",
                loading 
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              )}
            >
              {loading ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run Backtest
                </>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Summary</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Return</span>
                <span className={cn(
                  "text-sm font-bold",
                  result.totalReturn >= 0 ? "text-emerald-500" : "text-rose-500"
                )}>
                  {result.totalReturn.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Win Rate</span>
                <span className="text-sm font-bold text-white">{result.winRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Max Drawdown</span>
                <span className="text-sm font-bold text-rose-500">{result.maxDrawdown.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Trades</span>
                <span className="text-sm font-bold text-white">{result.trades.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Results Area */}
      <div className="lg:col-span-3 space-y-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[500px]"
            >
              <div className="relative mb-8">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-500 blur-3xl rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Activity className="w-16 h-16 text-blue-500 relative z-10" />
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Simulating Market Conditions</h3>
              <p className="text-gray-400 text-center max-w-sm">
                Gemini is processing {config.period} days of historical data and executing {config.strategy} strategy rules...
              </p>
            </motion.div>
          ) : result ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Equity Curve Chart */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-white">Equity Curve</h3>
                    <p className="text-xs text-gray-500">Portfolio performance over time</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-xs text-gray-400">Balance</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.equityCurve}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        hide 
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        stroke="#9ca3af"
                        fontSize={10}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                        labelStyle={{ display: 'none' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorBalance)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trade Log */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Backtest Trade Log</h3>
                  <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-400 uppercase">
                    {result.trades.length} Trades Executed
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-800/30">
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entry</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Exit</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">P/L</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {result.trades.slice().reverse().map((trade) => (
                        <tr key={trade.id} className="hover:bg-gray-800/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className={cn(
                              "flex items-center gap-2 text-xs font-bold",
                              trade.type === 'BUY' ? "text-emerald-500" : "text-rose-500"
                            )}>
                              {trade.type === 'BUY' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {trade.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-white font-mono">${trade.entryPrice.toLocaleString()}</td>
                          <td className="px-6 py-4 text-xs text-white font-mono">${trade.exitPrice.toLocaleString()}</td>
                          <td className={cn(
                            "px-6 py-4 text-xs font-bold font-mono",
                            trade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                          )}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {new Date(trade.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to Backtest</h3>
              <p className="text-gray-400 text-center max-w-sm mb-8">
                Configure your strategy and time period to see how it would have performed in historical market conditions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 flex items-start gap-3">
                  <Wallet className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white mb-1">Capital Simulation</div>
                    <div className="text-[10px] text-gray-500 leading-tight">Test with custom initial balances to see drawdown impacts.</div>
                  </div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white mb-1">Historical Replay</div>
                    <div className="text-[10px] text-gray-500 leading-tight">Replay market movements tick-by-tick for accuracy.</div>
                  </div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white mb-1">Risk Analysis</div>
                    <div className="text-[10px] text-gray-500 leading-tight">Identify maximum drawdowns and win/loss ratios.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
