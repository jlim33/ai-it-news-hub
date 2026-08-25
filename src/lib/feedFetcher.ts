import Parser from "rss-parser";
import { NewsArticle, FeedSource, Category } from "./types";
import { DEFAULT_FEEDS } from "./defaultFeeds";
import { generateLocalSummary } from "./aiSummarizer";
import fs from "fs";
import path from "path";

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

// Cache file path
const CACHE_DIR = path.join(process.cwd(), ".cache");
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
  if (!fs.existsSync(CACHE_DIR)) {
    try {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    } catch (e) {
      console.warn("Failed to create cache dir:", e);
    }
  }
}

/**
 * Load saved feeds config or fallback to defaults
 */
export function getSavedFeeds(): FeedSource[] {
  ensureCacheDir();
  if (fs.existsSync(FEEDS_FILE)) {
    try {
      const data = fs.readFileSync(FEEDS_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      console.warn("Failed to read feeds file, using defaults:", e);
    }
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
    console.error("Failed to write feeds file:", e);
  }
}

/**
 * Read cached articles from disk
 */
function loadCachedArticles(): NewsArticle[] {
  ensureCacheDir();
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse cached articles:", e);
    }
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
    console.error("Failed to save cached articles to disk:", e);
  }
}

/**
 * Calculate estimated reading time
 */
function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
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
 * Automatically assign or refine categories based on title/snippet keywords
 */
function autoRefineCategory(title: string, snippet: string, defaultCat: Category): Category {
  const text = (title + " " + snippet).toLowerCase();
  
  if (
    text.includes("llm") ||
    text.includes("gpt") ||
    text.includes("claude") ||
    text.includes("gemini") ||
    text.includes("prompt") ||
    text.includes("diffusion") ||
    text.includes("generative ai") ||
    text.includes("genai") ||
    text.includes("agentic")
  ) {
    return "Generative AI";
  }

  if (
    text.includes("arxiv") ||
    text.includes("paper") ||
    text.includes("dataset") ||
    text.includes("transformer") ||
    text.includes("benchmark") ||
    text.includes("neural network") ||
    text.includes("fine-tuning") ||
    text.includes("reinforcement learning")
  ) {
    return "LLMs & Research";
  }

  if (
    text.includes("nvidia") ||
    text.includes("gpu") ||
    text.includes("tpu") ||
    text.includes("semiconductor") ||
    text.includes("tsmc") ||
    text.includes("intel") ||
    text.includes("amd") ||
    text.includes("quantum") ||
    text.includes("hardware") ||
    text.includes("silicon")
  ) {
    return "Hardware & Chips";
  }

  if (
    text.includes("security") ||
    text.includes("vulnerability") ||
    text.includes("cve-") ||
    text.includes("ransomware") ||
    text.includes("malware") ||
    text.includes("hacker") ||
    text.includes("exploit") ||
    text.includes("zero-day")
  ) {
    return "Cybersecurity";
  }

  if (
    text.includes("kubernetes") ||
    text.includes("docker") ||
    text.includes("aws") ||
    text.includes("azure") ||
    text.includes("gcp") ||
    text.includes("devops") ||
    text.includes("cloud") ||
    text.includes("ci/cd") ||
    text.includes("database") ||
    text.includes("postgres")
  ) {
    return "Cloud & DevOps";
  }

  if (
    text.includes("open-source") ||
    text.includes("github") ||
    text.includes("hugging face") ||
    text.includes("apache") ||
    text.includes("mit license")
  ) {
    return "Open Source";
  }

  return defaultCat;
}

/**
 * Extract topic tags
 */
function extractTags(title: string, snippet: string, category: Category): string[] {
  const text = (title + " " + snippet).toLowerCase();
  const tags: Set<string> = new Set();
  
  tags.add(category);

  const keywords = [
    "OpenAI", "Anthropic", "Google", "DeepMind", "Meta", "NVIDIA", "Microsoft", "Apple",
    "Mistral", "Hugging Face", "LLaMA", "Claude", "ChatGPT", "Gemini", "Groq", "AWS",
    "Kubernetes", "Linux", "Rust", "Python", "TypeScript", "Quantum", "Cybersecurity", "Zero-Day"
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
      const snippet = sanitizeSnippet(
        item.contentSnippet || item.summary || item.content || item["content:encoded"] || ""
      );
      
      const pubDateObj = item.pubDate || item.isoDate ? new Date(item.pubDate || item.isoDate!) : new Date();
      const pubDate = isNaN(pubDateObj.getTime()) ? new Date().toISOString() : pubDateObj.toISOString();
      const timestamp = isNaN(pubDateObj.getTime()) ? Date.now() : pubDateObj.getTime();

      // Extract image if available
      let imageUrl = "";
      if (item.enclosure?.url && item.enclosure?.type?.startsWith("image/")) {
        imageUrl = item.enclosure.url;
      } else if (item.mediaContent?.$?.url) {
        imageUrl = item.mediaContent.$.url;
      } else if (item.mediaThumbnail?.$?.url) {
        imageUrl = item.mediaThumbnail.$.url;
      }

      // Unique deterministic ID based on title + link
      const id = Buffer.from(item.link).toString("base64url").slice(0, 32);

      const category = autoRefineCategory(title, snippet, feed.category);
      const readTimeMinutes = estimateReadTime(snippet || title);
      const tags = extractTags(title, snippet, category);

      // Pre-compute AI summary
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
        author: item.creator || item.author || feed.name,
        imageUrl: imageUrl || undefined,
        readTimeMinutes,
        aiSummary,
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

  // If in-memory cache is fresh and not forced, return cached
  if (!force && inMemoryArticles.length > 0 && now - lastSyncTime < CACHE_TTL_MS) {
    return {
      articles: inMemoryArticles,
      sourcesStatus: {}
    };
  }

  // First try disk cache if in-memory is empty and not forced
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

  // Fetch feeds concurrently in chunks of 5 to avoid connection flooding
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

  // Combine with existing articles, deduplicate by link/title
  const combinedMap = new Map<string, NewsArticle>();
  
  // Existing articles
  for (const art of inMemoryArticles) {
    combinedMap.set(art.link, art);
  }
  // New articles overwrite or insert
  for (const art of allFetched) {
    combinedMap.set(art.link, art);
  }

  const finalArticles = Array.from(combinedMap.values()).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  // If live fetch returned results, update memory and disk cache
  if (finalArticles.length > 0) {
    inMemoryArticles = finalArticles.slice(0, 300); // keep up to 300 latest articles
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
  // Ensure we have articles
  if (inMemoryArticles.length === 0) {
    await syncAllFeeds(false);
  }

  let filtered = [...inMemoryArticles];

  // Category filter
  if (options?.category && options.category !== "All") {
    filtered = filtered.filter(a => a.category === options.category);
  }

  // Source filter
  if (options?.source) {
    filtered = filtered.filter(a => a.source === options.source);
  }

  // Search filter
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

  // Sort
  if (options?.sortBy === "readTime") {
    filtered.sort((a, b) => a.readTimeMinutes - b.readTimeMinutes);
  } else {
    // default: latest
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
