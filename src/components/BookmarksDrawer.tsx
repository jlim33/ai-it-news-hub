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
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (article: NewsArticle) => void;
}

export function BookmarksDrawer({
  isOpen,
  onClose,
  bookmarks,
  onSelectArticle,
  onRemoveBookmark,
}: BookmarksDrawerProps) {
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

  const formatKoreanTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko });
    } catch {
      return "방금 전";
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
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">저장한 기사 목록</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{bookmarks.length}개의 기사가 저장되어 있습니다</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <button
                onClick={handleExportJSON}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all"
                title="JSON으로 내보내기"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-300 mb-1">
                저장된 기사가 없습니다
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                기사 카드의 북마크 아이콘을 클릭하여 나중에 읽을 기사를 저장해 보세요.
              </p>
            </div>
          ) : (
            bookmarks.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 text-[10px]">
                      {art.source}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {formatKoreanTime(art.pubDate)}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {art.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {art.readTimeMinutes}분 분량
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(art);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="북마크 해제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={art.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                      title="원문 보기"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>총 {bookmarks.length}개 기사 보관</span>
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
