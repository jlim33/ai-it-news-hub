"use client";

import React from "react";
import { Sparkles, ArrowUpRight, Clock, Flame } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface HeroFeaturedProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export function HeroFeatured({ articles, onSelectArticle }: HeroFeaturedProps) {
  if (!articles || articles.length === 0) return null;

  const mainStory = articles[0];
  const sideStories = articles.slice(1, 4);

  const getImpactBadge = (impact?: string) => {
    switch (impact) {
      case "매우 중요":
        return "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
      case "높음":
        return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
      default:
        return "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800";
    }
  };

  const formatKoreanTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko });
    } catch {
      return "방금 전";
    }
  };

  return (
    <div className="w-full my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Hero Card (Luxury Bright Porcelain Glow) */}
        {mainStory && (
          <div
            onClick={() => onSelectArticle(mainStory)}
            className="lg:col-span-7 group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-blue-500 transition-all duration-300 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none group-hover:from-indigo-400/20 group-hover:to-purple-400/20 transition-all duration-500" />
            
            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  주요 헤드라인
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                  {mainStory.source}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getImpactBadge(mainStory.aiSummary?.impactScore)}`}>
                  영향도: {mainStory.aiSummary?.impactScore || "보통"}
                </span>
                <span className="text-xs text-slate-400 font-mono ml-auto">
                  {formatKoreanTime(mainStory.pubDate)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors leading-tight mb-4 tracking-tight">
                {mainStory.title}
              </h2>

              {/* Snippet */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed mb-6 font-medium">
                {mainStory.aiSummary?.whyItMatters || mainStory.contentSnippet}
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-indigo-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs bg-indigo-50 text-indigo-700 dark:bg-purple-500/10 dark:text-purple-300 border border-indigo-200 dark:border-purple-500/20 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
                  AI 분석 완료
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {mainStory.readTimeMinutes}분 분량
                </span>
              </div>

              <span className="flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                브리핑 보기 <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        )}

        {/* Side Spotlight Stories */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {sideStories.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectArticle(story)}
              className="luxury-card group p-4 sm:p-5 rounded-3xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span className="font-bold text-indigo-600 dark:text-blue-400 bg-indigo-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-blue-500/20">
                    {story.source}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {formatKoreanTime(story.pubDate)}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2 mb-2 leading-snug">
                  {story.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {story.category}
                </span>
                <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-blue-400 transition-colors">
                  AI 핵심 요약 <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
