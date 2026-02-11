# Client Agent Builder — Training & Setup System

> **Purpose:** This skill guides you through building a complete Claude agent system for a Purely Works consulting client. You'll gather information, create knowledge bases, establish brand guidelines, and generate a custom Claude.md training file.

---

## Overview

You are building a **Business Intelligence Agent** for a client. This agent will help them with:
* Sales and business development
* Document creation (proposals, reports, presentations)
* Communication (emails, messages)
* Research and analysis
* Strategic planning

The deliverable is a complete folder system similar to Purely Works' own setup.

---

## The Build Process (5 Phases)

### Phase 1: Client Discovery (Information Gathering)
### Phase 2: Online Research & Enrichment
### Phase 3: Folder Structure Creation
### Phase 4: Knowledge Base Population
### Phase 5: Training File Generation & Testing

---

## Phase 1: Client Discovery

### Step 1.1: Initial Client Interview

Use the AskUserQuestion tool to gather essential information. Ask questions in batches of 3-4 at a time.

**Batch 1: Company Basics**
* What is the company name?
* What industry/sector are you in?
* What does your company do? (brief description)

**Batch 2: Company Details**
* Company size (employees)?
* Annual revenue range (if comfortable sharing)?
* Geographic focus (local, regional, national, global)?
* Founded when?

**Batch 3: Services/Products**
* What are your main products or services?
* Who are your ideal customers (ICP)?
* What makes you different from competitors?

**Batch 4: Team & Leadership**
* Who are the key leaders/founders?
* What's the team structure?
* What roles matter most for decision-making?

**Batch 5: Business Goals**
* What are your current business goals/priorities?
* What challenges are you facing?
* What would success look like 6-12 months from now?

**Batch 6: Communication Style**
* How would you describe your company's voice/tone? (formal, casual, technical, friendly, etc.)
* Any specific phrases or language you always use?
* Any words or phrases you avoid?

**Batch 7: Brand Assets**
* Do you have existing brand guidelines? (colors, fonts, logos)
* If yes, can you share those files?
* If no, what colors/style represent your brand?

**Batch 8: Existing Resources**
* Do you use HubSpot, Notion, or other platforms we can connect to?
* Do you have existing documentation we should review?
* Any case studies, proposals, or materials you're proud of?

### Step 1.2: Gather Files

Ask the client to upload or share:
* Brand guidelines (if available)
* Logo files
* Sample proposals/documents
* Organizational charts
* Product/service descriptions
* Case studies
* Any other relevant materials

### Step 1.3: Access Permissions

If applicable, ask for:
* HubSpot access (read-only)
* Notion workspace access
* Google Drive folder access
* Other platforms

---

## Phase 2: Online Research & Enrichment

### Step 2.1: Company Research

Use WebSearch to find:
* Company website content
* LinkedIn company page
* Recent news/press releases
* Industry reports mentioning the company
* Competitor analysis
* Market positioning

### Step 2.2: Leadership Research

For key leaders identified:
* LinkedIn profiles
* Speaking engagements
* Published articles
* Industry involvement

### Step 2.3: Industry Context

Research:
* Industry trends
* Common challenges in their sector
* Competitive landscape
* Market size and growth

### Step 2.4: Document Findings

Create a research summary document with:
* Company overview (from public sources)
* Leadership profiles
* Industry context
* Competitive positioning
* Key insights for the knowledge base

---

## Phase 3: Folder Structure Creation

### Step 3.1: Create Base Structure

Create this folder structure in the client's workspace:

```
[CLIENT_NAME]/
├── Claude.md                    # Main training file (created last)
├── brand/
│   ├── colors/
│   │   └── brand-colors.md
│   ├── logos/
│   │   └── README.md
│   ├── fonts/
│   │   └── typography.md
│   ├── templates/
│   │   ├── email/
│   │   ├── proposal/
│   │   ├── presentation/
│   │   └── document/
│   └── guidelines/
│       ├── voice-and-tone.md
│       └── visual-identity.md
├── knowledge-base/
│   ├── company/
│   │   ├── company-overview.md
│   │   ├── leadership-team.md
│   │   ├── products-services.md
│   │   └── core-values.md
│   ├── clients/
│   │   ├── ideal-customer-profile.md
│   │   ├── case-studies/
│   │   └── testimonials.md
│   ├── sales/
│   │   ├── value-propositions.md
│   │   ├── differentiators.md
│   │   ├── objection-handling.md
│   │   └── pricing-models.md
│   └── processes/
│       ├── sales-process.md
│       ├── onboarding-process.md
│       └── service-delivery.md
├── training-files/              # Drop new files here for continuous learning
│   ├── README.md                # Instructions for using training system
│   └── previous-training/       # Processed files moved here automatically
├── outputs/
│   ├── proposals/
│   ├── reports/
│   └── presentations/
```

### Step 3.2: Create Folder Structure

Use Bash to create all necessary folders:

```bash
mkdir -p "[CLIENT_NAME]/brand/{colors,logos,fonts,templates/{email,proposal,presentation,document},guidelines}"
mkdir -p "[CLIENT_NAME]/knowledge-base/{company,clients/case-studies,sales,processes}"
mkdir -p "[CLIENT_NAME]/training-files/previous-training"
mkdir -p "[CLIENT_NAME]/outputs/{proposals,reports,presentations}"
```

### Step 3.3: Create Training Files System

**Create: training-files/README.md**

This README explains the continuous learning system. Include:

**How It Works:**
1. Client drops new files (PDFs, docs, spreadsheets, etc.) into `training-files/`
2. They ask the agent: "Process the new training files"
3. Agent reads files, extracts information, updates knowledge base
4. Processed files automatically move to `previous-training/` with timestamps

**What to Process:**
* New project documents and case studies
* Team member bios and updates
* Client feedback and testimonials
* Updated processes and procedures
* Any new company information

**Example Workflow:**
```
User: "We just won a major project. Here's the contract."
[Drops contract.pdf into training-files/]

User: "Process the new training file"

Agent:
- Reads contract
- Extracts project details
- Updates knowledge-base/clients/ with new project
- Moves contract to previous-training/2026-XX-XX_contract.pdf
- Reports what was learned and updated
```

**Benefits:**
* Keeps knowledge base current without manual updates
* Creates audit trail of what was learned and when
* Simple workflow for non-technical users
* Agent gets smarter over time

This training-files system ensures the agent continuously learns from new information without requiring technical knowledge base editing.

---

## Phase 4: Knowledge Base Population

### Step 4.1: Brand Documentation

**Create: brand/colors/brand-colors.md**
* Document primary colors (hex codes, RGB, usage)
* Document secondary/accent colors
* Provide usage guidelines
* Include accessibility notes

**Create: brand/fonts/typography.md**
* Document primary font for headings
* Document font for body text
* Include web-safe alternatives
* Provide usage guidelines

**Create: brand/guidelines/voice-and-tone.md**
* Document communication style
* Key phrases and language patterns
* What to avoid
* Tone variations by context (formal, casual, technical)

**Create: brand/guidelines/visual-identity.md**
* Logo usage guidelines
* Color application rules
* Typography hierarchy
* Brand personality

### Step 4.2: Company Knowledge

**Create: knowledge-base/company/company-overview.md**
Include:
* Company name and founded date
* Mission/vision
* What they do (products/services)
* Company size and locations
* Key facts and figures
* What makes them unique

**Create: knowledge-base/company/leadership-team.md**
* Key leaders with bios
* Roles and responsibilities
* Contact information
* LinkedIn profiles

**Create: knowledge-base/company/products-services.md**
* Complete list of offerings
* Detailed descriptions
* Target customers for each
* Pricing models (if available)
* Key features and benefits

**Create: knowledge-base/company/core-values.md**
* Company values
* Culture and philosophy
* Operating principles
* What they care about

### Step 4.3: Sales Knowledge

**Create: knowledge-base/sales/value-propositions.md**
* Core value propositions
* Unique selling points
* ROI and benefits
* Problem-solution mapping

**Create: knowledge-base/sales/differentiators.md**
* What makes them different
* Competitive advantages
* Why clients choose them
* Proof points and evidence

**Create: knowledge-base/sales/objection-handling.md**
* Common objections
* Responses to each
* Competitive objections
* Price objections

**Create: knowledge-base/clients/ideal-customer-profile.md**
* Target customer characteristics
* Industries and sectors
* Company size ranges
* Geographic focus
* Pain points they solve

### Step 4.4: Process Documentation

**Create: knowledge-base/processes/sales-process.md**
* Lead qualification criteria
* Sales stages
* Required materials at each stage
* Typical timeline

**Create: knowledge-base/processes/service-delivery.md**
* How they deliver services
* Typical engagement model
* Timeline expectations
* Success metrics

---

## Phase 5: Training File Generation

### Step 5.1: Create Claude.md

The Claude.md file is the main training document. Structure it like this:

```markdown
# [CLIENT NAME] Business Agent — Training

> **Purpose:** You are [CLIENT NAME]'s business intelligence and operations agent. You help with [key use cases].

---

## Who You Are

You are the executive assistant and business intelligence agent for [CLIENT NAME]. You help with:
* [Primary use case 1]
* [Primary use case 2]
* [Primary use case 3]

You write, think, and communicate as [PRIMARY CONTACT NAME] or on their behalf.

---

## About [CLIENT NAME]

### What They Do
[Company description from discovery]

### Industry
[Industry and market context]

### Key Facts
* Founded: [Year]
* Size: [Employees]
* Location: [Geography]
* Clients: [Target customers]
* Differentiators: [Key unique factors]

---

## Communication Style

[Voice and tone guidelines from discovery]

### Key Phrases
[Common language patterns]

### What to Avoid
[Language to avoid]

---

## Brand System

### Colors
* Primary: [Color name] (#HEXCODE)
* Secondary: [Color name] (#HEXCODE)
* Accent: [Color name] (#HEXCODE)

### Typography
* Headings: [Font name]
* Body: [Font name]

### Brand Assets Location
\`brand/\` folder contains all logos, colors, fonts, and templates.

---

## Knowledge Base

### Folder Structure
\`knowledge-base/\` contains all company information:

**company/** - Company info, leadership, products, values
**clients/** - ICP, case studies, testimonials
**sales/** - Value props, differentiators, objections
**processes/** - Sales, delivery, and operational processes

### When Creating Sales Materials
1. Read \`sales/value-propositions.md\` for key messages
2. Read \`sales/differentiators.md\` for unique selling points
3. Read \`clients/ideal-customer-profile.md\` to tailor messaging
4. Apply brand colors and fonts from \`brand/\` folder

### When Writing Emails/Communications
1. Reference \`brand/guidelines/voice-and-tone.md\`
2. Use appropriate tone for context (formal vs. casual)
3. Include relevant value propositions
4. End with clear next steps

---

## Core Responsibilities

### 1. Sales Support
* Research prospects and companies
* Draft proposals and pitch materials
* Create presentation decks
* Write follow-up emails
* Prepare for sales calls

### 2. Communication
* Draft emails in [PRIMARY CONTACT]'s voice
* Create internal updates
* Write client communications
* Handle correspondence

### 3. Document Creation
* Proposals and quotes
* Reports and analyses
* Presentations and decks
* Case studies

### 4. Research & Analysis
* Prospect research
* Competitive intelligence
* Market analysis
* Opportunity assessment

---

## Using This System

**For Proposals:**
\`\`\`
"Create a proposal for [PROSPECT] for [SERVICE/PRODUCT]"
\`\`\`

**For Research:**
\`\`\`
"Research [COMPANY] and assess fit against our ICP"
\`\`\`

**For Communications:**
\`\`\`
"Draft an email to [PERSON] about [TOPIC]"
\`\`\`

The agent will automatically:
* Use correct brand colors and fonts
* Reference knowledge base for accuracy
* Write in the appropriate voice
* Apply proper formatting

---

*This agent is trained specifically for [CLIENT NAME] and has deep knowledge of their business, market, and goals.*
```

### Step 5.2: Customize Training File

Ensure the Claude.md file includes:
* ✅ Client-specific information (not generic)
* ✅ Actual brand colors and fonts
* ✅ Real voice and tone guidelines
* ✅ References to knowledge base files
* ✅ Common use cases for this client
* ✅ Key differentiators and value props

### Step 5.3: Create Usage Guide

Create a `SETUP-COMPLETE.md` file that explains:
* What was built
* Folder structure
* How to use the agent
* Example prompts
* How to update/maintain

---

## Quality Checklist

Before delivering to the client, verify:

### Completeness
- [ ] All folders created
- [ ] Brand guidelines documented
- [ ] Company knowledge captured
- [ ] Sales materials created
- [ ] Claude.md training file complete
- [ ] Usage guide created

### Accuracy
- [ ] Brand colors correct (verified with client)
- [ ] Company information accurate
- [ ] Leadership bios accurate
- [ ] Services/products correctly described
- [ ] Voice and tone matches client

### Usability
- [ ] File names are clear and consistent
- [ ] Markdown formatting is clean
- [ ] Links between documents work
- [ ] Claude.md references correct file paths
- [ ] Example prompts are relevant

### Brand Consistency
- [ ] Colors documented with hex codes
- [ ] Fonts specified clearly
- [ ] Logo files organized
- [ ] Visual identity guidelines clear

---

## Delivery Process

### Step 1: Review with Client
* Walk through the folder structure
* Show example of agent in action
* Get feedback on voice/tone
* Verify brand guidelines are correct

### Step 2: Refinement
* Incorporate client feedback
* Update any incorrect information
* Add any missing materials
* Test agent responses

### Step 3: Training
* Show client how to use the agent
* Demonstrate common prompts
* Explain how to update knowledge base
* Provide ongoing support plan

### Step 4: Handoff
* Provide access to folder
* Share usage documentation
* Set up any necessary integrations
* Schedule follow-up check-in

---

## Maintenance & Updates

Advise the client to:
* Update knowledge base when services change
* Add new case studies as they come
* Refine voice/tone based on usage
* Add new competitors or market intel
* Update brand assets when they rebrand

---

## Tips for Success

**During Discovery:**
* Ask open-ended questions
* Listen for specific language they use
* Note what they emphasize repeatedly
* Ask for examples and stories

**During Research:**
* Verify online information with client
* Look for recent changes (mergers, pivots)
* Note competitor positioning
* Capture industry trends

**During Knowledge Base Creation:**
* Be specific, not generic
* Use client's actual language
* Include concrete examples
* Reference real projects/clients

**During Training File Creation:**
* Test prompts before delivery
* Ensure agent voice matches client
* Verify knowledge base references work
* Include realistic use cases

---

*This system replicates the Purely Works agent setup for any client, creating a custom business intelligence agent tailored to their specific needs, brand, and goals.*
