import React from 'react';
import { motion } from 'motion/react';
import { TradingSignal } from '../types';
import { cn } from '../lib/utils';
import { Target, ShieldAlert, ArrowRight, Info, Search } from 'lucide-react';

interface SignalOverlayProps {
  signal: TradingSignal;
}

export const SignalOverlay: React.FC<SignalOverlayProps> = ({ signal }) => {
  // Mock observation points for visual flair
  const observations = [
    { id: 1, x: '25%', y: '35%', label: 'Resistance Zone', color: 'rose' },
    { id: 2, x: '65%', y: '75%', label: 'Support Level', color: 'emerald' },
    { id: 3, x: '45%', y: '55%', label: 'Trend Breakout', color: 'blue' },
  ];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Scanning Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Target Level Line */}
      {signal.target && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-500/50 flex items-center justify-end pr-4 group/line"
          style={{ top: '20%' }}
        >
          <div className="bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded-l flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Target className="w-2.5 h-2.5" />
            TARGET: ${signal.target.toLocaleString()}
          </div>
          <div className="absolute right-0 w-full h-8 bg-gradient-to-l from-emerald-500/10 to-transparent opacity-0 group-hover/line:opacity-100 transition-opacity" />
        </motion.div>
      )}

      {/* Entry Level Line */}
      {signal.entry && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute left-0 right-0 border-t-2 border-blue-500/50 flex items-center justify-end pr-4 group/line"
          style={{ top: '50%' }}
        >
          <div className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-l flex items-center gap-1 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <ArrowRight className="w-2.5 h-2.5" />
            ENTRY: ${signal.entry.toLocaleString()}
          </div>
          <div className="absolute right-0 w-full h-8 bg-gradient-to-l from-blue-500/10 to-transparent opacity-0 group-hover/line:opacity-100 transition-opacity" />
        </motion.div>
      )}

      {/* Stop Loss Line */}
      {signal.stopLoss && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute left-0 right-0 border-t-2 border-dashed border-rose-500/50 flex items-center justify-end pr-4 group/line"
          style={{ top: '80%' }}
        >
          <div className="bg-rose-600 text-white text-[8px] font-black px-2 py-1 rounded-l flex items-center gap-1 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            <ShieldAlert className="w-2.5 h-2.5" />
            STOP LOSS: ${signal.stopLoss.toLocaleString()}
          </div>
          <div className="absolute right-0 w-full h-8 bg-gradient-to-l from-rose-500/10 to-transparent opacity-0 group-hover/line:opacity-100 transition-opacity" />
        </motion.div>
      )}

      {/* Observation Points */}
      {observations.map((obs, i) => (
        <motion.div
          key={obs.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.2, type: 'spring' }}
          className="absolute pointer-events-auto cursor-help group/obs"
          style={{ left: obs.x, top: obs.y }}
        >
          <div className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center relative",
            obs.color === 'rose' ? "border-rose-500 bg-rose-500/20" :
            obs.color === 'emerald' ? "border-emerald-500 bg-emerald-500/20" :
            "border-blue-500 bg-blue-500/20"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full animate-ping absolute",
              obs.color === 'rose' ? "bg-rose-500" :
              obs.color === 'emerald' ? "bg-emerald-500" :
              "bg-blue-500"
            )} />
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              obs.color === 'rose' ? "bg-rose-500" :
              obs.color === 'emerald' ? "bg-emerald-500" :
              "bg-blue-500"
            )} />
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/obs:opacity-100 transition-all scale-90 group-hover/obs:scale-100 pointer-events-none">
            <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-lg px-2 py-1 whitespace-nowrap shadow-2xl">
              <div className="flex items-center gap-1.5">
                <Search className="w-2.5 h-2.5 text-blue-400" />
                <span className="text-[9px] font-bold text-white uppercase tracking-wider">{obs.label}</span>
              </div>
            </div>
            <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
          </div>
        </motion.div>
      ))}

      {/* Main Reasoning Callout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 left-8 right-8 p-4 bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Gemini AI Reasoning</div>
          <p className="text-xs text-gray-300 leading-relaxed font-medium italic">
            "{signal.reasoning}"
          </p>
        </div>
      </motion.div>
    </div>
  );
};
