import { NextRequest, NextResponse } from "next/server";
import { syncAllFeeds } from "@/lib/feedFetcher";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    const result = await syncAllFeeds(force);

    return NextResponse.json({
      success: true,
      count: result.articles.length,
      articles: result.articles,
      sourcesStatus: result.sourcesStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("GET /api/news/sync error:", error);
    return NextResponse.json(
      { error: "Sync failed", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await syncAllFeeds(true);

    return NextResponse.json({
      success: true,
      count: result.articles.length,
      sourcesStatus: result.sourcesStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("POST /api/news/sync error:", error);
    return NextResponse.json(
      { error: "Sync failed", message: error.message },
      { status: 500 }
    );
  }
}
