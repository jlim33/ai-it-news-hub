import { FeedSource } from "./types";

export const DEFAULT_FEEDS: FeedSource[] = [
  // 1. 국내 주요 AI & 테크 미디어
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
    id: "geeknews-tech",
    name: "긱뉴스 (GeekNews)",
    url: "https://news.hada.io/rss/news",
    category: "클라우드 & 개발",
    enabled: true,
    type: "rss",
    icon: "Flame"
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
    id: "naver-d2",
    name: "네이버 D2 (Naver Tech)",
    url: "https://d2.naver.com/d2.atom",
    category: "클라우드 & 개발",
    enabled: true,
    type: "atom",
    icon: "Layers"
  },
  {
    id: "kakao-tech",
    name: "카카오 테크 (Kakao Tech)",
    url: "https://tech.kakao.com/feed/",
    category: "빅테크 이슈",
    enabled: true,
    type: "rss",
    icon: "Globe"
  },
  {
    id: "toss-tech",
    name: "토스 테크 (Toss Tech)",
    url: "https://toss.tech/rss.xml",
    category: "클라우드 & 개발",
    enabled: true,
    type: "rss",
    icon: "Zap"
  },
  {
    id: "woowa-tech",
    name: "우아한형제들 기술블로그",
    url: "https://techblog.woowahan.com/feed/",
    category: "클라우드 & 개발",
    enabled: true,
    type: "rss",
    icon: "Smile"
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
