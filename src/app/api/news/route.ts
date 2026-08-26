import { NextRequest, NextResponse } from "next/server";
import { getNewsArticles } from "@/lib/feedFetcher";
import { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as Category | null;
    const search = searchParams.get("search") || undefined;
    const source = searchParams.get("source") || undefined;
    const sortBy = searchParams.get("sortBy") as "latest" | "popular" | "readTime" | null;
    const limit = parseInt(searchParams.get("limit") || "60", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const result = await getNewsArticles({
      category: category || "전체",
      search,
      source,
      sortBy: sortBy || "latest",
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET /api/news error:", error);
    return NextResponse.json(
      { error: "Failed to load news", message: error.message },
      { status: 500 }
    );
  }
}
