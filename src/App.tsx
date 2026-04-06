import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  User, 
  RefreshCw, 
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Image as ImageIcon,
  Upload,
  X,
  BrainCircuit,
  History,
  CheckCircle2
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SignalPanel } from './components/SignalPanel';
import { NewsPanel } from './components/NewsPanel';
import { TradeHistory } from './components/TradeHistory';
import { TradeSummary } from './components/TradeSummary';
import { SignalOverlay } from './components/SignalOverlay';
import { BacktestPanel } from './components/BacktestPanel';
import { AddTradeModal } from './components/AddTradeModal';
import { BrokerIntegrationModal } from './components/BrokerIntegrationModal';
import { MOCK_ASSETS, MOCK_NEWS, generateMockPriceHistory, MOCK_TRADES } from './mockData';
import { analyzeMarket, analyzeChartImage } from './services/geminiService';
import { TradingSignal, PriceData, MarketAsset, Trade } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [asset, setAsset] = useState<MarketAsset>(MOCK_ASSETS[0]);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [loadingSignal, setLoadingSignal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [timeframe] = useState<'15m' | '1H' | '4H' | '1D'>('1H');
  
  // Trade History State
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'HISTORY' | 'BACKTESTING'>('DASHBOARD');
  const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);

  useEffect(() => {
    const currentAsset = MOCK_ASSETS[0];
    setAsset(currentAsset);
    const history = generateMockPriceHistory(currentAsset.price);
    setPriceHistory(history);
    
    // Fetch initial AI Signal
    fetchSignal(currentAsset.symbol, history);
  }, []);

  const fetchSignal = async (symbol: string, history: PriceData[], tf: string = timeframe) => {
    setLoadingSignal(true);
    try {
      const result = await analyzeMarket(symbol, history, MOCK_NEWS, tf);
      setSignal(result);
    } catch (error) {
      console.error("Failed to fetch AI signal:", error);
    } finally {
      setLoadingSignal(false);
      setLastUpdated(new Date());
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setUploadedImage(reader.result as string);
      setLoadingSignal(true);
      try {
        const result = await analyzeChartImage(base64String, file.type);
        setSignal(result);
      } catch (error) {
        console.error("Failed to analyze image:", error);
      } finally {
        setLoadingSignal(false);
        setLastUpdated(new Date());
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    setUploadedImage(null);
    fetchSignal(asset.symbol, priceHistory);
  };

  const handleAddTrade = (newTrade: Trade) => {
    setTrades([newTrade, ...trades]);
  };

  const handleConnectBroker = () => {
    // In a real app, this would trigger an API sync
    // For now, we'll just show the success state in the modal
  };

  const handleRefresh = () => {
    fetchSignal(asset.symbol, priceHistory, timeframe);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0c10] text-gray-100 font-sans selection:bg-blue-500/30">
      <Sidebar 
        assets={MOCK_ASSETS} 
        selectedSymbol={selectedSymbol} 
        onSelect={setSelectedSymbol} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-gray-800/50 flex items-center justify-between px-8 sticky top-0 bg-[#0a0c10]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-xs font-medium text-gray-400">
              <Clock className="w-3 h-3" />
              Last update: {lastUpdated.toLocaleTimeString()}
            </div>
            <button 
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-blue-400"
              title="Refresh AI Analysis"
            >
              <RefreshCw className={cn("w-4 h-4", loadingSignal && "animate-spin")} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-emerald-500">Market Live</span>
            </div>
            <div className="h-6 w-[1px] bg-gray-800" />
            <button className="relative p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0c10]" />
            </button>
            <button className="flex items-center gap-3 p-1 pl-3 hover:bg-gray-800 rounded-full border border-gray-800 transition-all group">
              <span className="text-xs font-medium text-gray-300 group-hover:text-white">loadparking44</span>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'DASHBOARD' ? (
            <>
              {/* Asset Summary Header */}
              <div className="flex items-end justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                    {asset.symbol[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-3xl font-bold text-white">{asset.name}</h2>
                      <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-bold text-gray-400">
                        {asset.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-white tracking-tight">
                        ${asset.price.toLocaleString()}
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold",
                        asset.change24h >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                      )}>
                        {asset.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(asset.change24h)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-right">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Market Cap</div>
                    <div className="text-lg font-bold text-white">{asset.marketCap}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">24h Volume</div>
                    <div className="text-lg font-bold text-white">$45.2B</div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-12 gap-6">
                {/* Upload Section */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  {/* Image Upload Section */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 h-full flex flex-col justify-center min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold text-gray-300 uppercase tracking-wider">Analyze Your XAUUSD Chart</h3>
                      </div>
                      {uploadedImage && (
                        <button 
                          onClick={clearImage}
                          className="text-sm text-rose-500 hover:text-rose-400 flex items-center gap-1 font-medium"
                        >
                          <X className="w-4 h-4" /> Clear Image
                        </button>
                      )}
                    </div>

                    {!uploadedImage ? (
                      <label 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                          "flex flex-col items-center justify-center w-full flex-1 border-2 border-dashed rounded-2xl cursor-pointer transition-all group p-12",
                          isDragging 
                            ? "bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/20" 
                            : "bg-gray-800/30 border-gray-800 hover:bg-gray-800/50 hover:border-blue-500/50"
                        )}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className={cn(
                            "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all shadow-xl",
                            isDragging ? "bg-blue-600 scale-110" : "bg-gray-800 group-hover:scale-110"
                          )}>
                            <Upload className={cn(
                              "w-10 h-10 transition-colors",
                              isDragging ? "text-white" : "text-gray-400 group-hover:text-blue-400"
                            )} />
                          </div>
                          <p className="mb-4 text-xl text-gray-300 font-bold">
                            <span className="text-blue-400">{isDragging ? "Drop your chart here" : "Click to upload"}</span> or drag and drop
                          </p>
                          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold text-center max-w-sm">
                            Upload your XAUUSD chart screenshot for instant Gemini AI analysis
                          </p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-gray-700 flex-1 min-h-[300px] group/image">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded Chart" 
                          className={cn(
                            "w-full h-full object-contain bg-black/40 transition-all duration-700",
                            loadingSignal ? "blur-sm scale-105 opacity-50" : "blur-0 scale-100 opacity-100"
                          )} 
                        />
                        
                        {/* Signal Overlay Visual Cues */}
                        {!loadingSignal && signal && uploadedImage && (
                          <SignalOverlay signal={signal} />
                        )}
                        
                        {/* Scanning Line Animation */}
                        {loadingSignal && (
                          <motion.div 
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-8 z-30">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500",
                              loadingSignal ? "bg-blue-600 animate-pulse shadow-blue-600/40" : "bg-emerald-600 shadow-emerald-600/20"
                            )}>
                              {loadingSignal ? <BrainCircuit className="w-6 h-6 text-white" /> : <CheckCircle2 className="w-6 h-6 text-white" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">
                                {loadingSignal ? "AI Analyzing Uploaded Image..." : "Analysis Complete"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {loadingSignal ? "Gemini 3 Flash is scanning patterns and indicators" : "View the results in the AI Signal panel"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {loadingSignal && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 overflow-hidden z-40">
                            <motion.div 
                              initial={{ x: "-100%" }}
                              animate={{ x: "0%" }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="h-full w-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Signal & News Section */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <SignalPanel 
                    signal={signal} 
                    loading={loadingSignal} 
                  />
                  <TradeSummary trades={trades} onViewHistory={() => setActiveTab('HISTORY')} />
                  <NewsPanel news={MOCK_NEWS} />
                </div>
              </div>
            </>
          ) : activeTab === 'HISTORY' ? (
            <TradeHistory 
              trades={trades} 
              onAddTrade={() => setIsAddModalOpen(true)}
              onConnectBroker={() => setIsBrokerModalOpen(true)}
            />
          ) : (
            <BacktestPanel />
          )}
        </div>
      </main>

      {/* Modals */}
      <AddTradeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddTrade} 
      />
      <BrokerIntegrationModal 
        isOpen={isBrokerModalOpen} 
        onClose={() => setIsBrokerModalOpen(false)} 
        onConnect={handleConnectBroker} 
      />
    </div>
  );
}
