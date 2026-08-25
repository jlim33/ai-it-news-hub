"use client";

import React, { useState } from "react";
import {
  RotateCw,
  Search,
  Bookmark,
  Sparkles,
  Rss,
  Clock,
  Radio,
  SlidersHorizontal,
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
  sortBy,
  onSortChange,
}: HeaderProps) {
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Live Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/20 text-white font-black text-xl">
              ⚡
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  AI & IT PULSE
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  Live Feed
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Auto-sync: <strong className="text-slate-200">{formatSeconds(nextSyncIn)}</strong>
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
                placeholder="Search AI research, models, GPUs, security..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-slate-900/90 border border-slate-700/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder-slate-500 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
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
              className="md:hidden p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Manual Sync Button */}
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border border-blue-500/30 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md shadow-sm ${
                isSyncing ? "opacity-75 cursor-not-allowed" : ""
              }`}
              title="Sync latest RSS feeds now"
            >
              <RotateCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-blue-400" : ""}`} />
              <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Refresh"}</span>
            </button>

            {/* Daily Briefing Generator */}
            <button
              onClick={onOpenBriefing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-purple-500/30 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 hover:text-purple-300 transition-all flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md shadow-sm"
              title="Generate Daily AI Briefing & Newsletter"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">AI Briefing</span>
            </button>

            {/* Bookmarks Drawer Trigger */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-xl border border-slate-700/60 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-all"
              title="Saved Articles"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-blue-600 rounded-full border-2 border-slate-950 shadow-md">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* RSS Feed Manager */}
            <button
              onClick={onOpenFeedManager}
              className="p-2 rounded-xl border border-slate-700/60 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-all"
              title="Manage Feed Sources"
            >
              <Rss className="w-4 h-4 text-amber-400" />
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
                placeholder="Search AI research, models, GPUs..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:border-blue-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
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
