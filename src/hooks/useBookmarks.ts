import { useState, useEffect, useCallback } from "react";
import { NewsArticle } from "@/lib/types";
import { getStoredBookmarks, saveBookmark, removeBookmark } from "@/lib/storage";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);

  useEffect(() => {
    setBookmarks(getStoredBookmarks());
  }, []);

  const toggleBookmark = useCallback((article: NewsArticle) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === article.id);
      if (exists) {
        removeBookmark(article.id);
        return prev.filter(b => b.id !== article.id);
      } else {
        saveBookmark(article);
        return [article, ...prev];
      }
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => {
      return bookmarks.some(b => b.id === id);
    },
    [bookmarks]
  );

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
  };
}
