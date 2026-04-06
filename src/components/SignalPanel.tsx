import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BrainCircuit, 
  Activity, 
  Zap, 
  Layers, 
  Target, 
  Copy, 
  Check
} from 'lucide-react';
import { TradingSignal } from '../types';
import { cn } from '../lib/utils';

interface SignalPanelProps {
  signal: TradingSignal | null;
  loading: boolean;
}

export const SignalPanel: React.FC<SignalPanelProps> = ({ 
  signal, 
  loading
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!signal) return;
    const text = `XAUUSD Signal: ${signal.type} (${signal.confidence}% Confidence)\nReasoning: ${signal.reasoning}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'BUY': return <TrendingUp className="w-10 h-10" />;
      case 'SELL': return <TrendingDown className="w-10 h-10" />;
      default: return <Minus className="w-10 h-10" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 h-full overflow-y-auto custom-scrollbar flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">AI Analysis Result</h3>
          {signal && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-1.5 py-0.5 bg-blue-500 text-[8px] font-black text-white rounded uppercase tracking-tighter"
            >
              New
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {signal && (
            <button 
              onClick={handleCopy}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-500 hover:text-blue-400"
              title="Copy Signal"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
          {signal && (
            <div className="text-[10px] text-gray-500 font-mono">
              {new Date(signal.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center space-y-4 py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit className="w-12 h-12 text-blue-500" />
            </motion.div>
            <p className="text-gray-400 font-medium animate-pulse">Gemini AI is analyzing market trends...</p>
          </motion.div>
        ) : signal ? (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {/* Prominent Signal Card */}
            <div className={cn(
              "relative p-10 rounded-3xl mb-8 overflow-hidden border-2 transition-all duration-500",
              signal.type === 'BUY' ? "bg-emerald-500/10 border-emerald-500 shadow-2xl shadow-emerald-500/20" :
              signal.type === 'SELL' ? "bg-rose-500/10 border-rose-500 shadow-2xl shadow-rose-500/20" :
              "bg-amber-500/10 border-amber-500 shadow-2xl shadow-amber-500/20"
            )}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: signal.type === 'BUY' ? [0, 5, 0] : signal.type === 'SELL' ? [0, -5, 0] : 0
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                      "w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl",
                      signal.type === 'BUY' ? "bg-emerald-600" :
                      signal.type === 'SELL' ? "bg-rose-600" :
                      "bg-amber-600"
                    )}
                  >
                    {getSignalIcon(signal.type)}
                  </motion.div>
                  <div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">AI Recommendation</div>
                    <div className={cn(
                      "text-6xl font-black tracking-tighter",
                      signal.type === 'BUY' ? "text-emerald-500" :
                      signal.type === 'SELL' ? "text-rose-500" :
                      "text-amber-500"
                    )}>
                      {signal.type}
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Confidence</div>
                  <div className="text-6xl font-black text-white tracking-tighter">{signal.confidence}%</div>
                </div>
              </div>
              
              {/* Background Glow Effect */}
              <div className={cn(
                "absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full opacity-40",
                signal.type === 'BUY' ? "bg-emerald-500" :
                signal.type === 'SELL' ? "bg-rose-500" :
                "bg-amber-500"
              )} />
            </div>

            {/* Sentiment Meter */}
            <div className="bg-gray-800/30 border border-gray-800 rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Market Sentiment</span>
                <span className={cn(
                  "text-xs font-black uppercase px-3 py-1 rounded-lg",
                  signal.confidence > 75 ? "bg-emerald-500/20 text-emerald-500" :
                  signal.confidence > 50 ? "bg-amber-500/20 text-amber-500" :
                  "bg-rose-500/20 text-rose-500"
                )}>
                  {signal.confidence > 75 ? 'Strong' : signal.confidence > 50 ? 'Moderate' : 'Weak'}
                </span>
              </div>
              <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${signal.confidence}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]",
                    signal.type === 'BUY' ? "bg-emerald-500" :
                    signal.type === 'SELL' ? "bg-rose-500" :
                    "bg-amber-500"
                  )}
                />
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gray-700 z-10" />
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                <span>Bearish</span>
                <span>Neutral</span>
                <span>Bullish</span>
              </div>
            </div>

            {/* Trade Setup Card */}
            {(signal.entry || signal.target || signal.stopLoss) && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" />
                  Recommended Setup
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">Entry</div>
                    <div className="text-sm font-black text-white">
                      {signal.entry ? `$${signal.entry.toLocaleString()}` : 'Market'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-emerald-500 uppercase font-bold mb-1">Target</div>
                    <div className="text-sm font-black text-emerald-500">
                      {signal.target ? `$${signal.target.toLocaleString()}` : '--'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-rose-500 uppercase font-bold mb-1">Stop Loss</div>
                    <div className="text-sm font-black text-rose-500">
                      {signal.stopLoss ? `$${signal.stopLoss.toLocaleString()}` : '--'}
                    </div>
                  </div>
                </div>
                
                {/* Risk/Reward Visualization */}
                {signal.entry && signal.target && signal.stopLoss && (
                  <div className="mt-4 pt-4 border-t border-gray-800/50">
                    <div className="flex justify-between text-[9px] font-bold mb-2">
                      <span className="text-gray-500 uppercase">Risk/Reward Ratio</span>
                      <span className="text-blue-400">
                        {Math.abs((signal.target - signal.entry) / (signal.entry - signal.stopLoss)).toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full flex overflow-hidden">
                      <div 
                        className="h-full bg-rose-500" 
                        style={{ width: `${(Math.abs(signal.entry - signal.stopLoss) / Math.abs(signal.target - signal.stopLoss)) * 100}%` }} 
                      />
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${(Math.abs(signal.target - signal.entry) / Math.abs(signal.target - signal.stopLoss)) * 100}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Technical Indicators Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Activity className="w-3 h-3" />
                  RSI
                </div>
                <div className="text-lg font-bold text-white">{signal.indicators.rsi}</div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Layers className="w-3 h-3" />
                  Trend
                </div>
                <div className="text-[10px] font-bold text-white leading-tight">{signal.indicators.movingAverage}</div>
              </div>
            </div>

            {/* Support & Resistance */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Target className="w-3 h-3" />
                  Resistance
                </div>
                <div className="space-y-1">
                  {signal.indicators.resistanceLevels?.slice(0, 2).map((level, i) => (
                    <div key={i} className="text-xs font-bold text-white">${level.toLocaleString()}</div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Target className="w-3 h-3" />
                  Support
                </div>
                <div className="space-y-1">
                  {signal.indicators.supportLevels?.slice(0, 2).map((level, i) => (
                    <div key={i} className="text-xs font-bold text-white">${level.toLocaleString()}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">AI Reasoning Analysis</h4>
              <p className="text-sm text-gray-400 leading-relaxed italic">
                "{signal.reasoning}"
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
              <BrainCircuit className="w-8 h-8 text-gray-600" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">No Analysis Yet</h4>
            <p className="text-sm text-gray-500">
              Select an asset or upload a chart to generate an AI-powered trading signal.
            </p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
