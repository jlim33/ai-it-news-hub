"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bookmark,
  ExternalLink,
  Volume2,
  Share2,
  Clock,
  Check,
  Tag
} from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onOpenReader: (article: NewsArticle) => void;
  onPlayAudio?: (text: string) => void;
  viewMode?: "grid" | "list";
}

export function NewsCard({
  article,
  isBookmarked,
  onToggleBookmark,
  onOpenReader,
  onPlayAudio,
  viewMode = "grid",
}: NewsCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case "Critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "High":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const formattedDate = formatDistanceToNow(new Date(article.pubDate), { addSuffix: true });

  if (viewMode === "list") {
    return (
      <div
        onClick={() => onOpenReader(article)}
        className="group relative w-full p-4 sm:p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md"
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
            <span className="font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
              {article.source}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{formattedDate}</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${getImpactColor(article.aiSummary?.impactScore)}`}>
              {article.aiSummary?.impactScore || "Medium"} Impact
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors line-clamp-1 mb-1.5">
            {article.title}
          </h3>

          <p className="text-slate-400 text-xs sm:text-sm line-clamp-1">
            {article.aiSummary?.whyItMatters || article.contentSnippet}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenReader(article);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all"
            title="Read AI Summary & Details"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Brief</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article);
            }}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? "bg-blue-600 border-blue-500 text-white"
                : "border-slate-800 bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Article"}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-all"
            title="Open original publication"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenReader(article)}
      className="group relative rounded-3xl p-5 sm:p-6 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Source & Timestamp Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20">
              {article.source}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${getImpactColor(article.aiSummary?.impactScore)}`}>
              {article.aiSummary?.impactScore || "Medium"}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors leading-snug line-clamp-2 mb-3">
          {article.title}
        </h3>

        {/* Content Preview */}
        <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
          {article.contentSnippet}
        </p>

        {/* AI Key Bullet Callout if available */}
        {article.aiSummary?.tldr && article.aiSummary.tldr.length > 0 && (
          <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 mb-4 text-xs text-purple-200">
            <div className="flex items-center gap-1 font-semibold text-[11px] text-purple-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Key Takeaway</span>
            </div>
            <p className="line-clamp-2 leading-relaxed text-purple-200/90">
              {article.aiSummary.tldr[0]}
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {article.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400"
            >
              #{tag}
            </span>
          ))}
          <span className="text-[11px] text-slate-400 font-mono ml-auto flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {article.readTimeMinutes} min
          </span>
        </div>
      </div>

      {/* Footer Interactive Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        
        {/* Left AI Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenReader(article);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 hover:text-purple-300 border border-purple-500/30 text-xs font-bold transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Summary</span>
        </button>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5">
          {onPlayAudio && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const textToRead = `${article.title}. ${article.aiSummary?.whyItMatters || article.contentSnippet}`;
                onPlayAudio(textToRead);
              }}
              className="p-2 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-all"
              title="Listen to summary"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-all"
            title="Copy article link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article);
            }}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? "bg-blue-600 border-blue-500 text-white"
                : "border-slate-800 bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Article"}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-blue-400 transition-all"
            title="Open original article"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
