import { NextRequest, NextResponse } from "next/server";
import { getNewsItems, addNewsItem } from "@/lib/store";
import type { NewsItem, Territory } from "@/lib/types";

/**
 * GET /api/news
 * Returns news items with optional filtering
 * Query params: territory, agencyId, projectId, limit, offset
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const territory = searchParams.get("territory") as Territory | null;
    const agencyId = searchParams.get("agencyId");
    const projectId = searchParams.get("projectId");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;

    // Validate limit and offset
    const validLimit = Math.min(Math.max(limit, 1), 500); // 1-500
    const validOffset = Math.max(offset, 0);

    // Get news items with filters
    const { items, total } = getNewsItems({
      territory: territory || undefined,
      agencyId: agencyId || undefined,
      projectId: projectId || undefined,
      limit: validLimit,
      offset: validOffset,
    });

    return NextResponse.json(
      {
        success: true,
        items,
        total,
        limit: validLimit,
        offset: validOffset,
        hasMore: validOffset + items.length < total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/news error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch news items",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/news
 * Adds a new news item
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["sourceId", "agencyId", "title", "content", "url", "territory"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Prepare news item
    const newsItem: Omit<NewsItem, "id"> = {
      sourceId: body.sourceId,
      agencyId: body.agencyId,
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || undefined,
      url: body.url,
      publishedAt: body.publishedAt || undefined,
      scrapedAt: new Date().toISOString(),
      projectId: body.projectId || undefined,
      tags: body.tags || [],
      relevanceScore: body.relevanceScore || undefined,
      isProcessed: body.isProcessed || false,
      isArchived: body.isArchived || false,
      territory: body.territory,
    };

    // Add the news item
    const newItem = addNewsItem(newsItem);

    if (!newItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to add news item",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        item: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/news error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create news item",
      },
      { status: 500 }
    );
  }
}
