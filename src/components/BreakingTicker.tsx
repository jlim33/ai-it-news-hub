"use client";

import React from "react";
import { Flame, ChevronRight } from "lucide-react";
import { NewsArticle } from "@/lib/types";

interface BreakingTickerProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export function BreakingTicker({ articles, onSelectArticle }: BreakingTickerProps) {
  if (!articles || articles.length === 0) return null;

  const tickerArticles = articles.slice(0, 10);

  return (
    <div className="w-full bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden py-2 px-4 flex items-center gap-3 text-xs">
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-200 dark:border-red-500/30 text-rose-600 dark:text-red-400 font-extrabold tracking-wide uppercase shrink-0 shadow-sm">
        <Flame className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
        <span>실시간 속보 펄스</span>
      </div>

      <div className="relative overflow-hidden flex-1 group">
        <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] gap-8">
          {tickerArticles.concat(tickerArticles).map((art, idx) => (
            <button
              key={`${art.id}-${idx}`}
              onClick={() => onSelectArticle(art)}
              className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-blue-400 transition-colors cursor-pointer group/item font-medium"
            >
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                {art.source}
              </span>
              <span className="font-semibold">{art.title}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover/item:text-indigo-600 dark:group-hover/item:text-blue-400 transition-transform group-hover/item:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
