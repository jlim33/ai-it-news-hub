"use client";

import React, { useState } from "react";
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
  Tag,
  Share2,
  Check,
  Building2,
  Flame,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { NewsArticle, AISummary } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { getStoredApiKey } from "@/lib/storage";

interface ArticleModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  // Audio state & handlers
  isPlayingAudio: boolean;
  isPausedAudio: boolean;
  onSpeak: (text: string) => void;
  onPauseAudio: () => void;
  onResumeAudio: () => void;
  onStopAudio: () => void;
}

export function ArticleModal({
  article,
  isOpen,
  onClose,
  isBookmarked,
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

  if (!isOpen || !article) return null;

  const currentSummary = customSummary || article.aiSummary;

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
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setCustomSummary(data.summary);
        }
      }
    } catch (err) {
      console.error("Failed to generate deep summary:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const textToRead = `${article.title}. Summary: ${currentSummary?.tldr?.join(". ") || article.contentSnippet}. Why it matters: ${currentSummary?.whyItMatters || ""}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
              {article.source}
            </span>
            <span className="text-slate-400 font-mono">
              {formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
              title="Share / Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Save Article"}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Article Title */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-3">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              {article.author && (
                <span>By <strong className="text-slate-300">{article.author}</strong></span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {article.readTimeMinutes} min read
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {article.category}
              </span>
            </div>
          </div>

          {/* Audio TTS Player Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Audio Executive Briefing
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isPlayingAudio
                    ? isPausedAudio
                      ? "Narration paused"
                      : "Playing audio briefing..."
                    : "Listen to instant AI speech narration"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isPlayingAudio ? (
                <button
                  onClick={() => onSpeak(textToRead)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen</span>
                </button>
              ) : (
                <>
                  {isPausedAudio ? (
                    <button
                      onClick={onResumeAudio}
                      className="p-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                      title="Resume"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={onPauseAudio}
                      className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold"
                      title="Pause"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                    </button>
                  )}
                  <button
                    onClick={onStopAudio}
                    className="p-2 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400 text-xs"
                    title="Stop Audio"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AI Intelligence Insights Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 via-slate-900 to-indigo-950/20 border border-purple-500/30 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm text-purple-300 uppercase tracking-wider">
                  AI Key Takeaways & Analysis
                </span>
              </div>

              <button
                onClick={handleDeepAIAnalysis}
                disabled={isGeneratingAI}
                className="px-3 py-1 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-[11px] font-semibold text-purple-300 transition-all flex items-center gap-1.5"
                title="Perform deep AI analysis with Gemini"
              >
                <Sparkles className={`w-3 h-3 ${isGeneratingAI ? "animate-spin" : ""}`} />
                <span>{isGeneratingAI ? "Analyzing..." : "Regenerate AI"}</span>
              </button>
            </div>

            {/* Bullets */}
            {currentSummary?.tldr && currentSummary.tldr.length > 0 && (
              <ul className="space-y-2.5 mb-5 text-sm text-slate-200">
                {currentSummary.tldr.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Why It Matters Box */}
            {currentSummary?.whyItMatters && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/20 text-xs text-purple-200">
                <span className="font-bold uppercase tracking-wider text-purple-400 block mb-1 text-[11px]">
                  💡 Why It Matters
                </span>
                <p className="leading-relaxed text-slate-300">{currentSummary.whyItMatters}</p>
              </div>
            )}

            {/* Meta tags: Impact & Entities */}
            <div className="mt-4 pt-4 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Impact Rating:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30">
                  {currentSummary?.impactScore || "High"}
                </span>
                <span className="text-slate-400 font-medium ml-2">Sentiment:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30">
                  {currentSummary?.sentiment || "Positive"}
                </span>
              </div>

              {currentSummary?.keyEntities && currentSummary.keyEntities.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {currentSummary.keyEntities.map((ent, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {ent}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Article Full Preview / Snippet */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Article Content
            </h3>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-slate-950/40 border border-slate-800">
              {article.fullContent || article.contentSnippet}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Modal Bottom Fixed Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all"
          >
            <span>Read Original on {article.source}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
