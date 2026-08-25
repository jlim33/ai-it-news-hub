"use client";

import React from "react";
import { Sparkles, ArrowUpRight, Clock, ShieldCheck, Flame, BookOpen } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

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
      case "Critical":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "High":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="w-full my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Hero Card (Left 7 Cols) */}
        {mainStory && (
          <div
            onClick={() => onSelectArticle(mainStory)}
            className="lg:col-span-7 group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-slate-700/60 hover:border-blue-500/60 transition-all duration-300 shadow-xl hover:shadow-blue-500/10 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/25 transition-all duration-500" />
            
            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                  <Flame className="w-3.5 h-3.5" />
                  Top Story
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {mainStory.source}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getImpactBadge(mainStory.aiSummary?.impactScore)}`}>
                  Impact: {mainStory.aiSummary?.impactScore || "High"}
                </span>
                <span className="text-xs text-slate-400 font-mono ml-auto">
                  {formatDistanceToNow(new Date(mainStory.pubDate), { addSuffix: true })}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white group-hover:text-blue-300 transition-colors leading-tight mb-4">
                {mainStory.title}
              </h2>

              {/* Snippet / AI Bullet */}
              <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed mb-6">
                {mainStory.aiSummary?.whyItMatters || mainStory.contentSnippet}
              </p>
            </div>

            {/* Footer Insights */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  AI Analyzed
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {mainStory.readTimeMinutes} min read
                </span>
              </div>

              <span className="flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-transform">
                Read Briefing <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        )}

        {/* Side Spotlight Stories (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {sideStories.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectArticle(story)}
              className="group p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span className="font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {story.source}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {formatDistanceToNow(new Date(story.pubDate), { addSuffix: true })}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
                  {story.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                <span className="text-[11px] text-slate-400">
                  {story.category}
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-400 group-hover:text-blue-400 transition-colors">
                  AI Summary <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
