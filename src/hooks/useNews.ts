import { useState, useEffect, useCallback, useRef } from "react";
import { NewsArticle, Category } from "@/lib/types";
import { getAutoRefreshInterval } from "@/lib/storage";

export function useNews(initialCategory: Category = "전체") {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "readTime">("latest");
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [nextSyncIn, setNextSyncIn] = useState<number>(15 * 60); // seconds
  const [refreshInterval, setRefreshInterval] = useState<number>(15); // minutes

  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch articles from API
  const fetchArticles = useCallback(async (cat: Category, search: string, sort: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (cat !== "전체") params.append("category", cat);
      if (search) params.append("search", search);
      params.append("sortBy", sort);
      params.append("limit", "100");

      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch news feed");
      
      const data = await res.json();
      setArticles(data.articles || []);
      if (data.updatedAt) {
        setLastSynced(new Date(data.updatedAt));
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching news");
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger live feed sync
  const syncNow = useCallback(async () => {
    if (isSyncing) return;
    try {
      setIsSyncing(true);
      setError(null);
      const res = await fetch("/api/news/sync", { method: "POST" });
      if (!res.ok) throw new Error("Feed synchronization failed");
      const data = await res.json();
      
      setLastSynced(new Date());
      setNextSyncIn(refreshInterval * 60);

      // Re-fetch articles after sync
      await fetchArticles(category, searchQuery, sortBy);
    } catch (err: any) {
      console.error("Sync error:", err);
      setError("Failed to sync new feeds. Showing cached articles.");
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, category, searchQuery, sortBy, refreshInterval, fetchArticles]);

  // Initial load
  useEffect(() => {
    const interval = getAutoRefreshInterval();
    setRefreshInterval(interval);
    setNextSyncIn(interval * 60);

    // Initial sync and load
    fetchArticles(category, searchQuery, sortBy);
  }, []);

  // Refetch when category, search query, or sortBy changes
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchArticles(category, searchQuery, sortBy);
    }, 250);
    return () => clearTimeout(debounce);
  }, [category, searchQuery, sortBy, fetchArticles]);

  // Countdown timer & auto-sync trigger
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setNextSyncIn(prev => {
        if (prev <= 1) {
          syncNow();
          return refreshInterval * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [refreshInterval, syncNow]);

  const updateRefreshInterval = (minutes: number) => {
    setRefreshInterval(minutes);
    setNextSyncIn(minutes * 60);
  };

  return {
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
    refetch: () => fetchArticles(category, searchQuery, sortBy)
  };
}
