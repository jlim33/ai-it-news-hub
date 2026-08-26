import { AISummary, NewsArticle } from "./types";

/**
 * Intelligent local NLP summarizer (Korean Specialized):
 * Extracts core takeaways, impact score, and sentiment in Korean.
 */
export function generateLocalSummary(title: string, content: string, category: string): AISummary {
  const cleanContent = content
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split into sentences
  const sentences = cleanContent
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.length > 15 && !s.includes("기자") && !s.includes("무단전재") && !s.includes("Copyright") && !s.includes("Read more"));

  let bullets: string[] = [];

  if (sentences.length >= 3) {
    bullets = [
      sentences[0],
      sentences[1],
      sentences[Math.min(2, sentences.length - 1)]
    ];
  } else if (sentences.length === 2) {
    bullets = [
      sentences[0],
      sentences[1],
      `${category} 분야의 핵심 동향 및 기술적 파급 효과를 다룹니다.`
    ];
  } else if (sentences.length === 1) {
    bullets = [
      sentences[0],
      `'${title}'에 관한 주요 분석 및 업계 반응입니다.`,
      `국내외 개발자 및 IT 실무자에게 유의미한 시사점을 제공합니다.`
    ];
  } else {
    bullets = [
      `'${title}' 관련 최신 소식입니다.`,
      `${category} 생태계 내 주요 기술 혁신과 발전 방향을 다룹니다.`,
      `세부적인 분석 및 원문 정보는 링크를 통해 확인하실 수 있습니다.`
    ];
  }

  bullets = bullets.map(b => b.replace(/\s+/g, " ").trim());

  // Determine Impact Score
  let impactScore: AISummary["impactScore"] = "보통";
  const lowerText = (title + " " + cleanContent).toLowerCase();

  if (
    lowerText.includes("돌파구") ||
    lowerText.includes("breakthrough") ||
    lowerText.includes("zero-day") ||
    lowerText.includes("제로데이") ||
    lowerText.includes("critical") ||
    lowerText.includes("gpt-5") ||
    lowerText.includes("블랙웰") ||
    lowerText.includes("blackwell") ||
    lowerText.includes("agi") ||
    lowerText.includes("초거대") ||
    lowerText.includes("단독")
  ) {
    impactScore = "매우 중요";
  } else if (
    lowerText.includes("출시") ||
    lowerText.includes("공개") ||
    lowerText.includes("신규") ||
    lowerText.includes("release") ||
    lowerText.includes("오픈소스") ||
    lowerText.includes("투자") ||
    lowerText.includes("보안 취약점") ||
    lowerText.includes("벤치마크")
  ) {
    impactScore = "높음";
  } else if (
    lowerText.includes("팁") ||
    lowerText.includes("튜토리얼") ||
    lowerText.includes("마이너") ||
    lowerText.includes("패치")
  ) {
    impactScore = "일반";
  }

  // Determine Sentiment
  let sentiment: AISummary["sentiment"] = "중립적";
  if (
    lowerText.includes("취약점") ||
    lowerText.includes("해킹") ||
    lowerText.includes("유출") ||
    lowerText.includes("경고") ||
    lowerText.includes("위험") ||
    lowerText.includes("소송") ||
    lowerText.includes("breach") ||
    lowerText.includes("risk")
  ) {
    sentiment = "신중함";
  } else if (
    lowerText.includes("혁신") ||
    lowerText.includes("성능 향상") ||
    lowerText.includes("돌파") ||
    lowerText.includes("성공") ||
    lowerText.includes("기록 경신") ||
    lowerText.includes("faster") ||
    lowerText.includes("milestone")
  ) {
    sentiment = "긍정적";
  } else if (
    lowerText.includes("패러다임") ||
    lowerText.includes("생태계 변화") ||
    lowerText.includes("disrupt") ||
    lowerText.includes("대격변") ||
    lowerText.includes("재편")
  ) {
    sentiment = "파괴적 혁신";
  }

  // Extract key entities
  const knownKeywords = [
    "OpenAI", "Google", "DeepMind", "네이버", "카카오", "삼성전자", "SK하이닉스",
    "Anthropic", "Meta", "NVIDIA", "엔비디아", "Microsoft", "마이크로소프트", "Apple",
    "애플", "Claude", "ChatGPT", "Gemini", "Llama", "PyTorch", "Kubernetes", "쿠버네티스",
    "Rust", "TypeScript", "Linux", "Docker", "Intel", "AMD", "TSMC", "Hugging Face"
  ];
  const keyEntities = knownKeywords.filter(k => 
    new RegExp(`\\b${k}\\b`, "i").test(title + " " + cleanContent)
  );

  // Generate "Why It Matters" in Korean
  let whyItMatters = "";
  if (category === "생성형 AI" || category === "LLM & 연구") {
    whyItMatters = "최신 파운데이션 모델의 추론 능력 및 AI 애플리케이션 개발 워크플로우에 직접적인 변화를 가져옵니다.";
  } else if (category === "반도체 & 칩") {
    whyItMatters = "차세대 AI 컴퓨팅 인프라 공급망과 전력 효율성 및 가속기 시장 판도에 중대한 영향을 미칩니다.";
  } else if (category === "사이버 보안") {
    whyItMatters = "엔터프라이즈 인프라 보호 및 시스템 보안 패치 대응을 위한 즉각적인 점검이 요구됩니다.";
  } else if (category === "클라우드 & 개발" || category === "오픈소스") {
    whyItMatters = "현업 개발 생산성 향상과 클라우드 네이티브 아키텍처의 현대화 방향성을 제시합니다.";
  } else {
    whyItMatters = "글로벌 IT 업계 트렌드와 디지털 혁신 전략 수립에 필수적인 시장 신호를 제공합니다.";
  }

  return {
    tldr: bullets.slice(0, 3),
    whyItMatters,
    impactScore,
    sentiment,
    keyEntities: keyEntities.slice(0, 5)
  };
}

/**
 * Optional external LLM Summarizer using Gemini API if key is provided (Korean Output)
 */
export async function generateGeminiSummary(
  title: string,
  content: string,
  category: string,
  apiKey?: string
): Promise<AISummary> {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
  if (!effectiveKey) {
    return generateLocalSummary(title, content, category);
  }

  try {
    const prompt = `당신은 최고 수준의 AI & IT 전문 테크 애널리스트입니다. 다음 뉴스를 분석하고 전문적이고 명확한 한국어로 요약해 주세요:
제목: "${title}"
카테고리: "${category}"
본문: "${content.slice(0, 2000)}"

반드시 다음 JSON 형식으로만 응답해 주세요 (마크다운 없이 순수 JSON만 반환):
{
  "tldr": ["핵심 요약 1 (명확한 사실 중심)", "핵심 요약 2 (기술적 의미/파급효과)", "핵심 요약 3 (향후 전망 및 시사점)"],
  "whyItMatters": "1~2문장의 핵심 중요성 및 업계 영향 분석 브리핑",
  "impactScore": "매우 중요" | "높음" | "보통" | "일반",
  "sentiment": "긍정적" | "중립적" | "신중함" | "파괴적 혁신",
  "keyEntities": ["주요기업1", "기술명2", "기관3"]
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    if (!res.ok) {
      return generateLocalSummary(title, content, category);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return {
        tldr: parsed.tldr || [],
        whyItMatters: parsed.whyItMatters || "",
        impactScore: parsed.impactScore || "보통",
        sentiment: parsed.sentiment || "중립적",
        keyEntities: parsed.keyEntities || []
      };
    }
  } catch (err) {
    console.warn("Error calling Gemini summary, using local fallback:", err);
  }

  return generateLocalSummary(title, content, category);
}

/**
 * Generate a curated Daily AI & IT Briefing in Korean Markdown format
 */
export function generateDailyBriefingMarkdown(articles: NewsArticle[]): string {
  const dateStr = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });

  const topArticles = articles.slice(0, 8);

  let md = `# ⚡ AI & IT 일일 뉴스 브리핑 — ${dateStr}\n\n`;
  md += `> **개요**: 국내외 주요 테크 미디어, AI 연구소 및 엔지니어링 블로그 실시간 종합 분석.\n\n---\n\n`;

  topArticles.forEach((art, index) => {
    md += `### ${index + 1}. [${art.title}](${art.link})\n`;
    md += `**출처:** ${art.source} | **분류:** \`${art.category}\` | **영향도:** **${art.aiSummary?.impactScore || "보통"}**\n\n`;
    if (art.aiSummary?.tldr && art.aiSummary.tldr.length > 0) {
      art.aiSummary.tldr.forEach(b => {
        md += `- ${b}\n`;
      });
    } else {
      md += `- ${art.contentSnippet.slice(0, 200)}...\n`;
    }
    if (art.aiSummary?.whyItMatters) {
      md += `\n💡 *왜 중요한가:* ${art.aiSummary.whyItMatters}\n`;
    }
    md += `\n---\n\n`;
  });

  md += `\n*AI & IT News Pulse 한국어 에디션 자동 생성.*`;
  return md;
}
