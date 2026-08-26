"use client";

import React from "react";
import { X, Bookmark, Trash2, ExternalLink, Clock, Download } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: NewsArticle[];
  locale?: "ko" | "en";
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (article: NewsArticle) => void;
}

export function BookmarksDrawer({
  isOpen,
  onClose,
  bookmarks,
  locale = "ko",
  onSelectArticle,
  onRemoveBookmark,
}: BookmarksDrawerProps) {
  const isEn = locale === "en";
  if (!isOpen) return null;

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(bookmarks, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saved-ai-news-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (dateStr: string) => {
    try {
      if (isEn) {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
      }
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko });
    } catch {
      return isEn ? "Just now" : "방금 전";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isEn ? "Saved Bookmarks" : "보관된 북마크"} ({bookmarks.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? "Offline local persistent reading list" : "오프라인 로컬 저장 기사 모음"}
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

        {/* Bookmarks List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {bookmarks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs">
              <Bookmark className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-700 stroke-1" />
              <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">
                {isEn ? "No bookmarks saved yet" : "저장된 북마크가 없습니다"}
              </p>
              <p className="text-slate-400">
                {isEn ? "Click the bookmark icon on any card to save it here." : "뉴스 카드의 북마크 아이콘을 눌러 중요한 뉴스를 보관해보세요."}
              </p>
            </div>
          ) : (
            bookmarks.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  onSelectArticle(art);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px]">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {art.source}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {formatTime(art.pubDate)}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-2">
                  {art.title}
                </h4>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">
                    {art.category}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(art);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                    title={isEn ? "Remove bookmark" : "북마크 제거"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {bookmarks.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
            <button
              onClick={handleExportJSON}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Download className="w-4 h-4 text-indigo-500" />
              <span>{isEn ? "Export Bookmarks as JSON" : "JSON으로 내보내기"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
