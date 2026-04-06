import React from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  BarChart2, 
  Plus, 
  Link as LinkIcon,
  ChevronRight
} from 'lucide-react';
import { Trade, TradeMetrics } from '../types';
import { cn } from '../lib/utils';

interface TradeHistoryProps {
  trades: Trade[];
  onAddTrade: () => void;
  onConnectBroker: () => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, onAddTrade, onConnectBroker }) => {
  const calculateMetrics = (trades: Trade[]): TradeMetrics => {
    const totalPnL = trades.reduce((acc, trade) => acc + trade.pnl, 0);
    const winningTrades = trades.filter(trade => trade.pnl > 0).length;
    const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;
    
    const totalProfit = trades.filter(t => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0);
    const totalLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0));
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit;

    return {
      totalPnL,
      winRate,
      totalTrades: trades.length,
      profitFactor
    };
  };

  const metrics = calculateMetrics(trades);

  return (
    <div className="space-y-8">
      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
            <DollarSign className="w-3 h-3" />
            Total P/L
          </div>
          <div className={cn(
            "text-2xl font-bold",
            metrics.totalPnL >= 0 ? "text-emerald-500" : "text-rose-500"
          )}>
            ${metrics.totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
            <Percent className="w-3 h-3" />
            Win Rate
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics.winRate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
            <BarChart2 className="w-3 h-3" />
            Total Trades
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics.totalTrades}
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
            <TrendingUp className="w-3 h-3" />
            Profit Factor
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {metrics.profitFactor.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Recent Trade Activity</h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onConnectBroker}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-bold text-gray-300 transition-all"
          >
            <LinkIcon className="w-4 h-4" />
            Connect Broker
          </button>
          <button 
            onClick={onAddTrade}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Trade
          </button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/30 border-b border-gray-800">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Symbol</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entry/Exit</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Size</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">P/L</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-800/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-300">
                    {new Date(trade.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-[10px] font-bold text-gray-400">
                    {trade.symbol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-xs font-bold",
                    trade.type === 'BUY' ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {trade.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-white">${trade.entryPrice.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500">Exit: ${trade.exitPrice.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-400">
                  {trade.size} Lots
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={cn(
                    "text-sm font-bold",
                    trade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-600 hover:text-gray-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {trades.length === 0 && (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No trade history found. Start logging your trades!</p>
          </div>
        )}
      </div>
    </div>
  );
};
