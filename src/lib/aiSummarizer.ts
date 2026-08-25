import { AISummary, NewsArticle } from "./types";

/**
 * Intelligent local NLP summarizer:
 * Extracts core takeaways, impact score, and sentiment without requiring external API keys.
 */
export function generateLocalSummary(title: string, content: string, category: string): AISummary {
  const cleanContent = content
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split into sentences
  const sentences = cleanContent
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.length > 20 && !s.includes("Read more") && !s.includes("Subscribe") && !s.includes("Copyright"));

  let bullets: string[] = [];

  if (sentences.length >= 3) {
    bullets = [
      sentences[0],
      sentences[1],
      sentences[Math.min(2, sentences.length - 1)]
    ];
  } else if (sentences.length === 2) {
    bullets = [sentences[0], sentences[1], `Focuses on developments across ${category}.`];
  } else if (sentences.length === 1) {
    bullets = [
      sentences[0],
      `Key report discussing ${title.toLowerCase()}.`,
      `Relevant for engineering, AI practitioners, and IT strategists.`
    ];
  } else {
    bullets = [
      `Announcement regarding ${title}.`,
      `Highlights latest advancements and community reactions in ${category}.`,
      `Full technical analysis available at the source article.`
    ];
  }

  // Cleanup bullets
  bullets = bullets.map(b => b.replace(/\s+/g, " ").trim());

  // Determine Impact Score
  let impactScore: AISummary["impactScore"] = "Medium";
  const lowerText = (title + " " + cleanContent).toLowerCase();
  
  if (
    lowerText.includes("breakthrough") ||
    lowerText.includes("zero-day") ||
    lowerText.includes("critical") ||
    lowerText.includes("gpt-5") ||
    lowerText.includes("major outage") ||
    lowerText.includes("antitrust") ||
    lowerText.includes("nvidia blackwell") ||
    lowerText.includes("quantum") ||
    lowerText.includes("agi")
  ) {
    impactScore = "Critical";
  } else if (
    lowerText.includes("new model") ||
    lowerText.includes("releases") ||
    lowerText.includes("open-source") ||
    lowerText.includes("vulnerability") ||
    lowerText.includes("announces") ||
    lowerText.includes("funding") ||
    lowerText.includes("benchmark")
  ) {
    impactScore = "High";
  } else if (
    lowerText.includes("tutorial") ||
    lowerText.includes("tip") ||
    lowerText.includes("minor update")
  ) {
    impactScore = "Low";
  }

  // Determine Sentiment
  let sentiment: AISummary["sentiment"] = "Neutral";
  if (
    lowerText.includes("vulnerability") ||
    lowerText.includes("hack") ||
    lowerText.includes("breach") ||
    lowerText.includes("warning") ||
    lowerText.includes("risk") ||
    lowerText.includes("lawsuit") ||
    lowerText.includes("danger")
  ) {
    sentiment = "Cautious";
  } else if (
    lowerText.includes("breakthrough") ||
    lowerText.includes("faster") ||
    lowerText.includes("achieves") ||
    lowerText.includes("efficient") ||
    lowerText.includes("success") ||
    lowerText.includes("milestone")
  ) {
    sentiment = "Positive";
  } else if (
    lowerText.includes("disrupt") ||
    lowerText.includes("transforms") ||
    lowerText.includes("revolution") ||
    lowerText.includes("paradigm")
  ) {
    sentiment = "Disruptive";
  }

  // Extract key entities
  const knownKeywords = [
    "OpenAI", "Google", "DeepMind", "Anthropic", "Meta", "NVIDIA", "Microsoft", "Apple",
    "Amazon", "AWS", "Claude", "ChatGPT", "Gemini", "Llama", "PyTorch", "Kubernetes",
    "Rust", "TypeScript", "Linux", "Docker", "Intel", "AMD", "TSMC", "Mistral", "Hugging Face"
  ];
  const keyEntities = knownKeywords.filter(k => 
    new RegExp(`\\b${k}\\b`, "i").test(title + " " + cleanContent)
  );

  // Generate "Why It Matters"
  let whyItMatters = "";
  if (category === "Generative AI" || category === "LLMs & Research") {
    whyItMatters = "Directly influences current frontier model capabilities, deployment cost, and developer tooling ecosystems.";
  } else if (category === "Hardware & Chips") {
    whyItMatters = "Impacts computing infrastructure capacity, semiconductor supply chains, and AI compute bottlenecks.";
  } else if (category === "Cybersecurity") {
    whyItMatters = "Urgent attention required for defense teams, infrastructure hardening, and mitigation strategies.";
  } else if (category === "Cloud & DevOps" || category === "Open Source") {
    whyItMatters = "Affects daily developer productivity, open software supply chains, and distributed systems architecture.";
  } else {
    whyItMatters = "Signals broader technological shifts impacting modern IT infrastructure and digital strategy.";
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
 * Optional external LLM Summarizer using Gemini API if key is provided.
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
    const prompt = `You are a world-class AI & IT technology analyst. Analyze this news item:
Title: "${title}"
Category: "${category}"
Content: "${content.slice(0, 2000)}"

Return a valid JSON object with the following schema (no markdown wrap, just raw json):
{
  "tldr": ["Key point 1 (crisp and factual)", "Key point 2 (technical implication)", "Key point 3 (future outlook)"],
  "whyItMatters": "1-2 sentence executive briefing on why this is significant.",
  "impactScore": "Critical" | "High" | "Medium" | "Low",
  "sentiment": "Positive" | "Neutral" | "Cautious" | "Disruptive",
  "keyEntities": ["Entity1", "Entity2", "Entity3"]
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
      console.warn("Gemini API request failed, falling back to heuristic NLP summarizer.");
      return generateLocalSummary(title, content, category);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return {
        tldr: parsed.tldr || [],
        whyItMatters: parsed.whyItMatters || "",
        impactScore: parsed.impactScore || "Medium",
        sentiment: parsed.sentiment || "Neutral",
        keyEntities: parsed.keyEntities || []
      };
    }
  } catch (err) {
    console.warn("Error calling Gemini summary, using local fallback:", err);
  }

  return generateLocalSummary(title, content, category);
}

/**
 * Generate a curated Daily AI & IT Briefing in Markdown format
 */
export function generateDailyBriefingMarkdown(articles: NewsArticle[]): string {
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const topArticles = articles.slice(0, 8);

  let md = `# ⚡ AI & IT Daily Pulse — ${dateStr}\n\n`;
  md += `> **Executive Summary**: Aggregated from top engineering blogs, arXiv papers, and tech outlets.\n\n---\n\n`;

  topArticles.forEach((art, index) => {
    md += `### ${index + 1}. [${art.title}](${art.link})\n`;
    md += `**Source:** ${art.source} | **Category:** \`${art.category}\` | **Impact:** **${art.aiSummary?.impactScore || "Medium"}**\n\n`;
    if (art.aiSummary?.tldr && art.aiSummary.tldr.length > 0) {
      art.aiSummary.tldr.forEach(b => {
        md += `- ${b}\n`;
      });
    } else {
      md += `- ${art.contentSnippet.slice(0, 200)}...\n`;
    }
    if (art.aiSummary?.whyItMatters) {
      md += `\n💡 *Why It Matters:* ${art.aiSummary.whyItMatters}\n`;
    }
    md += `\n---\n\n`;
  });

  md += `\n*Generated automatically by AI & IT News Hub.*`;
  return md;
}
