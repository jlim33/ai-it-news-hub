import { AISummary, NewsArticle } from "./types";

/**
 * Intelligent local NLP summarizer supporting both English and Korean:
 * Extracts core takeaways, impact score, and sentiment accurately.
 */
export function generateLocalSummary(
  title: string,
  content: string,
  category: string,
  lang: "ko" | "en" = "ko"
): AISummary {
  const cleanContent = content
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split into sentences
  const sentences = cleanContent
    .split(/(?<=[.?!])\s+/)
    .filter(
      s =>
        s.length > 15 &&
        !s.toLowerCase().includes("copyright") &&
        !s.toLowerCase().includes("read more") &&
        !s.toLowerCase().includes("subscribe") &&
        !s.includes("기자") &&
        !s.includes("무단전재")
    );

  // -------------------------------------------------------------
  // 1. English Summary Logic
  // -------------------------------------------------------------
  if (lang === "en") {
    let bullets: string[] = [];

    if (sentences.length >= 3) {
      bullets = [sentences[0], sentences[1], sentences[Math.min(2, sentences.length - 1)]];
    } else if (sentences.length === 2) {
      bullets = [
        sentences[0],
        sentences[1],
        `Key technological breakthrough and architectural impact in the ${category} domain.`
      ];
    } else if (sentences.length === 1) {
      bullets = [
        sentences[0],
        `Strategic breakdown and community takeaways regarding "${title}".`,
        `Offers critical implications for software engineers, AI researchers, and tech leaders.`
      ];
    } else {
      bullets = [
        `Breaking coverage on: ${title}.`,
        `Highlights current progress and engineering methodologies in ${category}.`,
        `For full details and original context, refer to the source article link.`
      ];
    }

    bullets = bullets.map(b => b.replace(/\s+/g, " ").trim());

    // Impact Score (English)
    let impactScore: AISummary["impactScore"] = "Moderate";
    const lowerText = (title + " " + cleanContent).toLowerCase();

    if (
      lowerText.includes("breakthrough") ||
      lowerText.includes("zero-day") ||
      lowerText.includes("critical") ||
      lowerText.includes("gpt-5") ||
      lowerText.includes("blackwell") ||
      lowerText.includes("agi") ||
      lowerText.includes("acquisition") ||
      lowerText.includes("billion")
    ) {
      impactScore = "Critical";
    } else if (
      lowerText.includes("launch") ||
      lowerText.includes("release") ||
      lowerText.includes("open-source") ||
      lowerText.includes("benchmark") ||
      lowerText.includes("vulnerability") ||
      lowerText.includes("funding")
    ) {
      impactScore = "High";
    } else if (
      lowerText.includes("tip") ||
      lowerText.includes("guide") ||
      lowerText.includes("patch") ||
      lowerText.includes("minor")
    ) {
      impactScore = "Low";
    }

    // Sentiment (English)
    let sentiment: AISummary["sentiment"] = "Neutral";
    if (
      lowerText.includes("vulnerability") ||
      lowerText.includes("breach") ||
      lowerText.includes("hack") ||
      lowerText.includes("risk") ||
      lowerText.includes("warning") ||
      lowerText.includes("lawsuit") ||
      lowerText.includes("fine")
    ) {
      sentiment = "Cautious";
    } else if (
      lowerText.includes("breakthrough") ||
      lowerText.includes("revolutionary") ||
      lowerText.includes("sota") ||
      lowerText.includes("game-changer") ||
      lowerText.includes("disrupt")
    ) {
      sentiment = "Disruptive";
    } else if (
      lowerText.includes("surge") ||
      lowerText.includes("growth") ||
      lowerText.includes("success") ||
      lowerText.includes("improved") ||
      lowerText.includes("efficient")
    ) {
      sentiment = "Positive";
    }

    // Why It Matters (English)
    let whyItMatters = `Directly influences technical workflows, system design, and competitive positioning across the ${category} ecosystem.`;
    if (lowerText.includes("security") || lowerText.includes("vulnerability")) {
      whyItMatters = "Requires immediate review of infrastructure configurations and dependency auditing to mitigate exposure.";
    } else if (lowerText.includes("gpu") || lowerText.includes("nvidia") || lowerText.includes("chip")) {
      whyItMatters = "Shifts hardware pricing and AI compute capacity limits for enterprise training clusters.";
    } else if (lowerText.includes("model") || lowerText.includes("llm") || lowerText.includes("transformer")) {
      whyItMatters = "Sets a new standard for reasoning efficiency and real-world multi-modal application deployment.";
    }

    // Key Entities
    const entities = extractKeyEntities(title, cleanContent);

    return {
      tldr: bullets,
      whyItMatters,
      impactScore,
      sentiment,
      keyEntities: entities
    };
  }

  // -------------------------------------------------------------
  // 2. Korean Summary Logic (기존 한국어 최적화)
  // -------------------------------------------------------------
  let bullets: string[] = [];

  if (sentences.length >= 3) {
    bullets = [sentences[0], sentences[1], sentences[Math.min(2, sentences.length - 1)]];
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

  // Impact Score (Korean)
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

  // Sentiment (Korean)
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
    lowerText.includes("sota") ||
    lowerText.includes("게임체인저") ||
    lowerText.includes("파괴적")
  ) {
    sentiment = "파괴적 혁신";
  } else if (
    lowerText.includes("급증") ||
    lowerText.includes("성장") ||
    lowerText.includes("호재") ||
    lowerText.includes("성공")
  ) {
    sentiment = "긍정적";
  }

  // Why It Matters (Korean)
  let whyItMatters = `최신 파운데이션 모델의 추론 능력 및 AI 애플리케이션 개발 워크플로우에 직접적인 변화를 가져옵니다.`;
  if (lowerText.includes("보안") || lowerText.includes("security")) {
    whyItMatters = `사이버 위협 선제 대응 및 인프라 보안 수칙 강화를 위해 즉각적인 조치가 권장됩니다.`;
  } else if (lowerText.includes("반도체") || lowerText.includes("gpu") || lowerText.includes("nvidia")) {
    whyItMatters = `글로벌 하드웨어 공급망 및 차세대 AI 가속기 시장 점유율에 중대한 전환점을 시사합니다.`;
  }

  const entities = extractKeyEntities(title, cleanContent);

  return {
    tldr: bullets,
    whyItMatters,
    impactScore,
    sentiment,
    keyEntities: entities
  };
}

function extractKeyEntities(title: string, content: string): string[] {
  const text = title + " " + content;
  const common = [
    "OpenAI", "Anthropic", "Google", "DeepMind", "Microsoft", "NVIDIA", "Meta",
    "Apple", "Mistral", "Hugging Face", "AWS", "GitHub", "TSMC", "Intel", "AMD",
    "ChatGPT", "Claude", "Gemini", "LLaMA", "Python", "Rust", "TypeScript", "Kubernetes"
  ];
  return common.filter(e => new RegExp(`\\b${e}\\b`, "i").test(text)).slice(0, 5);
}

/**
 * Format daily briefing text for English and Korean
 */
export function formatDailyDigestText(articles: NewsArticle[], lang: "ko" | "en" = "ko"): string {
  const dateStr = new Date().toLocaleDateString(lang === "en" ? "en-US" : "ko-KR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (lang === "en") {
    let body = `⚡ AI & IT Pulse - Daily Intelligence Briefing (${dateStr})\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    articles.slice(0, 5).forEach((art, idx) => {
      body += `[${idx + 1}] ${art.title}\n`;
      body += `• Source: ${art.source} | Category: ${art.category} | Impact: ${art.aiSummary?.impactScore || "Moderate"}\n`;
      if (art.aiSummary?.tldr) {
        art.aiSummary.tldr.forEach(bullet => {
          body += `  - ${bullet}\n`;
        });
      }
      if (art.aiSummary?.whyItMatters) {
        body += `  ★ Why It Matters: ${art.aiSummary.whyItMatters}\n`;
      }
      body += `• Link: ${art.link}\n\n`;
    });

    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `Curated automatically by AI & IT Pulse (Global Edition)\n`;
    return body;
  }

  let body = `⚡ AI & IT 펄스 - 일일 테크 브리핑 (${dateStr})\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  articles.slice(0, 5).forEach((art, idx) => {
    body += `[${idx + 1}] ${art.title}\n`;
    body += `• 출처: ${art.source} | 카테고리: ${art.category} | 영향도: ${art.aiSummary?.impactScore || "보통"}\n`;
    if (art.aiSummary?.tldr) {
      art.aiSummary.tldr.forEach(bullet => {
        body += `  - ${bullet}\n`;
      });
    }
    if (art.aiSummary?.whyItMatters) {
      body += `  ★ 시사점: ${art.aiSummary.whyItMatters}\n`;
    }
    body += `• 링크: ${art.link}\n\n`;
  });

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `발행: AI & IT 펄스 자동 큐레이션 시스템\n`;
  return body;
}

export function generateDailyBriefingMarkdown(articles: NewsArticle[], lang: "ko" | "en" = "ko"): string {
  return formatDailyDigestText(articles, lang);
}

/**
 * Cloud LLM Deep Analysis via Gemini API
 */
export async function generateGeminiSummary(
  title: string,
  content: string,
  category: string,
  apiKey?: string,
  lang: "ko" | "en" = "ko"
): Promise<AISummary> {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return generateLocalSummary(title, content, category, lang);
  }

  try {
    const prompt = lang === "en"
      ? `You are an elite AI & tech research analyst. Summarize this article in 3 high-impact bullet points and explain why it matters.
Article Title: ${title}
Category: ${category}
Article Content: ${content.slice(0, 1500)}

Respond in valid JSON only with keys: "tldr" (array of 3 strings), "whyItMatters" (string), "impactScore" ("Critical"|"High"|"Moderate"|"Low"), "sentiment" ("Positive"|"Neutral"|"Cautious"|"Disruptive"), "keyEntities" (array of strings).`
      : `당신은 최고 수준의 AI & 테크 전문 분석가입니다. 다음 기사의 핵심을 3줄로 요약하고 왜 중요한지 설명해주세요.
기사 제목: ${title}
카테고리: ${category}
기사 본문: ${content.slice(0, 1500)}

반드시 다음 JSON 형식으로만 응답하세요:
{
  "tldr": ["요약1", "요약2", "요약3"],
  "whyItMatters": "이 기사가 산업과 개발자에게 미치는 실질적 영향",
  "impactScore": "매우 중요" | "높음" | "보통" | "일반",
  "sentiment": "긍정적" | "중립적" | "신중함" | "파괴적 혁신",
  "keyEntities": ["핵심키워드1", "핵심키워드2"]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      return generateLocalSummary(title, content, category, lang);
    }

    const data = await response.json();
    const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) {
      return generateLocalSummary(title, content, category, lang);
    }

    const parsed = JSON.parse(rawJsonText);
    return {
      tldr: Array.isArray(parsed.tldr) ? parsed.tldr : [title],
      whyItMatters: parsed.whyItMatters || "",
      impactScore: parsed.impactScore || (lang === "en" ? "Moderate" : "보통"),
      sentiment: parsed.sentiment || (lang === "en" ? "Neutral" : "중립적"),
      keyEntities: Array.isArray(parsed.keyEntities) ? parsed.keyEntities : [],
    };
  } catch (err) {
    console.error("Gemini API call failed, falling back to local NLP:", err);
    return generateLocalSummary(title, content, category, lang);
  }
}

