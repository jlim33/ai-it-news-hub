"use client";

import React, { useState } from "react";
import {
  RotateCw,
  Search,
  Bookmark,
  Sparkles,
  Rss,
  Clock,
  X
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSyncing: boolean;
  onSyncNow: () => void;
  nextSyncIn: number; // seconds
  lastSynced: Date | null;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenBriefing: () => void;
  onOpenFeedManager: () => void;
  sortBy: "latest" | "popular" | "readTime";
  onSortChange: (sort: "latest" | "popular" | "readTime") => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  isSyncing,
  onSyncNow,
  nextSyncIn,
  lastSynced,
  bookmarkCount,
  onOpenBookmarks,
  onOpenBriefing,
  onOpenFeedManager,
}: HeaderProps) {
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Live Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
              ⚡
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                  AI & IT 펄스
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-blue-500/10 dark:text-blue-400 border border-indigo-200/80 dark:border-blue-500/20 uppercase tracking-wider">
                  실시간 피드
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-500" />
                  자동 갱신: <strong className="text-slate-800 dark:text-slate-200 font-bold">{formatSeconds(nextSyncIn)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="AI 논문, 모델, 반도체, 보안, 빅테크 소식 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-2xl text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 focus:border-indigo-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              className="md:hidden p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
              title="검색"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Manual Sync Button */}
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              className={`p-2 sm:px-3.5 sm:py-2 rounded-2xl border border-indigo-200 dark:border-blue-500/30 bg-indigo-50 dark:bg-blue-600/10 hover:bg-indigo-100 dark:hover:bg-blue-600/20 text-indigo-700 dark:text-blue-400 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm ${
                isSyncing ? "opacity-75 cursor-not-allowed" : ""
              }`}
              title="최신 뉴스 즉시 새로고침"
            >
              <RotateCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-indigo-600" : ""}`} />
              <span className="hidden sm:inline">{isSyncing ? "수집 중..." : "새로고침"}</span>
            </button>

            {/* Language Switcher */}
            <a
              href="/en"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs transition-all"
              title="영문 에디션 보기 (English Global Edition)"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-500" />
              <span>🇺🇸 English</span>
            </a>

            {/* Daily Briefing Generator */}
            <button
              onClick={onOpenBriefing}
              className="p-2 sm:px-3.5 sm:py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all flex items-center gap-1.5 text-xs font-bold shadow-md shadow-indigo-500/20"
              title="일일 AI 브리핑 및 뉴스레터 발행"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">AI 브리핑</span>
            </button>

            {/* Bookmarks Drawer Trigger */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all shadow-sm"
              title="저장한 기사 목록"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-indigo-600 rounded-full shadow-md">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* RSS Feed Manager */}
            <button
              onClick={onOpenFeedManager}
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all shadow-sm"
              title="피드 소스 관리"
            >
              <Rss className="w-4 h-4 text-amber-500" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Search Input Expanded */}
        {showSearchMobile && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="AI 논문, 모델, 반도체, 보안 소식 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-9 py-2 rounded-2xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
