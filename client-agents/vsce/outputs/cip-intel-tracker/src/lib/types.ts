// ============================================================
// CIP Intel Tracker - Core Type Definitions
// VSCE, Inc. - Capital Improvement Program Intelligence System
// ============================================================

// --- Territories ---
export type Territory = "socal" | "norcal" | "pnw";

export const TERRITORY_LABELS: Record<Territory, string> = {
  socal: "Southern California",
  norcal: "Northern California",
  pnw: "Pacific Northwest (Seattle)",
};

// --- Pipeline Stages ---
// From Bill & Farid Jan 29 meeting:
// CIP Monitoring → Pre-Sell → Pre-Solicitation → Solicitation → Go/No-Go → Proposal → Submitted → Award
export type PipelineStage =
  | "cip_identified"      // CIP project found via scraping or manual entry
  | "monitoring"          // Actively tracking project updates
  | "pre_sell"            // Intelligence gathering, relationship building
  | "pre_solicitation"    // Agency announces procurement method, scoping
  | "solicitation"        // Actual RFP on Planet Bids with deadline
  | "wheelhouse_review"   // "Is it in our wheelhouse?" decision point
  | "go_no_go"           // Go/No-Go decision (both enter CRM for stats)
  | "proposal"           // Active proposal development
  | "submitted"          // Proposal submitted, awaiting decision
  | "awarded"            // Contract awarded
  | "not_awarded"        // Lost bid
  | "no_go"             // Decided not to pursue
  | "dumped";            // Not in wheelhouse, never enters CRM

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string; description: string }[] = [
  { key: "cip_identified", label: "CIP Identified", color: "#6366f1", description: "Project discovered via scraping or manual entry" },
  { key: "monitoring", label: "Monitoring", color: "#8b5cf6", description: "Actively tracking project updates and developments" },
  { key: "pre_sell", label: "Pre-Sell", color: "#a855f7", description: "Intelligence gathering, relationship building with agency" },
  { key: "pre_solicitation", label: "Pre-Solicitation", color: "#d946ef", description: "Agency announces procurement method and scoping" },
  { key: "solicitation", label: "Solicitation", color: "#ec4899", description: "RFP posted (Planet Bids) with submission deadline" },
  { key: "wheelhouse_review", label: "Wheelhouse Review", color: "#f97316", description: "Evaluating if project fits VSCE capabilities" },
  { key: "go_no_go", label: "Go/No-Go", color: "#eab308", description: "Leadership decision to pursue or pass" },
  { key: "proposal", label: "Proposal Dev", color: "#22c55e", description: "Active proposal development in progress" },
  { key: "submitted", label: "Submitted", color: "#14b8a6", description: "Proposal submitted, awaiting agency decision" },
  { key: "awarded", label: "Awarded", color: "#10b981", description: "Contract awarded to VSCE" },
  { key: "not_awarded", label: "Not Awarded", color: "#ef4444", description: "Lost bid to competitor" },
  { key: "no_go", label: "No-Go", color: "#9ca3af", description: "Decided not to pursue this opportunity" },
  { key: "dumped", label: "Not In Wheelhouse", color: "#6b7280", description: "Outside VSCE capabilities, removed from tracking" },
];

// Active pipeline stages (visible on pipeline board)
export const ACTIVE_PIPELINE_STAGES: PipelineStage[] = [
  "cip_identified",
  "monitoring",
  "pre_sell",
  "pre_solicitation",
  "solicitation",
  "wheelhouse_review",
  "go_no_go",
  "proposal",
  "submitted",
];

// --- News Source Types ---
export type NewsSourceType =
  | "cip_page"            // Agency's Capital Improvement Program project page
  | "board_minutes"       // Board/council meeting minutes
  | "board_agenda"        // Board/council meeting agendas
  | "rss_feed"           // RSS/Atom feed
  | "planet_bids"         // Planet Bids procurement portal
  | "press_release"       // Agency press releases / news
  | "project_page"        // Specific project status pages
  | "procurement_portal"; // Agency procurement/bid portal

export const NEWS_SOURCE_TYPE_LABELS: Record<NewsSourceType, string> = {
  cip_page: "CIP Project Page",
  board_minutes: "Board Minutes",
  board_agenda: "Board Agenda",
  rss_feed: "RSS Feed",
  planet_bids: "Planet Bids",
  press_release: "Press Releases",
  project_page: "Project Status Page",
  procurement_portal: "Procurement Portal",
};

// --- Agency ---
export interface Agency {
  id: string;
  name: string;
  shortName: string;           // e.g., "LA Metro", "OCTA"
  territory: Territory;
  capitalProgram: string;       // e.g., "$26.2B (2025-2034)"
  website: string;
  procurementPortal?: string;
  contactPhone?: string;
  contactEmail?: string;
  dbeGoal?: string;            // e.g., "20-25%"
  keyProjects?: string[];
  notes?: string;
  newsSources: NewsSource[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- News Source ---
export interface NewsSource {
  id: string;
  agencyId: string;
  name: string;
  type: NewsSourceType;
  url: string;
  scrapeSelector?: string;      // CSS selector for scraping
  scrapeConfig?: {
    itemSelector?: string;       // Selector for individual items
    titleSelector?: string;      // Selector for item title
    dateSelector?: string;       // Selector for item date
    linkSelector?: string;       // Selector for item link
    descriptionSelector?: string; // Selector for item description
    paginationSelector?: string; // For multi-page results
  };
  lastScrapedAt?: string;
  lastStatus?: "success" | "error" | "pending";
  lastError?: string;
  scrapeFrequency: "hourly" | "daily" | "weekly";
  isActive: boolean;
  createdAt: string;
}

// --- News Item ---
export interface NewsItem {
  id: string;
  sourceId: string;
  agencyId: string;
  title: string;
  content: string;             // Original scraped content
  excerpt?: string;            // AI-generated excerpt
  url: string;                 // Link to original
  publishedAt?: string;
  scrapedAt: string;
  projectId?: string;          // Tagged to a project (optional)
  tags: string[];
  relevanceScore?: number;     // AI confidence score 0-100
  isProcessed: boolean;        // Has AI processed this?
  isArchived: boolean;
  territory: Territory;
}

// --- CIP Project ---
export interface CIPProject {
  id: string;
  agencyId: string;
  name: string;
  description: string;
  territory: Territory;
  pipelineStage: PipelineStage;
  estimatedValue?: string;      // e.g., "$4.2B"
  estimatedValueNum?: number;   // Numeric value for sorting
  procurementMethod?: "design_bid_build" | "design_build" | "cmgc" | "other";
  fundingSource?: string;
  rfpDeadline?: string;
  rfpNumber?: string;
  planetBidsId?: string;
  inWheelhouse?: boolean;      // null = not reviewed, true/false = reviewed
  goNoGoDecision?: "go" | "no_go" | null;
  goNoGoDate?: string;
  goNoGoNotes?: string;
  keyContacts?: { name: string; role: string; email?: string; phone?: string }[];
  newsItemIds: string[];        // Associated news items
  notes: string;
  createdAt: string;
  updatedAt: string;
  // Pre-sell tracking
  preSellStatus?: string;
  preSellNotes?: string;
  // Related RFPs (non-one-to-one: one CIP can have multiple RFPs)
  relatedRfpIds?: string[];
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalProjects: number;
  projectsByStage: Record<PipelineStage, number>;
  projectsByTerritory: Record<Territory, number>;
  newNewsToday: number;
  newNewsThisWeek: number;
  unprocessedNews: number;
  totalAgencies: number;
  activeAgencies: number;
  upcomingDeadlines: { project: CIPProject; daysUntil: number }[];
}

// --- Scrape Result ---
export interface ScrapeResult {
  sourceId: string;
  agencyId: string;
  success: boolean;
  itemsFound: number;
  newItems: number;
  errors?: string[];
  scrapedAt: string;
}
