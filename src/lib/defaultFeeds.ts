import { FeedSource } from "./types";

export const DEFAULT_FEEDS: FeedSource[] = [
  // 1. 국내 주요 AI & 테크 미디어
  {
    id: "geeknews-tech",
    name: "긱뉴스 (GeekNews)",
    url: "https://news.hada.io/rss/news",
    category: "클라우드 & 개발",
    enabled: true,
    type: "rss",
    icon: "Flame"
  },
  {
    id: "ai-times-kr",
    name: "AI타임스 (AI Times)",
    url: "https://www.aitimes.com/rss/allArticle.xml",
    category: "생성형 AI",
    enabled: true,
    type: "rss",
    icon: "Sparkles"
  },
  {
    id: "zdnet-korea",
    name: "지디넷코리아 (ZDNet Korea)",
    url: "https://zdnet.co.kr/feed/all/",
    category: "빅테크 이슈",
    enabled: true,
    type: "rss",
    icon: "Globe"
  },
  {
    id: "bloter-tech",
    name: "블로터 (Bloter)",
    url: "https://www.bloter.net/feed/allArticle.xml",
    category: "빅테크 이슈",
    enabled: true,
    type: "rss",
    icon: "Layers"
  },
  {
    id: "yozm-it",
    name: "요즘IT (Yozm IT)",
    url: "https://yozm.wishket.com/magazine/feed/",
    category: "클라우드 & 개발",
    enabled: true,
    type: "rss",
    icon: "BookOpen"
  },
  {
    id: "boannews-security",
    name: "보안뉴스 (BoanNews)",
    url: "https://www.boannews.com/media/news_rss.xml",
    category: "사이버 보안",
    enabled: true,
    type: "rss",
    icon: "ShieldAlert"
  },

  // 2. 글로벌 프론티어 AI & 리서치 (한글 AI 자동 요약 지원)
  {
    id: "arxiv-ai",
    name: "arXiv AI Research",
    url: "https://rss.arxiv.org/rss/cs.AI",
    category: "LLM & 연구",
    enabled: true,
    type: "rss",
    icon: "GraduationCap"
  },
  {
    id: "techcrunch-ai",
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "생성형 AI",
    enabled: true,
    type: "rss",
    icon: "Sparkles"
  },
  {
    id: "openai-news",
    name: "OpenAI Newsroom",
    url: "https://openai.com/news/rss.xml",
    category: "생성형 AI",
    enabled: true,
    type: "rss",
    icon: "Bot"
  },
  {
    id: "huggingface-blog",
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    category: "오픈소스",
    enabled: true,
    type: "rss",
    icon: "Smile"
  },
  {
    id: "tomshardware-chips",
    name: "Tom's Hardware (반도체/칩)",
    url: "https://www.tomshardware.com/feeds/all",
    category: "반도체 & 칩",
    enabled: true,
    type: "rss",
    icon: "Cpu"
  },
  {
    id: "the-hacker-news",
    name: "The Hacker News (보안)",
    url: "https://feeds.feedburner.com/TheHackersNews",
    category: "사이버 보안",
    enabled: true,
    type: "rss",
    icon: "ShieldAlert"
  },
  {
    id: "hn-frontpage",
    name: "Hacker News (인기 테크)",
    url: "https://hnrss.org/frontpage",
    category: "전체",
    enabled: true,
    type: "rss",
    icon: "Flame"
  }
];
