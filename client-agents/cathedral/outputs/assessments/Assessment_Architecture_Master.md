# Cathedral Center Assessment Architecture

## Master Reference Document

---

## Overview

Cathedral Center's MVP assessment suite consists of three comprehensive Tier 2 assessments designed to evaluate financial advisory firms across operational, strategic, and transitional dimensions. Each assessment uses a dual-response gap analysis methodology that measures both current state and desired future state, producing actionable SWOT-classified insights.

---

## Assessment Suite Summary

| Assessment | Questions | Dimensions | Purpose |
|---|---|---|---|
| **#1: Practice Gap Analysis** | 54 questions | 9 DNA categories | Evaluate firm alignment across operational, strategic, behavioral, and cultural dimensions |
| **#2: Succession & Exit Readiness** | 48 questions | 4 readiness dimensions | Measure firm preparedness for ownership transition |
| **#3: Growth Readiness** | 50 questions | 5 growth dimensions | Assess capacity and capability for organic and inorganic growth |
| **Total** | **152 questions** | **18 dimensions** | **Comprehensive firm evaluation** |

---

## Shared Methodology

### Response Scale (All Assessments)

All assessments use a consistent 5-point Likert scale:

* **1** = Not at all like our firm
* **2** = Not much like our firm
* **3** = Somewhat like our firm
* **4** = Mostly like our firm
* **5** = Exactly like our firm

### Dual-Response Format

Every question captures TWO responses:

* **Current State** ("Where You Are") — How accurately does this describe your firm today?
* **Desired State** ("Where You Want To Be") — How much do you want this to describe your firm?

### Gap Calculation

**Gap Score** = |Desired State - Current State| (absolute difference, range 0-4)

### Dimension Scoring

* **Alignment %** = (1 - Average Gap / 4) × 100
* **Readiness Score** = Average Current State / 5 × 100

### SWOT Classification Thresholds

| Alignment % | Classification | Interpretation |
|---|---|---|
| ≥ 90% | **STRENGTH** | Highly aligned, minimal gap |
| 75-89% | **OPPORTUNITY** | Well aligned with room for growth |
| 60-74% | **THREAT** | Meaningful gaps requiring attention |
| < 60% | **WEAKNESS** | Significant gaps indicating fundamental misalignment |

### 5-Variable Compatibility System (Two-Party Assessments)

When comparing responses from two parties:

| Gap Between Parties | Variable | Interpretation |
|---|---|---|
| 0 | Variable 1 | Perfect alignment |
| 1 | Variable 2 | Strong alignment with minor differences |
| 2 | Variable 3 | Moderate alignment requiring exploration |
| 3 | Variable 4 | Limited alignment requiring serious consideration |
| 4 | Variable 5 | Minimal alignment suggesting fundamental difference |

---

## Assessment #1: Practice Gap Analysis

### Purpose

Evaluates firm alignment across nine critical practice dimensions. Designed for both self-evaluation and two-party compatibility analysis (e.g., acquirer vs. target firm).

### 9 DNA Categories (6 questions each = 54 total)

1. **Financial Structure** — Revenue model, profitability, compensation, pricing, reserves, benchmarking
2. **Asset Management** — Investment philosophy, portfolio construction, values-based investing, research, process documentation
3. **Financial Planning** — Planning depth, behavioral finance, goals-based planning, advanced planning, cash flow, insurance
4. **Infrastructure** — Operational support, benefits, independence framework, outsourcing, onboarding, virtual capability
5. **Technology** — Tech stack integration, CRM, client portal, advisor tools, bidirectional data, investment strategy
6. **Strategy** — Strategic planning, branding, digital marketing, lead generation, succession, inorganic growth
7. **Culture** — Vision, entrepreneurship, communication, employee development, client impact, performance orientation
8. **Values** — Faith/purpose, work-life integration, community impact, coaching, diversity, relationships
9. **Behavioral Profile** — Driver orientation, analytical approach, collaborative culture, expressive energy, change orientation, management style

### Output

* 9 dimension scores with SWOT classification
* Overall Practice Alignment Score
* Overall Practice Readiness Score
* 36 SWOT narrative templates (4 per dimension)
* 45 variable response narratives (5 per dimension)

---

## Assessment #2: Succession & Exit Readiness

### Purpose

Evaluates firm preparedness for ownership transition across four succession readiness dimensions. Applicable to any transition pathway: internal succession, external acquisition, merger, or management buyout.

### 4 Readiness Dimensions (12 questions each = 48 total)

1. **Strategic Readiness** — Succession strategy documentation, values preservation, timeline, success criteria, market monitoring, post-exit vision, professional advisors, team communication, pathway evaluation, governance, culture statement, plan maintenance
2. **Financial Readiness** — Organic growth, valuation understanding, revenue diversification, fee optimization, financial hygiene, contract transferability, profit margins, liability documentation, deal structure literacy, retention data, financial reporting, tax optimization
3. **Continuity Readiness** — Successor identification, successor criteria, leadership development, relationship redundancy, process documentation, data organization, communication planning, compliance transferability, vendor relationships, team retention, emergency succession, institutional brand
4. **Operational Readiness** — Organizational structure, performance management, technology documentation, training programs, service standardization, risk assessment, KPI dashboards, workflow documentation, marketing systematization, environment professionalism, advisory board, self-assessment

### Readiness Tier Classification

| Score | Tier | Interpretation |
|---|---|---|
| 90-100 | Succession Ready | Well-prepared for ownership transition |
| 75-89 | Approaching Ready | Most elements in place with targeted gaps |
| 60-74 | In Development | Meaningful preparation still required |
| 40-59 | Early Stage | Substantial planning work needed |
| < 40 | Not Ready | Foundational planning has not yet begun |

### Output

* 4 dimension scores with SWOT classification
* Overall Readiness Score and Tier
* 16 SWOT narrative templates (4 per dimension)

---

## Assessment #3: Growth Readiness

### Purpose

Evaluates firm capacity and capability for executing growth strategies across five growth dimensions covering organic acquisition, M&A capability, operational scalability, digital marketing, and strategic vision.

### 5 Growth Dimensions (10 questions each = 50 total)

1. **Organic Growth Engine** — Client acquisition strategy, COI networks, retention metrics, upsell processes, referral culture, client selection criteria, satisfaction measurement, ideal client profile, thought leadership, growth metric tracking
2. **Inorganic Growth Capability** — Acquisition criteria, financial capacity, M&A expertise, integration playbook, deal pipeline, management capacity, infrastructure scalability, cultural assessment, market intelligence, post-acquisition measurement
3. **Scalability & Capacity** — Service model scalability, bottleneck management, technology headroom, talent pipeline, compliance scalability, process standardization, physical/virtual infrastructure, financial modeling, leadership bandwidth, flexible partnerships
4. **Digital & Marketing Readiness** — Website quality, content creation, social media presence, marketing automation, performance metrics, brand consistency, SEO/visibility, digital prospect experience, marketing discipline, social proof
5. **Strategic Growth Vision** — Growth targets, market focus, growth pathway balance, competitive positioning, compensation alignment, strategic partnerships, service innovation, client journey optimization, innovation investment, growth accountability

### Growth Readiness Tier Classification

| Score | Tier | Interpretation |
|---|---|---|
| 90-100 | Growth Accelerator | Positioned for aggressive growth execution |
| 75-89 | Growth Ready | Strong foundations with targeted gaps |
| 60-74 | Growth Building | Active development with investment needed |
| 40-59 | Growth Emerging | Early-stage infrastructure requiring development |
| < 40 | Pre-Growth | Foundational capabilities need to be established |

### Output

* 5 dimension scores with SWOT classification
* Overall Growth Readiness Score and Tier
* 20 SWOT narrative templates (4 per dimension)

---

## Technical Implementation Notes

### For Development Team

* All assessments use identical response scales and scoring formulas — build once, apply to all
* SWOT narrative selection is driven by dimension Alignment % threshold
* Variable response selection (for compatibility) is driven by gap value between two parties
* Each assessment workbook contains: Questions sheet, Scoring Engine sheet, SWOT Narratives sheet, and Instructions sheet
* Assessment #1 also includes Response Variables sheet for two-party compatibility narratives
* All formulas are live Excel formulas — verify with recalculation
* Blue-colored input cells indicate user-entry fields
* Yellow-highlighted cells contain automated calculations

### Database Schema Considerations

* 152 total questions across 18 dimensions
* Each question stores: category, code, statement text, context text
* Each response stores: current_state (1-5), desired_state (1-5), gap (calculated)
* Each dimension stores: avg_current, avg_desired, avg_gap, alignment_pct, readiness_score, swot_class
* SWOT narratives are lookup tables keyed by (assessment, dimension, swot_class)
* Variable narratives are lookup tables keyed by (assessment, dimension, gap_value)

### AI Integration Points

* SWOT narratives serve as base templates that AI can personalize with specific response data
* Variable narratives provide compatibility-specific feedback for two-party assessments
* Assessment results feed into DNA scoring system across the five DNA dimensions
* Scoring thresholds and narrative templates are designed for AI enhancement, not replacement

---

## File Inventory

| File | Type | Contents |
|---|---|---|
| Assessment_1_Practice_Gap_Analysis.xlsx | Excel | 54 questions, scoring engine, SWOT narratives, variable narratives, instructions |
| Assessment_2_Succession_Exit_Readiness.xlsx | Excel | 48 questions, scoring engine, SWOT narratives, instructions |
| Assessment_3_Growth_Readiness.xlsx | Excel | 50 questions, scoring engine, SWOT narratives, instructions |
| Assessment_Architecture_Master.md | Markdown | This document — master reference for all assessments |

---

*Created: February 10, 2026*
*Version: 1.0*
*Total Assessment Questions: 152*
*Total SWOT Narratives: 72*
*Total Variable Narratives: 45*
