"use client";

import React from "react";
import { X, Bookmark, Trash2, ExternalLink, Sparkles, Clock, Download } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Saved Articles</h2>
              <p className="text-xs text-slate-400">{bookmarks.length} articles saved for later</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <button
                onClick={handleExportJSON}
                className="p-2 rounded-xl border border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
                title="Export Bookmarks (JSON)"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300 mb-1">No saved articles yet</p>
              <p className="text-xs text-slate-400 max-w-xs">
                Click the bookmark icon on any news card to save it for offline or later reading.
              </p>
            </div>
          ) : (
            bookmarks.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 text-[10px]">
                      {art.source}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {formatDistanceToNow(new Date(art.pubDate), { addSuffix: true })}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {art.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {art.readTimeMinutes} min
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(art);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={art.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"
                      title="Open source"
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
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>{bookmarks.length} saved</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
