"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { BreakingTicker } from "@/components/BreakingTicker";
import { HeroFeatured } from "@/components/HeroFeatured";
import { CategoryNav } from "@/components/CategoryNav";
import { NewsGrid } from "@/components/NewsGrid";
import { ArticleModal } from "@/components/ArticleModal";
import { DailyBriefingModal } from "@/components/DailyBriefingModal";
import { FeedManagerModal } from "@/components/FeedManagerModal";
import { BookmarksDrawer } from "@/components/BookmarksDrawer";

import { useNews } from "@/hooks/useNews";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSpeech } from "@/hooks/useSpeech";
import { NewsArticle } from "@/lib/types";
import { ArrowUp, Sparkles, Rss, Layers, Zap } from "lucide-react";

export default function Home() {
  const {
    articles,
    loading,
    isSyncing,
    error,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    lastSynced,
    nextSyncIn,
    refreshInterval,
    updateRefreshInterval,
    syncNow,
    refetch,
  } = useNews("All");

  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { isPlaying, isPaused, speak, pause, resume, stop } = useSpeech();

  // Modals & Drawers state
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(false);
  const [isFeedManagerOpen, setIsFeedManagerOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // Layout View Mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      
      {/* Top Fixed Header */}
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

      {/* Breaking News Live Marquee */}
      <BreakingTicker
        articles={articles}
        onSelectArticle={handleSelectArticle}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Error notification banner if any */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => syncNow()}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* Featured Hero Stories (Visible when on 'All' category and no search active) */}
        {category === "All" && !searchQuery && articles.length > 0 && (
          <HeroFeatured
            articles={articles}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {/* Category Navigation & View Controls */}
        <CategoryNav
          selectedCategory={category}
          onSelectCategory={setCategory}
          articles={articles}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Search Results / Category Indicator Header */}
        {(searchQuery || category !== "All") && (
          <div className="pt-6 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{searchQuery ? `Search: "${searchQuery}"` : category}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                  {articles.length} articles
                </span>
              </h2>
            </div>
            {(searchQuery || category !== "All") && (
              <button
                onClick={() => {
                  setCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* News Feed Grid / List */}
        <NewsGrid
          articles={articles}
          loading={loading}
          viewMode={viewMode}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onSelectArticle={handleSelectArticle}
          onPlayAudio={speak}
          onResetFilters={() => {
            setCategory("All");
            setSearchQuery("");
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-200">AI & IT News Pulse</span>
            <span>•</span>
            <span>Automated RSS & AI-Powered Intelligence</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFeedManagerOpen(true)}
              className="hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Rss className="w-3.5 h-3.5" />
              Manage Feeds
            </button>
            <button
              onClick={() => setIsBriefingOpen(true)}
              className="hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Daily Briefing
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all ml-2"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
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
        onFeedsUpdated={refetch}
        refreshInterval={refreshInterval}
        onUpdateRefreshInterval={updateRefreshInterval}
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
