import Parser from "rss-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parser = new Parser({
  timeout: 7000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI-IT-News-Hub/1.0",
    "Accept": "application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8"
  }
});

const FEEDS = [
  { id: "ai-times-kr", name: "AI타임스", url: "https://www.aitimes.com/rss/allArticle.xml", category: "생성형 AI", lang: "ko" },
  { id: "geeknews-tech", name: "긱뉴스", url: "https://news.hada.io/rss/news", category: "클라우드 & 개발", lang: "ko" },
  { id: "yozm-it", name: "요즘IT", url: "https://yozm.wishket.com/magazine/feed/", category: "클라우드 & 개발", lang: "ko" },
  { id: "techcrunch-ai", name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", category: "생성형 AI", lang: "en" },
  { id: "verge-tech", name: "The Verge", url: "https://www.theverge.com/rss/index.xml", category: "빅테크 이슈", lang: "en" },
  { id: "venturebeat-ai", name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", category: "LLM & 연구", lang: "en" },
  { id: "arstechnica-tech", name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", category: "반도체 & 칩", lang: "en" }
];

async function generate() {
  console.log("Fetching RSS feeds...");
  const articles = [];

  for (const feed of FEEDS) {
    try {
      console.log(`Fetching ${feed.name}...`);
      const res = await parser.parseURL(feed.url);
      const items = (res.items || []).slice(0, 8);
      for (const item of items) {
        const title = item.title?.trim() || "Untitled";
        const snippet = (item.contentSnippet || item.content || item.summary || "")
          .replace(/<[^>]*>?/gm, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 280);
        
        articles.push({
          id: Buffer.from(item.link || title).toString("base64").slice(0, 16),
          title,
          link: item.link || "#",
          source: feed.name,
          sourceId: feed.id,
          category: feed.category,
          lang: feed.lang,
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          timestamp: new Date(item.isoDate || item.pubDate || Date.now()).getTime(),
          author: item.creator || item.author || feed.name,
          snippet: snippet || "자세한 기사 내용은 원문 링크를 통해 확인하실 수 있습니다.",
          readTime: Math.max(2, Math.ceil((snippet.length || 100) / 70)),
          likes: Math.floor(Math.random() * 45) + 12,
          bookmarksCount: Math.floor(Math.random() * 20) + 3,
          isBreaking: Math.random() < 0.15,
          keyTakeaways: [
            `${title}에 대한 심층 보도 및 주요 산업 동향`,
            `기술 혁신 및 글로벌 개발자 생태계에 미치는 영향`,
            `지속적인 업데이트 및 최신 후속 동향 모니터링 필요`
          ]
        });
      }
    } catch (e) {
      console.warn(`Failed to fetch ${feed.name}:`, e.message);
    }
  }

  // Fallback seed articles if network blocked or limited
  if (articles.length === 0) {
    console.log("Using rich fallback seed articles...");
    articles.push(
      {
        id: "ai-sample-1",
        title: "오픈AI 차세대 추론 모델 o3 발표: 벤치마크 최고점 경신",
        link: "https://openai.com",
        source: "AI타임스",
        sourceId: "ai-times-kr",
        category: "생성형 AI",
        lang: "ko",
        publishedAt: new Date().toISOString(),
        timestamp: Date.now(),
        author: "기술분석팀",
        snippet: "오픈AI가 고도화된 다단계 추론 모델 o3 및 o3-mini를 공식 공개하며 수학 및 코딩 벤치마크에서 기존 최고점을 대폭 경신했습니다.",
        readTime: 3,
        likes: 128,
        bookmarksCount: 45,
        isBreaking: true,
        keyTakeaways: [
          "수학 및 고난도 알고리즘 대회 수준의 문제 해결 능력 입증",
          "추론 연산(Compute) 최적화로 응답 속도 및 비용 효율성 향상",
          "글로벌 AI 경쟁 가속화 및 엔터프라이즈 도입 가시화"
        ]
      },
      {
        id: "ai-sample-2",
        title: "구글 딥마인드, 제미나이 2.0 플래시 공식 릴리스 및 실시간 멀티모달 확장",
        link: "https://blog.google",
        source: "긱뉴스",
        sourceId: "geeknews-tech",
        category: "생성형 AI",
        lang: "ko",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        timestamp: Date.now() - 3600000,
        author: "AI리포트",
        snippet: "구글이 초저지연 실시간 음성, 비전 상호작용이 가능한 Gemini 2.0 Flash 정식 버전을 전격 공개하고 개발자 API를 제공합니다.",
        readTime: 4,
        likes: 95,
        bookmarksCount: 38,
        isBreaking: false,
        keyTakeaways: [
          "실시간 음성 및 영상 스트리밍 동시 추론 지원",
          "개발자 콘솔 및 Vertex AI를 통한 즉시 배포 가능",
          "멀티에이전트 오케스트레이션 성능 강화"
        ]
      },
      {
        id: "ai-sample-3",
        title: "엔비디아 차세대 블랙웰 Ultra GPU 아키텍처 양산 로드맵 발표",
        link: "https://nvidianews.nvidia.com",
        source: "The Verge",
        sourceId: "verge-tech",
        category: "반도체 & 칩",
        lang: "ko",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        timestamp: Date.now() - 7200000,
        author: "Tech Desk",
        snippet: "엔비디아가 데이터센터 및 AI 슈퍼클러스터를 위한 블랙웰 울트라(Blackwell Ultra) GPU 양산 일정을 공식화하며 시장 주도권을 공고히 하고 있습니다.",
        readTime: 3,
        likes: 112,
        bookmarksCount: 52,
        isBreaking: true,
        keyTakeaways: [
          "초대형 LLM 학습 및 추론 처리량 2배 이상 향상",
          "차세대 HBM3e 메모리 탑재로 대역폭 극대화",
          "주요 클라우드 서비스 공급업체 우선 공급 예정"
        ]
      }
    );
  }

  // Sort by date desc
  articles.sort((a, b) => b.timestamp - a.timestamp);

  const outDir = path.join(__dirname, "..", "public", "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "news.json");

  const payload = {
    updatedAt: new Date().toISOString(),
    total: articles.length,
    articles
  };

  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`Saved ${articles.length} articles to ${outFile}`);
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
