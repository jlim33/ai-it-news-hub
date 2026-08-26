import { FeedSource } from "./types";

export const DEFAULT_FEEDS: FeedSource[] = [
  // 1. 국내 주요 AI & 테크 미디어 (Korean Feeds)
  {
    id: "ai-times-kr",
    name: "AI타임스 (AI Times)",
    url: "https://www.aitimes.com/rss/allArticle.xml",
    category: "생성형 AI",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "Sparkles"
  },
  {
    id: "geeknews-tech",
    name: "긱뉴스 (GeekNews)",
    url: "https://news.hada.io/rss/news",
    category: "클라우드 & 개발",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "Flame"
  },
  {
    id: "yozm-it",
    name: "요즘IT (Yozm IT)",
    url: "https://yozm.wishket.com/magazine/feed/",
    category: "클라우드 & 개발",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "BookOpen"
  },
  {
    id: "naver-d2",
    name: "네이버 D2 (Naver Tech)",
    url: "https://d2.naver.com/d2.atom",
    category: "클라우드 & 개발",
    enabled: true,
    type: "atom",
    lang: "ko",
    icon: "Layers"
  },
  {
    id: "kakao-tech",
    name: "카카오 테크 (Kakao Tech)",
    url: "https://tech.kakao.com/feed/",
    category: "빅테크 이슈",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "Globe"
  },
  {
    id: "toss-tech",
    name: "토스 테크 (Toss Tech)",
    url: "https://toss.tech/rss.xml",
    category: "클라우드 & 개발",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "Zap"
  },
  {
    id: "woowa-tech",
    name: "우아한형제들 기술블로그",
    url: "https://techblog.woowahan.com/feed/",
    category: "클라우드 & 개발",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "Smile"
  },

  // 2. 글로벌 프론티어 AI & 리서치 (Global English Feeds)
  {
    id: "arxiv-ai",
    name: "arXiv AI Research",
    url: "https://rss.arxiv.org/rss/cs.AI",
    category: "LLMs & Research",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "GraduationCap"
  },
  {
    id: "arxiv-cl",
    name: "arXiv Computation & Language",
    url: "https://rss.arxiv.org/rss/cs.CL",
    category: "LLMs & Research",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "BookOpen"
  },
  {
    id: "openai-news",
    name: "OpenAI Newsroom",
    url: "https://openai.com/news/rss.xml",
    category: "Generative AI",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Bot"
  },
  {
    id: "techcrunch-ai",
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "Generative AI",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Sparkles"
  },
  {
    id: "huggingface-blog",
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    category: "Open Source",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Smile"
  },
  {
    id: "the-verge",
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "Big Tech",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Globe"
  },
  {
    id: "ars-technica",
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "Big Tech",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Layers"
  },
  {
    id: "wired-business",
    name: "Wired Business",
    url: "https://www.wired.com/feed/category/business/latest/rss",
    category: "Big Tech",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Zap"
  },
  {
    id: "tomshardware-chips",
    name: "Tom's Hardware",
    url: "https://www.tomshardware.com/feeds/all",
    category: "Chips & Hardware",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Cpu"
  },
  {
    id: "the-hacker-news",
    name: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
    category: "Cybersecurity",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "ShieldAlert"
  },
  {
    id: "aws-news",
    name: "AWS Architecture & News",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    category: "Cloud & DevOps",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Cloud"
  },
  {
    id: "github-blog",
    name: "GitHub Engineering Blog",
    url: "https://github.blog/feed/",
    category: "Cloud & DevOps",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "GitBranch"
  },
  {
    id: "hn-frontpage",
    name: "Hacker News Frontpage",
    url: "https://hnrss.org/frontpage",
    category: "All",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Flame"
  }
];
