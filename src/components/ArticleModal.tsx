"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Bookmark,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Share2,
  Check,
  Building2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react";
import { NewsArticle, AISummary, ReactionState } from "@/lib/types";
import {
  getStoredApiKey,
  getArticleReaction,
  toggleArticleReaction
} from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { CommentsSection } from "./CommentsSection";

interface ArticleModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  locale?: "ko" | "en";
  onToggleBookmark: (article: NewsArticle) => void;
  // Audio state & handlers
  isPlayingAudio: boolean;
  isPausedAudio: boolean;
  onSpeak: (text: string, lang?: "en" | "ko") => void;
  onPauseAudio: () => void;
  onResumeAudio: () => void;
  onStopAudio: () => void;
}

export function ArticleModal({
  article,
  isOpen,
  onClose,
  isBookmarked,
  locale = "ko",
  onToggleBookmark,
  isPlayingAudio,
  isPausedAudio,
  onSpeak,
  onPauseAudio,
  onResumeAudio,
  onStopAudio,
}: ArticleModalProps) {
  const [copied, setCopied] = useState(false);
  const [customSummary, setCustomSummary] = useState<AISummary | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [reaction, setReaction] = useState<ReactionState>({
    userVote: null,
    likes: 5,
    dislikes: 0
  });

  const isEn = locale === "en" || article?.lang === "en";

  useEffect(() => {
    if (article) {
      setReaction(getArticleReaction(article.id, article.likes || 5, article.dislikes || 0));
      setCustomSummary(null);
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const currentSummary = customSummary || article.aiSummary;

  const handleLike = () => {
    const updated = toggleArticleReaction(article.id, "like", article.likes || 5, article.dislikes || 0);
    setReaction({ ...updated });
  };

  const handleDislike = () => {
    const updated = toggleArticleReaction(article.id, "dislike", article.likes || 5, article.dislikes || 0);
    setReaction({ ...updated });
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeepAIAnalysis = async () => {
    try {
      setIsGeneratingAI(true);
      const userKey = getStoredApiKey();
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          content: article.fullContent || article.contentSnippet,
          category: article.category,
          apiKey: userKey,
          lang: isEn ? "en" : "ko"
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setCustomSummary(data.summary);
        }
      }
    } catch (err) {
      console.error("Deep summary error:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const textToRead = isEn
    ? `${article.title}. Summary: ${currentSummary?.tldr?.join(". ") || article.contentSnippet}. Why It Matters: ${currentSummary?.whyItMatters || ""}`
    : `${article.title}. 요약: ${currentSummary?.tldr?.join(". ") || article.contentSnippet}. 중요성: ${currentSummary?.whyItMatters || ""}`;

  let formattedDate = isEn ? "Just now" : "방금 전";
  try {
    if (isEn) {
      formattedDate = formatDistanceToNow(new Date(article.pubDate), { addSuffix: true });
    } else {
      formattedDate = formatDistanceToNow(new Date(article.pubDate), { addSuffix: true, locale: ko });
    }
  } catch {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
              {article.source}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              {formattedDate}
            </span>
          </div>

          {/* Action Header & Reactions */}
          <div className="flex items-center gap-2">
            
            {/* Reaction Buttons */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  reaction.userVote === "like"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:text-blue-600"
                }`}
                title={isEn ? "Like" : "좋아요"}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{reaction.likes}</span>
              </button>
              <button
                onClick={handleDislike}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  reaction.userVote === "dislike"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:text-rose-600"
                }`}
                title={isEn ? "Dislike" : "별로예요"}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{reaction.dislikes}</span>
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all"
              title={isEn ? "Share link" : "기사 링크 공유"}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-indigo-600"
              }`}
              title={isEn ? (isBookmarked ? "Remove bookmark" : "Save article") : (isBookmarked ? "북마크 해제" : "기사 저장")}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              title={isEn ? "Close (Esc)" : "창 닫기 (Esc)"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto space-y-6">
          
          {/* Article Title & Metadata */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              {article.author && (
                <span>{isEn ? "By:" : "작성자:"} <strong className="text-slate-800 dark:text-slate-200">{article.author}</strong></span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTimeMinutes} {isEn ? "min read" : "분 분량"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                {article.category}
              </span>
            </div>
          </div>

          {/* Audio TTS Player Banner (US Native Voice Supported) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border border-indigo-200/60 dark:border-blue-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-blue-400 border border-indigo-200 dark:border-blue-500/30">
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {isEn ? "AI Audio Briefing (US Native Voice)" : "AI 음성 뉴스 브리핑 (Audio)"}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isPlayingAudio
                    ? isPausedAudio
                      ? (isEn ? "Audio playback paused." : "음성 재생이 일시 정지되었습니다.")
                      : (isEn ? "AI voice is reading executive takeaways with native American accent..." : "AI 음성으로 기사 브리핑을 읽고 있습니다...")
                    : (isEn ? "Listen to full AI summary in natural US native voice" : "기사 요약을 음성으로 편안하게 들어보세요")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isPlayingAudio ? (
                <button
                  onClick={() => onSpeak(textToRead, isEn ? "en" : "ko")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isEn ? "Listen" : "듣기"}</span>
                </button>
              ) : (
                <>
                  {isPausedAudio ? (
                    <button
                      onClick={onResumeAudio}
                      className="p-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                      title={isEn ? "Resume" : "이어듣기"}
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={onPauseAudio}
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                      title={isEn ? "Pause" : "일시정지"}
                    >
                      <Pause className="w-4 h-4 fill-current" />
                    </button>
                  )}
                  <button
                    onClick={onStopAudio}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs"
                    title={isEn ? "Stop audio" : "재생 중단"}
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AI Intelligence Insights Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 dark:from-purple-950/30 dark:via-slate-900 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-purple-500/30 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-purple-500/20 text-indigo-700 dark:text-purple-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm text-indigo-950 dark:text-purple-300 tracking-wider">
                  {isEn ? "AI Executive Takeaways & Key Insights" : "AI 핵심 분석 & 시사점"}
                </span>
              </div>

              <button
                onClick={handleDeepAIAnalysis}
                disabled={isGeneratingAI}
                className="px-3 py-1 rounded-xl bg-indigo-100 dark:bg-purple-600/20 hover:bg-indigo-200 dark:hover:bg-purple-600/30 border border-indigo-200 dark:border-purple-500/30 text-[11px] font-semibold text-indigo-700 dark:text-purple-300 transition-all flex items-center gap-1.5"
                title={isEn ? "Regenerate AI analysis" : "Gemini AI 심층 분석 재생성"}
              >
                <Sparkles className={`w-3 h-3 ${isGeneratingAI ? "animate-spin" : ""}`} />
                <span>{isGeneratingAI ? (isEn ? "Analyzing..." : "분석 중...") : (isEn ? "Re-analyze" : "AI 재분석")}</span>
              </button>
            </div>

            {/* Bullets */}
            {currentSummary?.tldr && currentSummary.tldr.length > 0 && (
              <ul className="space-y-2.5 mb-5 text-sm text-slate-800 dark:text-slate-200">
                {currentSummary.tldr.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Why It Matters Box */}
            {currentSummary?.whyItMatters && (
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-indigo-100 dark:border-purple-500/20 text-xs shadow-sm">
                <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-purple-400 block mb-1 text-[11px]">
                  💡 {isEn ? "WHY IT MATTERS" : "왜 중요한가 (Why It Matters)"}
                </span>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  {currentSummary.whyItMatters}
                </p>
              </div>
            )}

            {/* Meta Tags: Impact & Sentiment & Entities */}
            <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{isEn ? "Impact:" : "영향도:"}</span>
                <span className="font-bold text-indigo-700 dark:text-white px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-purple-500/20 border border-indigo-200 dark:border-purple-500/30">
                  {currentSummary?.impactScore || (isEn ? "Moderate" : "보통")}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium ml-2">{isEn ? "Sentiment:" : "시장 감성:"}</span>
                <span className="font-bold text-blue-700 dark:text-white px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-indigo-500/20 border border-blue-200 dark:border-indigo-500/30">
                  {currentSummary?.sentiment || (isEn ? "Positive" : "긍정적")}
                </span>
              </div>

              {currentSummary?.keyEntities && currentSummary.keyEntities.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {currentSummary.keyEntities.map((ent, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                      {ent}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Article Full Preview / Snippet */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isEn ? "Original Story Preview" : "기사 본문 요약"}
            </h3>
            <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
              {article.fullContent || article.contentSnippet}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                #{tag}
              </span>
            ))}
          </div>

          {/* Real-Time Comments & Discussion Section */}
          <CommentsSection articleId={article.id} locale={isEn ? "en" : "ko"} />

        </div>

        {/* Modal Bottom Fixed Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            {isEn ? "Close" : "닫기"}
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all"
          >
            <span>{isEn ? `Read Full Story on ${article.source}` : `${article.source} 원문 기사 보기`}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
