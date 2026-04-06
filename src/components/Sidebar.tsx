import React from 'react';
import { Search, TrendingUp, TrendingDown, LayoutDashboard, Wallet, Settings, LogOut, ChevronRight, History, BarChart3 } from 'lucide-react';
import { MarketAsset } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  assets: MarketAsset[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
  activeTab: 'DASHBOARD' | 'HISTORY' | 'BACKTESTING';
  onTabChange: (tab: 'DASHBOARD' | 'HISTORY' | 'BACKTESTING') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ assets, selectedSymbol, onSelect, activeTab, onTabChange }) => {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0 overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">TradeSignal</h1>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Pro Edition</span>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Main Menu</h3>
          <nav className="space-y-1">
            <button 
              onClick={() => onTabChange('DASHBOARD')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === 'DASHBOARD' ? "text-blue-400 bg-blue-500/10" : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button 
              onClick={() => onTabChange('HISTORY')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === 'HISTORY' ? "text-blue-400 bg-blue-500/10" : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <History className="w-4 h-4" />
              Trade History
            </button>
            <button 
              onClick={() => onTabChange('BACKTESTING')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === 'BACKTESTING' ? "text-blue-400 bg-blue-500/10" : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              Backtesting
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
              <Wallet className="w-4 h-4" />
              Portfolio
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Watchlist</h3>
          <div className="space-y-1">
            {assets.map((asset) => (
              <button 
                key={asset.symbol}
                onClick={() => onSelect(asset.symbol)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group",
                  selectedSymbol === asset.symbol 
                    ? "bg-gray-800 border border-gray-700 shadow-lg" 
                    : "hover:bg-gray-800/50 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
                    asset.type === 'crypto' ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {asset.symbol[0]}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{asset.symbol}</div>
                    <div className="text-[10px] text-gray-500">{asset.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">${asset.price.toLocaleString()}</div>
                  <div className={cn(
                    "text-[10px] font-medium flex items-center justify-end gap-1",
                    asset.change24h >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {asset.change24h >= 0 ? <TrendingUp className="w-2 h-2" /> : <TrendingDown className="w-2 h-2" />}
                    {Math.abs(asset.change24h)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-800">
        <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 hover:text-white transition-all">
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4" />
            Sign Out
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
