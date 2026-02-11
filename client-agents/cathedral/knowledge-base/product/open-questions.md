# Cathedral Center: Open Questions & Strategic Decisions

## Overview

This document tracks key decisions made and open questions requiring resolution for Cathedral Center's development and launch. It reflects the current state of strategic clarity and areas requiring additional thinking, data, or stakeholder alignment.

---

## Decisions Made

### Platform & Technology

**✓ HubSpot as Integration Center**
- Decision: Use HubSpot CRM as primary integration point
- Rationale: SageCrest already using HubSpot; strong API; familiar to advisory industry
- Implication: Architecture centered on HubSpot data flows and custom fields

**✓ Modular Microservice Architecture from Start**
- Decision: Build with microservice-ready, modular architecture
- Rationale: Enables scaling, specialization, and future expansion
- Services: Assessment, Scoring, Leads, Integration, Notification, Reporting

**✓ Single-Client Deployment Initially**
- Decision: Deploy for SageCrest only in MVP; multi-tenant deferred
- Rationale: Faster MVP, dedicated optimization, prove value before multi-tenant complexity
- Timeline: Single-tenant MVP, multi-tenant architecture Phase 2, multi-tenant SaaS Phase 3+

**✓ Simple, Explainable Scoring Over Black-Box AI**
- Decision: Use transparent, rule-based scoring vs. complex ML models
- Rationale: Regulatory comfort, explainability to advisors, easier refinement
- Phase 4+: Add predictive analytics and advanced AI once data accumulated

**✓ Tier 3 Expert-Led Deep Dive**
- Decision: Keep Tier 3 human-led, not automated
- Rationale: Complex assessment requires human judgment; adds value perception; drives pricing power
- Implication: Scalability limited by expert availability; positioning as premium service

### MVP Scope

**✓ Lead Enrichment Handled by Project Saraphim**
- Decision: Don't build enrichment in Cathedral MVP
- Rationale: Project Saraphim handling enrichment; Cathedral uses enriched data
- Implication: Dependency on Saraphim; integration point needed

**✓ Advisor Recruitment/Compatibility as MVP Focus**
- Decision: Prioritize inorganic growth (recruiting/M&A) over organic growth in MVP
- Rationale: Higher value perception, clearer use case, better initial traction
- Organic growth: Added as Phase 2+ enhancement

**✓ Five Pillar Architecture (Not Just Assessment)**
- Decision: Full five-pillar model (Intelligence, Assessment, Workflow, Enablement, Services)
- Rationale: Competitive differentiation; higher lifetime value; stickier relationships
- MVP Scope: Core Intelligence + Assessment pillars; others phased in Phases 2-3

### Go-to-Market

**✓ Best Vocational Life® as No-Cost Entry Point**
- Decision: Offer 3-hour consultation at no cost
- Rationale: Build trust, demonstrate value, reduce friction to engagement
- Positioning: "Consulting not sales"; genuine advisor success focus

**✓ Consulting-First Positioning**
- Decision: Market as advisory partner, not software vendor
- Rationale: More sustainable, defensible positioning; higher perceived value
- Content: Focus on thought leadership, case studies, peer learning

---

## Open Questions

### Strategic & Business Model

#### Q1: Exact Lead Enrichment Integration

**Question:** Which data providers should we integrate with Project Saraphim (Apollo, ZoomInfo, others)?

**Context:**
- Project Saraphim responsible for lead enrichment
- Multiple providers available with different capabilities
- Cost and integration considerations

**Impact:** Lead quality, pricing model pass-through costs, integration timeline

**Owner:** Brian Church / Farid Kheloco

**Target Resolution:** By Phase 2 (June 2026)

---

#### Q2: Pricing Model for Tier 3 Services

**Question:** What should be the pricing structure for Tier 3 deep dive assessment and coaching?

**Context:**
- MVP documentation suggests $5K-$25K range
- Pricing depends on firm size, complexity, depth
- Revenue model still being finalized
- Bundle pricing vs. à la carte

**Options:**
- Flat fee ($5K, $10K, $15K tiers)
- Percentage-based (% of AUM or revenue)
- Value-based (based on estimated impact)
- Tiered by firm size

**Impact:** Revenue generation, customer acquisition, market positioning

**Owner:** Matthew Bond / Brian Church

**Target Resolution:** By Phase 2 launch (April 2026)

---

#### Q3: Pricing Model for Enrichment Pass-Through

**Question:** How should we handle pass-through costs for data enrichment from Project Saraphim?

**Context:**
- Saraphim incurs costs for data provider subscriptions
- Question of whether/how to charge Cathedral customers for enrichment
- Transparency and fairness considerations

**Options:**
- Bundle enrichment cost into Cathedral pricing
- Separate enrichment fee
- Pass-through only for customers requesting enrichment
- Saraphim absorbs cost as internal service

**Impact:** Pricing competitiveness, customer perception, revenue sharing between initiatives

**Owner:** Matthew Bond / Cara Banchero

**Target Resolution:** By Phase 2 launch (April 2026)

---

### Product & Feature

#### Q4: Top 10-15 Assessment Inputs to Prioritize in Tier 2 MVP

**Question:** Which 10-15 questions from the full 91-question framework should be prioritized in the MVP questionnaire?

**Context:**
- Full framework has ~91 questions
- MVP aims for 15-20 minute completion time
- Need to capture essence of compatibility without full depth

**Current Thinking:**
- Core Values & Philosophy (3-4)
- Business Model & Strategy (3-4)
- Behavioral Profile/DAAN (3-4)
- Culture Fit (3-4)

**Decision Needed:**
- Exact question prioritization
- Weighting in scoring
- Validation against existing data

**Impact:** Score accuracy, questionnaire completion rates, user satisfaction

**Owner:** Brian Church

**Target Resolution:** By Phase 2 kick-off (February 2026)

---

#### Q5: Should MVP Include Advisor Matching Functionality?

**Question:** Should Cathedral include "matching" feature suggesting ideal advisor candidates?

**Context:**
- Advisor matching could be valuable feature
- Would require advisor database and matching algorithm
- Adds complexity to MVP
- Could be deferred to Phase 2

**Considerations:**
- MVP focus on evaluating specific targets vs. suggesting targets
- Advisor network/database requirements
- Privacy and confidentiality implications
- Matching algorithm development

**Decision Options:**
- Include in MVP
- Defer to Phase 2
- Partner with existing advisor network (Fentric, etc.)

**Impact:** Feature completeness, MVP scope, user value perception

**Owner:** Brian Church / Farid Kheloco

**Target Resolution:** By Phase 2 specification (February 2026)

---

#### Q6: Report Generation Capabilities in MVP

**Question:** Should "Download Report" feature be in MVP or deferred to Phase 2?

**Context:**
- MVP focused on core assessment and scoring
- Report generation adds UI/design complexity
- Could be manual/email for MVP, automated Phase 2

**Options:**
- MVP: Digital dashboard only; reports emailed manually
- MVP: Basic PDF reports automated
- Phase 2+: Enhanced report generation with customization

**Impact:** User experience, competitive positioning, technical complexity

**Owner:** Varda Quraishi / Farid Kheloco

**Target Resolution:** During Phase 2 kick-off (February 2026)

---

### Measurement & Analytics

#### Q7: Exact Success Metrics & Measurement Approach

**Question:** What are the specific KPIs and measurement approach for launch success?

**Context:**
- Need to track platform usage, business impact, customer satisfaction
- Metrics should inform product development and go-to-market refinement

**Potential Metrics:**
- **Adoption:** # assessments per month, # new users, # active users
- **Engagement:** Questionnaire completion rate, session duration, feature usage
- **Business Impact:** % converting to paid services, average revenue per user, customer lifetime value
- **Satisfaction:** NPS, customer satisfaction survey, feature requests
- **Integration:** HubSpot sync success rate, error rate, data quality

**Decision Needed:**
- Which metrics are most important?
- Measurement methodology
- Reporting frequency and dashboards
- Success thresholds and targets

**Impact:** Product roadmap prioritization, go-to-market refinement, success measurement

**Owner:** Cara Banchero / Matthew Bond

**Target Resolution:** By Phase 2 launch (April 2026)

---

#### Q8: How to Handle Compliance Constraints?

**Question:** What are specific compliance requirements and constraints for assessment data and advisor information?

**Context:**
- Financial services industry has regulatory constraints
- Assessment data may contain sensitive information
- Advisor profiles contain confidential firm information
- Privacy and confidentiality critical

**Considerations:**
- Data protection and security
- Consent and permissions
- Use case limitations
- Regulatory examination and review

**Decision Needed:**
- Data classification (public, internal, confidential)
- Access controls and RBAC
- Audit logging and compliance
- Consent and privacy disclosures

**Impact:** Feature design, data handling, user interface, compliance risk

**Owner:** Brian Church / Legal counsel

**Target Resolution:** By Phase 1 completion (February 2026)

---

### Technical & Integration

#### Q9: Exact HubSpot Environment Details

**Question:** What are the specific HubSpot environment setup, custom fields, and existing workflows?

**Context:**
- Cathedral integrates with HubSpot
- Need to understand existing environment
- Custom field mappings and workflows
- Data quality and migration

**Details Needed:**
- Existing HubSpot account structure (portals, teams)
- Current custom fields and properties
- Lead and contact record structure
- Existing workflows and automation
- Data quality assessment

**Impact:** Integration design, migration strategy, workflow design

**Owner:** Cara Banchero / Technical team

**Target Resolution:** By Phase 1 completion (February 2026)

---

#### Q10: Exact API Rate Limits & Capacity Planning

**Question:** What are the API rate limits and performance requirements for HubSpot, enrichment providers, and email services?

**Context:**
- Multiple integrations need capacity planning
- HubSpot API has rate limits
- Enrichment providers have usage limits
- Email services have delivery limits

**Details Needed:**
- HubSpot API rate limits and plans
- Enrichment provider limits and costs
- Email service capacity and costs
- Peak usage expectations
- Scaling requirements

**Impact:** System design, cost modeling, performance optimization

**Owner:** Shehryar Ahmed / Technical team

**Target Resolution:** By Phase 2 kick-off (February 2026)

---

### Market & Competition

#### Q11: Competitive Landscape & Differentiation

**Question:** Who are the direct and indirect competitors, and how should Cathedral position against them?

**Context:**
- Multiple players in advisor growth/M&A space
- Consultants, platforms, brokers, networks
- Need clear differentiation strategy

**Competitors to Analyze:**
- Traditional M&A brokers and consultants
- Advisor recruiting firms
- Platforms (Fentric, Orion, etc.)
- Custodian-provided tools and services

**Differentiation Strategy:**
- Evidence-based DNA assessment (unique)
- SageCrest 70-year credibility
- Consultant positioning vs. transactional vendor
- Integrated software + services
- Advisor community and ecosystem

**Impact:** Marketing messaging, pricing strategy, feature prioritization

**Owner:** Brian Church / Matthew Bond

**Target Resolution:** By Phase 2 launch (April 2026)

---

#### Q12: Market Sizing & Revenue Potential

**Question:** What is the total addressable market (TAM) and revenue potential for Cathedral Center?

**Context:**
- 300,000+ financial advisors in US
- Market segments: M&A, recruiting, organic growth, succession
- Various pricing models and revenue scenarios

**Sizing Approach:**
- # of advisory firms × average revenue per customer × years
- Different TAM for different growth scenarios
- Market penetration assumptions

**Impact:** Business planning, investment justification, growth strategy

**Owner:** Matthew Bond / Brian Church

**Target Resolution:** By Phase 2 launch (April 2026)

---

## Strategic Decision Framework

### For Resolving Open Questions

**Key Stakeholders:**

- **Matthew Bond (CEO):** Business strategy, revenue, market positioning
- **Brian Church (Chief Growth Officer/Product Owner):** Product strategy, assessment framework, market positioning
- **Cara Banchero (COO):** Operations, timeline, resources, compliance
- **Farid Kheloco (Purely Works CEO):** Technical execution, architecture, timeline

**Decision Process:**

1. **Identify Decision Type** — Strategic, product, technical, or operational
2. **Gather Information** — Research, data, stakeholder input
3. **Align Stakeholders** — Get buy-in from relevant parties
4. **Document Decision** — Update this document and communicate
5. **Set Timeline** — Establish target resolution date
6. **Track Progress** — Monitor and adjust as needed

---

## Alternate Strategic Paths

### Path A: Organic-First MVP

**Alternative:** Focus MVP on client upsell and referral lead identification instead of recruiting

**Rationale:**
- Larger market opportunity (all client prospects)
- More recurring engagement
- Less transactional, more advisory

**Tradeoffs:**
- Different data requirements (client data vs. advisor data)
- Different assessment framework (client suitability vs. advisor fit)
- Changes go-to-market strategy

**Timeline Impact:** 2-4 week shift to requirements; different data integrations

---

### Path B: Off-the-Shelf Tool Composition

**Alternative:** Use combination of Typeform (assessments), HubSpot (CRM), and manual analysis vs. custom build

**Rationale:**
- Faster to market
- Lower development cost
- Proven components

**Tradeoffs:**
- Less customization and integration
- No proprietary scoring algorithm
- Limited differentiation
- Manual process management

**Timeline Impact:** Could launch 4-6 weeks earlier; reduced development cost

---

### Path C: Big Bang Unified Platform

**Alternative:** Develop all five pillars at once instead of phased approach

**Rationale:**
- Comprehensive solution to market
- Single cohesive platform
- Maximum differentiation

**Tradeoffs:**
- 18-24 month development timeline
- Higher risk and cost
- Delayed revenue
- Scope creep and complexity

**Timeline Impact:** 12+ month delay vs. MVP-first approach

---

### Path D: Multi-Client SaaS from Start

**Alternative:** Build full multi-tenant SaaS for multiple clients in MVP instead of single-tenant

**Rationale:**
- Immediate market expansion
- Higher revenue potential
- Proven SaaS model

**Tradeoffs:**
- Multi-tenant complexity added to MVP
- Configuration and customization needs
- Higher support requirements
- Slower to market

**Timeline Impact:** 4-8 week delay; higher MVP cost

---

### Path E: Advanced AI/Enrichment-Heavy

**Alternative:** Integrate advanced NLP, ZoomInfo data, and AI-driven insights in MVP

**Rationale:**
- More sophisticated scoring
- Richer data and insights
- Tech differentiation

**Tradeoffs:**
- Higher cost (enrichment, API, processing)
- More complex development
- Data quality dependencies
- Potential regulatory/compliance issues

**Timeline Impact:** 6-8 week delay; higher ongoing costs

---

### Path F: Early Exit/Partnership

**Alternative:** Develop MVP, then pursue partnership or acquisition vs. building as independent platform

**Rationale:**
- Potentially higher valuation
- Reduced long-term execution risk
- Quicker realization of value

**Tradeoffs:**
- Loss of independence and control
- Potential dilution of strategy
- Partnership terms and constraints
- Changed roadmap and vision

**Timeline Impact:** No direct impact; affects long-term strategy

---

## Resolution Status

### By Target Dates

**By February 6, 2026 (Phase 1 Completion):**
- Q8: Compliance constraints
- Q9: HubSpot environment details
- Q10: API rate limits & capacity planning

**By February 20, 2026 (Phase 2 Kick-off):**
- Q4: Top assessment inputs
- Q5: Advisor matching functionality
- Q6: Report generation capabilities

**By April 1, 2026 (MVP Launch):**
- Q1: Enrichment integration
- Q2: Tier 3 pricing
- Q3: Enrichment pass-through pricing
- Q7: Success metrics & measurement

**By June 1, 2026 (Phase 2 Milestone):**
- Q11: Competitive differentiation
- Q12: Market sizing & TAM

---

## Document Maintenance

This document should be updated:
- **Weekly:** During active development phases
- **Monthly:** During slower phases
- **Upon Decision:** Immediately when questions are resolved
- **Upon Context Change:** When significant new information emerges

**Owner:** Brian Church / Farid Kheloco

---

*Last Updated: February 6, 2026*
