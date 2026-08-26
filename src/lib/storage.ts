import { NewsArticle, Comment, ReactionState } from "./types";

const BOOKMARKS_KEY = "ai_news_bookmarks_v2";
const COMMENTS_KEY = "ai_news_comments_v2";
const REACTIONS_KEY = "ai_news_reactions_v2";
const USER_NICKNAME_KEY = "ai_news_nickname_v2";
const AUTO_REFRESH_KEY = "ai_news_auto_refresh_interval_v2";
const GEMINI_KEY = "ai_news_gemini_key_v2";
const THEME_KEY = "ai_news_theme_v2";

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

// --- Reactions (Like / Dislike) ---

export function getStoredReactions(): Record<string, ReactionState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REACTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getArticleReaction(articleId: string, defaultLikes = 5, defaultDislikes = 0): ReactionState {
  const all = getStoredReactions();
  if (all[articleId]) return all[articleId];
  return {
    userVote: null,
    likes: defaultLikes,
    dislikes: defaultDislikes
  };
}

export function toggleArticleReaction(articleId: string, type: "like" | "dislike", defaultLikes = 5, defaultDislikes = 0): ReactionState {
  const all = getStoredReactions();
  const current = all[articleId] || { userVote: null, likes: defaultLikes, dislikes: defaultDislikes };

  if (current.userVote === type) {
    // Cancel vote
    if (type === "like") current.likes = Math.max(0, current.likes - 1);
    if (type === "dislike") current.dislikes = Math.max(0, current.dislikes - 1);
    current.userVote = null;
  } else {
    // Switch or new vote
    if (current.userVote === "like") current.likes = Math.max(0, current.likes - 1);
    if (current.userVote === "dislike") current.dislikes = Math.max(0, current.dislikes - 1);

    if (type === "like") current.likes += 1;
    if (type === "dislike") current.dislikes += 1;
    current.userVote = type;
  }

  all[articleId] = current;
  if (typeof window !== "undefined") {
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(all));
  }
  return current;
}

// --- Comments System ---

export function getStoredComments(): Record<string, Comment[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getArticleComments(articleId: string): Comment[] {
  const all = getStoredComments();
  return all[articleId] || [];
}

export function addArticleComment(articleId: string, author: string, content: string, avatarColor = "indigo"): Comment {
  const all = getStoredComments();
  const list = all[articleId] || [];

  const newComment: Comment = {
    id: "cmt-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    articleId,
    author: author.trim() || "익명의 독자",
    avatarColor,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likes: 0
  };

  list.unshift(newComment);
  all[articleId] = list;

  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
  }
  return newComment;
}

export function deleteArticleComment(articleId: string, commentId: string): void {
  const all = getStoredComments();
  if (!all[articleId]) return;
  all[articleId] = all[articleId].filter(c => c.id !== commentId);
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
  }
}

export function likeArticleComment(articleId: string, commentId: string): void {
  const all = getStoredComments();
  if (!all[articleId]) return;
  all[articleId] = all[articleId].map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c);
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
  }
}

export function getSavedNickname(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(USER_NICKNAME_KEY) || "";
}

export function saveNickname(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_NICKNAME_KEY, name.trim());
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
  if (typeof window === "undefined") return 15;
  const stored = localStorage.getItem(AUTO_REFRESH_KEY);
  return stored ? parseInt(stored, 10) : 15;
}

export function setAutoRefreshInterval(minutes: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTO_REFRESH_KEY, minutes.toString());
}
