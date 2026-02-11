# VSCE, Inc. - AI Agent System

## Overview

This folder contains the complete training, knowledge base, and operational system for Claude, an AI agent specialized in supporting VSCE, Inc., a boutique civil engineering and program management consulting firm serving transportation agencies and government clients across California and the Pacific Northwest.

**Organization:** VSCE, Inc.
**Website:** vsceinc.com
**HQ:** Oakland, CA
**Employees:** ~30
**Revenue:** $7.4M
**Founded:** 2004

---

## System Structure

```
vsce/
├── Claude.md                          # Main training file (START HERE)
├── README.md                          # This file
│
├── brand/                             # Brand assets and guidelines
│   ├── README.md                      # Brand asset inventory
│   ├── colors/                        # Color palette specifications
│   ├── logos/                         # Company logos (various formats)
│   ├── fonts/                         # Typography guidelines
│   ├── templates/                     # Standard templates
│   │   ├── email/                     # Email templates
│   │   ├── proposal/                  # RFP response templates
│   │   ├── presentation/              # PowerPoint templates
│   │   └── document/                  # Standard document formats
│   └── guidelines/
│       └── voice-and-tone.md          # Communication standards
│
├── knowledge-base/                    # Operational and client intelligence
│   ├── company/
│   │   ├── company-overview.md        # Full company profile
│   │   ├── leadership-team.md         # Leadership directory
│   │   └── products-services.md       # Complete service catalog
│   ├── clients/
│   │   ├── ideal-customer-profile.md  # Target client characteristics
│   │   ├── project-types.md           # Types of work VSCE performs
│   │   └── case-studies/              # Completed project summaries
│   ├── sales/
│   │   └── value-propositions.md      # Key differentiators and win themes
│   └── processes/
│       ├── proposal-process.md        # RFP response workflow
│       └── recruitment-process.md     # Staff augmentation workflow
│
├── training-files/                    # Continuous learning materials
│   ├── README.md                      # How to use training system
│   └── previous-training/             # Historical training notes
│
└── outputs/                           # Generated documents (working folder)
    ├── proposals/                     # RFP responses and drafts
    ├── reports/                       # Analysis and intelligence reports
    └── presentations/                 # Presentation materials

```

---

## Quick Start

### For Leadership Using This Agent
1. **Start with Claude.md** — Understand the agent's capabilities and communication style
2. **Reference knowledge-base/company/** — Company details, leadership, services
3. **Use for RFP analysis** — Ask the agent to score proposals and recommend go/no-go
4. **Track business development** — Monitor RFP pipeline and market opportunities
5. **Support proposal development** — Request draft sections, case study research, competitive analysis

### For Proposal Team Using This Agent
1. **Analyze incoming RFPs** — Ask agent to score requirements and identify gaps
2. **Research clients** — Request agency background, funding status, procurement history
3. **Draft proposal sections** — Request executive summary, qualifications, approach
4. **Coordinate resources** — Track proposal status, deadlines, team assignments
5. **Develop case studies** — Request project summaries and client impact statements

### For Recruiting & Business Development
1. **Build candidate profiles** — Request market analysis and candidate sourcing
2. **Develop job descriptions** — Request role summaries and qualification frameworks
3. **Market analysis** — Request talent pool research and recruitment strategy
4. **Partnership opportunities** — Request market and competitive analysis

---

## Key Features

### Proposal Development Support
- RFP analysis and response strategy
- Competitive scoring and win probability assessment
- Client research and agency background briefings
- Proposal section drafting (qualifications, approach, management)
- Case study development and documentation
- Deadline tracking and project management

### RFP Intelligence & Market Analysis
- Transportation agency funding and capital program tracking
- RFP monitoring and competitive analysis
- Southern California capital program intelligence (Project One)
- Win theme identification and strategy
- Market trend analysis

### Business Intelligence
- Client agency analysis (BART, Caltrans, LA Metro, etc.)
- Competitive positioning analysis
- Growth opportunity identification
- Capital improvement plan (CIP) tracking
- Government procurement landscape monitoring

### Recruitment Support
- Job description development
- Candidate profile building
- Talent pool research
- "Briefcase of confidence" recruitment philosophy support
- Pacific Northwest recruiting (Project Three)

### Purely Works Partnership Support
- Project Zero: Infrastructure setup tracking
- Project One: SoCal RFP Intelligence System support
- Project Two: Historical data migration (SharePoint to ProjectMark CRM)
- Project Three: Pacific Northwest recruiting coordination
- Project Four: Proposal workflow optimization
- Active proposal status tracking (Doran Street, CCTA, Port of LA)

---

## What This Agent Knows

### About VSCE
- **History:** Founded 2004, 20+ years serving public-sector transportation agencies
- **Locations:** Oakland (HQ), Stockton, Fresno, Los Angeles, San Jose (coming soon)
- **Certifications:** DBE (Caltrans), SBE (CA DGS), MBE (CA PUC), SLEB, LBE
- **Leadership:** Jesús Vargas (CEO), Trinity Nguyen, Arvind Joshi, Allen Wong, and full team
- **Services:** Construction management, program management, capital analysis, RFP management, recruiting
- **Project Experience:** $2B+ in completed work
- **Employees:** ~30 professionals
- **Revenue:** $7.4M

### About Key Clients
- BART, Caltrans, California High Speed Rail, Alameda County Transportation Commission
- Caltrain, VTA, AC Transit, OCTA, Merced Transit, MTC
- Various California municipalities and regional transportation agencies

### About Competition & Markets
- Regional competitors and their positioning
- Competitive advantages and differentiators
- Market trends and growth opportunities
- Procurement landscape for public-sector transportation

### About Processes
- RFP response workflow and timeline management
- Proposal development process (from RFP to submission)
- Staff augmentation and recruiting process
- CRM/project management systems (ProjectMark CRM, Airtable)

---

## Example Tasks

### "Score this BART RFP for us. What's our win probability?"
The agent analyzes the RFP requirements, assesses VSCE capability alignment, considers competitive landscape, and provides:
- Win probability score (High/Medium/Low)
- Key requirement alignment analysis
- Critical gaps and mitigation strategies
- Recommended team composition
- Timeline and resource requirements

### "What's the state of the Southern California RFP market right now?"
The agent provides:
- Summary of active RFPs from major SoCal agencies
- Funding landscape and capital program status
- Competitive analysis and VSCE positioning
- Emerging opportunities
- Recommended pursuit strategy

### "Draft the Qualifications section for the CCTA proposal."
The agent:
- Researches CCTA and their specific needs
- Identifies relevant VSCE past projects
- Drafts qualifications emphasizing DBE/SBE status and experience
- Recommends case studies to highlight
- Suggests team composition and bios

### "Build a job description for a Senior Program Manager in LA."
The agent:
- Researches similar VSCE project roles
- Develops comprehensive job description
- Identifies required certifications and experience
- Creates recruitment messaging
- Suggests sourcing channels

### "Analyze our competitive position for Caltrans PM contracts."
The agent:
- Identifies competitive threats and advantages
- Analyzes Caltrans procurement patterns
- Recommends positioning and messaging
- Identifies gaps in capability or experience
- Suggests partnership or subcontracting opportunities

---

## Data Sources Used

### Company Information
- vsceinc.com (website)
- VSCE leadership team (direct contacts)
- Company documents and case studies
- Proposal archives and past projects
- Purely Works partnership documentation

### Client Intelligence
- Transportation agency websites
- RFP announcements and procurement notices
- Government databases (SAM.gov, eVosm, local portals)
- News and industry publications
- Capital improvement plans (CIPs)

### Market Research
- Industry reports (APTA, ASCE, TRB)
- Government procurement trends
- Competitive intelligence
- Economic and funding forecasts
- Regional development plans

### Process Documentation
- VSCE internal workflows and standards
- Purely Works project documentation
- Industry best practices
- Government procurement standards
- CRM and project management system documentation

---

## Communication Standards

This agent communicates with:
- **Formal yet collaborative tone** appropriate for government consulting
- **Clear status updates** with actions and timelines
- **Documentation-driven approach** with source verification
- **Solution-oriented perspective** focused on outcomes
- **Respect for executive schedules** with concise summaries and supporting detail on request

All communications reflect VSCE's professional brand and public-sector consulting expertise.

---

## Operational Notes

### Proposal Workflow
1. RFP received → Agent analyzes and scores
2. Win/pursue decision made by leadership
3. Agent drafts response strategy and outlines
4. Proposal team (Ivan Ramirez lead) develops full response
5. Design team (Umair Khalid) handles layout and graphics
6. Leadership review (Allen Wong, Jesús Vargas)
7. Final submission and tracking

### Decision-Making Authority
- **RFP Go/No-Go:** Allen Wong (BD) + Jesús Vargas (CEO)
- **Proposal Content:** Ivan Ramirez (Proposal Development) + Provi Rodriguez (Technical)
- **Design/Layout:** Umair Khalid (InDesign specialist)
- **Strategic Direction:** Jesús Vargas (CEO) + Arvind Joshi (Southern CA lead)

### Key Contacts for Escalation
- CEO (Strategy): Jesús Vargas — (510) 681-8072
- BD (Proposals): Allen Wong — (510) 500-4451
- Operations: Claudia Guadagne — (510) 421-1415
- Finance: Amy Lei — (510) 606-6663
- Recruiting: Armeen Haroon (Purely Works)

---

## Purely Works Partnership

VSCE is actively working with Purely Works on 7 strategic initiatives:

### Active Projects
1. **Project Zero:** Infrastructure setup and migration (GitHub, Vercel, databases)
2. **Project One:** Southern California Capital Program RFP Intelligence System
   - AI-powered RFP tracking (20+ SoCal agencies)
   - Planet Bids integration
   - RFP scoring algorithms
   - Resume formatter automation
   - CIP tracking dashboard
3. **Project Two:** Historical proposal migration (300-500 docs from SharePoint to ProjectMark CRM)
4. **Project Three:** Pacific Northwest recruiting (Armeen Haroon lead)
5. **Project Four:** Proposal workflow optimization

### Active Proposal Pursuits
- Doran Street project
- CCTA On-Call Construction Management
- Port of Los Angeles contract

### Purely Works Team
- **Farid Kheloco** — Account owner, strategic partner
- **Hammad Younas** — Technical lead
- **Armeen Haroon** — Recruiting lead
- **Muniba** — Proposal coordination
- **Umair Khalid** — InDesign/Design (dual role with VSCE)

---

## Next Steps

### Immediate (Next 30 Days)
- [ ] Complete Project Zero infrastructure setup
- [ ] Finalize Project One (SoCal RFP Intelligence System)
- [ ] Complete Project Two (historical data migration)
- [ ] Secure wins on active proposals (Doran Street, CCTA, Port of LA)

### Medium-term (60-90 Days)
- [ ] Launch Project Three recruiting initiatives
- [ ] Optimize Project Four proposal workflows
- [ ] Expand to San Jose office
- [ ] Build talent pools in LA and Pacific Northwest

### Strategic (6-12 Months)
- [ ] Establish SoCal as major revenue driver (via Arvind Joshi)
- [ ] Diversify service offerings (aviation, new verticals)
- [ ] Scale recruiting and staff augmentation
- [ ] Integrate AI throughout proposal workflow

---

## Questions & Support

For questions about this system:
- **Claude.md content:** Refer to training file or contact Purely Works
- **Knowledge base updates:** Contact Allen Wong or Ivan Ramirez
- **Process changes:** Contact Claudia Guadagne or Jesús Vargas
- **Purely Works coordination:** Contact Farid Kheloco or Hammad Younas

---

**System Version:** 1.0
**Last Updated:** February 2024
**Maintained By:** VSCE Leadership + Purely Works Partnership
**Next Review:** Quarterly

