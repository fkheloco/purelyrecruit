# Cathedral Center MVP Specification

## Overview

The Cathedral Center Minimum Viable Product (MVP) represents the focused set of features for April 1, 2026 launch. The MVP prioritizes core functionality that demonstrates value and creates a foundation for expansion in subsequent phases.

**Launch Target:** April 1, 2026
**Deployment Model:** Single-organization deployment (SageCrest), foundation for multi-tenant SaaS
**Primary Use Case:** Advisor Compatibility Assessment for recruiting/M&A

---

## MVP Scope: IN-SCOPE Features

### 1. Lead Scoring Engine

#### Tier 1 & Tier 2 Scoring System

**Tier 1: Automated Public Data Enrichment**

- **Data Collection:** SEC ADV filings, public business records, web presence analysis
- **Enrichment:** Firm details, AUM, location, compliance history, technology infrastructure
- **Automated Scoring:** Algorithm-based compatibility score (0-100)
- **Timeline:** 24-48 hours from lead entry
- **Output:** Tier 1 profile card with score and recommendation

**Tier 2: Structured Questionnaire Scoring**

- **Question Database:** 91 questions across four modules
  - Operations (~30+ inputs)
  - Strategy
  - Behaviors (DAAN framework)
  - Culture (~55 questions)
- **Self-Administered:** Web form or lightweight app interface
- **Response Collection:** Validated, stored securely
- **Scoring Calculation:** Preliminary DNA scores across five dimensions
- **Timeline:** 30-45 minutes for advisor to complete
- **Output:** Preliminary DNA scores + insights

**Use Cases:**
- One organic growth scenario (e.g., high-potential client prospect)
- One inorganic growth scenario (e.g., advisor recruiting/acquisition target)

**Custom Cathedral Score Field:**
- New custom field in HubSpot: "Cathedral DNA Score"
- Range: 0-100
- Synced from Cathedral system to HubSpot
- Used for lead ranking and filtering

#### Filtering & Reporting

- **HubSpot Views:** Pre-built filtered views for scored leads
  - "High-Priority Opportunities" (70+ score)
  - "Evaluate Further" (50-70 score)
  - "Lower Priority" (<50 score)
- **Reports:** Basic scoring reports showing top opportunities
- **Dashboards:** Leads dashboard with ranked scored prospects

---

### 2. Advisor Compatibility Index (MVP)

#### Interactive Assessment Tool

**Assessment Delivery:**
- Web-based form or lightweight embedded app
- 10-15 key screening questions (subset of full Tier 2)
- Mobile-friendly interface
- Progress tracking and save functionality
- ~15-20 minutes to complete

**Questionnaire Modules (MVP):**
- Core Values & Philosophy (5 questions)
- Business Model & Strategy (4 questions)
- Behavioral Profile (DAAN - 3 questions)
- Culture Fit (3 questions)

#### Compatibility Report Output

**Automated Report Includes:**
- Overall Compatibility Score (0-100)
- Five DNA Dimension Scores:
  - Culture Alignment
  - Values Compatibility
  - Behavioral Fit
  - Needs Matching
  - Desires Alignment
- Fit Category (Strong, Opportunistic, Threatening, Weak)
- Bullet-point insights for each dimension
- Integration risk assessment
- Recommendation (Proceed, Proceed with Caution, Reconsider)

**Report Format:**
- PDF export capability
- Digital dashboard view
- Email delivery option
- Shareable link (with permissions)

---

### 3. Selective Workflow Automation (2-3 Workflows)

#### Workflow 1: Hot Lead Alert

**Trigger:** Lead score exceeds 70 (high compatibility threshold)

**Actions:**
- Automatic notification to user (in-app + email)
- Task creation in HubSpot with deadline
- Add to "Hot Leads" HubSpot list
- Suggest next action (schedule call, send resource)

**Output:** Alert to sales team for immediate follow-up

#### Workflow 2: Post-Assessment Outreach

**Trigger:** Advisor completes Tier 2 assessment

**Actions:**
- Generate personalized email with:
  - Top 3 insights from assessment
  - DNA score summary
  - Strength areas highlight
- Suggest consultation booking
- Send relevant learning center resource
- Track email open and click data

**Output:** Personalized engagement email driving consultation

#### Workflow 3: Periodic Lead Re-Rank (Future - Not MVP)

May defer to Phase 2 if timeline constraints arise.

---

### 4. User Interface

#### HubSpot-First Interface

**Primary Integration Point:** HubSpot CRM
- Custom Cathedral Score field visible in lead/contact view
- Embedded assessment form within HubSpot (iframe)
- Cathedral-scored filtered views of leads
- Activity log showing assessment interactions

**Leads Dashboard (Simple Standalone)**

If capacity available:
- Ranked list of scored leads
- Filter by score range, lead type, date
- Sort by score, last updated
- View individual lead profiles with scores

**Advisor Profile View**

- Display Tier 2 assessment results
- Show DNA scores visually (0-100 scale)
- Display insights and recommendations
- Show historical assessments if applicable

---

### 5. Backend Infrastructure

#### Core Systems

**Database:**
- Neon PostgreSQL (serverless)
- Normalized schema for assessments, questions, responses, scores
- Multi-user, single-tenant architecture (expandable to multi-tenant)
- Data isolation and security at application level

**API Layer:**
- RESTful API for assessment operations
- tRPC for type-safe client-server communication
- Endpoints:
  - POST /assessments (create)
  - GET /assessments/:id (retrieve)
  - POST /assessments/:id/responses (submit answers)
  - GET /assessments/:id/results (retrieve scores)
  - GET /leads/scored (retrieve scored leads)

**Authentication & Authorization:**
- Auth0 integration for user management
- Role-Based Access Control (RBAC):
  - Admin (full system access)
  - Advisor (can complete assessments)
  - Sales/Evaluator (can view scores and insights)
- Secure token-based authentication
- Session management and security

**Data Security:**
- Encrypted data at rest
- HTTPS/TLS for all communications
- Secure secrets management (environment variables, key vault)
- Audit logging for data access
- Regular security testing (OWASP compliance)

#### HubSpot Integration

**Bidirectional Sync:**
- Pull lead data from HubSpot (name, email, company, AUM if available)
- Push Cathedral Score back to HubSpot custom field
- Sync assessment status and completion date
- Log all Cathedral activities in HubSpot activity timeline

**API Connection:**
- HubSpot API authentication (OAuth)
- Automated sync every 4 hours or on-demand
- Error handling and retry logic
- Data validation before sync

#### Email Infrastructure

- SendGrid integration for transactional emails
- Email templates for:
  - Assessment invitation
  - Assessment reminder
  - Post-assessment insights email
  - Consultation confirmation
- Tracking: open rate, click rate, bounce handling

---

### 6. Data Entities Model

#### Core Data Objects

**Tenant**
- Tenant ID, Name, Billing Info
- SageCrest (single tenant MVP)
- Configuration and settings

**Lead**
- Lead ID, Name, Email, Phone
- Company/Firm Name, Website, Location
- Lead Type (Prospect/Advisor/Firm)
- AUM, Revenue, Industry
- Tier 1 Score, Last Scored Date
- Status (Active, Converted, Lost, On Hold)
- Source, Created Date, Updated Date

**Assessment**
- Assessment ID, Tenant ID, Lead ID
- Assessment Type (Tier 1, Tier 2)
- Status (Draft, In Progress, Completed)
- Created Date, Completed Date
- Results (score, dimension scores, insights)

**Question**
- Question ID, Module (Operations/Strategy/Behavior/Culture)
- Question Text, Answer Type (Single Choice/Multiple Choice/Scale)
- Required Flag, Weight/Importance

**Response**
- Response ID, Assessment ID, Question ID
- Answer (text or selected option)
- Confidence/Certainty Level
- Timestamp

**Assessment Result**
- Result ID, Assessment ID
- Tier 1 Score (if applicable)
- Tier 2 Scores (5 DNA Dimensions)
- Overall DNA Score (0-100)
- Fit Category, Insights
- Generated Date, Generated By

**HubSpot Sync Log**
- Sync ID, Last Sync Date
- Synced Records Count
- Errors (if any)
- Next Sync Scheduled

---

## MVP Scope: OUT-OF-SCOPE Features

### Phase 3 Assessments (Deferred)

The following assessments are intentionally deferred to Phase 3:

- **Firm Growth Readiness Model** — Measures growth preparation and capability
- **Client Journey Mapping Tool** — Identifies gaps in client experience
- **Value Accretion Framework** — Quantifies firm/advisor value drivers
- **Succession & Equity Assessment** — Plans ownership transition and incentives

### Advanced Analytics & AI (Phase 4)

- Cohort benchmarking and peer comparison
- Deep predictive modeling (partnership success prediction)
- Natural language processing of open-ended responses
- Anomaly detection for unusual fit patterns

### Executive Enablement (Phase 3+)

- C-suite mastermind sessions
- Executive coaching platform
- Valuation and monetization planning
- Succession and equity design consulting
- Exit strategy planning

### Human + AI Services Layer (Deferred)

- Integrated knowledge base and AI chatbot
- Automated insights generation
- Proactive recommendations engine
- Consulting services marketplace

### Infrastructure (Not MVP)

- **Multi-tenant SaaS:** MVP deployed single-tenant; multi-tenant deferred to Phase 2+
- **Salesforce Integration:** HubSpot only for MVP
- **Advanced UI/Branding:** Functional UI, polished design deferred
- **Mobile Apps:** Web-responsive only
- **Full RBAC:** Basic roles; advanced permission management deferred

### Lead Enrichment Services

- Integration with Apollo, ZoomInfo, or other data providers
- Handled separately by Project Saraphim
- Cathedral uses enriched data, not responsible for enrichment

### Tier 3 Deep Dive (Phase 2)

- Expert interview infrastructure
- Financial due diligence tools
- Legal/compliance assessment
- Integration planning templates
- Final DNA score calculation

### Content & Learning (Phase 2+)

- Learning Center (knowledge base, guides, webinars)
- Content delivery and management
- Certification programs
- Video library

---

## Non-Functional Requirements

### Performance

- **Assessment Scoring:** <5 seconds response time
- **Batch Scoring:** Complete re-scoring of all leads within 24 hours
- **Lead Dashboard:** <2 second page load time
- **API Response:** <500ms average response time
- **Uptime:** 99.5% availability target

### Security & Compliance

- **Authentication:** OAuth 2.0 via Auth0
- **Encryption:** Data encrypted at rest and in transit
- **HTTPS:** All communications over TLS 1.2+
- **Data Isolation:** Multi-user, single-tenant data separation
- **Secrets Management:** Secure credential storage (no hardcoded secrets)
- **Audit Logging:** All data access logged and traceable
- **OWASP Compliance:** Follow OWASP Top 10 prevention

### Data & Integration

- **Multi-Tenant Foundation:** Architecture designed for multi-tenant, single-tenant deployment
- **HubSpot Sync:** Bidirectional, reliable sync with error handling
- **Data Validation:** All inputs validated before storage
- **Referential Integrity:** Database constraints maintain data relationships
- **Backup & Recovery:** Regular backups with recovery testing

### Scalability & Maintainability

- **Modular Architecture:** Microservice-ready structure
  - Assessment Service (questionnaire, scoring)
  - Lead Service (lead data, enrichment)
  - Integration Service (HubSpot sync)
  - Notification Service (email delivery)
- **Database Indexing:** Optimized queries for common operations
- **API Versioning:** Support for future API versions
- **Logging:** Structured logging for debugging and monitoring
- **Error Handling:** Graceful error handling with user feedback

---

## MVP Development Phases

### Phase 1: Foundation (Jan 23 - Feb 6)
- Database design, Authentication setup, Infrastructure
- Frontend shell, Backend foundation

### Phase 2: Assessment System (Feb 6 - Mar 6)
- Tier 1 automation, Tier 2 questionnaire, Scoring engine
- HubSpot integration, Workflow automation

### Phase 3: Polish & Launch (Mar 6 - Apr 1)
- AI reporting, Testing and QA
- Documentation, Launch preparation

---

## Success Metrics (MVP Launch)

| Metric | Target |
|---|---|
| Tier 1 automation operational | 100% |
| Tier 2 questionnaire complete | 100% |
| DNA scoring functional | 100% |
| HubSpot integration live | 100% |
| Workflows executing | 100% |
| Documentation complete | 100% |
| Testing coverage | 80%+ |
| Page load time | <2 seconds |
| Assessment completion time | 30-45 minutes |
| Uptime | >99.5% |

---

## Future Expansion (Post-MVP)

### Phase 2 (Months 4-9)
- Tier 3 deep dive infrastructure
- Full Advisor Compatibility Index (91 questions)
- Advanced workflow automation
- Learning center launch
- Basic analytics and benchmarking

### Phase 3 (Months 10-15)
- Full assessment suite (5 assessments)
- Executive enablement (coaching, mastermind)
- Advanced analytics
- Multi-tenant SaaS readiness

### Phase 4 (Month 16+)
- AI-driven insights and recommendations
- Predictive analytics
- Market benchmarking
- Integrated advisor coaching platform

---

*Last Updated: February 6, 2026*
