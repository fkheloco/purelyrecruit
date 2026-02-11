# Cathedral Center Client Agent

**Welcome to the Cathedral Center AI Agent system.** This folder contains comprehensive training materials, brand guidelines, knowledge base, and output templates for the Cathedral Center project—SageCrest Wealth Management's AI-powered assessment and growth enablement platform for financial advisors.

---

## Quick Navigation

### Getting Started
- **Claude.md** — Main training file with complete agent instructions
- **README.md** — This file

### Core Knowledge
- **/knowledge-base/** — Complete reference library organized by topic
  - **/company/** — SageCrest Wealth Management overview, leadership, products
  - **/assessments/** — Assessment framework, methodology, DNA scoring
  - **/sales/** — Value propositions, positioning, target profiles
  - **/processes/** — Development process, marketing strategy
  - **/clients/** — Ideal customer profiles, case studies

### Brand & Design
- **/brand/** — Brand guidelines, assets, voice/tone documentation
  - **/colors/** — SageCrest color palette (to be defined)
  - **/logos/** — Logo files and usage guidelines
  - **/fonts/** — Font specifications
  - **/templates/** — Marketing templates (email, proposal, presentation, document)
  - **/guidelines/** — Brand voice, tone, visual standards

### Training & Development
- **/training-files/** — Continuous learning system
  - **/previous-training/** — Archive of training iterations and updates

### Outputs
- **/outputs/** — Generated deliverables organized by type
  - **/proposals/** — Marketing proposals, partnership proposals
  - **/reports/** — Assessment reports, status reports, analytics
  - **/presentations/** — Pitch decks, webinar slides, internal presentations

---

## Project Overview

### What is Cathedral Center?

**Cathedral Center** is SageCrest Wealth Management's transformative AI-powered assessment and growth enablement platform designed for financial advisors and advisory firms.

**Core Value Proposition:**
"Cathedral Center transforms your recruiting and M&A process by making assessments feel like valuable consulting rather than sales."

### Key Information

| Attribute | Details |
|-----------|---------|
| **Parent Company** | SageCrest Wealth Management (founded 1950, A+ BBB rating) |
| **Product Names** | Cathedral Center (product), Project Cathedral (internal) |
| **Tagline** | Transform your recruiting and M&A process |
| **Launch Date** | April 1, 2026 |
| **Development Timeline** | January 23 - April 1, 2026 (10 weeks) |
| **Budget** | $6,000/month (Purely Works development) |
| **HQ** | 1510 Fashion Island Blvd., Suite 380, San Mateo, CA 94404 |
| **Website** | sagecrestwm.com |
| **Phone** | (650) 573-8525 / 800-350-4500 |

### Problem Solved

Research shows **~70% of advisor M&A partnerships fail** within 5 years due to cultural misalignment and poor fit assessment. Cathedral Center solves this through evidence-based DNA scoring that assesses compatibility across five dimensions: culture, values, behaviors, needs, and desires.

### The Platform

Cathedral Center features a **three-tier assessment system**:

1. **Tier 1: Public Data Enrichment** (Automated)
   - Pulls firm details, AUM, SEC filings, compliance history
   - Analyzes technology stack
   - Generates automated scoring
   
2. **Tier 2: Structured Questionnaires** (Self-Administered)
   - Operations module (~30+ inputs)
   - Strategy, Behaviors (DAAN framework), Culture (~91 questions)
   - Takes 30-45 minutes
   
3. **Tier 3: Deep Dive Interviews** (Human-Led)
   - Financial due diligence, legal/compliance review
   - Integration planning, cultural fit assessment
   - 2-4 hours with SageCrest leadership

**Additional Features:**
- AI-augmented reports (GPT-4, Claude, Gemini integration)
- DNA score visualization and interpretation
- Workflow management for advisor evaluations
- SWOT-based integration roadmap generation
- HubSpot and Fentric integration
- Letter of Intent (LOI) creation
- NDA management
- Multi-tenant architecture (Phase 2+)

---

## Key Names & Terminology

To avoid confusion, here are the official names:

| Name | Usage |
|------|-------|
| **SageCrest Wealth Management** | Legal entity name, formal contexts, official communications |
| **Cathedral Center** | Product name, what the platform is called |
| **Project Cathedral** | Internal development reference (used in design docs, sprints) |
| **Project Cathy** | Developer shorthand (internal only) |
| **Cathedral** | General reference (acceptable in most contexts) |

**Website URLs:**
- sagecrestwm.com (primary)
- sagecrestwealth.com (also active)

---

## Leadership Team

**SageCrest Wealth Management Leadership:**
- **Matthew Bond** — President & CEO (mbond@sagecrestwm.com, 650-227-0382)
- **Cara Banchero** — Chief Operating Officer (cbanchero@sagecrestwm.com, 650-227-0344)
- **Brian Church** — Chief Growth Officer / Owner (briantchurch@me.com)

**Purely Works Development Team:**
- **Farid Kheloco** — CEO, Project Lead
- **Usman Ghani** — Lead Developer (50% allocation)
- **Hammad Younas** — Developer (50%)
- **Varda Quraishi** — UI/UX Designer, Assessment Modules
- **Shehryar Ahmed** — Backend, Auth, Infrastructure

---

## How to Use This Agent System

### For Content Creation
1. Reference **/knowledge-base/** for accurate product information
2. Check **/brand/guidelines/** for voice and tone standards
3. Generate content (marketing, technical, recruitment) aligned with Cathedral Center's consultative positioning
4. Ensure all claims are fact-based and compliant with financial services standards

### For Marketing & Promotion
1. Use insights from **/knowledge-base/sales/** for value propositions
2. Create podcast scripts, social media content, email campaigns
3. Position Cathedral Center as valuable consulting, not transactional sales
4. Reference advisor pain points and growth challenges

### For Technical Documentation
1. Reference **/knowledge-base/processes/development-process.md** for tech stack
2. Document features, APIs, integrations clearly
3. Ensure compliance with financial data handling standards
4. Create user guides for advisors and internal teams

### For Stakeholder Communication
1. Tailor tone to audience (Brian = strategic/detailed, Cara = pragmatic/timeline-focused, Matt = business metrics)
2. Use **/knowledge-base/** to back up claims with data
3. Keep updates aligned with development phases and launch timeline

---

## Communication Style

**Cathedral Center communications should be:**
- **Professional yet conversational** — Technical credibility with warmth
- **Consultant-focused** — Frame insights as valuable guidance
- **Advisor-centric** — Show understanding of growth challenges
- **Data-driven** — Support claims with evidence
- **Accessible** — Clear language without oversimplification
- **Collaborative** — Emphasis on partnership, not pressure

**Core Principle: "Consulting Not Sales"**
All Cathedral Center communications should feel like valuable expert guidance, not sales pressure. The goal is to position assessment as a professional service that adds value to the advisor's decision-making process.

---

## Development Timeline

| Phase | Dates | Focus |
|-------|-------|-------|
| **Phase 1** | Jan 23 - Feb 6 | Foundation: DB schema, auth, infrastructure, frontend shell |
| **Phase 2** | Feb 6 - Mar 6 | Assessment system, scoring engine, Tier 1 & 2 automation |
| **Phase 3** | Mar 6 - Apr 1 | AI reports, polish, QA, launch prep |

**Key Meetings:**
- Weekly Dev Sync: Wednesday 11am PST
- Content Meetings: Friday 1pm PST
- Monthly Stakeholder Review: TBD

---

## Tech Stack Summary

- **Frontend:** React 18 + TypeScript, Material UI, Emotion
- **Backend:** Node.js + TypeScript, Prisma ORM, tRPC
- **Auth:** Auth0 with RBAC
- **Database:** Neon PostgreSQL
- **AI:** OpenAI GPT-4, Anthropic Claude, Google Gemini
- **Hosting:** Vercel + Cloudflare
- **Monitoring:** Sentry
- **CI/CD:** GitHub Actions
- **Tools:** Linear, Notion, GitHub, Figma

---

## File Structure Reference

```
cathedral/
├── Claude.md                              # Main agent training
├── README.md                              # This file
├── brand/
│   ├── README.md                          # Brand assets status
│   ├── colors/                            # Color palette definitions
│   ├── logos/                             # Logo files
│   ├── fonts/                             # Font specifications
│   ├── guidelines/
│   │   └── voice-and-tone.md             # Communication style guide
│   └── templates/
│       ├── email/                         # Email templates
│       ├── proposal/                      # Proposal templates
│       ├── presentation/                  # Slide deck templates
│       └── document/                      # Document templates
├── knowledge-base/
│   ├── company/
│   │   ├── company-overview.md           # SageCrest + Cathedral overview
│   │   ├── leadership-team.md            # Leadership bios and contacts
│   │   └── products-services.md          # SageCrest services + Cathedral features
│   ├── assessments/
│   │   ├── assessment-framework.md       # Three-tier system, DNA scoring
│   │   └── user-journey.md               # Five-step user journey
│   ├── sales/
│   │   └── value-propositions.md         # Cathedral value props, positioning
│   ├── clients/
│   │   ├── ideal-customer-profile.md     # Target advisor personas
│   │   └── case-studies/                 # Real/example case studies
│   └── processes/
│       ├── development-process.md        # Tech stack, phases, team roles
│       └── marketing-strategy.md         # Marketing channels, content strategy
├── training-files/
│   ├── README.md                          # Continuous learning system
│   └── previous-training/                 # Training iteration archive
└── outputs/
    ├── proposals/                         # Generated marketing proposals
    ├── reports/                           # Assessment & status reports
    └── presentations/                     # Generated presentation decks
```

---

## Key Statistics & Facts

- **SageCrest History:** Founded 1950 (70+ years in advisory)
- **BBB Rating:** A+ (excellent standing)
- **Employees:** 11-50 team members
- **Cathedral Launch:** April 1, 2026
- **M&A Failure Rate:** ~70% (industry benchmark driving Cathedral Center development)
- **Assessment Timeline:** Tier 1 (fully automated), Tier 2 (30-45 min), Tier 3 (2-4 hours)
- **DNA Dimensions:** 5 core assessment areas (culture, values, behavior, needs, desires)
- **Target Market:** 300,000+ US financial advisors
- **LPL Affiliation:** SageCrest is LPL Financial-affiliated advisor

---

## Important Compliance Notes

**Financial Services Sensitivity:**
- Cathedral Center assessments are internal planning tools, not public scorecards
- Advisor data and DNA scores are confidential
- Frame assessments as valuable consulting insights, not judgmental evaluations
- Respect advisor privacy and professional standing
- Acknowledge SEC ADV filings, compliance history, and regulatory context when appropriate

**LPL Financial Awareness:**
- SageCrest is LPL-affiliated; acknowledge this in formal contexts
- Reference LPL compliance guidelines when relevant
- Understand target advisors may also be LPL-affiliated
- Never position Cathedral Center as an LPL product; it's SageCrest innovation

---

*Last Updated: February 6, 2026*

*This system contains comprehensive training for the Cathedral Center AI Agent, developed in collaboration with SageCrest Wealth Management and the Purely Works development team.*
