import Parser from "rss-parser";
import { NewsArticle, FeedSource, Category } from "./types";
import { DEFAULT_FEEDS } from "./defaultFeeds";
import { generateLocalSummary } from "./aiSummarizer";
import fs from "fs";
import path from "path";
import os from "os";

// Initialize RSS Parser with custom fields
const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 AI-IT-News-Hub/1.0",
    "Accept": "application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8"
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"],
      ["dc:creator", "creator"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

// Cache file path in OS temporary directory
const CACHE_DIR = path.join(os.tmpdir(), "ai-news-hub-cache");
const CACHE_FILE = path.join(CACHE_DIR, "news-cache.json");
const FEEDS_FILE = path.join(CACHE_DIR, "feeds-config.json");

// In-memory cache for ultra-fast API responses
let inMemoryArticles: NewsArticle[] = [];
let lastSyncTime: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Ensure the cache directory exists
 */
function ensureCacheDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  } catch (e) {
    // Non-fatal in read-only environment
  }
}

/**
 * Load saved feeds config or fallback to defaults
 */
export function getSavedFeeds(): FeedSource[] {
  ensureCacheDir();
  try {
    if (fs.existsSync(FEEDS_FILE)) {
      const data = fs.readFileSync(FEEDS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Failed to read feeds file, using defaults:", e);
  }
  return DEFAULT_FEEDS;
}

/**
 * Save custom feeds config
 */
export function saveFeeds(feeds: FeedSource[]) {
  ensureCacheDir();
  try {
    fs.writeFileSync(FEEDS_FILE, JSON.stringify(feeds, null, 2), "utf-8");
  } catch (e) {
    // Non-fatal
  }
}

/**
 * Read cached articles from disk
 */
function loadCachedArticles(): NewsArticle[] {
  ensureCacheDir();
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Non-fatal
  }
  return [];
}

/**
 * Save articles to disk cache
 */
function saveCachedArticles(articles: NewsArticle[]) {
  ensureCacheDir();
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(articles, null, 2), "utf-8");
  } catch (e) {
    // Non-fatal
  }
}

/**
 * Calculate estimated reading time
 */
function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 150));
}

/**
 * Clean and normalize snippet
 */
function sanitizeSnippet(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Automatically assign or refine categories based on Korean & English keywords
 */
function autoRefineCategory(title: string, snippet: string, defaultCat: Category): Category {
  const text = (title + " " + snippet).toLowerCase();
  
  if (
    text.includes("llm") ||
    text.includes("gpt") ||
    text.includes("claude") ||
    text.includes("클로드") ||
    text.includes("gemini") ||
    text.includes("제미나이") ||
    text.includes("생성형") ||
    text.includes("생성 ai") ||
    text.includes("diffusion") ||
    text.includes("디퓨전") ||
    text.includes("genai") ||
    text.includes("프롬프트") ||
    text.includes("에이전트") ||
    text.includes("agent")
  ) {
    return "생성형 AI";
  }

  if (
    text.includes("arxiv") ||
    text.includes("논문") ||
    text.includes("연구") ||
    text.includes("paper") ||
    text.includes("transformer") ||
    text.includes("트랜스포머") ||
    text.includes("벤치마크") ||
    text.includes("파인튜닝") ||
    text.includes("fine-tuning") ||
    text.includes("강화학습")
  ) {
    return "LLM & 연구";
  }

  if (
    text.includes("엔비디아") ||
    text.includes("nvidia") ||
    text.includes("gpu") ||
    text.includes("반도체") ||
    text.includes("npu") ||
    text.includes("tpu") ||
    text.includes("hbm") ||
    text.includes("tsmc") ||
    text.includes("인텔") ||
    text.includes("intel") ||
    text.includes("amd") ||
    text.includes("하드웨어") ||
    text.includes("블랙웰") ||
    text.includes("blackwell")
  ) {
    return "반도체 & 칩";
  }

  if (
    text.includes("보안") ||
    text.includes("취약점") ||
    text.includes("해킹") ||
    text.includes("랜섬웨어") ||
    text.includes("cve-") ||
    text.includes("악성코드") ||
    text.includes("security") ||
    text.includes("vulnerability") ||
    text.includes("zero-day") ||
    text.includes("제로데이")
  ) {
    return "사이버 보안";
  }

  if (
    text.includes("쿠버네티스") ||
    text.includes("kubernetes") ||
    text.includes("도커") ||
    text.includes("docker") ||
    text.includes("aws") ||
    text.includes("클라우드") ||
    text.includes("cloud") ||
    text.includes("devops") ||
    text.includes("데브옵스") ||
    text.includes("ci/cd") ||
    text.includes("database") ||
    text.includes("db") ||
    text.includes("서버")
  ) {
    return "클라우드 & 개발";
  }

  if (
    text.includes("오픈소스") ||
    text.includes("open-source") ||
    text.includes("github") ||
    text.includes("깃허브") ||
    text.includes("hugging face") ||
    text.includes("허깅페이스") ||
    text.includes("라이선스")
  ) {
    return "오픈소스";
  }

  return defaultCat;
}

/**
 * Extract topic tags in Korean/English
 */
function extractTags(title: string, snippet: string, category: Category): string[] {
  const text = (title + " " + snippet).toLowerCase();
  const tags: Set<string> = new Set();
  
  tags.add(category);

  const keywords = [
    "OpenAI", "Anthropic", "Google", "DeepMind", "네이버", "카카오", "Meta",
    "NVIDIA", "Microsoft", "Apple", "Mistral", "Hugging Face", "LLaMA", "Claude",
    "ChatGPT", "Gemini", "AWS", "Kubernetes", "Rust", "Python", "TypeScript", "반도체", "보안"
  ];

  for (const kw of keywords) {
    if (new RegExp(`\\b${kw}\\b`, "i").test(text)) {
      tags.add(kw);
    }
  }

  return Array.from(tags).slice(0, 4);
}

/**
 * Fetch a single feed source
 */
async function fetchFeed(feed: FeedSource): Promise<NewsArticle[]> {
  try {
    const feedData = await parser.parseURL(feed.url);
    const articles: NewsArticle[] = [];

    for (const item of feedData.items || []) {
      if (!item.title || !item.link) continue;

      const title = item.title.trim();
      const rawItem = item as any;
      const snippet = sanitizeSnippet(
        rawItem.contentSnippet || rawItem.summary || rawItem.content || rawItem["content:encoded"] || ""
      );
      
      const pubDateObj = rawItem.pubDate || rawItem.isoDate ? new Date(rawItem.pubDate || rawItem.isoDate!) : new Date();
      const pubDate = isNaN(pubDateObj.getTime()) ? new Date().toISOString() : pubDateObj.toISOString();
      const timestamp = isNaN(pubDateObj.getTime()) ? Date.now() : pubDateObj.getTime();

      // Extract image if available
      let imageUrl = "";
      if (rawItem.enclosure?.url && (rawItem.enclosure?.type?.startsWith("image/") || typeof rawItem.enclosure?.url === "string")) {
        imageUrl = rawItem.enclosure.url;
      } else if (rawItem.mediaContent?.$?.url) {
        imageUrl = rawItem.mediaContent.$.url;
      } else if (rawItem.mediaThumbnail?.$?.url) {
        imageUrl = rawItem.mediaThumbnail.$.url;
      }

      const id = Buffer.from(item.link).toString("base64url").slice(0, 32);

      const category = autoRefineCategory(title, snippet, feed.category);
      const readTimeMinutes = estimateReadTime(snippet || title);
      const tags = extractTags(title, snippet, category);

      // Pre-compute Korean AI summary
      const aiSummary = generateLocalSummary(title, snippet, category);

      articles.push({
        id,
        title,
        link: item.link,
        source: feed.name,
        sourceUrl: feed.url,
        pubDate,
        timestamp,
        category,
        contentSnippet: snippet.slice(0, 400),
        fullContent: snippet,
        author: rawItem.creator || rawItem.author || feed.name,
        imageUrl: imageUrl || undefined,
        readTimeMinutes,
        aiSummary,
        likes: Math.floor(Math.random() * 15) + 3, // Initial organic reaction baseline
        dislikes: Math.floor(Math.random() * 2),
        commentsCount: 0,
        tags
      });
    }

    return articles;
  } catch (err: any) {
    console.warn(`[FeedFetcher] Error fetching feed "${feed.name}" (${feed.url}):`, err.message || err);
    return [];
  }
}

/**
 * Sync and fetch all enabled feeds
 */
export async function syncAllFeeds(force = false): Promise<{
  articles: NewsArticle[];
  sourcesStatus: { [id: string]: { count: number; error?: string } };
}> {
  const now = Date.now();

  if (!force && inMemoryArticles.length > 0 && now - lastSyncTime < CACHE_TTL_MS) {
    return {
      articles: inMemoryArticles,
      sourcesStatus: {}
    };
  }

  if (!force && inMemoryArticles.length === 0) {
    const diskArticles = loadCachedArticles();
    if (diskArticles.length > 0) {
      inMemoryArticles = diskArticles;
      lastSyncTime = now;
      return {
        articles: inMemoryArticles,
        sourcesStatus: {}
      };
    }
  }

  const feeds = getSavedFeeds().filter(f => f.enabled !== false);
  const sourcesStatus: { [id: string]: { count: number; error?: string } } = {};
  const allFetched: NewsArticle[] = [];

  const chunkSize = 5;
  for (let i = 0; i < feeds.length; i += chunkSize) {
    const chunk = feeds.slice(i, i + chunkSize);
    const results = await Promise.allSettled(chunk.map(f => fetchFeed(f)));

    results.forEach((res, index) => {
      const feed = chunk[index];
      if (res.status === "fulfilled") {
        sourcesStatus[feed.id] = { count: res.value.length };
        allFetched.push(...res.value);
      } else {
        sourcesStatus[feed.id] = { count: 0, error: res.reason?.message || "Failed to fetch" };
      }
    });
  }

  const combinedMap = new Map<string, NewsArticle>();
  for (const art of inMemoryArticles) {
    combinedMap.set(art.link, art);
  }
  for (const art of allFetched) {
    combinedMap.set(art.link, art);
  }

  const finalArticles = Array.from(combinedMap.values()).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  if (finalArticles.length > 0) {
    inMemoryArticles = finalArticles.slice(0, 300);
    lastSyncTime = now;
    saveCachedArticles(inMemoryArticles);
  }

  return {
    articles: inMemoryArticles,
    sourcesStatus
  };
}

/**
 * Get filtered and paginated articles
 */
export async function getNewsArticles(options?: {
  category?: Category;
  search?: string;
  source?: string;
  sortBy?: "latest" | "popular" | "readTime";
  limit?: number;
  offset?: number;
}): Promise<{ articles: NewsArticle[]; total: number; updatedAt: string }> {
  if (inMemoryArticles.length === 0) {
    await syncAllFeeds(false);
  }

  let filtered = [...inMemoryArticles];

  if (options?.category && options.category !== "전체") {
    filtered = filtered.filter(a => a.category === options.category);
  }

  if (options?.source) {
    filtered = filtered.filter(a => a.source === options.source);
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.contentSnippet.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (options?.sortBy === "readTime") {
    filtered.sort((a, b) => a.readTimeMinutes - b.readTimeMinutes);
  } else if (options?.sortBy === "popular") {
    filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else {
    filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  const total = filtered.length;
  const offset = options?.offset || 0;
  const limit = options?.limit || 50;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    articles: paginated,
    total,
    updatedAt: new Date(lastSyncTime || Date.now()).toISOString()
  };
}
