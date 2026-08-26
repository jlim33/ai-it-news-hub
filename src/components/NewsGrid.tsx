"use client";

import React, { useState } from "react";
import { NewsArticle } from "@/lib/types";
import { NewsCard } from "./NewsCard";
import { SearchX } from "lucide-react";

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
              className="rounded-3xl p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 animate-pulse flex flex-col justify-between h-72 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-20 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
                <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                <div className="w-full h-12 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div className="w-24 h-7 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="w-16 h-7 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
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
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-slate-800/60 flex items-center justify-center text-indigo-500 mb-4 border border-indigo-100 dark:border-slate-700 shadow-sm">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          검색된 뉴스가 없습니다
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-md mb-6">
          선택하신 카테고리나 검색어에 일치하는 기사가 없습니다. 필터를 초기화해 보세요.
        </p>
        <button
          onClick={onResetFilters}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
        >
          모든 필터 초기화
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
            className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <span>더 많은 기사 불러오기 ({articles.length - displayCount}개 남음)</span>
          </button>
        </div>
      )}
    </div>
  );
}
