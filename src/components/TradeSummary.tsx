import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, DollarSign, Percent, History, ArrowRight } from 'lucide-react';
import { Trade } from '../types';
import { cn } from '../lib/utils';

interface TradeSummaryProps {
  trades: Trade[];
  onViewHistory: () => void;
}

export const TradeSummary: React.FC<TradeSummaryProps> = ({ trades, onViewHistory }) => {
  const totalPnL = trades.reduce((acc, trade) => acc + trade.pnl, 0);
  const winningTrades = trades.filter(trade => trade.pnl > 0).length;
  const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;
  const recentTrades = trades.slice(0, 3);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">Performance Summary</h3>
        </div>
        <button 
          onClick={onViewHistory}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors uppercase tracking-widest"
        >
          Full History <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            <DollarSign className="w-3 h-3" />
            Total P/L
          </div>
          <div className={cn(
            "text-xl font-bold",
            totalPnL >= 0 ? "text-emerald-500" : "text-rose-500"
          )}>
            ${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            <Percent className="w-3 h-3" />
            Win Rate
          </div>
          <div className="text-xl font-bold text-white">
            {winRate.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Recent Activity</h4>
        <div className="space-y-2">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  trade.type === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}>
                  {trade.type === 'BUY' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{trade.symbol}</div>
                  <div className="text-[9px] text-gray-500">{new Date(trade.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
              <div className={cn(
                "text-xs font-bold",
                trade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
              )}>
                {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toLocaleString()}
              </div>
            </div>
          ))}
          {recentTrades.length === 0 && (
            <div className="py-4 text-center text-xs text-gray-600 italic">No recent trades logged</div>
          )}
        </div>
      </div>
    </div>
  );
};
