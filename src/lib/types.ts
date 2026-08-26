export type Category =
  | "전체"
  | "생성형 AI"
  | "LLM & 연구"
  | "반도체 & 칩"
  | "사이버 보안"
  | "클라우드 & 개발"
  | "오픈소스"
  | "빅테크 이슈";

export interface AISummary {
  tldr: string[];
  whyItMatters: string;
  impactScore: "매우 중요" | "높음" | "보통" | "일반";
  sentiment: "긍정적" | "중립적" | "신중함" | "파괴적 혁신";
  keyEntities: string[];
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  avatarColor: string;
  content: string;
  createdAt: string; // ISO string
  likes: number;
}

export interface ReactionState {
  userVote: "like" | "dislike" | null;
  likes: number;
  dislikes: number;
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
  score?: number;
  likes?: number;
  dislikes?: number;
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
  type: "rss" | "atom" | "json";
  lastFetched?: string;
  status?: "ok" | "error" | "pending";
}

export interface SyncResponse {
  articles: NewsArticle[];
  total: number;
  updatedAt: string;
  sourcesStatus: { [feedId: string]: { count: number; error?: string } };
}
