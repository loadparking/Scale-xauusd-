import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link as LinkIcon, Shield, Globe, Key, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface BrokerIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export const BrokerIntegrationModal: React.FC<BrokerIntegrationModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [step, setStep] = useState<'SELECT' | 'CONNECTING' | 'SUCCESS'>('SELECT');
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);

  const brokers = [
    { id: 'meta', name: 'MetaTrader 5', icon: 'MT5', color: 'bg-blue-500' },
    { id: 'ctrader', name: 'cTrader', icon: 'CT', color: 'bg-indigo-500' },
    { id: 'oanda', name: 'OANDA', icon: 'OA', color: 'bg-emerald-500' },
    { id: 'ig', name: 'IG Markets', icon: 'IG', color: 'bg-rose-500' },
  ];

  const handleConnect = () => {
    setStep('CONNECTING');
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(() => {
        onConnect();
        onClose();
      }, 1500);
    }, 2000);
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
                <LinkIcon className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Broker Integration</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            {step === 'SELECT' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Select your broker</h4>
                  <p className="text-xs text-gray-500">Choose your trading platform to automatically sync trade history.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {brokers.map((broker) => (
                    <button
                      key={broker.id}
                      onClick={() => setSelectedBroker(broker.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group",
                        selectedBroker === broker.id 
                          ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10" 
                          : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg", broker.color)}>
                        {broker.icon}
                      </div>
                      <span className={cn(
                        "text-xs font-bold transition-colors",
                        selectedBroker === broker.id ? "text-blue-400" : "text-gray-400 group-hover:text-gray-200"
                      )}>
                        {broker.name}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedBroker && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-4"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">API Key / Access Token</label>
                      <div className="relative">
                        <Key className="w-3 h-3 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="password" 
                          placeholder="Enter your API key"
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 pl-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleConnect}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all"
                    >
                      Connect Account
                    </button>
                  </motion.div>
                )}

                <div className="flex items-center gap-2 justify-center text-[10px] text-gray-600 font-medium pt-4">
                  <Shield className="w-3 h-3" />
                  <span>Secure 256-bit encrypted connection</span>
                </div>
              </div>
            )}

            {step === 'CONNECTING' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <Globe className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white mb-1">Establishing Connection</h4>
                  <p className="text-xs text-gray-500">Syncing trade data from {brokers.find(b => b.id === selectedBroker)?.name}...</p>
                </div>
              </div>
            )}

            {step === 'SUCCESS' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white mb-1">Integration Successful</h4>
                  <p className="text-xs text-gray-500">Your trade history is now automatically syncing.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
