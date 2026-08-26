"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bookmark,
  ExternalLink,
  Volume2,
  Share2,
  Clock,
  Check,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react";
import { NewsArticle, ReactionState } from "@/lib/types";
import {
  getArticleReaction,
  toggleArticleReaction,
  getArticleComments
} from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

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
  const [reaction, setReaction] = useState<ReactionState>({
    userVote: null,
    likes: article.likes || 5,
    dislikes: article.dislikes || 0
  });
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    setReaction(getArticleReaction(article.id, article.likes || 5, article.dislikes || 0));
    const comments = getArticleComments(article.id);
    setCommentCount(comments.length);
  }, [article.id, article.likes, article.dislikes]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleArticleReaction(article.id, "like", article.likes || 5, article.dislikes || 0);
    setReaction({ ...updated });
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleArticleReaction(article.id, "dislike", article.likes || 5, article.dislikes || 0);
    setReaction({ ...updated });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getImpactBadge = (impact?: string) => {
    switch (impact) {
      case "매우 중요":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      case "높음":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "보통":
        return "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  let formattedDate = "방금 전";
  try {
    formattedDate = formatDistanceToNow(new Date(article.pubDate), { addSuffix: true, locale: ko });
  } catch {}

  if (viewMode === "list") {
    return (
      <div
        onClick={() => onOpenReader(article)}
        className="luxury-card group relative w-full p-4 sm:p-5 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
              {article.source}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{formattedDate}</span>
            <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${getImpactBadge(article.aiSummary?.impactScore)}`}>
              {article.aiSummary?.impactScore || "보통"}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">
            {article.title}
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-1">
            {article.aiSummary?.whyItMatters || article.contentSnippet}
          </p>
        </div>

        {/* Action Controls & Reactions */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          
          {/* Reaction Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold transition-all ${
                reaction.userVote === "like"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
              }`}
              title="좋아요"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{reaction.likes}</span>
            </button>
            <button
              onClick={handleDislike}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold transition-all ${
                reaction.userVote === "dislike"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-rose-600"
              }`}
              title="별로예요"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{reaction.dislikes}</span>
            </button>
          </div>

          {/* Comments Count Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenReader(article);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all"
            title="댓글 보기 / 작성"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>{commentCount}</span>
          </button>

          {/* AI Summary Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenReader(article);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 요약</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article);
            }}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600"
            }`}
            title={isBookmarked ? "북마크 해제" : "기사 저장"}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all"
            title="원문 기사 열기"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Grid View Card (Luxury Bright Style)
  return (
    <div
      onClick={() => onOpenReader(article)}
      className="luxury-card group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Source & Timestamp Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
              {article.source}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${getImpactBadge(article.aiSummary?.impactScore)}`}>
              {article.aiSummary?.impactScore || "보통"}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2 mb-3">
          {article.title}
        </h3>

        {/* Content Preview */}
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
          {article.contentSnippet}
        </p>

        {/* AI Key Bullet Callout */}
        {article.aiSummary?.tldr && article.aiSummary.tldr.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/40 mb-4 text-xs text-indigo-950 dark:text-indigo-200">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 핵심 분석</span>
            </div>
            <p className="line-clamp-2 leading-relaxed text-indigo-900/90 dark:text-indigo-200/90">
              {article.aiSummary.tldr[0]}
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {article.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
          <span className="text-[11px] text-slate-400 font-mono ml-auto flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {article.readTimeMinutes}분 분량
          </span>
        </div>
      </div>

      {/* Footer Interactive Actions & Reactions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        
        {/* Like & Dislike Reaction Bar */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold transition-all ${
              reaction.userVote === "like"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
            }`}
            title="좋아요"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{reaction.likes}</span>
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold transition-all ${
              reaction.userVote === "dislike"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-rose-600"
            }`}
            title="별로예요"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>{reaction.dislikes}</span>
          </button>
        </div>

        {/* Comments Count Badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenReader(article);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-all"
          title="댓글 열기"
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
          <span>{commentCount}</span>
        </button>

        {/* Right Tools */}
        <div className="flex items-center gap-1">
          {onPlayAudio && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const textToRead = `${article.title}. ${article.aiSummary?.whyItMatters || article.contentSnippet}`;
                onPlayAudio(textToRead);
              }}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all"
              title="음성으로 듣기"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all"
            title="링크 복사"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article);
            }}
            className={`p-1.5 rounded-xl border transition-all ${
              isBookmarked
                ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600"
            }`}
            title={isBookmarked ? "북마크 해제" : "기사 저장"}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all"
            title="원문 기사 열기"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
