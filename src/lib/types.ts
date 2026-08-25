export type Category =
  | "All"
  | "Generative AI"
  | "LLMs & Research"
  | "Hardware & Chips"
  | "Cybersecurity"
  | "Cloud & DevOps"
  | "Open Source"
  | "Big Tech";

export interface AISummary {
  tldr: string[];
  whyItMatters: string;
  impactScore: "Critical" | "High" | "Medium" | "Low";
  sentiment: "Positive" | "Neutral" | "Cautious" | "Disruptive";
  keyEntities: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceUrl?: string;
  pubDate: string; // ISO 8601 string
  timestamp: number; // epoch ms
  category: Category;
  contentSnippet: string;
  fullContent?: string;
  author?: string;
  imageUrl?: string;
  readTimeMinutes: number;
  aiSummary?: AISummary;
  score?: number; // upvotes / popularity if available (e.g., Hacker News)
  commentsCount?: number;
  commentsUrl?: string;
  tags: string[];
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: Category;
  enabled: boolean;
  isCustom?: boolean;
  icon?: string;
  type: "rss" | "atom" | "json" | "hackernews";
  lastFetched?: string;
  status?: "ok" | "error" | "pending";
}

export interface SyncResponse {
  articles: NewsArticle[];
  total: number;
  updatedAt: string;
  sourcesStatus: { [feedId: string]: { count: number; error?: string } };
}

export interface FilterOptions {
  category: Category;
  searchQuery: string;
  source?: string;
  sortBy: "latest" | "popular" | "readTime";
  timeWindow?: "all" | "24h" | "48h" | "7d";
}
