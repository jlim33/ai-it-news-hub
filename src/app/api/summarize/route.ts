import { NextRequest, NextResponse } from "next/server";
import { generateGeminiSummary } from "@/lib/aiSummarizer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, apiKey } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const summary = await generateGeminiSummary(
      title,
      content,
      category || "All",
      apiKey
    );

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("POST /api/summarize error:", error);
    return NextResponse.json(
      { error: "Summarization failed", message: error.message },
      { status: 500 }
    );
  }
}
