// ============================================================
// CIP Intel Tracker - AI Processing Engine (Rule-Based)
// Rule-based heuristics for simulating AI processing
// ============================================================

import type { CIPProject } from "./types";

/**
 * Generate an AI-style excerpt from news content
 * Takes first 2-3 sentences, prepends agency info, focuses on key details
 * Limited to 200 characters
 */
export function generateExcerpt(content: string, agencyShortName: string): string {
  // Split by sentences (simple regex)
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];

  if (sentences.length === 0) {
    return agencyShortName;
  }

  // Take first 2-3 sentences and clean them
  let excerpt = sentences.slice(0, 3).join(" ").trim();

  // Remove extra whitespace
  excerpt = excerpt.replace(/\s+/g, " ");

  // Extract key details in order: dollar amounts, project names, dates, keywords
  const dollarMatch = excerpt.match(/\$[\d.,]+[BMK]?/);
  const dateMatch = excerpt.match(/\d{4}|\b(Q[1-4]|January|February|March|April|May|June|July|August|September|October|November|December)\b/i);

  // Build concise excerpt: Agency + amount + key phrase + timeline
  let result = `${agencyShortName}`;

  // Add dollar amount if found
  if (dollarMatch) {
    result += ` ${dollarMatch[0]}`;
  }

  // Add first phrase from content
  const words = excerpt.split(" ").slice(0, 12).join(" ");
  if (words.length > 0) {
    result += ` ${words}`;
  }

  // Add date/timeline if found
  if (dateMatch) {
    result += ` ${dateMatch[0]}`;
  }

  // Trim to 200 characters
  if (result.length > 200) {
    result = result.substring(0, 197) + "...";
  }

  return result;
}

/**
 * Calculate relevance score (0-100) using additive keyword matching
 * Base: 40 for CIP-related content
 * Additional points for specific keywords and patterns
 */
export function calculateRelevanceScore(content: string, title: string): number {
  const text = `${title} ${content}`.toLowerCase();
  let score = 40; // Base score for any CIP-related content

  // Dollar amounts: +15
  if (/\$\d+[\.,]?\d*\s*[BMK]?/i.test(text)) {
    score += 15;
  }

  // Procurement keywords: +20
  const procurementKeywords = ["rfp", "rfq", "bid", "proposal", "solicitation", "procurement", "request for"];
  if (procurementKeywords.some(kw => text.includes(kw))) {
    score += 20;
  }

  // Construction keywords: +15
  const constructionKeywords = ["design-build", "design-bid-build", "cmgc", "construction management", "construction"];
  if (constructionKeywords.some(kw => text.includes(kw))) {
    score += 15;
  }

  // VSCE service keywords: +10
  const vsceKeywords = ["civil engineering", "program management", "construction oversight", "inspection", "owner's representative"];
  if (vsceKeywords.some(kw => text.includes(kw))) {
    score += 10;
  }

  // Deadline/timeline info: +10
  if (/deadline|expected|completion|phase|2026|2027|2028|2029|2030|q[1-4]/i.test(text)) {
    score += 10;
  }

  // Funding source info: +10
  const fundingKeywords = ["measure m", "fta", "iija", "sb1", "grant", "bond", "federal", "state"];
  if (fundingKeywords.some(kw => text.includes(kw))) {
    score += 10;
  }

  // DBE/SBE/DVBE references: +10
  if (/dbe|sbe|dvbe|disadvantaged|minority|women|local hiring|community benefit/i.test(text)) {
    score += 10;
  }

  // Cap score at 100
  return Math.min(score, 100);
}

/**
 * Extract tags from content based on pattern matching
 * Returns array of relevant tags for categorization
 */
export function extractTags(content: string, title: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const tags: Set<string> = new Set();

  // Mode of transportation
  if (/transit|metro|rapid bus|brt|bus rapid|corridor/i.test(text)) tags.add("transit");
  if (/rail|light rail|commuter rail|subway/i.test(text)) tags.add("rail");
  if (/bus/i.test(text) && !text.includes("brt")) tags.add("bus");
  if (/brt|bus rapid transit/i.test(text)) tags.add("brt");
  if (/highway|i-\d+|freeway|interstate|capacity enhancement/i.test(text)) tags.add("highway");
  if (/bridge|crossing|span/i.test(text)) tags.add("bridge");
  if (/water|aqueduct|pipeline|main replacement/i.test(text)) tags.add("water");
  if (/port|harbor|terminal|maritime|shipping/i.test(text)) tags.add("port");
  if (/airport|terminal|lax|aviation/i.test(text)) tags.add("airport");
  if (/utility|power|electric|gas|infrastructure/i.test(text)) tags.add("utility");

  // Project type
  if (/construction|build|construct|built/i.test(text)) tags.add("construction");
  if (/design|design-build|design-bid-build/i.test(text)) tags.add("design");
  if (/environmental|eir|environmental review|impact/i.test(text)) tags.add("environmental");
  if (/plan|planning|planning stage|pre-scoping/i.test(text)) tags.add("planning");
  if (/procurement|bid|rfp|rfq/i.test(text)) tags.add("procurement");

  // Procurement specific
  if (/rfp|request for proposal/i.test(text)) tags.add("rfp");
  if (/rfq|request for qualifications/i.test(text)) tags.add("rfq");
  if (/bid|bidding/i.test(text)) tags.add("bid");
  if (/proposal|proposing/i.test(text)) tags.add("proposal");
  if (/award|awarded|winning|won/i.test(text)) tags.add("award");

  // Value/scope
  const dollarMatch = text.match(/\$[\d.,]+\s*b(?:illion)?/i);
  if (dollarMatch) {
    const amount = parseFloat(dollarMatch[0].replace(/[^\d.]/g, ""));
    if (amount >= 100) tags.add("high-value");
  }

  // Location indicators (if present)
  if (/(los angeles|la metro|lawa)/i.test(text)) tags.add("los-angeles");
  if (/(orange county|octa)/i.test(text)) tags.add("orange-county");
  if (/(inland empire|pomona|ontario|rancho cucamonga|fontana)/i.test(text)) tags.add("inland-empire");
  if (/(seattle|sound transit|west seattle|puget sound)/i.test(text)) tags.add("seattle");
  if (/(port of long beach|polb|harbor)/i.test(text)) tags.add("long-beach");

  return Array.from(tags).sort();
}

/**
 * Find project matches using simple keyword overlap
 * Compares title and content against project names and descriptions
 * Returns top 3 matches with match scores
 */
export function findProjectMatches(
  title: string,
  content: string,
  projects: CIPProject[]
): { projectId: string; projectName: string; score: number }[] {
  const searchText = `${title} ${content}`.toLowerCase();

  // Calculate match score for each project
  const matches = projects
    .map((project) => {
      let score = 0;
      const projectName = project.name.toLowerCase();
      const projectDesc = project.description.toLowerCase();

      // Extract keywords from project name (multi-word phrases)
      const projectWords = projectName.split(/\s+/).filter(w => w.length > 3);
      const contentWords = searchText.split(/\s+/);

      // Exact phrase match in title
      if (searchText.includes(projectName)) {
        score += 50;
      }

      // Word overlap scoring
      for (const word of projectWords) {
        // Count occurrences
        const count = (searchText.match(new RegExp(`\\b${word}\\b`, "g")) || []).length;
        score += Math.min(count * 10, 20); // Cap contribution per word at 20
      }

      // Check for related concepts (e.g., "BRT" vs "Bus Rapid Transit")
      if ((projectName.includes("brt") && searchText.includes("bus rapid")) ||
          (projectName.includes("bus rapid") && searchText.includes("brt"))) {
        score += 15;
      }

      if ((projectName.includes("design-build") && searchText.includes("design build")) ||
          (projectName.includes("design build") && searchText.includes("design-build"))) {
        score += 10;
      }

      // Agency/location match
      if (searchText.includes(project.agencyId.toLowerCase())) {
        score += 20;
      }

      // Dollar amount proximity
      const searchAmount = searchText.match(/\$[\d.,]+\s*[bmk]?/i);
      if (searchAmount && project.estimatedValue) {
        const searchNum = parseFloat(searchAmount[0].replace(/[^\d.]/g, ""));
        const projectNum = project.estimatedValueNum || 0;
        const ratio = Math.abs(searchNum - projectNum) / Math.max(searchNum, projectNum);
        // Award points for similar amounts (within 30%)
        if (ratio < 0.3) {
          score += 15;
        }
      }

      return {
        projectId: project.id,
        projectName: project.name,
        score: Math.min(score, 100), // Cap at 100
      };
    })
    .filter((match) => match.score > 10) // Only include meaningful matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Return top 3 matches

  return matches;
}
