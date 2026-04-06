import React from 'react';
import { Newspaper, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { NewsItem } from '../types';
import { cn } from '../lib/utils';

interface NewsPanelProps {
  news: NewsItem[];
}

export const NewsPanel: React.FC<NewsPanelProps> = ({ news }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-3 h-3 text-emerald-500" />;
      case 'negative': return <TrendingDown className="w-3 h-3 text-rose-500" />;
      default: return <Minus className="w-3 h-3 text-amber-500" />;
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Market Sentiment & News</h3>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="group p-4 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 rounded-lg transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                  {item.source}
                </span>
                <span className="text-[10px] text-gray-500">{item.timestamp}</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
                item.sentiment === 'positive' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                item.sentiment === 'negative' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}>
                {getSentimentIcon(item.sentiment)}
                {item.sentiment.toUpperCase()}
              </div>
            </div>
            <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors mb-2">
              {item.title}
            </h4>
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {item.summary}
            </p>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2 text-xs font-medium text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 rounded-lg transition-all flex items-center justify-center gap-2">
        <MessageSquare className="w-3 h-3" />
        View All Market News
      </button>
    </div>
  );
};
