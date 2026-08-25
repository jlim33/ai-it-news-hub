"use client";

import React from "react";
import { Zap, Flame, ChevronRight } from "lucide-react";
import { NewsArticle } from "@/lib/types";

interface BreakingTickerProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export function BreakingTicker({ articles, onSelectArticle }: BreakingTickerProps) {
  if (!articles || articles.length === 0) return null;

  const tickerArticles = articles.slice(0, 10);

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800/80 overflow-hidden py-2 px-4 flex items-center gap-3 text-xs">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 text-red-400 font-bold tracking-wide uppercase shrink-0 shadow-sm">
        <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
        <span>Trending Pulse</span>
      </div>

      <div className="relative overflow-hidden flex-1 group">
        <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] gap-8">
          {tickerArticles.concat(tickerArticles).map((art, idx) => (
            <button
              key={`${art.id}-${idx}`}
              onClick={() => onSelectArticle(art)}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors cursor-pointer group/item"
            >
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                {art.source}
              </span>
              <span className="font-medium">{art.title}</span>
              <ChevronRight className="w-3 h-3 text-slate-600 group-hover/item:text-blue-400 transition-transform group-hover/item:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
