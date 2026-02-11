// ============================================================
// CIP Intel Tracker - Seed Data
// Pre-loaded with VSCE Tier 1 SoCal + PNW agencies
// Sources researched from actual agency websites
// ============================================================

import { Agency, NewsSource, Territory } from "./types";
import { v4 as uuidv4 } from "uuid";

// Helper to create a news source
function src(
  agencyId: string,
  name: string,
  type: NewsSource["type"],
  url: string,
  freq: NewsSource["scrapeFrequency"] = "daily",
  config?: NewsSource["scrapeConfig"]
): NewsSource {
  return {
    id: uuidv4(),
    agencyId,
    name,
    type,
    url,
    scrapeConfig: config,
    scrapeFrequency: freq,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}

// ============================================================
// SOCAL TIER 1 AGENCIES
// ============================================================

const LA_METRO_ID = "la-metro";
const OCTA_ID = "octa";
const PORT_LB_ID = "port-long-beach";
const SBCTA_ID = "sbcta";
const RCTC_ID = "rctc";
const VCTC_ID = "vctc";
const CALTRANS_D7_ID = "caltrans-d7";
const CALTRANS_D8_ID = "caltrans-d8";
const CALTRANS_D11_ID = "caltrans-d11";
const CALTRANS_D12_ID = "caltrans-d12";
const LADWP_ID = "ladwp";
const MWD_ID = "mwd";
const IEUA_ID = "ieua";
const LAWA_ID = "lawa";
const SDCWA_ID = "sd-cwa";
const IRWD_ID = "irwd";
const LACPW_ID = "la-county-pw";

// PNW AGENCIES
const SOUND_TRANSIT_ID = "sound-transit";
const WSDOT_ID = "wsdot";
const WSF_ID = "wsf";
const PORT_SEATTLE_ID = "port-seattle";
const PORT_TACOMA_ID = "port-tacoma";
const KC_METRO_ID = "kc-metro";
const COMMUNITY_TRANSIT_ID = "community-transit";
const PIERCE_TRANSIT_ID = "pierce-transit";
const TRIMET_ID = "trimet";
const SCL_ID = "seattle-city-light";
const SPU_ID = "seattle-public-utilities";
const SDOT_ID = "sdot";
const STA_ID = "spokane-transit";

export const SEED_AGENCIES: Agency[] = [
  // ---- SOCAL ----
  {
    id: LA_METRO_ID,
    name: "Los Angeles County Metropolitan Transportation Authority",
    shortName: "LA Metro",
    territory: "socal",
    capitalProgram: "$26.2B (2025-2034)",
    website: "https://www.metro.net",
    procurementPortal: "https://www.metro.net/about/business/",
    contactPhone: "(213) 922-6000",
    dbeGoal: "20-25%",
    keyProjects: [
      "Purple Line Extension (Phases 2-3) - $4.2B",
      "Regional Connector - $2.3B",
      "Bus Rapid Transit Expansion - $3B",
      "Fleet Modernization - $4.5B",
    ],
    notes: "Clean project pages with ~60 projects easily found. Primary SoCal target.",
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: OCTA_ID,
    name: "Orange County Transportation Authority",
    shortName: "OCTA",
    territory: "socal",
    capitalProgram: "$1.74B (5-year capital plan)",
    website: "https://www.octa.net",
    procurementPortal: "https://www.octa.net/About-OCTA/Who-We-Are/Procurement/",
    contactPhone: "(714) 560-5760",
    contactEmail: "procurement@octa.net",
    dbeGoal: "18-22%",
    keyProjects: [
      "OC Streetcar Phase 1 - $860M",
      "I-405 Improvement Program - $2B",
      "Bus Transit Center Improvements - $340M",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: PORT_LB_ID,
    name: "Port of Long Beach",
    shortName: "Port of Long Beach",
    territory: "socal",
    capitalProgram: "$3.2B (10-year capital plan)",
    website: "https://polb.com",
    procurementPortal: "https://polb.com/business/bid-opportunities/",
    contactPhone: "(562) 283-7709",
    contactEmail: "business@polb.org",
    dbeGoal: "24%",
    keyProjects: [
      "Middle Harbor Redevelopment - $1.4B",
      "Pier T Redevelopment - $850M",
      "Green Port Infrastructure - $270M",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: SBCTA_ID,
    name: "San Bernardino County Transportation Authority",
    shortName: "SBCTA",
    territory: "socal",
    capitalProgram: "$850M (5-year plan)",
    website: "https://www.gosbcta.com",
    procurementPortal: "https://www.gosbcta.com/procurement/",
    dbeGoal: "15-20%",
    keyProjects: [
      "I-10/I-15 Interchange - $400M",
      "West Valley Connector BRT - $350M",
    ],
    notes: "Has project categorization: planning, construction, completed. Clean pages.",
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: RCTC_ID,
    name: "Riverside County Transportation Commission",
    shortName: "RCTC",
    territory: "socal",
    capitalProgram: "$900M",
    website: "https://www.rctc.org",
    procurementPortal: "https://www.rctc.org/doing-business/",
    keyProjects: [
      "91/15 Interchange Improvements",
      "Mid County Parkway",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: VCTC_ID,
    name: "Ventura County Transportation Commission",
    shortName: "VCTC",
    territory: "socal",
    capitalProgram: "$650M",
    website: "https://www.goventura.org",
    keyProjects: [
      "Highway 101/33 Interchange",
      "VCTC Intercity Bus Service Expansion",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: CALTRANS_D7_ID,
    name: "Caltrans District 7 (Los Angeles / Ventura)",
    shortName: "Caltrans D7",
    territory: "socal",
    capitalProgram: "$800M+ annual",
    website: "https://dot.ca.gov/caltrans-near-me/district-7",
    procurementPortal: "https://dot.ca.gov/programs/procurement-and-contracts",
    keyProjects: ["I-5 North Capacity Enhancement", "I-710 South Corridor"],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: CALTRANS_D8_ID,
    name: "Caltrans District 8 (San Bernardino / Riverside)",
    shortName: "Caltrans D8",
    territory: "socal",
    capitalProgram: "$600M+ annual",
    website: "https://dot.ca.gov/caltrans-near-me/district-8",
    procurementPortal: "https://dot.ca.gov/programs/procurement-and-contracts",
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: CALTRANS_D11_ID,
    name: "Caltrans District 11 (San Diego / Imperial)",
    shortName: "Caltrans D11",
    territory: "socal",
    capitalProgram: "$450M+ annual",
    website: "https://dot.ca.gov/caltrans-near-me/district-11",
    procurementPortal: "https://dot.ca.gov/programs/procurement-and-contracts",
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: CALTRANS_D12_ID,
    name: "Caltrans District 12 (Orange County)",
    shortName: "Caltrans D12",
    territory: "socal",
    capitalProgram: "$350M+ annual",
    website: "https://dot.ca.gov/caltrans-near-me/district-12",
    procurementPortal: "https://dot.ca.gov/programs/procurement-and-contracts",
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: LADWP_ID,
    name: "Los Angeles Department of Water & Power",
    shortName: "LADWP",
    territory: "socal",
    capitalProgram: "$2.5B (2025-2030)",
    website: "https://www.ladwp.com",
    procurementPortal: "https://www.ladwp.com/ladwp/faces/ladwp/aboutus/a-financesandreports/a-fr-procurement",
    contactPhone: "(213) 367-4211",
    contactEmail: "businessservices@ladwp.com",
    dbeGoal: "20%",
    keyProjects: [
      "Water Main Replacement - $800M",
      "Renewable Generation Integration - $600M",
      "Sylmar High Voltage Converter - $400M",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: MWD_ID,
    name: "Metropolitan Water District of Southern California",
    shortName: "MWD",
    territory: "socal",
    capitalProgram: "$3B (2025-2030)",
    website: "https://www.mwdh2o.com",
    contactPhone: "(213) 217-6000",
    dbeGoal: "15%",
    keyProjects: [
      "Colorado River Reliability - $1.2B",
      "Water Reclamation - $500M",
      "Seismic Safety - $300M",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: IEUA_ID,
    name: "Inland Empire Utilities Agency",
    shortName: "IEUA",
    territory: "socal",
    capitalProgram: "$800M",
    website: "https://www.ieua.org",
    contactPhone: "(909) 993-1600",
    keyProjects: [
      "Regional Recycled Water System Expansion",
      "RP-1 Plant Modernization",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: LAWA_ID,
    name: "Los Angeles World Airports",
    shortName: "LAWA",
    territory: "socal",
    capitalProgram: "$30B+ (2025-2045)",
    website: "https://www.lawa.org",
    procurementPortal: "https://www.lawa.org/en/lawa-businesses",
    contactPhone: "(424) 646-5200",
    keyProjects: [
      "LAX Specific Plan - $5B+",
      "Terminal 9 Renovation - $1.2B",
      "Integrated Ground Transport Center - $2.1B",
      "Sustainability Infrastructure - $800M",
    ],
    notes: "No clean CIP pages. Must scrape board meeting minutes/RSS. Has RSS feeds for agenda, minutes, video.",
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: SDCWA_ID,
    name: "San Diego County Water Authority",
    shortName: "SD CWA",
    territory: "socal",
    capitalProgram: "$500M (2025-2030)",
    website: "https://www.sdcwa.org",
    keyProjects: [
      "Pipeline Relining Program",
      "Twin Oaks Valley WTP Improvements",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: IRWD_ID,
    name: "Irvine Ranch Water District",
    shortName: "IRWD",
    territory: "socal",
    capitalProgram: "$420M",
    website: "https://www.irwd.com",
    keyProjects: [
      "Baker Water Treatment Plant Expansion",
      "Sewer System Rehabilitation",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: LACPW_ID,
    name: "Los Angeles County Public Works",
    shortName: "LA County PW",
    territory: "socal",
    capitalProgram: "$1.2B",
    website: "https://pw.lacounty.gov",
    procurementPortal: "https://pw.lacounty.gov/general/contracts/",
    keyProjects: [
      "Storm Drain Infrastructure",
      "Bridge Rehabilitation Program",
      "Pavement Management Program",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ---- PNW ----
  {
    id: SOUND_TRANSIT_ID,
    name: "Sound Transit",
    shortName: "Sound Transit",
    territory: "pnw",
    capitalProgram: "$54B (ST3 Program)",
    website: "https://www.soundtransit.org",
    procurementPortal: "https://www.soundtransit.org/get-to-know-us/doing-business-sound-transit",
    keyProjects: [
      "West Seattle Link Extension - $7B",
      "Ballard Link Extension - $9B",
      "Tacoma Dome Link Extension - $3.2B",
      "Federal Way Link Extension - $3.1B",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: WSDOT_ID,
    name: "Washington State Department of Transportation",
    shortName: "WSDOT",
    territory: "pnw",
    capitalProgram: "$2.5-3B annual",
    website: "https://wsdot.wa.gov",
    procurementPortal: "https://wsdot.wa.gov/business-wsdot",
    keyProjects: [
      "I-405 Renton to Bellevue Widening",
      "SR 167 Completion",
      "Fish Passage Barrier Removal",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: WSF_ID,
    name: "Washington State Ferries",
    shortName: "WA Ferries",
    territory: "pnw",
    capitalProgram: "$6B (long-range plan)",
    website: "https://wsdot.wa.gov/travel/washington-state-ferries",
    keyProjects: [
      "Hybrid-Electric Ferry Program",
      "Terminal Electrification",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: PORT_SEATTLE_ID,
    name: "Port of Seattle",
    shortName: "Port of Seattle",
    territory: "pnw",
    capitalProgram: "$5.6B (5-year CIP)",
    website: "https://www.portseattle.org",
    procurementPortal: "https://www.portseattle.org/business/contracting",
    keyProjects: [
      "SEA Airport International Arrivals Facility",
      "Sustainable Aviation Fuels Program",
      "Terminal Modernization",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: PORT_TACOMA_ID,
    name: "Port of Tacoma",
    shortName: "Port of Tacoma",
    territory: "pnw",
    capitalProgram: "$2.1B",
    website: "https://www.portoftacoma.com",
    keyProjects: [
      "Terminal Modernization",
      "Clean Truck Program",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: KC_METRO_ID,
    name: "King County Metro Transit",
    shortName: "KC Metro",
    territory: "pnw",
    capitalProgram: "$4.2B",
    website: "https://kingcounty.gov/en/dept/metro",
    keyProjects: [
      "RapidRide Expansion",
      "Base Capacity Program",
      "Zero-Emission Fleet Transition",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: COMMUNITY_TRANSIT_ID,
    name: "Community Transit",
    shortName: "Community Transit",
    territory: "pnw",
    capitalProgram: "$800M",
    website: "https://www.communitytransit.org",
    keyProjects: ["Swift BRT Expansion", "Fleet Electrification"],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: PIERCE_TRANSIT_ID,
    name: "Pierce Transit",
    shortName: "Pierce Transit",
    territory: "pnw",
    capitalProgram: "$500M",
    website: "https://www.piercetransit.org",
    keyProjects: ["Stream BRT", "Fleet Modernization"],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: TRIMET_ID,
    name: "TriMet (Portland)",
    shortName: "TriMet",
    territory: "pnw",
    capitalProgram: "$2.5B",
    website: "https://trimet.org",
    keyProjects: [
      "Division Transit Project",
      "SW Corridor Light Rail",
      "Fleet Electrification",
    ],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: SCL_ID,
    name: "Seattle City Light",
    shortName: "Seattle City Light",
    territory: "pnw",
    capitalProgram: "$1.8B",
    website: "https://www.seattle.gov/city-light",
    keyProjects: ["Grid Modernization", "Skagit Hydroelectric Relicensing"],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: SPU_ID,
    name: "Seattle Public Utilities",
    shortName: "Seattle PU",
    territory: "pnw",
    capitalProgram: "$1.6B",
    website: "https://www.seattle.gov/utilities",
    keyProjects: ["Ship Canal Water Quality Project", "Drainage System Improvements"],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: SDOT_ID,
    name: "Seattle Department of Transportation",
    shortName: "SDOT",
    territory: "pnw",
    capitalProgram: "$1.2B",
    website: "https://www.seattle.gov/transportation",
    keyProjects: ["West Seattle Bridge Rehabilitation", "Vision Zero Safety Program"],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: STA_ID,
    name: "Spokane Transit Authority",
    shortName: "Spokane Transit",
    territory: "pnw",
    capitalProgram: "$650M",
    website: "https://www.spokanetransit.com",
    keyProjects: ["City Line BRT", "Division BRT"],
    newsSources: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================
// NEWS SOURCES FOR EACH AGENCY
// Researched actual working URLs for CIP pages, board minutes, RSS, etc.
// ============================================================

export const SEED_NEWS_SOURCES: NewsSource[] = [
  // --- LA METRO ---
  src(LA_METRO_ID, "LA Metro - Capital Projects", "project_page",
    "https://www.metro.net/about/capital-projects/", "daily"),
  src(LA_METRO_ID, "LA Metro - Board Meetings & Agendas", "board_agenda",
    "https://boardagendas.metro.net/", "weekly"),
  src(LA_METRO_ID, "LA Metro - Press Releases", "press_release",
    "https://www.metro.net/news/press-releases/", "daily"),
  src(LA_METRO_ID, "LA Metro - Procurement / Business", "procurement_portal",
    "https://www.metro.net/about/business/", "daily"),

  // --- OCTA ---
  src(OCTA_ID, "OCTA - Capital Programs", "cip_page",
    "https://www.octa.net/About-OCTA/Capital-Programs/", "daily"),
  src(OCTA_ID, "OCTA - Board Agendas", "board_agenda",
    "https://www.octa.net/About-OCTA/Who-We-Are/Board-of-Directors/Board-Meetings/", "weekly"),
  src(OCTA_ID, "OCTA - Procurement", "procurement_portal",
    "https://www.octa.net/About-OCTA/Who-We-Are/Procurement/Current-Opportunities/", "daily"),
  src(OCTA_ID, "OCTA - Newsroom", "press_release",
    "https://www.octa.net/News/", "daily"),

  // --- PORT OF LONG BEACH ---
  src(PORT_LB_ID, "POLB - Capital Projects", "cip_page",
    "https://polb.com/port-info/capital-improvement-projects/", "daily"),
  src(PORT_LB_ID, "POLB - Board Meetings", "board_minutes",
    "https://polb.com/port-info/commission-meetings/", "weekly"),
  src(PORT_LB_ID, "POLB - Bid Opportunities", "procurement_portal",
    "https://polb.com/business/bid-opportunities/", "daily"),

  // --- SBCTA ---
  src(SBCTA_ID, "SBCTA - Projects", "project_page",
    "https://www.gosbcta.com/projects/", "daily"),
  src(SBCTA_ID, "SBCTA - Board Agendas", "board_agenda",
    "https://www.gosbcta.com/board-of-directors/", "weekly"),
  src(SBCTA_ID, "SBCTA - Procurement", "procurement_portal",
    "https://www.gosbcta.com/procurement/", "daily"),

  // --- RCTC ---
  src(RCTC_ID, "RCTC - Projects", "project_page",
    "https://www.rctc.org/projects/", "daily"),
  src(RCTC_ID, "RCTC - Board Meetings", "board_agenda",
    "https://www.rctc.org/board-meetings/", "weekly"),

  // --- VCTC ---
  src(VCTC_ID, "VCTC - Projects & Programs", "project_page",
    "https://www.goventura.org/projects-programs/", "weekly"),
  src(VCTC_ID, "VCTC - Commission Meetings", "board_agenda",
    "https://www.goventura.org/commission-meetings/", "weekly"),

  // --- CALTRANS D7 ---
  src(CALTRANS_D7_ID, "Caltrans D7 - Projects", "project_page",
    "https://dot.ca.gov/caltrans-near-me/district-7/district-7-projects", "daily"),
  src(CALTRANS_D7_ID, "Caltrans - Contract Alerts", "procurement_portal",
    "https://dot.ca.gov/programs/procurement-and-contracts/contract-alerts", "daily"),

  // --- CALTRANS D8 ---
  src(CALTRANS_D8_ID, "Caltrans D8 - Projects", "project_page",
    "https://dot.ca.gov/caltrans-near-me/district-8/district-8-projects", "daily"),

  // --- CALTRANS D11 ---
  src(CALTRANS_D11_ID, "Caltrans D11 - Projects", "project_page",
    "https://dot.ca.gov/caltrans-near-me/district-11/district-11-projects", "daily"),

  // --- CALTRANS D12 ---
  src(CALTRANS_D12_ID, "Caltrans D12 - Projects", "project_page",
    "https://dot.ca.gov/caltrans-near-me/district-12/district-12-projects", "daily"),

  // --- LADWP ---
  src(LADWP_ID, "LADWP - News & Info", "press_release",
    "https://www.ladwp.com/who-we-are/news-room", "daily"),
  src(LADWP_ID, "LADWP - Board Agendas", "board_agenda",
    "https://www.ladwp.com/who-we-are/board-commissioners/agendas-minutes", "weekly"),

  // --- MWD ---
  src(MWD_ID, "MWD - Board Meetings", "board_agenda",
    "https://www.mwdh2o.com/who-we-are/board-of-directors/board-meetings/", "weekly"),
  src(MWD_ID, "MWD - News", "press_release",
    "https://www.mwdh2o.com/newsroom/", "daily"),

  // --- IEUA ---
  src(IEUA_ID, "IEUA - Board Meetings", "board_agenda",
    "https://www.ieua.org/about-ieua/board-of-directors/", "weekly"),
  src(IEUA_ID, "IEUA - News", "press_release",
    "https://www.ieua.org/news/", "weekly"),

  // --- LAWA ---
  // LAWA has no clean CIP pages - must scrape board minutes/RSS (per Bill/Farid meeting)
  src(LAWA_ID, "LAWA - Board of Airport Commissioners", "board_minutes",
    "https://www.lawa.org/en/lawa-investor-relations/board-of-airport-commissioners", "weekly"),
  src(LAWA_ID, "LAWA - News Releases", "press_release",
    "https://www.lawa.org/en/news-releases", "daily"),
  src(LAWA_ID, "LAWA - Business Opportunities", "procurement_portal",
    "https://www.lawa.org/en/lawa-businesses", "daily"),

  // --- SD CWA ---
  src(SDCWA_ID, "SDCWA - Board Meetings", "board_agenda",
    "https://www.sdcwa.org/meetings-and-documents/", "weekly"),
  src(SDCWA_ID, "SDCWA - News", "press_release",
    "https://www.sdcwa.org/news/", "daily"),

  // --- IRWD ---
  src(IRWD_ID, "IRWD - Board Meetings", "board_agenda",
    "https://www.irwd.com/about-us/board-of-directors", "weekly"),
  src(IRWD_ID, "IRWD - News", "press_release",
    "https://www.irwd.com/news", "weekly"),

  // --- LA COUNTY PW ---
  src(LACPW_ID, "LA County PW - Projects", "project_page",
    "https://pw.lacounty.gov/general/projects/", "daily"),
  src(LACPW_ID, "LA County PW - Contracts", "procurement_portal",
    "https://pw.lacounty.gov/general/contracts/", "daily"),

  // ---- PNW ----
  src(SOUND_TRANSIT_ID, "Sound Transit - Projects & Plans", "project_page",
    "https://www.soundtransit.org/system-expansion", "daily"),
  src(SOUND_TRANSIT_ID, "Sound Transit - Board Meetings", "board_agenda",
    "https://www.soundtransit.org/get-to-know-us/board-directors/board-meetings", "weekly"),
  src(SOUND_TRANSIT_ID, "Sound Transit - Procurement", "procurement_portal",
    "https://www.soundtransit.org/get-to-know-us/doing-business-sound-transit/bid-opportunities", "daily"),

  src(WSDOT_ID, "WSDOT - Projects", "project_page",
    "https://wsdot.wa.gov/construction-planning/search-projects", "daily"),
  src(WSDOT_ID, "WSDOT - Business", "procurement_portal",
    "https://wsdot.wa.gov/business-wsdot/contracts", "daily"),

  src(PORT_SEATTLE_ID, "Port of Seattle - Capital Projects", "project_page",
    "https://www.portseattle.org/projects", "daily"),
  src(PORT_SEATTLE_ID, "Port of Seattle - Contracting", "procurement_portal",
    "https://www.portseattle.org/business/contracting", "daily"),
  src(PORT_SEATTLE_ID, "Port of Seattle - Commission Meetings", "board_agenda",
    "https://www.portseattle.org/about/commission/commission-meetings", "weekly"),

  src(KC_METRO_ID, "KC Metro - Projects", "project_page",
    "https://kingcounty.gov/en/dept/metro/about/capital-projects", "daily"),

  src(TRIMET_ID, "TriMet - Projects", "project_page",
    "https://trimet.org/projects/", "daily"),
  src(TRIMET_ID, "TriMet - Board Meetings", "board_agenda",
    "https://trimet.org/meetings/", "weekly"),
];

// Attach news sources to their agencies
export function getSeededAgencies(): Agency[] {
  return SEED_AGENCIES.map((agency) => ({
    ...agency,
    newsSources: SEED_NEWS_SOURCES.filter((s) => s.agencyId === agency.id),
  }));
}
