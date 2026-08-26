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
import { ArrowUp, Sparkles, Rss } from "lucide-react";

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
  } = useNews("전체");

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
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300">
      
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
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between font-medium">
            <span>{error}</span>
            <button
              onClick={() => syncNow()}
              className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Featured Hero Stories */}
        {category === "전체" && !searchQuery && articles.length > 0 && (
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
        {(searchQuery || category !== "전체") && (
          <div className="pt-6 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{searchQuery ? `검색 결과: "${searchQuery}"` : category}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  총 {articles.length}건
                </span>
              </h2>
            </div>
            {(searchQuery || category !== "전체") && (
              <button
                onClick={() => {
                  setCategory("전체");
                  setSearchQuery("");
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 underline font-bold"
              >
                전체 보기로 돌아가기
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
            setCategory("전체");
            setSearchQuery("");
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-slate-200 text-sm">⚡ AI & IT 펄스</span>
            <span>•</span>
            <span>국내외 실시간 기술 뉴스 자동 수집 및 AI 인텔리전스</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFeedManagerOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors font-semibold"
            >
              <Rss className="w-3.5 h-3.5" />
              피드 관리
            </button>
            <button
              onClick={() => setIsBriefingOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              일일 브리핑
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all ml-2 shadow-xs"
              title="맨 위로 가기"
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
