// ============================================================
// CIP Intel Tracker - Data Store
// In-memory store with JSON file persistence
// ============================================================

import {
  Agency,
  CIPProject,
  DashboardStats,
  NewsItem,
  NewsSource,
  PipelineStage,
  Territory,
  ACTIVE_PIPELINE_STAGES,
} from "./types";
import { getSeededAgencies, SEED_NEWS_SOURCES } from "./seed-data";
import { v4 as uuidv4 } from "uuid";

// ---- In-Memory Data Store ----
let agencies: Agency[] = [];
let newsItems: NewsItem[] = [];
let projects: CIPProject[] = [];
let initialized = false;

// ---- Initialize ----
export function initStore() {
  if (initialized) return;
  agencies = getSeededAgencies();
  newsItems = generateSampleNews();
  projects = generateSampleProjects();
  initialized = true;
}

// ---- Agency CRUD ----
export function getAgencies(territory?: Territory): Agency[] {
  initStore();
  if (territory) return agencies.filter((a) => a.territory === territory);
  return agencies;
}

export function getAgency(id: string): Agency | undefined {
  initStore();
  return agencies.find((a) => a.id === id);
}

export function updateAgency(id: string, updates: Partial<Agency>): Agency | null {
  initStore();
  const idx = agencies.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  agencies[idx] = { ...agencies[idx], ...updates, updatedAt: new Date().toISOString() };
  return agencies[idx];
}

export function addAgency(agency: Omit<Agency, "id" | "createdAt" | "updatedAt">): Agency {
  initStore();
  const newAgency: Agency = {
    ...agency,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  agencies.push(newAgency);
  return newAgency;
}

// ---- News Source CRUD ----
export function getNewsSources(agencyId?: string): NewsSource[] {
  initStore();
  if (agencyId) {
    const agency = agencies.find((a) => a.id === agencyId);
    return agency?.newsSources ?? [];
  }
  return agencies.flatMap((a) => a.newsSources);
}

export function addNewsSource(agencyId: string, source: Omit<NewsSource, "id" | "agencyId" | "createdAt">): NewsSource | null {
  initStore();
  const agency = agencies.find((a) => a.id === agencyId);
  if (!agency) return null;
  const newSource: NewsSource = {
    ...source,
    id: uuidv4(),
    agencyId,
    createdAt: new Date().toISOString(),
  };
  agency.newsSources.push(newSource);
  return newSource;
}

// ---- News Item CRUD ----
export function getNewsItems(filters?: {
  territory?: Territory;
  agencyId?: string;
  projectId?: string;
  isProcessed?: boolean;
  isArchived?: boolean;
  limit?: number;
  offset?: number;
}): { items: NewsItem[]; total: number } {
  initStore();
  let items = [...newsItems];

  if (filters?.territory) items = items.filter((n) => n.territory === filters.territory);
  if (filters?.agencyId) items = items.filter((n) => n.agencyId === filters.agencyId);
  if (filters?.projectId) items = items.filter((n) => n.projectId === filters.projectId);
  if (filters?.isProcessed !== undefined) items = items.filter((n) => n.isProcessed === filters.isProcessed);
  if (filters?.isArchived !== undefined) items = items.filter((n) => n.isArchived === filters.isArchived);

  // Sort by scraped date, newest first
  items.sort((a, b) => new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime());

  const total = items.length;
  const offset = filters?.offset ?? 0;
  const limit = filters?.limit ?? 50;
  items = items.slice(offset, offset + limit);

  return { items, total };
}

export function getNewsItem(id: string): NewsItem | undefined {
  initStore();
  return newsItems.find((n) => n.id === id);
}

export function addNewsItem(item: Omit<NewsItem, "id">): NewsItem {
  initStore();
  const newItem: NewsItem = { ...item, id: uuidv4() };
  newsItems.push(newItem);
  return newItem;
}

export function updateNewsItem(id: string, updates: Partial<NewsItem>): NewsItem | null {
  initStore();
  const idx = newsItems.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  newsItems[idx] = { ...newsItems[idx], ...updates };
  return newsItems[idx];
}

export function tagNewsToProject(newsId: string, projectId: string): boolean {
  initStore();
  const newsIdx = newsItems.findIndex((n) => n.id === newsId);
  const project = projects.find((p) => p.id === projectId);
  if (newsIdx === -1 || !project) return false;

  newsItems[newsIdx].projectId = projectId;
  if (!project.newsItemIds.includes(newsId)) {
    project.newsItemIds.push(newsId);
  }
  return true;
}

// ---- Project CRUD ----
export function getProjects(filters?: {
  territory?: Territory;
  agencyId?: string;
  pipelineStage?: PipelineStage;
  stages?: PipelineStage[];
}): CIPProject[] {
  initStore();
  let items = [...projects];

  if (filters?.territory) items = items.filter((p) => p.territory === filters.territory);
  if (filters?.agencyId) items = items.filter((p) => p.agencyId === filters.agencyId);
  if (filters?.pipelineStage) items = items.filter((p) => p.pipelineStage === filters.pipelineStage);
  if (filters?.stages) items = items.filter((p) => filters.stages!.includes(p.pipelineStage));

  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return items;
}

export function getProject(id: string): CIPProject | undefined {
  initStore();
  return projects.find((p) => p.id === id);
}

export function addProject(project: Omit<CIPProject, "id" | "createdAt" | "updatedAt">): CIPProject {
  initStore();
  const newProject: CIPProject = {
    ...project,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(newProject);
  return newProject;
}

export function updateProject(id: string, updates: Partial<CIPProject>): CIPProject | null {
  initStore();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date().toISOString() };
  return projects[idx];
}

export function moveProjectStage(id: string, newStage: PipelineStage): CIPProject | null {
  return updateProject(id, { pipelineStage: newStage });
}

// ---- Dashboard Stats ----
export function getDashboardStats(): DashboardStats {
  initStore();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  const projectsByStage = {} as Record<PipelineStage, number>;
  ACTIVE_PIPELINE_STAGES.forEach((s) => {
    projectsByStage[s] = projects.filter((p) => p.pipelineStage === s).length;
  });
  // Include terminal stages
  (["awarded", "not_awarded", "no_go", "dumped"] as PipelineStage[]).forEach((s) => {
    projectsByStage[s] = projects.filter((p) => p.pipelineStage === s).length;
  });

  const projectsByTerritory: Record<Territory, number> = {
    socal: projects.filter((p) => p.territory === "socal").length,
    norcal: projects.filter((p) => p.territory === "norcal").length,
    pnw: projects.filter((p) => p.territory === "pnw").length,
  };

  const upcomingDeadlines = projects
    .filter((p) => p.rfpDeadline)
    .map((p) => ({
      project: p,
      daysUntil: Math.ceil(
        (new Date(p.rfpDeadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .filter((d) => d.daysUntil > 0 && d.daysUntil <= 90)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return {
    totalProjects: projects.length,
    projectsByStage,
    projectsByTerritory,
    newNewsToday: newsItems.filter((n) => new Date(n.scrapedAt) >= todayStart).length,
    newNewsThisWeek: newsItems.filter((n) => new Date(n.scrapedAt) >= weekStart).length,
    unprocessedNews: newsItems.filter((n) => !n.isProcessed && !n.isArchived).length,
    totalAgencies: agencies.length,
    activeAgencies: agencies.filter((a) => a.isActive).length,
    upcomingDeadlines,
  };
}

// ============================================================
// SAMPLE DATA GENERATORS (for demo purposes)
// ============================================================

function generateSampleNews(): NewsItem[] {
  const now = new Date();
  const items: NewsItem[] = [
    {
      id: uuidv4(),
      sourceId: "la-metro-projects",
      agencyId: "la-metro",
      title: "Purple Line Extension Section 2 Reaches 85% Completion Milestone",
      content: "The Los Angeles Metro Purple Line Extension Section 2 project, stretching from Wilshire/La Cienega to Century City/Constellation, has reached an 85% completion milestone. The $4.2 billion project includes twin tunnels and three new stations. Testing is expected to begin in Q3 2026 with revenue service targeted for 2027. The project creates significant opportunities for construction management and program oversight services.",
      excerpt: "LA Metro's Purple Line Section 2 hits 85% completion. $4.2B project on track for 2027 revenue service. Testing begins Q3 2026. Major CM/PM opportunities remain for final phase.",
      url: "https://www.metro.net/projects/purple-line-extension/",
      publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      tags: ["transit", "rail", "construction", "purple-line"],
      relevanceScore: 92,
      isProcessed: true,
      isArchived: false,
      territory: "socal",
    },
    {
      id: uuidv4(),
      sourceId: "la-metro-procurement",
      agencyId: "la-metro",
      title: "LA Metro Releases RFQ for Bus Rapid Transit Corridor Design Services",
      content: "Los Angeles County Metropolitan Transportation Authority has released a Request for Qualifications for design services on the Vermont Avenue Bus Rapid Transit Corridor. The project is estimated at $180M for construction with design services valued at $15-20M. DBE goal is set at 22%. Pre-qualification submissions due March 15, 2026.",
      excerpt: "New RFQ from LA Metro for Vermont Ave BRT design services. $180M construction value, $15-20M design. 22% DBE goal. Submissions due March 15, 2026.",
      url: "https://www.metro.net/about/business/",
      publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      tags: ["brt", "design", "rfq", "procurement"],
      relevanceScore: 88,
      isProcessed: true,
      isArchived: false,
      territory: "socal",
    },
    {
      id: uuidv4(),
      sourceId: "octa-capital",
      agencyId: "octa",
      title: "OCTA Board Approves $340M Bus Transit Center Improvement Program",
      content: "The OCTA Board of Directors has approved a $340 million program to improve 12 bus transit centers across Orange County. The program will be delivered in three phases from 2026-2030. Phase 1 includes Anaheim, Fullerton, and Santa Ana centers. OCTA is seeking qualified construction management firms for program-level oversight.",
      excerpt: "OCTA approves $340M bus transit center program across 12 locations. Phase 1 targets Anaheim, Fullerton, Santa Ana. Seeking CM firms for program oversight. 2026-2030 delivery.",
      url: "https://www.octa.net/About-OCTA/Capital-Programs/",
      publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      tags: ["transit", "bus", "construction", "program-management"],
      relevanceScore: 85,
      isProcessed: true,
      isArchived: false,
      territory: "socal",
    },
    {
      id: uuidv4(),
      sourceId: "polb-cip",
      agencyId: "port-long-beach",
      title: "Port of Long Beach Middle Harbor Terminal Redevelopment Phase 2 Update",
      content: "The Port of Long Beach has released an update on the Middle Harbor Terminal Redevelopment Phase 2, reporting the project is now 72% complete with $980M expended to date. The total project budget remains at $1.4B. Zero-emission infrastructure installation is proceeding with 12 ship-to-shore cranes delivered. Completion targeted for 2028.",
      excerpt: "POLB Middle Harbor Phase 2 at 72% complete. $980M spent of $1.4B budget. Zero-emission infrastructure progressing. 12 cranes delivered. 2028 completion target.",
      url: "https://polb.com/port-info/capital-improvement-projects/",
      publishedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      tags: ["port", "construction", "zero-emission", "infrastructure"],
      relevanceScore: 78,
      isProcessed: true,
      isArchived: false,
      territory: "socal",
    },
    {
      id: uuidv4(),
      sourceId: "lawa-board",
      agencyId: "lawa",
      title: "LAWA Board Discusses Terminal 9 Renovation Bid Package Structure",
      content: "At the February 2026 Board of Airport Commissioners meeting, LAWA staff presented the proposed bid package structure for the Terminal 9 Renovation project. The $1.2B project will be divided into 5 bid packages with a design-build delivery method. Environmental review is expected to complete by June 2026. Community benefits agreement requires 50% local hiring.",
      excerpt: "LAWA Board reviews Terminal 9 Renovation bid structure. $1.2B project split into 5 design-build packages. Environmental review by June 2026. 50% local hiring required.",
      url: "https://www.lawa.org/en/lawa-investor-relations/board-of-airport-commissioners",
      publishedAt: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      tags: ["aviation", "terminal", "design-build", "construction"],
      relevanceScore: 82,
      isProcessed: true,
      isArchived: false,
      territory: "socal",
    },
    {
      id: uuidv4(),
      sourceId: "sbcta-projects",
      agencyId: "sbcta",
      title: "West Valley Connector BRT Project Enters Final Design Phase",
      content: "SBCTA has announced the West Valley Connector Bus Rapid Transit project has entered final design. The $350M project will run 35 miles through Pomona, Ontario, Rancho Cucamonga, and Fontana. Construction is expected to begin in late 2026 with completion in 2029. The project includes 31 stations and a dedicated maintenance facility.",
      excerpt: "SBCTA's West Valley Connector BRT enters final design. $350M, 35-mile project. Construction starts late 2026. 31 stations planned through Inland Empire cities.",
      url: "https://www.gosbcta.com/projects/",
      publishedAt: new Date(now.getTime() - 96 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
      tags: ["brt", "transit", "design", "inland-empire"],
      relevanceScore: 80,
      isProcessed: true,
      isArchived: false,
      territory: "socal",
    },
    {
      id: uuidv4(),
      sourceId: "sound-transit-projects",
      agencyId: "sound-transit",
      title: "Sound Transit Board Authorizes West Seattle Link Extension to Advance to 60% Design",
      content: "The Sound Transit Board has authorized advancing the West Seattle Link Extension to 60% design. The $7B project will connect West Seattle to downtown Seattle via an elevated and tunnel alignment. The project includes 5 new stations. Sound Transit is seeking qualified construction management firms for owner's representative services during design.",
      excerpt: "Sound Transit advances West Seattle Link to 60% design. $7B project with 5 stations. Seeking CM firms for owner's rep during design phase. Major PNW opportunity.",
      url: "https://www.soundtransit.org/system-expansion/west-seattle-link-extension",
      publishedAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      tags: ["transit", "rail", "design", "light-rail"],
      relevanceScore: 90,
      isProcessed: true,
      isArchived: false,
      territory: "pnw",
    },
    {
      id: uuidv4(),
      sourceId: "ladwp-news",
      agencyId: "ladwp",
      title: "LADWP Accelerates Water Main Replacement Program with $200M Emergency Allocation",
      content: "The LADWP Board of Commissioners approved an emergency $200M allocation to accelerate the water main replacement program following a series of infrastructure failures. The program targets replacement of 60 miles of aging pipe infrastructure over the next 18 months. Pre-qualified contractors will receive task orders through the existing on-call program.",
      excerpt: "LADWP adds $200M emergency funding for water main replacement. 60 miles of pipe in 18 months. Task orders through existing on-call contracts. Accelerated timeline.",
      url: "https://www.ladwp.com/who-we-are/news-room",
      publishedAt: new Date(now.getTime() - 120 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 96 * 60 * 60 * 1000).toISOString(),
      tags: ["water", "infrastructure", "emergency", "replacement"],
      relevanceScore: 75,
      isProcessed: true,
      isArchived: false,
      territory: "socal",
    },
    // Unprocessed items
    {
      id: uuidv4(),
      sourceId: "caltrans-d7-projects",
      agencyId: "caltrans-d7",
      title: "I-5 North Capacity Enhancement Project Environmental Review Published",
      content: "Caltrans District 7 has published the Draft Environmental Impact Report for the I-5 North Capacity Enhancement Project. The project spans 12 miles from SR-14 to SR-126. Public comment period runs through April 2026. Estimated construction cost is $680M with a design-bid-build delivery method.",
      url: "https://dot.ca.gov/caltrans-near-me/district-7/district-7-projects",
      publishedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      tags: ["highway", "environmental", "capacity"],
      isProcessed: false,
      isArchived: false,
      territory: "socal",
    },
    {
      id: uuidv4(),
      sourceId: "mwd-news",
      agencyId: "mwd",
      title: "MWD Board Reviews Colorado River Reliability Program Cost Estimate Update",
      content: "The Metropolitan Water District Board reviewed an updated cost estimate for the Colorado River Reliability Program, now projected at $1.35B (up from $1.2B). The increase is attributed to material cost escalation and expanded seismic resilience requirements. The program includes 45 miles of aqueduct improvements.",
      url: "https://www.mwdh2o.com/newsroom/",
      publishedAt: new Date(now.getTime() - 15 * 60 * 60 * 1000).toISOString(),
      scrapedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      tags: ["water", "infrastructure", "cost-estimate"],
      isProcessed: false,
      isArchived: false,
      territory: "socal",
    },
  ];

  return items;
}

function generateSampleProjects(): CIPProject[] {
  return [
    {
      id: uuidv4(),
      agencyId: "la-metro",
      name: "Purple Line Extension Section 3",
      description: "Extension of Metro Purple Line from Century City to Westwood/VA Hospital. Final phase of the Westside subway extension.",
      territory: "socal",
      pipelineStage: "monitoring",
      estimatedValue: "$4.2B",
      estimatedValueNum: 4200000000,
      procurementMethod: "design_build",
      fundingSource: "Measure M, FTA Capital Investment Grants",
      keyContacts: [],
      newsItemIds: [],
      notes: "High-profile Olympic deadline project. Construction management opportunities available.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      agencyId: "la-metro",
      name: "Vermont Avenue BRT Corridor",
      description: "Bus Rapid Transit corridor along Vermont Avenue, one of 15 planned BRT corridors.",
      territory: "socal",
      pipelineStage: "pre_solicitation",
      estimatedValue: "$180M",
      estimatedValueNum: 180000000,
      procurementMethod: "design_bid_build",
      fundingSource: "Measure M, Federal BRT grants",
      rfpDeadline: "2026-03-15",
      keyContacts: [],
      newsItemIds: [],
      notes: "Design services RFQ released. 22% DBE goal. Strong VSCE alignment.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inWheelhouse: true,
    },
    {
      id: uuidv4(),
      agencyId: "octa",
      name: "Bus Transit Center Improvement Program",
      description: "Program to modernize 12 bus transit centers across Orange County. Three-phase delivery 2026-2030.",
      territory: "socal",
      pipelineStage: "pre_sell",
      estimatedValue: "$340M",
      estimatedValueNum: 340000000,
      fundingSource: "OC Measure M",
      keyContacts: [],
      newsItemIds: [],
      notes: "Seeking CM firms for program-level oversight. Phase 1: Anaheim, Fullerton, Santa Ana.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      agencyId: "port-long-beach",
      name: "Middle Harbor Terminal Redevelopment Phase 2",
      description: "Major terminal redevelopment including zero-emission infrastructure and automated container handling.",
      territory: "socal",
      pipelineStage: "monitoring",
      estimatedValue: "$1.4B",
      estimatedValueNum: 1400000000,
      procurementMethod: "cmgc",
      keyContacts: [],
      newsItemIds: [],
      notes: "72% complete. Monitoring for supplemental contracts and change orders.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      agencyId: "lawa",
      name: "Terminal 9 Renovation",
      description: "Major terminal renovation at LAX. $1.2B project with 5 design-build bid packages.",
      territory: "socal",
      pipelineStage: "pre_solicitation",
      estimatedValue: "$1.2B",
      estimatedValueNum: 1200000000,
      procurementMethod: "design_build",
      keyContacts: [],
      newsItemIds: [],
      notes: "Environmental review by June 2026. 50% local hiring. Community benefits required.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inWheelhouse: true,
    },
    {
      id: uuidv4(),
      agencyId: "sbcta",
      name: "West Valley Connector BRT",
      description: "35-mile BRT project through Pomona, Ontario, Rancho Cucamonga, and Fontana with 31 stations.",
      territory: "socal",
      pipelineStage: "pre_sell",
      estimatedValue: "$350M",
      estimatedValueNum: 350000000,
      fundingSource: "SB1, FTA Small Starts",
      keyContacts: [],
      newsItemIds: [],
      notes: "In final design. Construction starts late 2026. CM opportunities approaching.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      agencyId: "sound-transit",
      name: "West Seattle Link Extension",
      description: "Light rail extension connecting West Seattle to downtown Seattle. 5 new stations, elevated and tunnel alignment.",
      territory: "pnw",
      pipelineStage: "pre_sell",
      estimatedValue: "$7B",
      estimatedValueNum: 7000000000,
      procurementMethod: "design_build",
      keyContacts: [],
      newsItemIds: [],
      notes: "Advancing to 60% design. Seeking CM/owner's rep firms. Major PNW pursuit.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      agencyId: "ladwp",
      name: "Water Main Replacement Program - Emergency Phase",
      description: "Accelerated water main replacement covering 60 miles of aging pipe over 18 months.",
      territory: "socal",
      pipelineStage: "solicitation",
      estimatedValue: "$200M",
      estimatedValueNum: 200000000,
      procurementMethod: "design_bid_build",
      fundingSource: "LADWP Revenue Bonds",
      keyContacts: [],
      newsItemIds: [],
      notes: "Task orders through existing on-call program. Emergency accelerated timeline.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inWheelhouse: true,
    },
    {
      id: uuidv4(),
      agencyId: "caltrans-d7",
      name: "I-5 North Capacity Enhancement",
      description: "12-mile capacity enhancement from SR-14 to SR-126. Design-bid-build delivery.",
      territory: "socal",
      pipelineStage: "cip_identified",
      estimatedValue: "$680M",
      estimatedValueNum: 680000000,
      procurementMethod: "design_bid_build",
      fundingSource: "SB1, IIJA Federal Highway",
      keyContacts: [],
      newsItemIds: [],
      notes: "Draft EIR published. Public comment through April 2026. Early stage — monitoring.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      agencyId: "mwd",
      name: "Colorado River Reliability Program",
      description: "45 miles of aqueduct improvements for Colorado River water supply reliability.",
      territory: "socal",
      pipelineStage: "monitoring",
      estimatedValue: "$1.35B",
      estimatedValueNum: 1350000000,
      fundingSource: "MWD Capital Budget, State Water Bond",
      keyContacts: [],
      newsItemIds: [],
      notes: "Cost estimate increased from $1.2B to $1.35B. Seismic resilience scope expansion.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
