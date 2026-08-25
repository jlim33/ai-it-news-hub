# ⚡ AI & IT News Pulse

A real-time, auto-updating news aggregation and AI intelligence web platform for Artificial Intelligence and Information Technology.

---

## 🌟 Key Features

- **🔴 Automated Real-Time Feed Ingestion**:
  - Aggregates from 15+ curated feeds: arXiv AI/NLP research papers, OpenAI, Google DeepMind, Anthropic, TechCrunch AI, The Verge, Ars Technica, Wired, Tom's Hardware, The Hacker News, AWS Blog, GitHub Blog, and Hacker News.
  - Periodic background auto-sync with configurable countdown timer (5m, 15m, 30m, 1h).
  - One-click instant manual sync button (`Refresh Now`).

- **🧠 Built-In AI Summarization & Intelligence**:
  - Instant 3-bullet **TL;DR**, **Why It Matters**, **Impact Score** (Critical / High / Medium / Low), and **Sentiment Analysis** for every news item.
  - Zero-configuration heuristic NLP engine active out-of-the-box.
  - Optional Gemini API Key integration for deep generative synthesis.

- **🎙️ Web Speech TTS Audio Briefings**:
  - Listen to article headlines and AI briefings on the go with built-in voice playback (Play, Pause, Resume, Stop).

- **📊 Daily AI Briefing & Newsletter Generator**:
  - Generate a formatted daily briefing of top tech stories with 1-click Markdown or JSON export.

- **⚙️ Feed Manager & Customization**:
  - Add custom RSS/Atom feed URLs.
  - Toggle individual news sources on or off.
  - Adjust background refresh frequencies.

- **💾 Bookmarks & Offline Reading**:
  - Save articles for later reading with local persistent storage.
  - Export saved reading list as JSON.

- **🎨 Multi-Theme Cyber Engine**:
  - Dark Mode, Cyber Neon Mode, and Clean Light Mode.
  - Live breaking news marquee ticker and responsive Grid/List views.

---

## 🚀 Quick Start

### 1. Launch Development Server
```bash
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```
Or directly via node:
```bash
node ./node_modules/next/dist/bin/next dev -p 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📂 Project Architecture

```
ai-it-news-hub/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── news/
│   │   │   │   ├── route.ts            # GET news with filtering & pagination
│   │   │   │   └── sync/route.ts       # POST/GET live RSS sync trigger
│   │   │   ├── summarize/route.ts      # POST AI summary & analysis
│   │   │   └── feeds/route.ts          # GET/POST custom feed configuration
│   │   ├── globals.css                 # Themes, glassmorphism, scrollbars
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Main interactive news dashboard
│   ├── components/
│   │   ├── Header.tsx                  # Live sync status, countdown, search
│   │   ├── BreakingTicker.tsx          # Real-time scrolling news marquee
│   │   ├── HeroFeatured.tsx            # Top breaking headline spotlight
│   │   ├── CategoryNav.tsx             # Category pills & Grid/List switcher
│   │   ├── NewsCard.tsx                # News item card with AI summaries & audio
│   │   ├── NewsGrid.tsx                # Grid / List view with pagination
│   │   ├── ArticleModal.tsx            # Distraction-free reader & TTS player
│   │   ├── DailyBriefingModal.tsx      # Daily AI briefing generator
│   │   ├── FeedManagerModal.tsx        # RSS source toggles & custom feeds
│   │   ├── BookmarksDrawer.tsx         # Saved articles drawer
│   │   └── ThemeToggle.tsx             # Dark / Light / Cyber theme toggle
│   ├── hooks/
│   │   ├── useNews.ts                  # Feed fetching & auto-sync polling
│   │   ├── useBookmarks.ts             # Bookmark persistence
│   │   └── useSpeech.ts                # Browser TTS controller
│   └── lib/
│       ├── types.ts                    # TypeScript data models
│       ├── defaultFeeds.ts             # 15+ curated high-signal RSS feeds
│       ├── feedFetcher.ts              # RSS parser, deduplication & cache layer
│       ├── aiSummarizer.ts             # Local NLP & Gemini AI engine
│       └── storage.ts                  # LocalStorage helpers
```
