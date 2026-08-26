"use client";

import React, { useState, useEffect } from "react";
import {
  RotateCw,
  Search,
  Bookmark,
  Sparkles,
  Rss,
  Clock,
  X,
  Languages,
  Flame,
  ChevronRight,
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Volume2,
  Share2,
  ExternalLink,
  Check,
  ArrowUp,
  Globe,
  Layers,
  BookOpen,
  Cpu,
  ShieldAlert,
  Cloud,
  GitBranch,
  ArrowUpDown,
  LayoutGrid,
  List,
  SearchX
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArticleModal } from "@/components/ArticleModal";
import { DailyBriefingModal } from "@/components/DailyBriefingModal";
import { FeedManagerModal } from "@/components/FeedManagerModal";
import { BookmarksDrawer } from "@/components/BookmarksDrawer";

import { useBookmarks } from "@/hooks/useBookmarks";
import { useSpeech } from "@/hooks/useSpeech";
import { NewsArticle, Category, ReactionState } from "@/lib/types";
import { getArticleReaction, toggleArticleReaction, getArticleComments } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";

const EN_CATEGORIES: { name: Category; label: string; icon: any }[] = [
  { name: "All", label: "All News", icon: Layers },
  { name: "Generative AI", label: "Generative AI", icon: Sparkles },
  { name: "LLMs & Research", label: "LLMs & Research", icon: BookOpen },
  { name: "Chips & Hardware", label: "Chips & Hardware", icon: Cpu },
  { name: "Cybersecurity", label: "Cybersecurity", icon: ShieldAlert },
  { name: "Cloud & DevOps", label: "Cloud & DevOps", icon: Cloud },
  { name: "Open Source", label: "Open Source", icon: GitBranch },
  { name: "Big Tech", label: "Big Tech", icon: Flame },
];

export default function EnglishGlobalPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "readTime">("latest");
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [nextSyncIn, setNextSyncIn] = useState<number>(15 * 60);
  const [refreshInterval, setRefreshInterval] = useState<number>(15);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { isPlaying, isPaused, speak, pause, resume, stop } = useSpeech();

  // Modals & Drawers
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isFeedManagerOpen, setIsFeedManagerOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append("lang", "en"); // Fetch ONLY English global feeds
      if (category !== "All" && category !== "전체") params.append("category", category);
      if (searchQuery) params.append("search", searchQuery);
      params.append("sortBy", sortBy);
      params.append("limit", "100");

      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch news feed");
      const data = await res.json();
      setArticles(data.articles || []);
      if (data.updatedAt) setLastSynced(new Date(data.updatedAt));
    } catch (err: any) {
      setError(err.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, searchQuery, sortBy]);

  const syncNow = async () => {
    try {
      setIsSyncing(true);
      await fetch("/api/news/sync", { method: "POST" });
      await fetchNews();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSelectArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleCloseArticleModal = () => {
    setIsArticleModalOpen(false);
    setSelectedArticle(null);
    stop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  const mainStory = articles[0];
  const sideStories = articles.slice(1, 4);

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300">
      
      {/* 100% English Global Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
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
                    AI & IT Pulse
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-blue-500/10 dark:text-blue-400 border border-indigo-200/80 dark:border-blue-500/20 uppercase tracking-wider">
                    Global Live
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    Auto-refresh: <strong className="text-slate-800 dark:text-slate-200 font-bold">{formatSeconds(nextSyncIn)}</strong>
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
                  placeholder="Search AI research, models, GPUs, cybersecurity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 rounded-2xl text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 focus:border-indigo-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Language Switcher to Korean Version */}
              <a
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs transition-all"
                title="Switch to Korean Edition (한국어 버전)"
              >
                <Languages className="w-3.5 h-3.5 text-indigo-500" />
                <span>🇰🇷 한국어</span>
              </a>

              {/* Manual Sync Button */}
              <button
                onClick={syncNow}
                disabled={isSyncing}
                className={`p-2 sm:px-3.5 sm:py-2 rounded-2xl border border-indigo-200 dark:border-blue-500/30 bg-indigo-50 dark:bg-blue-600/10 hover:bg-indigo-100 dark:hover:bg-blue-600/20 text-indigo-700 dark:text-blue-400 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm ${
                  isSyncing ? "opacity-75 cursor-not-allowed" : ""
                }`}
                title="Refresh all feeds now"
              >
                <RotateCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-indigo-600" : ""}`} />
                <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync"}</span>
              </button>

              {/* Daily Briefing Generator */}
              <button
                onClick={() => setIsBriefingOpen(true)}
                className="p-2 sm:px-3.5 sm:py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all flex items-center gap-1.5 text-xs font-bold shadow-md shadow-indigo-500/20"
                title="Daily Intelligence Digest"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">AI Digest</span>
              </button>

              {/* Bookmarks Drawer Trigger */}
              <button
                onClick={() => setIsBookmarksOpen(true)}
                className="relative p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all shadow-sm"
                title="Saved bookmarks"
              >
                <Bookmark className="w-4 h-4" />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-indigo-600 rounded-full shadow-md">
                    {bookmarks.length}
                  </span>
                )}
              </button>

              {/* RSS Feed Manager */}
              <button
                onClick={() => setIsFeedManagerOpen(true)}
                className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all shadow-sm"
                title="Feed Sources Manager"
              >
                <Rss className="w-4 h-4 text-amber-500" />
              </button>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Breaking Marquee */}
      {articles.length > 0 && (
        <div className="w-full bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden py-2 px-4 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-200 dark:border-red-500/30 text-rose-600 dark:text-red-400 font-extrabold tracking-wide uppercase shrink-0 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
            <span>Live Breaking Pulse</span>
          </div>

          <div className="relative overflow-hidden flex-1 group">
            <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] gap-8">
              {articles.slice(0, 10).concat(articles.slice(0, 10)).map((art, idx) => (
                <button
                  key={`${art.id}-${idx}`}
                  onClick={() => handleSelectArticle(art)}
                  className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-blue-400 transition-colors cursor-pointer group/item font-medium"
                >
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                    {art.source}
                  </span>
                  <span className="font-semibold">{art.title}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover/item:text-indigo-600 dark:group-hover/item:text-blue-400 transition-transform group-hover/item:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner with Korean Switcher */}
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider mb-0.5">
              <span>🌐 Global Edition (English Mode)</span>
            </div>
            <p className="text-xs text-blue-100">
              Live AI & Tech intelligence curated from top global labs (OpenAI, arXiv, TechCrunch, The Verge, AWS, etc.).
            </p>
          </div>

          <a
            href="/"
            className="px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border border-white/20"
          >
            <span>🇰🇷 한국어 버전으로 이동</span>
          </a>
        </div>

        {/* Hero Stories */}
        {category === "All" && !searchQuery && articles.length > 0 && mainStory && (
          <div className="w-full my-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div
                onClick={() => handleSelectArticle(mainStory)}
                className="lg:col-span-7 group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-blue-500 transition-all duration-300 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      Top Story
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                      {mainStory.source}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-auto">
                      {formatTime(mainStory.pubDate)}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors leading-tight mb-4 tracking-tight">
                    {mainStory.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed mb-6 font-medium">
                    {mainStory.aiSummary?.whyItMatters || mainStory.contentSnippet}
                  </p>
                </div>

                <div className="pt-4 border-t border-indigo-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs bg-indigo-50 text-indigo-700 dark:bg-purple-500/10 dark:text-purple-300 border border-indigo-200 dark:border-purple-500/20 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
                      AI Synthesized
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {mainStory.readTimeMinutes} min read
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                    Read Takeaways <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Side Stories */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {sideStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => handleSelectArticle(story)}
                    className="luxury-card group p-4 sm:p-5 rounded-3xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                        <span className="font-bold text-indigo-600 dark:text-blue-400 bg-indigo-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-blue-500/20">
                          {story.source}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {formatTime(story.pubDate)}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2 mb-2 leading-snug">
                        {story.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {story.category}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-blue-400 transition-colors">
                        AI TL;DR <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* English Category Navigation */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            {EN_CATEGORIES.map(({ name, label, icon: Icon }) => {
              const isSelected = category === name;
              const count = name === "All" ? articles.length : articles.filter(a => a.category === name).length;

              return (
                <button
                  key={name}
                  onClick={() => setCategory(name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-lg shadow-indigo-500/25 scale-[1.02]"
                      : "bg-white/90 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 shadow-sm"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-indigo-500"}`} />
                  <span>{label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? "bg-indigo-700 text-indigo-100" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-700 dark:text-slate-300 font-bold outline-none cursor-pointer pr-1"
              >
                <option value="latest" className="bg-white dark:bg-slate-900">Latest</option>
                <option value="popular" className="bg-white dark:bg-slate-900">Most Upvoted</option>
                <option value="readTime" className="bg-white dark:bg-slate-900">Quick Reads</option>
              </select>
            </div>

            <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-xl transition-all ${viewMode === "list" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Header */}
        {searchQuery && (
          <div className="py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Search results for: &quot;{searchQuery}&quot; ({articles.length} stories)
            </h2>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-indigo-600 hover:text-indigo-700 underline font-bold"
            >
              Clear search
            </button>
          </div>
        )}

        {/* English Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {articles.map((article) => (
            <EnglishCard
              key={article.id}
              article={article}
              isBookmarked={isBookmarked(article.id)}
              onToggleBookmark={toggleBookmark}
              onOpenReader={handleSelectArticle}
              onPlayAudio={speak}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-slate-200 text-sm">⚡ AI & IT Pulse</span>
            <span>•</span>
            <span>Global Real-Time Tech Intelligence & Automated AI Syntheses</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              className="hover:text-indigo-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors font-semibold"
            >
              <Globe className="w-3.5 h-3.5" />
              Korean Edition (한국어)
            </a>
            <button
              onClick={() => setIsBriefingOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Daily Digest
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all ml-2 shadow-xs"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isArticleModalOpen}
        onClose={handleCloseArticleModal}
        isBookmarked={selectedArticle ? isBookmarked(selectedArticle.id) : false}
        locale="en"
        onToggleBookmark={toggleBookmark}
        isPlayingAudio={isPlaying}
        isPausedAudio={isPaused}
        onSpeak={speak}
        onPauseAudio={pause}
        onResumeAudio={resume}
        onStopAudio={stop}
      />

      <DailyBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        articles={articles}
        locale="en"
      />

      <FeedManagerModal
        isOpen={isFeedManagerOpen}
        onClose={() => setIsFeedManagerOpen(false)}
        onFeedsUpdated={fetchNews}
        refreshInterval={refreshInterval}
        locale="en"
        onUpdateRefreshInterval={setRefreshInterval}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        locale="en"
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={toggleBookmark}
      />
    </div>
  );
}

function EnglishCard({
  article,
  isBookmarked,
  onToggleBookmark,
  onOpenReader,
  onPlayAudio
}: {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggleBookmark: (art: NewsArticle) => void;
  onOpenReader: (art: NewsArticle) => void;
  onPlayAudio?: (text: string) => void;
}) {
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

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  return (
    <div
      onClick={() => onOpenReader(article)}
      className="luxury-card group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Source Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
            {article.source}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {formatTime(article.pubDate)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2 mb-3">
          {article.title}
        </h3>

        {/* Snippet */}
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
          {article.contentSnippet}
        </p>

        {/* AI Key Bullet */}
        {article.aiSummary?.tldr && article.aiSummary.tldr.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/40 mb-4 text-xs text-indigo-950 dark:text-indigo-200">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Executive Takeaway</span>
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
            {article.readTimeMinutes} min read
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        
        {/* Like & Dislike */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold transition-all ${
              reaction.userVote === "like"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
            }`}
            title="Like"
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
            title="Dislike"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>{reaction.dislikes}</span>
          </button>
        </div>

        {/* Comments Count */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenReader(article);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-all"
          title="Open comments"
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
          <span>{commentCount}</span>
        </button>

        {/* Tools */}
        <div className="flex items-center gap-1">
          {onPlayAudio && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const textToRead = `${article.title}. ${article.aiSummary?.whyItMatters || article.contentSnippet}`;
                onPlayAudio(textToRead);
              }}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all"
              title="Listen to audio briefing"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all"
            title="Copy link"
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
            title={isBookmarked ? "Remove bookmark" : "Save article"}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all"
            title="Open original link"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
