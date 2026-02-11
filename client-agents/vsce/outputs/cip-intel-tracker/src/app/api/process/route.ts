import { NextRequest, NextResponse } from "next/server";
import { getNewsItems, updateNewsItem, getProjects, getAgency } from "@/lib/store";
import { generateExcerpt, calculateRelevanceScore, extractTags, findProjectMatches } from "@/lib/ai-processing";

/**
 * POST /api/process
 *
 * Processes unprocessed news items and generates:
 * - AI excerpt (summary focused on VSCE relevance)
 * - Relevance score (0-100)
 * - Auto-generated tags
 * - Suggested project matches
 *
 * Request body:
 * - newsItemIds?: string[] - Process specific items. If not provided, processes all unprocessed items.
 *
 * Returns:
 * - processed: NewsItem[] - Array of processed news items
 * - processedCount: number - Total items processed
 * - projectMatches: Map of newsItemId to suggested matches
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { newsItemIds } = body as { newsItemIds?: string[] };

    // Get all projects for matching
    const allProjects = getProjects();

    // Determine which items to process
    let itemsToProcess: string[];

    if (newsItemIds && Array.isArray(newsItemIds) && newsItemIds.length > 0) {
      // Process specific items provided
      itemsToProcess = newsItemIds;
    } else {
      // Process all unprocessed items (isProcessed=false, isArchived=false)
      const unprocessed = getNewsItems({
        isProcessed: false,
        isArchived: false,
        limit: 500, // Process up to 500 at a time
      });
      itemsToProcess = unprocessed.items.map((item) => item.id);
    }

    if (itemsToProcess.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No items to process",
          processed: [],
          processedCount: 0,
          projectMatches: {},
        },
        { status: 200 }
      );
    }

    // Process each item
    const processed = [];
    const projectMatches: Record<string, { projectId: string; projectName: string; score: number }[]> = {};

    for (const itemId of itemsToProcess) {
      const newsItem = getNewsItems({
        limit: 1,
        offset: 0,
      }).items.find((item) => item.id === itemId);

      if (!newsItem) {
        continue;
      }

      // Skip if already processed
      if (newsItem.isProcessed || newsItem.isArchived) {
        continue;
      }

      // Get agency info for excerpt generation
      const agency = getAgency(newsItem.agencyId);
      const agencyShortName = agency?.shortName || "Unknown Agency";

      // 1. Generate excerpt
      const excerpt = generateExcerpt(newsItem.content, agencyShortName);

      // 2. Calculate relevance score
      const relevanceScore = calculateRelevanceScore(newsItem.content, newsItem.title);

      // 3. Extract tags
      const tags = extractTags(newsItem.content, newsItem.title);

      // 4. Find project matches
      const matches = findProjectMatches(newsItem.title, newsItem.content, allProjects);
      if (matches.length > 0) {
        projectMatches[itemId] = matches;
      }

      // Update the news item with processed data
      const updated = updateNewsItem(itemId, {
        excerpt,
        relevanceScore,
        tags: [...new Set([...newsItem.tags, ...tags])], // Merge existing tags with new ones
        isProcessed: true,
      });

      if (updated) {
        processed.push(updated);
      }
    }

    return NextResponse.json(
      {
        success: true,
        processed,
        processedCount: processed.length,
        projectMatches,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/process error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process news items",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/process
 *
 * Returns statistics about processing status
 *
 * Returns:
 * - unprocessedCount: number - Total unprocessed items
 * - processedCount: number - Total processed items
 * - totalItems: number - Total news items in system
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const unprocessed = getNewsItems({
      isProcessed: false,
      isArchived: false,
      limit: 500,
    });

    const processed = getNewsItems({
      isProcessed: true,
      limit: 1,
    });

    const total = getNewsItems({
      limit: 1,
    });

    return NextResponse.json(
      {
        success: true,
        unprocessedCount: unprocessed.total,
        processedCount: total.total - unprocessed.total,
        totalItems: total.total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/process error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get processing statistics",
      },
      { status: 500 }
    );
  }
}
