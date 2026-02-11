# Brio Solutions - AI Agent System

## Overview

This folder contains a complete AI agent system custom-built for Brio Solutions LLC. The agent is trained to support business operations, proposal development, candidate research, and day-to-day operational tasks.

**Created:** February 6, 2026
**Built By:** Purely Works using Client Agent Builder methodology
**Client:** Brio Solutions LLC (gobriosolutions.com)

---

## What's Included

### 1. Claude.md - Agent Training File
**Location:** `Claude.md`

This is the main training file that defines the agent's personality, knowledge, and capabilities. Place this file in the root of any conversation folder where you want the agent to assist with Brio Solutions work.

**Key Features:**
* Comprehensive company knowledge
* Service catalog and capabilities
* Leadership team information
* Communication style and tone guidelines
* Process workflows and best practices
* Task priorities and quality standards

### 2. Knowledge Base
**Location:** `knowledge-base/`

Complete repository of company information, organized by category:

**company/** - Company overview, mission, values, history
* `company-overview.md` - Comprehensive company background

**leadership/** - Team bios and contact information
* `team.md` - Executive leadership profiles (Manan Choksi, Ipsita Kothari)

**services/** - Service offerings and capabilities
* `service-catalog.md` - Complete list of 8 core services with details

**sales/** - Value propositions and competitive positioning
* `value-propositions.md` - 7 key differentiators and competitive analysis

**clients/** - Project types and typical client work
* `project-types.md` - Aviation, transit, infrastructure, government contracting

**processes/** - Operational workflows and methodologies
* `recruitment-process.md` - Staff augmentation workflow
* `rfp-scoring-process.md` - AI-powered RFP evaluation system

### 3. Brand Folder
**Location:** `brand/`

Structure ready for brand assets. Currently contains:
* `README.md` - Instructions for adding brand assets

**Needs:**
* Colors (palette and usage guidelines)
* Logos (full, icon, variations)
* Fonts (typography specifications)
* Templates (proposals, presentations, email signatures)
* Guidelines (brand standards and voice/tone)

### 4. Training Files System (NEW!)
**Location:** `training-files/`

A continuous learning system that keeps the knowledge base up-to-date:

**How it works:**
1. Drop any files (PDFs, docs, spreadsheets, etc.) into `training-files/`
2. Ask the agent: "Process the new training files"
3. Agent reads, extracts info, updates knowledge base
4. Processed files automatically move to `training-files/previous-training/` with timestamps

**Use for:**
* New project documents and case studies
* Team member bios and updates
* Client feedback and testimonials
* Updated processes and procedures
* Any new company information

See `training-files/README.md` for complete instructions.

### 5. Outputs Folder
**Location:** `outputs/`

Where all deliverables are saved:
* `outputs/proposals/` - RFP responses, SOQs, proposals
* `outputs/reports/` - Analysis, intelligence reports, summaries
* `outputs/presentations/` - Decks and pitch materials

---

## How to Use This System

### For Brio Solutions Team

**Option 1: Use in Cowork Mode**
1. Open Claude (Cowork mode)
2. Select this folder as your working directory
3. The Claude.md file will automatically train the agent
4. Start asking for help with proposals, research, candidates, etc.

**Option 2: Copy Training to New Projects**
1. Start a new Claude conversation
2. Copy the Claude.md file into that conversation's folder
3. Reference knowledge base files as needed
4. The agent will have full Brio Solutions context

**Option 3: Use with Purely Works Partnership**
* Farid and the Purely team already have this system
* Just mention "use the Brio agent" or "check the Brio knowledge base"
* They can immediately assist with your specific needs

### Example Tasks

**Proposal Development:**
* "Draft an SOQ for this airport construction RFP"
* "Create a technical proposal for PMIS implementation at [Client]"
* "Review this RFP and assess our fit"

**Candidate Evaluation:**
* "Evaluate this resume for the construction manager position"
* "Summarize the top 3 candidates from Armeen's latest batch"
* "What aviation experience does this candidate have?"

**Business Intelligence:**
* "Research LAX's current construction projects and upcoming RFPs"
* "Analyze this RFP and recommend go/no-go with reasoning"
* "Who are the key decision-makers at [Transit Agency]?"

**Document Creation:**
* "Create a one-pager about our PMIS capabilities for LA Metro"
* "Draft a follow-up email to [Client] about our proposal"
* "Prepare a 10-slide presentation deck for this pitch"

---

## Information Sources

This agent system was built using information from:

✓ **HubSpot CRM** - Company record, contacts (Manan, Ipsita)
✓ **Google Drive** - 10+ weekly sync meeting notes (Oct 2025 - Feb 2026)
✓ **Gmail** - Email correspondence and communications
✓ **Notion** - Project documentation and notes
✓ **Web Research** - Company website, LinkedIn, industry sources
✓ **Purely Works Partnership** - Current project details and workflows

### Key Information Gathered

**Company Details:**
* Founded early 2010s, based in Conshohocken, PA
* Fewer than 25 employees
* Specialization: Aviation/airport projects, PMIS, construction management

**Notable Projects:**
* LA Metro PMIS Development (flagship project)
* Aviation and airport construction projects
* Government contracting and RFP responses

**Current Initiatives (Feb 2026):**
* AI-powered RFP scoring system (in development with Purely Works)
* SOQ generation tool using RAG technology
* Candidate search AI tool for Airtable database
* Active recruitment for aviation construction roles

**Partnership with Purely Works:**
* Recruitment services - Armeen Haroon
* Development services - Hammad Younas
* Account management - Farid Kheloco
* Client representative - David Hirsch

---

## Next Steps to Complete Setup

### 1. Add Brand Assets (Priority: Medium)

Provide the following to complete the brand folder:
* **Colors:** Primary/secondary colors with hex codes
* **Logos:** Full logo, icon, variations (PNG, SVG, EPS)
* **Fonts:** Primary and secondary typefaces with specifications
* **Templates:** Existing proposal/presentation templates

**How:** Share via Google Drive or email to farid@purelyworks.com

### 2. Review & Update Knowledge Base (Priority: Low)

As projects progress and new information becomes available:
* Update `company-overview.md` with new initiatives
* Add `clients/case-studies.md` with completed projects
* Expand `services/` with detailed service descriptions
* Document new processes in `processes/`

### 3. Test the Agent (Priority: High)

Try these test scenarios to ensure the agent works correctly:
* Ask it to draft an SOQ for a sample RFP
* Request candidate evaluation for a sample resume
* Have it research a potential client
* Test document creation capabilities

### 4. Integrate with Daily Workflow

Identify regular tasks where the agent can help:
* Weekly RFP review and evaluation
* Candidate summaries for recruitment meetings
* Quick research for business development calls
* Draft emails and communications
* Proposal outline creation

---

## Maintenance & Updates

**Quarterly Review Recommended:**
* Update company information and achievements
* Add new project case studies
* Refresh competitive positioning
* Update service offerings
* Review and improve process documentation

**Ongoing Maintenance:**
* Add completed projects to knowledge base
* Document lessons learned from proposals (wins and losses)
* Update team information as changes occur
* Refine agent instructions based on usage patterns

---

## Support & Questions

**For Agent Setup & Technical Issues:**
* Farid Kheloco - farid@purelyworks.com

**For Knowledge Base Content Updates:**
* Manan Choksi - mananc@gobriosolutions.com
* Ipsita Kothari - ipsitak@gobriosolutions.com

**For Partnership & Services:**
* Purely Works - admin@purelystartup.com

---

## System Specifications

**Framework:** Claude Agent SDK / Cowork Mode
**Knowledge Base Format:** Markdown (.md files)
**Training Method:** Context-based learning from Claude.md
**Tool Integrations:** Gmail, Google Drive, Notion, HubSpot CRM
**Created With:** Client Agent Builder v1.0
**Last Updated:** February 6, 2026

---

**Ready to Use!** This agent system is complete and ready for Brio Solutions to start using immediately. Simply select this folder in Cowork mode or copy Claude.md to any project folder where you need Brio-specific assistance.
