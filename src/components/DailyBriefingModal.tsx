"use client";

import React, { useState } from "react";
import { X, Sparkles, Copy, Check, Download, Send, SendHorizontal, AlertCircle, CheckCircle2 } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { generateDailyBriefingMarkdown } from "@/lib/aiSummarizer";

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
}

export function DailyBriefingModal({ isOpen, onClose, articles }: DailyBriefingModalProps) {
  const [copied, setCopied] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState("https://formspree.io/f/xgawgzrv");
  const [emailInput, setEmailInput] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"idle" | "success" | "error">("idle");
  const [publishMsg, setPublishMsg] = useState("");

  if (!isOpen) return null;

  const markdownContent = generateDailyBriefingMarkdown(articles);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-it-daily-briefing-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePublishToFormspree = async () => {
    if (!endpointUrl.trim()) {
      setPublishStatus("error");
      setPublishMsg("Formspree 엔드포인트 URL을 입력해주세요.");
      return;
    }

    try {
      setIsPublishing(true);
      setPublishStatus("idle");
      setPublishMsg("");

      const payload: any = {
        subject: `⚡ [AI & IT News Pulse] 일일 뉴스 브리핑 (${new Date().toISOString().slice(0, 10)})`,
        message: markdownContent,
        summary: `오늘의 주요 AI & IT 뉴스 ${Math.min(8, articles.length)}건 브리핑`,
        top_story: articles[0]?.title || "N/A",
        source: "AI & IT News Pulse Web App",
        timestamp: new Date().toISOString(),
      };

      if (emailInput.trim()) {
        payload.email = emailInput.trim();
      }

      const res = await fetch(endpointUrl.trim(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setPublishStatus("success");
        setPublishMsg("Formspree를 통해 브리핑이 성공적으로 전송/발행되었습니다! (Status: 200)");
      } else {
        const errorData = await res.json().catch(() => ({}));
        setPublishStatus("error");
        setPublishMsg(errorData.error || `전송 실패 (HTTP ${res.status})`);
      }
    } catch (err: any) {
      setPublishStatus("error");
      setPublishMsg(err.message || "네트워크 오류가 발생했습니다.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                일일 AI & IT 뉴스레터 브리핑 생성기
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                오늘의 주요 AI & IT 핵심 뉴스 요약 및 Formspree 자동 발행
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formspree Publish Banner */}
        <div className="p-4 mx-6 mt-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 dark:from-blue-950/40 dark:via-purple-950/30 dark:to-slate-950/50 border border-indigo-200/80 dark:border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                Formspree 이메일 / 뉴스레터 자동 발행
              </span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold font-mono">
              Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <input
              type="text"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              placeholder="https://formspree.io/f/..."
              className="sm:col-span-8 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 font-mono outline-none focus:border-indigo-500"
            />
            <button
              onClick={handlePublishToFormspree}
              disabled={isPublishing}
              className={`sm:col-span-4 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
                isPublishing ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <SendHorizontal className={`w-3.5 h-3.5 ${isPublishing ? "animate-spin" : ""}`} />
              <span>{isPublishing ? "발행 중..." : "Formspree로 발행"}</span>
            </button>
          </div>

          {publishStatus === "success" && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{publishMsg}</span>
            </div>
          )}

          {publishStatus === "error" && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{publishMsg}</span>
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between gap-3 mt-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            마크다운 템플릿 미리보기
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.md 파일 다운로드</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "복사 완료!" : "마크다운 복사"}</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-6 max-h-[48vh] overflow-y-auto bg-slate-50/70 dark:bg-slate-950/60 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
          {markdownContent}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Formspree, 슬랙, 디스코드, 사내 뉴스레터 등에 바로 붙여넣어 활용하세요.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
