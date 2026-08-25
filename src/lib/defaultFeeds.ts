import { FeedSource } from "./types";

export const DEFAULT_FEEDS: FeedSource[] = [
  // AI & Research
  {
    id: "arxiv-ai",
    name: "arXiv AI Research",
    url: "https://rss.arxiv.org/rss/cs.AI",
    category: "LLMs & Research",
    enabled: true,
    type: "rss",
    icon: "GraduationCap"
  },
  {
    id: "arxiv-cl",
    name: "arXiv Computation & Language (NLP)",
    url: "https://rss.arxiv.org/rss/cs.CL",
    category: "LLMs & Research",
    enabled: true,
    type: "rss",
    icon: "BookOpen"
  },
  {
    id: "techcrunch-ai",
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "Generative AI",
    enabled: true,
    type: "rss",
    icon: "Sparkles"
  },
  {
    id: "openai-news",
    name: "OpenAI Newsroom",
    url: "https://openai.com/news/rss.xml",
    category: "Generative AI",
    enabled: true,
    type: "rss",
    icon: "Bot"
  },
  {
    id: "huggingface-blog",
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    category: "Open Source",
    enabled: true,
    type: "rss",
    icon: "Smile"
  },
  {
    id: "mit-tech-review-ai",
    name: "MIT Technology Review AI",
    url: "https://www.technologyreview.com/feed/",
    category: "Generative AI",
    enabled: true,
    type: "rss",
    icon: "Cpu"
  },

  // IT & Big Tech
  {
    id: "the-verge-tech",
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "Big Tech",
    enabled: true,
    type: "atom",
    icon: "Globe"
  },
  {
    id: "ars-technica",
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "Big Tech",
    enabled: true,
    type: "rss",
    icon: "Layers"
  },
  {
    id: "wired-tech",
    name: "Wired Tech",
    url: "https://www.wired.com/feed/category/gear/latest/rss",
    category: "Big Tech",
    enabled: true,
    type: "rss",
    icon: "Zap"
  },

  // Hardware & Chips
  {
    id: "anandtech-hardware",
    name: "Tom's Hardware / Chips",
    url: "https://www.tomshardware.com/feeds/all",
    category: "Hardware & Chips",
    enabled: true,
    type: "rss",
    icon: "Cpu"
  },

  // Cybersecurity
  {
    id: "the-hacker-news",
    name: "The Hacker News (Security)",
    url: "https://feeds.feedburner.com/TheHackersNews",
    category: "Cybersecurity",
    enabled: true,
    type: "rss",
    icon: "ShieldAlert"
  },
  {
    id: "bleeping-computer",
    name: "BleepingComputer",
    url: "https://www.bleepingcomputer.com/feed/",
    category: "Cybersecurity",
    enabled: true,
    type: "rss",
    icon: "ShieldCheck"
  },

  // Cloud & DevOps
  {
    id: "aws-news",
    name: "AWS Architecture & News",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    category: "Cloud & DevOps",
    enabled: true,
    type: "rss",
    icon: "Cloud"
  },
  {
    id: "github-blog",
    name: "GitHub Engineering Blog",
    url: "https://github.blog/feed/",
    category: "Open Source",
    enabled: true,
    type: "rss",
    icon: "GitBranch"
  },

  // Hacker News Community
  {
    id: "hacker-news-front",
    name: "Hacker News AI & Tech",
    url: "https://hnrss.org/frontpage",
    category: "All",
    enabled: true,
    type: "rss",
    icon: "Flame"
  }
];
