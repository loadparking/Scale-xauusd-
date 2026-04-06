import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, DollarSign, BarChart3, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Trade } from '../types';
import { cn } from '../lib/utils';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trade: Trade) => void;
}

export const AddTradeModal: React.FC<AddTradeModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    symbol: 'XAUUSD',
    type: 'BUY' as 'BUY' | 'SELL',
    entryPrice: '',
    exitPrice: '',
    size: '0.1',
    pnl: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trade: Trade = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: formData.symbol,
      type: formData.type,
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: parseFloat(formData.exitPrice),
      size: parseFloat(formData.size),
      pnl: parseFloat(formData.pnl),
      timestamp: new Date(formData.timestamp).toISOString(),
      status: 'CLOSED'
    };
    onAdd(trade);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Log Manual Trade</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Symbol</label>
                <input 
                  type="text" 
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</label>
                <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'BUY' })}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                      formData.type === 'BUY' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-gray-500 hover:text-gray-300"
                    )}
                  >
                    <TrendingUp className="w-3 h-3" />
                    BUY
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'SELL' })}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                      formData.type === 'SELL' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-gray-500 hover:text-gray-300"
                    )}
                  >
                    <TrendingDown className="w-3 h-3" />
                    SELL
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entry Price</label>
                <div className="relative">
                  <DollarSign className="w-3 h-3 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.entryPrice}
                    onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 pl-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Exit Price</label>
                <div className="relative">
                  <DollarSign className="w-3 h-3 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.exitPrice}
                    onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 pl-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lot Size</label>
                <div className="relative">
                  <BarChart3 className="w-3 h-3 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 pl-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Profit/Loss ($)</label>
                <div className="relative">
                  <DollarSign className="w-3 h-3 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.pnl}
                    onChange={(e) => setFormData({ ...formData, pnl: e.target.value })}
                    className={cn(
                      "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold",
                      parseFloat(formData.pnl) >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trade Timestamp</label>
              <div className="relative">
                <Clock className="w-3 h-3 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="datetime-local" 
                  value={formData.timestamp}
                  onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 pl-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all mt-4"
            >
              Log Trade Entry
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
