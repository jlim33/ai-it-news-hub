import { NextRequest, NextResponse } from "next/server";
import { getSavedFeeds, saveFeeds } from "@/lib/feedFetcher";
import { DEFAULT_FEEDS } from "@/lib/defaultFeeds";
import { FeedSource } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const feeds = getSavedFeeds();
    return NextResponse.json({ feeds });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to get feeds" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feeds, action } = body;

    if (action === "reset") {
      saveFeeds(DEFAULT_FEEDS);
      return NextResponse.json({ feeds: DEFAULT_FEEDS, message: "Reset to default feeds" });
    }

    if (Array.isArray(feeds)) {
      saveFeeds(feeds);
      return NextResponse.json({ feeds, message: "Feeds updated successfully" });
    }

    return NextResponse.json({ error: "Invalid feeds format" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update feeds" }, { status: 500 });
  }
}
