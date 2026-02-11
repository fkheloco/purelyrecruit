import { NextRequest, NextResponse } from "next/server";
import { NewsSource, NewsItem, Territory } from "@/lib/types";
import { getAgency, addNewsItem } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

interface ScrapeRequest {
  sourceId: string;
  agencyId: string;
  url: string;
  type: string;
  scrapeConfig?: {
    itemSelector?: string;
    titleSelector?: string;
    dateSelector?: string;
    linkSelector?: string;
    descriptionSelector?: string;
    paginationSelector?: string;
  };
}

interface ScrapedItem {
  title: string;
  content: string;
  url: string;
  date: string | null;
}

interface ScrapeResponse {
  success: boolean;
  items?: ScrapedItem[];
  itemsAdded?: number;
  error?: string;
}

/**
 * Helper function to decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

/**
 * Helper function to extract text content from HTML
 */
function extractTextContent(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  text = text.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, " ");
  // Decode HTML entities
  text = decodeHtmlEntities(text);
  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

/**
 * Helper function to extract title from HTML
 */
function extractTitle(html: string): string {
  // Try to get title from <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return decodeHtmlEntities(titleMatch[1].trim());
  }

  // Try to get first h1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return decodeHtmlEntities(h1Match[1].trim());
  }

  // Try to get first h2
  const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>/i);
  if (h2Match && h2Match[1]) {
    return decodeHtmlEntities(h2Match[1].trim());
  }

  return "Untitled Page";
}

/**
 * Helper function to extract headings and links from HTML
 */
function extractStructuredContent(html: string): string {
  const items: string[] = [];

  // Extract all headings (h1-h3)
  const headingMatches = html.matchAll(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/gi);
  for (const match of headingMatches) {
    const text = decodeHtmlEntities(match[1].trim());
    if (text && text.length > 0) items.push(text);
  }

  // Extract all links with text
  const linkMatches = html.matchAll(/<a[^>]*href="[^"]*"[^>]*>([^<]+)<\/a>/gi);
  for (const match of linkMatches) {
    const text = decodeHtmlEntities(match[1].trim());
    if (text && text.length > 0) items.push(text);
  }

  return items.slice(0, 20).join(" | ");
}

/**
 * Helper function to extract date from HTML
 */
function extractDate(html: string): string | null {
  // Look for common date patterns
  const datePatterns = [
    /<time[^>]*datetime="([^"]+)"[^>]*>/i,
    /published[">:]*\s*(\d{4}-\d{2}-\d{2})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{4}-\d{2}-\d{2})/,
    /(\w+\s+\d{1,2},?\s+\d{4})/,
  ];

  for (const pattern of datePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Parse RSS/Atom feed XML and extract items
 */
function parseRssFeed(xml: string): ScrapedItem[] {
  const items: ScrapedItem[] = [];

  // Extract RSS items
  const itemMatches = xml.matchAll(/<item[^>]*>[\s\S]*?<\/item>/gi);
  for (const itemMatch of itemMatches) {
    const itemXml = itemMatch[0];

    // Extract title
    const titleMatch = itemXml.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : "Untitled";

    // Extract link
    const linkMatch = itemXml.match(/<link[^>]*>([^<]+)<\/link>/i);
    const url = linkMatch ? linkMatch[1].trim() : "";

    // Extract description
    const descMatch = itemXml.match(/<description[^>]*>([^<]+)<\/description>/i);
    const description = descMatch ? decodeHtmlEntities(descMatch[1].trim()) : "";

    // Extract pub date
    const dateMatch = itemXml.match(/<pubDate[^>]*>([^<]+)<\/pubDate>/i);
    const date = dateMatch ? dateMatch[1].trim() : null;

    if (title && url) {
      items.push({
        title,
        content: description || "No description available",
        url,
        date,
      });
    }
  }

  // Also try Atom format if no items found
  if (items.length === 0) {
    const atomEntries = xml.matchAll(/<entry[^>]*>[\s\S]*?<\/entry>/gi);
    for (const entryMatch of atomEntries) {
      const entryXml = entryMatch[0];

      const titleMatch = entryXml.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : "Untitled";

      const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"/i);
      const url = linkMatch ? linkMatch[1].trim() : "";

      const summaryMatch = entryXml.match(/<summary[^>]*>([^<]+)<\/summary>/i);
      const summary = summaryMatch ? decodeHtmlEntities(summaryMatch[1].trim()) : "";

      const publishedMatch = entryXml.match(/<published[^>]*>([^<]+)<\/published>/i);
      const date = publishedMatch ? publishedMatch[1].trim() : null;

      if (title && url) {
        items.push({
          title,
          content: summary || "No summary available",
          url,
          date,
        });
      }
    }
  }

  return items;
}

/**
 * Extract items using CSS selectors from HTML
 */
function extractWithSelectors(
  html: string,
  itemSelector: string,
  titleSelector?: string,
  descriptionSelector?: string,
  dateSelector?: string,
  linkSelector?: string
): ScrapedItem[] {
  const items: ScrapedItem[] = [];

  // Simple regex-based CSS selector parser (very basic)
  // Matches: .class, #id, tag, tag.class, tag#id
  const parseSelector = (selector: string) => {
    const trimmed = selector.trim();
    const classMatch = trimmed.match(/^([\w-]+)?\.([a-zA-Z0-9\-_]+)$/);
    const idMatch = trimmed.match(/^([\w-]+)?#([a-zA-Z0-9\-_]+)$/);
    const tagMatch = trimmed.match(/^([a-zA-Z0-9\-]+)$/);

    if (classMatch) {
      const tag = classMatch[1] || "[a-z0-9]+";
      const className = classMatch[2];
      return `<${tag}[^>]*class="[^"]*${className}[^"]*"[^>]*>`;
    }
    if (idMatch) {
      const tag = idMatch[1] || "[a-z0-9]+";
      const id = idMatch[2];
      return `<${tag}[^>]*id="${id}"[^>]*>`;
    }
    if (tagMatch) {
      return `<${trimmed}[^>]*>`;
    }

    return null;
  };

  const itemPattern = parseSelector(itemSelector);
  if (!itemPattern) return items;

  // Extract items
  const itemRegex = new RegExp(itemPattern + "[\\s\\S]*?<\\/[a-z0-9]+>", "gi");
  const itemMatches = html.matchAll(itemRegex);

  for (const itemMatch of itemMatches) {
    const itemHtml = itemMatch[0];

    // Extract title
    let title = "Untitled";
    if (titleSelector) {
      const titlePattern = parseSelector(titleSelector);
      if (titlePattern) {
        const titleRegex = new RegExp(titlePattern + "([^<]+)<\\/", "i");
        const titleMatch = itemHtml.match(titleRegex);
        if (titleMatch && titleMatch[1]) {
          title = decodeHtmlEntities(titleMatch[1].trim());
        }
      }
    } else {
      const h1Match = itemHtml.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/i);
      if (h1Match) title = decodeHtmlEntities(h1Match[1].trim());
    }

    // Extract description
    let description = "";
    if (descriptionSelector) {
      const descPattern = parseSelector(descriptionSelector);
      if (descPattern) {
        const descRegex = new RegExp(descPattern + "([^<]+)<\\/", "i");
        const descMatch = itemHtml.match(descRegex);
        if (descMatch && descMatch[1]) {
          description = decodeHtmlEntities(descMatch[1].trim());
        }
      }
    } else {
      const pMatch = itemHtml.match(/<p[^>]*>([^<]+)<\/p>/i);
      if (pMatch) description = decodeHtmlEntities(pMatch[1].trim());
    }

    // Extract link
    let url = "";
    if (linkSelector) {
      const linkPattern = parseSelector(linkSelector);
      if (linkPattern) {
        const linkRegex = new RegExp(linkPattern + '[^>]*href="([^"]+)"', "i");
        const linkMatch = itemHtml.match(linkRegex);
        if (linkMatch && linkMatch[1]) {
          url = linkMatch[1];
        }
      }
    } else {
      const aMatch = itemHtml.match(/<a[^>]*href="([^"]+)"/i);
      if (aMatch && aMatch[1]) url = aMatch[1];
    }

    // Extract date
    let date: string | null = null;
    if (dateSelector) {
      const datePattern = parseSelector(dateSelector);
      if (datePattern) {
        const dateRegex = new RegExp(datePattern + "([^<]+)<\\/", "i");
        const dateMatch = itemHtml.match(dateRegex);
        if (dateMatch && dateMatch[1]) {
          date = dateMatch[1].trim();
        }
      }
    } else {
      date = extractDate(itemHtml);
    }

    if (title) {
      items.push({
        title,
        content: description || "No description available",
        url: url || "",
        date,
      });
    }
  }

  return items;
}

/**
 * Extract Planet Bids content - look for bid/RFP patterns
 */
function extractPlanetBidsContent(html: string): ScrapedItem[] {
  const items: ScrapedItem[] = [];

  // Look for bid listings - typically in divs or rows
  const bidPatterns = [
    /<div[^>]*class="[^"]*bid[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    /<tr[^>]*>[\s\S]*?<\/tr>/gi,
    /<li[^>]*class="[^"]*rfp[^"]*"[^>]*>[\s\S]*?<\/li>/gi,
  ];

  for (const pattern of bidPatterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      const bidHtml = match[0];

      // Extract title - look for bold text or links
      let title = "";
      const titleMatch = bidHtml.match(/<(?:b|strong|a)[^>]*>([^<]+)<\/(?:b|strong|a)>/i);
      if (titleMatch) {
        title = decodeHtmlEntities(titleMatch[1].trim());
      } else {
        const textMatch = bidHtml.match(/>([^<]{20,}?)</);
        if (textMatch) title = decodeHtmlEntities(textMatch[1].trim()).substring(0, 100);
      }

      // Extract link
      const linkMatch = bidHtml.match(/href="([^"]+)"/i);
      const url = linkMatch ? linkMatch[1] : "";

      // Extract date/deadline
      const dateMatch = bidHtml.match(
        /(?:deadline|due|closes?|posted)[\s:]*([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2})/i
      );
      const date = dateMatch ? dateMatch[1] : null;

      // Get plain text content
      const content = extractTextContent(bidHtml);

      if (title && content) {
        items.push({
          title,
          content: content.substring(0, 500),
          url,
          date,
        });
      }

      if (items.length >= 50) break;
    }

    if (items.length >= 50) break;
  }

  return items;
}

/**
 * Basic HTML scraping fallback
 */
function extractBasicContent(html: string, url: string): ScrapedItem[] {
  const title = extractTitle(html);
  const textContent = extractTextContent(html);
  const structuredContent = extractStructuredContent(html);
  const date = extractDate(html);

  // Combine content for the item
  const content = [structuredContent, textContent.substring(0, 500)].filter(Boolean).join(" ... ");

  return [
    {
      title,
      content: content.substring(0, 1000),
      url,
      date,
    },
  ];
}

/**
 * Fetch URL with timeout
 */
async function fetchUrl(url: string, timeoutMs: number = 15000): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * POST /api/scrape
 * Scrapes a URL and extracts content based on source type and config
 */
export async function POST(request: NextRequest): Promise<NextResponse<ScrapeResponse>> {
  try {
    const body = (await request.json()) as ScrapeRequest;
    const { sourceId, agencyId, url, type, scrapeConfig } = body;

    // Validate required fields
    if (!sourceId || !agencyId || !url || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: sourceId, agencyId, url, type",
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid URL format",
        },
        { status: 400 }
      );
    }

    // Fetch the URL
    let content: string;
    try {
      content = await fetchUrl(url, 15000);
    } catch (fetchError) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : "Unknown error";
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch URL: ${errorMessage}`,
        },
        { status: fetchError instanceof Error && fetchError.name === "AbortError" ? 504 : 502 }
      );
    }

    let items: ScrapedItem[] = [];

    // Route based on source type
    if (type === "rss_feed" || url.toLowerCase().includes("rss") || url.toLowerCase().includes("feed")) {
      items = parseRssFeed(content);
    } else if (type === "planet_bids") {
      items = extractPlanetBidsContent(content);
    } else if (scrapeConfig?.itemSelector) {
      // Use custom selectors if provided
      items = extractWithSelectors(
        content,
        scrapeConfig.itemSelector,
        scrapeConfig.titleSelector,
        scrapeConfig.descriptionSelector,
        scrapeConfig.dateSelector,
        scrapeConfig.linkSelector
      );
    } else {
      // Fallback to basic HTML scraping
      items = extractBasicContent(content, url);
    }

    // If no items extracted, return fallback
    if (items.length === 0) {
      items = extractBasicContent(content, url);
    }

    // Add items to store
    let itemsAdded = 0;
    const agency = getAgency(agencyId);
    const territory = (agency?.territory || "socal") as Territory;

    for (const item of items) {
      try {
        const newsItem: Omit<NewsItem, "id"> = {
          sourceId,
          agencyId,
          title: item.title,
          content: item.content,
          excerpt: item.content.substring(0, 200),
          url: item.url,
          publishedAt: item.date || undefined,
          scrapedAt: new Date().toISOString(),
          tags: [],
          isProcessed: false,
          isArchived: false,
          territory,
        };
        addNewsItem(newsItem);
        itemsAdded++;
      } catch (storeError) {
        console.error("Error adding news item:", storeError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        items: items.slice(0, 20), // Return first 20 items
        itemsAdded,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
