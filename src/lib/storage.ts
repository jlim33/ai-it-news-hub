import { NewsArticle, FeedSource } from "./types";

const BOOKMARKS_KEY = "ai_news_bookmarks_v1";
const READ_HISTORY_KEY = "ai_news_read_history_v1";
const GEMINI_KEY = "ai_news_gemini_key_v1";
const AUTO_REFRESH_KEY = "ai_news_auto_refresh_interval_v1";
const THEME_KEY = "ai_news_theme_v1";

export function getStoredBookmarks(): NewsArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookmark(article: NewsArticle): boolean {
  if (typeof window === "undefined") return false;
  try {
    const bookmarks = getStoredBookmarks();
    if (!bookmarks.some(b => b.id === article.id)) {
      bookmarks.unshift(article);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks.slice(0, 100)));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function removeBookmark(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const bookmarks = getStoredBookmarks().filter(b => b.id !== id);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {}
}

export function isArticleBookmarked(id: string): boolean {
  return getStoredBookmarks().some(b => b.id === id);
}

export function getReadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(READ_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markAsRead(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getReadHistory();
    if (!history.includes(id)) {
      history.push(id);
      localStorage.setItem(READ_HISTORY_KEY, JSON.stringify(history.slice(-200)));
    }
  } catch {}
}

export function getStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(GEMINI_KEY) || "";
}

export function setStoredApiKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GEMINI_KEY, key);
}

export function getAutoRefreshInterval(): number {
  if (typeof window === "undefined") return 15; // default 15 minutes
  const stored = localStorage.getItem(AUTO_REFRESH_KEY);
  return stored ? parseInt(stored, 10) : 15;
}

export function setAutoRefreshInterval(minutes: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTO_REFRESH_KEY, minutes.toString());
}
