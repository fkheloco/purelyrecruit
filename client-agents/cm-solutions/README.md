# CM Solutions Client Agent - System Documentation

## Overview

This directory contains the complete operational framework for the CM Solutions (CMS) client agent—an AI-powered system designed to enhance proposal development, recruitment processes, sales enablement, and project documentation for CM Solutions.

**Client:** CM Solutions
**Headquarters:** 114 W. Colorado Blvd, Monrovia, CA 91016
**Website:** thecmsolution.com
**Phone:** 626.639.2813
**Engagement Start:** November 18, 2025
**MSA Executed:** February 2026 with CEO Robyn Coates

---

## What This System Does

The CM Solutions agent supports:

1. **Proposal Development** — Generate customized, professional proposals for construction management and project controls projects
2. **Recruitment Support** — Create job descriptions, recruiting communications, and candidate materials aligned with CMS values
3. **Sales Enablement** — Develop case studies, value propositions, and sales collateral emphasizing diversity and expertise
4. **Project Documentation** — Create scheduling, cost control, and risk management templates and procedures
5. **Salesforce Support** — Assist with CRM activities, opportunity documentation, and pipeline management
6. **LEAD Initiatives** — Support leadership development and diversity advancement programs

---

## Directory Structure

```
cm-solutions/
├── Claude.md                              # Main agent training & instructions
├── README.md                              # This file
├── brand/                                 # Brand assets & guidelines
│   ├── README.md                          # Brand system overview
│   ├── colors/                            # Color palette (TBD)
│   ├── logos/                             # Logo files (TBD)
│   ├── fonts/                             # Font specifications (TBD)
│   ├── templates/                         # Design templates
│   │   ├── email/                         # Email templates
│   │   ├── proposal/                      # Proposal templates
│   │   ├── presentation/                  # Presentation templates
│   │   └── document/                      # Document templates
│   └── guidelines/
│       └── voice-and-tone.md              # Communication style guide
├── knowledge-base/                        # Core reference materials
│   ├── company/
│   │   ├── company-overview.md            # Company details, mission, history
│   │   ├── leadership-team.md             # Executive bios & contact info
│   │   └── products-services.md           # Complete service catalog
│   ├── sales/
│   │   ├── value-propositions.md          # Competitive advantages, WBE positioning
│   │   └── README.md                      # Sales resources index
│   ├── clients/
│   │   ├── ideal-customer-profile.md      # Target client definition
│   │   ├── project-types.md               # Project categories & descriptions
│   │   └── case-studies/                  # (TBD) Client success stories
│   └── processes/
│       ├── proposal-process.md            # Proposal workflow & AI automation
│       ├── recruitment-process.md         # Recruiting & staff augmentation
│       └── README.md                      # Process documentation index
├── training-files/
│   ├── README.md                          # Continuous learning instructions
│   └── previous-training/                 # (TBD) Archived training materials
└── outputs/
    ├── proposals/                         # Generated proposal documents
    ├── reports/                           # Analysis and reporting outputs
    └── presentations/                     # Generated presentation files
```

---

## How to Use This System

### For Proposal Development

1. **Reference:** `/knowledge-base/company/products-services.md` and `/knowledge-base/sales/value-propositions.md`
2. **Template:** Use `/brand/templates/proposal/` as starting point
3. **Output:** Save final proposals to `/outputs/proposals/`
4. **Quality Check:** Ensure brand consistency, accuracy, and client customization

### For Recruitment Support

1. **Reference:** `/knowledge-base/company/leadership-team.md` and `/knowledge-base/processes/recruitment-process.md`
2. **Style Guide:** Follow `/brand/guidelines/voice-and-tone.md`
3. **Content:** Emphasize diversity, culture, and career development
4. **Review:** Coordinate with Joe Schlegel (VP Talent Acquisition)

### For Sales Materials

1. **Reference:** `/knowledge-base/sales/value-propositions.md`
2. **Research:** Check `/knowledge-base/clients/project-types.md` for relevant experience
3. **Positioning:** Always highlight WBE/DBE certifications and diverse workforce
4. **Approval:** Coordinate with David Hirsch (Proposal Manager) or Robyn Coates (CEO)

### For Project Documentation

1. **Reference:** `/knowledge-base/processes/` for workflows
2. **Expertise:** Leverage Robyn Coates' scheduling methodology (PSP, PE)
3. **Standards:** Follow CM Solutions' proven processes and best practices
4. **Output:** Save templates to `/outputs/reports/` for future use

---

## Key Information at a Glance

### Company Profile

- **Founded:** 2001-2002
- **Size:** 51-200 employees
- **Certifications:** WBE, SBE, DBE
- **Distinctive Feature:** 40%+ women staff (4x industry average)
- **Tagline:** "People • Process • Tools • Solutions"

### Leadership Contacts

| Name | Title | Email | Phone |
|------|-------|-------|-------|
| Robyn Coates | President & CEO | robyn@thecmsolution.com | 626.639.2813 |
| Dylan Hirsch | VP Project Controls | dylanhirsch@thecmsolution.com | — |
| David Hirsch | Proposal Manager & AI Implementation | davidhirsch@thecmsolution.com | 301.801.3264 |
| Joe Schlegel | VP Talent Acquisition | joeschlegel@thecmsolution.com | 909.518.9850 |
| Kristen Badar | Senior Client Contracts Admin | kbadar@thecmsolution.com | 626.498.3728 |
| Mike Webb | VP Construction Services | mikewebb@thecmsolution.com | — |
| Jessica Holiday | Senior Consultant-Scheduler | jessicaholiday@thecmsolution.com | — |

### Core Services

- Project Controls (scheduling, cost management, risk mitigation)
- Project Scheduling (PSP-certified expertise)
- Cost Controls & Budget Management
- Construction Claims Management
- Program & Project Management
- Staff Augmentation

### Industries & Project Types

Facilities, Oil & Gas, Energy, Transportation, Water/Wastewater, Data Centers, Healthcare, Correctional, Education

### Purely Works Partnership

- **Account Owner:** Farid Kheloco
- **Services:** AI consulting, proposal automation, recruitment enhancement, AI toolbox
- **Key Initiatives:** Mammoth Recruiting Solution, Proposal Bot Training (LOSSAN, SDG&E), AI Toolbox
- **Payment:** Invoice at start, 15-day window, prefer ACH
- **Liaison:** David Hirsch (AI Implementation)

---

## Using the Agent

### Direct Prompt Examples

```
"Create a proposal for a $5M water infrastructure project with scheduling, cost controls, and claims prevention focus."

"Draft a job description for a Senior Scheduler emphasizing our women-owned certification and diversity."

"Develop a case study showing how our scheduling expertise prevented a 6-month delay on a transportation project."

"Generate a cost control procedure template for a healthcare facility project."

"Create sales talking points for a meeting with a prime contractor looking for diverse vendors."
```

### Guidance Prompts

```
"What are our top competitive differentiators as a women-owned PM firm?"

"What project types has CM Solutions had the most success with historically?"

"Summarize Robyn Coates' background and why she's an industry authority."

"What does the Mammoth Recruiting Solution project entail?"
```

---

## Quality Standards

All output from this agent should meet these standards:

- **Accurate:** All facts verified against knowledge base; uncertainties flagged
- **Professional:** Polished writing, proper grammar, brand-compliant formatting
- **Customized:** No generic templates; all content tailored to specific client/context
- **Compliant:** Respects contracts, certifications, and legal requirements
- **Complete:** Thorough, detailed content without placeholders
- **Branded:** Uses "People • Process • Tools • Solutions" framework and consistent tone
- **Strategic:** Emphasizes WBE/DBE advantage, diversity, and expertise

---

## Sources & References

### Primary Research Sources

1. **Company Website:** thecmsolution.com
2. **Leadership Information:** Direct contact bios and backgrounds
3. **Service Descriptions:** CM Solutions marketing materials and past proposals
4. **Purely Works Engagement:** MSA and engagement documentation
5. **Industry Research:** Construction management, project controls, and diversity trends

### Key Documents to Reference

- `/knowledge-base/company/company-overview.md` — Full company background
- `/knowledge-base/company/leadership-team.md` — Detailed leader bios
- `/knowledge-base/company/products-services.md` — Complete service offerings
- `/knowledge-base/sales/value-propositions.md` — Competitive positioning
- `/knowledge-base/clients/project-types.md` — Industry experience
- `Claude.md` — Core agent instructions

---

## Training & Development

This system uses continuous learning. New materials should be added to:

- `/training-files/previous-training/` — Archive of completed training sessions
- Knowledge base updates as CM Solutions evolves service offerings or market positioning

See `/training-files/README.md` for continuous learning protocols.

---

## Support & Escalation

### When to Escalate

- Unusual client requests requiring CEO approval
- Contract or legal interpretation questions
- Strategic direction decisions
- High-stakes proposal opportunities (>$500K)
- Sensitive HR or diversity initiatives

### Escalation Contacts

| Situation | Contact | Email |
|-----------|---------|-------|
| Strategic/Client Issues | Robyn Coates (CEO) | robyn@thecmsolution.com |
| Proposals & Innovation | David Hirsch | davidhirsch@thecmsolution.com |
| Recruitment | Joe Schlegel | joeschlegel@thecmsolution.com |
| Contracts & Compliance | Kristen Badar | kbadar@thecmsolution.com |
| Purely Works Coordination | Farid Kheloco | (via Purely Works) |

---

## Notes for Agent Operators

1. **Diversity is a Competitive Advantage:** Always lead with WBE/DBE positioning. 40%+ women staff is 4x the construction industry average.

2. **Robyn Coates is an Industry Authority:** Her PE, PSP credentials and 20+ years of scheduling expertise are major differentiators. Reference her leadership prominently.

3. **"People • Process • Tools • Solutions" is the Brand Philosophy:** Weave this into all materials, not just as a tagline.

4. **Scheduling Excellence is Core:** Jessica Holiday and the team's PSP certifications are world-class. Lead with this in technical proposals.

5. **Flexibility & Scalability Matter:** Staff augmentation is a growing service area. Emphasize ability to scale teams and programs.

6. **Client Relationships are Key:** CM Solutions has long-term client relationships (LOSSAN, SDG&E). Reference these in relevant contexts.

7. **Purely Works is a Strategic Partner:** David Hirsch's transition to AI Implementation signals this is a growth area. Support his vision.

---

## Document Version & Maintenance

**Last Updated:** February 2026
**Maintained By:** Purely Works - CM Solutions Partnership
**Review Cycle:** Quarterly or as needed with major changes
**Next Review:** May 2026

For updates, contact Farid Kheloco (Purely Works Account Owner) or David Hirsch (CM Solutions AI Implementation Lead).

