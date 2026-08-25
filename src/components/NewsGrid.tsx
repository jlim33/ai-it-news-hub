"use client";

import React, { useState } from "react";
import { NewsArticle } from "@/lib/types";
import { NewsCard } from "./NewsCard";
import { RotateCw, SearchX, Sparkles } from "lucide-react";

interface NewsGridProps {
  articles: NewsArticle[];
  loading: boolean;
  viewMode: "grid" | "list";
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onSelectArticle: (article: NewsArticle) => void;
  onPlayAudio?: (text: string) => void;
  onResetFilters: () => void;
}

export function NewsGrid({
  articles,
  loading,
  viewMode,
  isBookmarked,
  onToggleBookmark,
  onSelectArticle,
  onPlayAudio,
  onResetFilters,
}: NewsGridProps) {
  const [displayCount, setDisplayCount] = useState(24);

  if (loading && articles.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 bg-slate-900/40 border border-slate-800 animate-pulse flex flex-col justify-between h-72"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-20 h-5 bg-slate-800 rounded-lg"></div>
                  <div className="w-16 h-4 bg-slate-800 rounded"></div>
                </div>
                <div className="w-full h-6 bg-slate-800 rounded mb-3"></div>
                <div className="w-3/4 h-6 bg-slate-800 rounded mb-4"></div>
                <div className="w-full h-12 bg-slate-800/60 rounded"></div>
              </div>
              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div className="w-24 h-7 bg-slate-800 rounded-xl"></div>
                <div className="w-16 h-7 bg-slate-800 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-400 mb-4 border border-slate-700">
          <SearchX className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-200 mb-2">No news items found</h3>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          No articles match your active search or category filters. Try adjusting your query or resetting filters.
        </p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  const visibleArticles = articles.slice(0, displayCount);
  const hasMore = articles.length > displayCount;

  return (
    <div className="w-full py-6">
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-3"
        }
      >
        {visibleArticles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            isBookmarked={isBookmarked(article.id)}
            onToggleBookmark={onToggleBookmark}
            onOpenReader={onSelectArticle}
            onPlayAudio={onPlayAudio}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="w-full flex justify-center mt-10">
          <button
            onClick={() => setDisplayCount((prev) => prev + 24)}
            className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-blue-500/60 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <span>Load More Articles ({articles.length - displayCount} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
}
