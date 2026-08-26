"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BreakingTicker } from "@/components/BreakingTicker";
import { HeroFeatured } from "@/components/HeroFeatured";
import { NewsCard } from "@/components/NewsCard";
import { ArticleModal } from "@/components/ArticleModal";
import { DailyBriefingModal } from "@/components/DailyBriefingModal";
import { FeedManagerModal } from "@/components/FeedManagerModal";
import { BookmarksDrawer } from "@/components/BookmarksDrawer";

import { useBookmarks } from "@/hooks/useBookmarks";
import { useSpeech } from "@/hooks/useSpeech";
import { NewsArticle, Category } from "@/lib/types";
import { ArrowUp, Sparkles, Rss, Globe, ArrowUpDown, LayoutGrid, List, SearchX } from "lucide-react";

export default function EnglishPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "readTime">("latest");
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [nextSyncIn, setNextSyncIn] = useState<number>(15 * 60);
  const [refreshInterval, setRefreshInterval] = useState<number>(15);

  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { isPlaying, isPaused, speak, pause, resume, stop } = useSpeech();

  // Modals & Drawers state
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
      if (category !== "전체") params.append("category", category);
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

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300">
      
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSyncing={isSyncing}
        onSyncNow={syncNow}
        nextSyncIn={nextSyncIn}
        lastSynced={lastSynced}
        bookmarkCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenFeedManager={() => setIsFeedManagerOpen(true)}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Breaking Marquee */}
      <BreakingTicker articles={articles} onSelectArticle={handleSelectArticle} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner with Korean Switcher */}
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider mb-0.5">
              <span>🌐 Global Edition (English Mode)</span>
            </div>
            <p className="text-xs text-blue-100">
              Live AI & Tech intelligence curated from top global labs and research sources.
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
        {category === "전체" && !searchQuery && articles.length > 0 && (
          <HeroFeatured articles={articles} onSelectArticle={handleSelectArticle} />
        )}

        {/* Search Results / Status */}
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

        {/* Grid List of Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              isBookmarked={isBookmarked(article.id)}
              onToggleBookmark={toggleBookmark}
              onOpenReader={handleSelectArticle}
              onPlayAudio={speak}
              viewMode={viewMode}
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
      />

      <FeedManagerModal
        isOpen={isFeedManagerOpen}
        onClose={() => setIsFeedManagerOpen(false)}
        onFeedsUpdated={fetchNews}
        refreshInterval={refreshInterval}
        onUpdateRefreshInterval={setRefreshInterval}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={toggleBookmark}
      />
    </div>
  );
}
