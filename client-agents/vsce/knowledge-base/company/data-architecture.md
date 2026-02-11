# VSCE, Inc. - ProjectMark Data Architecture & Model Documentation

## Overview

ProjectMark is VSCE's CRM and project management system. This document provides comprehensive documentation of the three primary data sets, their fields, relationships, and usage within the VSCE organization.

---

## Data Set 1: Opportunities / Projects / Proposals

### Primary Fields

#### Identification & Classification
- **Opportunity ID:** Unique system identifier
- **RFP Title/Name:** Client-facing project or contract name
- **Description:** Summary of scope and objectives
- **Type:** Dropdown selection
  - Opportunity (RFP not yet released)
  - Active RFP (Released, response in progress)
  - Proposal (Response submitted)
  - Award (Contract awarded)
  - Project (Contract active, project executing)
- **Subtype:** Additional classification
  - Construction Management
  - Program Management
  - Capital Program Analysis
  - RFP Management
  - Project Management
  - Staff Augmentation
  - Proposal Development Services
  - Strategic Advisory

#### Client Information
- **Client Agency:** Link to Companies data set
- **Client Contact:** Primary contact person
- **Contact Email:** Contact email address
- **Contact Phone:** Contact phone number
- **Project Manager (Client):** Client-side project lead
- **Procurement Officer:** If applicable for RFP

#### Financial Tracking
- **Original Budget:** Initial estimated project/contract value
- **Current Budget:** Current estimated value (after changes)
- **Projected Revenue:** Expected VSCE revenue from engagement
- **Estimated Margin:** Projected profit margin percentage
- **Projected Profit:** Estimated profit dollars
- **Cost of Delivery:** Estimated staffing and delivery costs
- **Status:** Budget tracking status
  - On-Track
  - At-Risk
  - Over-Budget
  - Complete

#### Timeline & Deadlines
- **RFP Release Date:** When opportunity became known
- **Proposal Deadline:** Submission deadline for RFP
- **Award Date:** Estimated/actual award date
- **Project Start Date:** Contract effective date
- **Project End Date:** Contract completion date
- **Duration (Months):** Calculated field

#### Strategic Information
- **Service Category:** Primary service line
- **Geographic Region:** Service delivery region
- **Strategic Importance:** Dropdown
  - Strategic Priority (Executive focus)
  - Important (Core pursuit)
  - Opportunistic (Selective pursuit)
  - Competitive Intel (Track only)
- **Win Probability:** Percentage estimate (0-100%)
- **Go/No-Go Status:**
  - Go
  - No-Go
  - Under Review
- **Decision Date:** When go/no-go decision made
- **Decision Owner:** Who made the decision

#### Team Assignment
- **Proposal Lead:** Ivan Ramirez or designee
- **Technical Lead:** Provi Rodriguez or subject matter expert
- **Design/Graphics:** Umair Khalid
- **BD Owner:** Allen Wong
- **Executive Sponsor:** Jesús Vargas or Regional President
- **Project Manager (VSCE):** Assigned PM for execution
- **Team Members:** Multi-select list of assigned staff

#### Competitive Information
- **Primary Competitors:** Free text or linked to Competitor records
- **Competitive Strengths:** How VSCE differentiates
- **Competitive Threats:** Competitor advantages
- **Win Themes:** Key messages for proposal
- **Competitive Win Probability:** Assessment vs. competitors

#### Documentation & Artifacts
- **RFP Document:** Attachment field
- **RFP Analysis Report:** Internal document link
- **Proposal Strategy:** Document attachment
- **Draft Proposal:** Most recent version
- **Final Proposal:** Submitted document
- **Submission Confirmation:** Email/receipt confirmation
- **Award Letter:** If awarded
- **Contract Document:** Signed contract

#### Historical & Outcome Data
- **Response Status:**
  - In Development
  - Ready for Review
  - Under Review
  - Submitted
  - Awarded
  - Not Awarded
  - Withdrawn
- **Actual Award Date:** When award confirmed
- **Awarded To (if not VSCE):** Competitor name if lost
- **Loss Reason:** If not awarded
  - Price
  - Technical approach
  - Team/experience
  - Competitor advantage
  - Client requirements changed
  - Other (describe)
- **Post-Award Lessons Learned:** Notes on what worked/didn't work
- **Case Study Status:** Whether developed into case study

#### Tracking Fields
- **Date Created:** System auto-populated
- **Created By:** User who created record
- **Date Last Modified:** System auto-populated
- **Last Modified By:** User who last updated
- **Owner:** Primary record owner (usually BD or PM)

---

## Data Set 2: Contacts & Companies

### Companies Fields

#### Basic Information
- **Company Name:** Legal/registered company name
- **Doing Business As (DBA):** Trade names if applicable
- **Company Type:** Dropdown
  - Client Agency (Transportation/Government)
  - Competitor
  - Partner/Subconsultant
  - Vendor/Supplier
  - Internal (VSCE)
- **Industry:** Primary industry classification
- **Subindustry:** Detailed classification (Transit, Highway, Port, etc.)

#### Location & Contact Information
- **Headquarters Address:** Street, city, state, ZIP
- **Service Region:** Geographic area served
- **Phone Number:** Main company phone
- **Website:** Company website URL
- **Email:** Main email address

#### Government Agency Specific
- **Government Level:** City, County, State, Federal
- **Agency Type:** Transportation, Transit, Port, Airport, Utility, etc.
- **Procurement Officer:** Name and contact info
- **Budget Cycle:** Annual, fiscal year, etc.
- **Capital Program:** Link to capital improvement plans
- **Certifications Required:** DBE, MBE, SBE, etc.
- **Small Business Preferences:** Scoring bonus or set-aside
- **Prevailing Wage Requirements:** Yes/No
- **Labor Compliance:** Apprenticeship, prevailing wage, etc.

#### Financial Information
- **Annual Budget (if public sector):** Total agency budget
- **Capital Program Budget:** Annual capital spending
- **Recent Awards to VSCE:** List of recent contract awards
- **Total Value of VSCE Work:** Cumulative contract value
- **Estimated Annual Opportunity:** Projected annual RFP value from this client

#### Relationship Information
- **Account Manager:** VSCE contact person
- **Relationship Status:** Dropdown
  - Active (Regular business)
  - Strategic Partner (Multi-year engagement)
  - Growing (Expansion focus)
  - Dormant (No recent activity)
  - Closed (No longer pursuing)
- **Years of Relationship:** Calculated
- **Number of Projects:** Count of associated opportunities
- **Last Contact Date:** Last interaction with client
- **Next Planned Contact:** Scheduled follow-up date

#### Intelligence & Notes
- **Key Contacts:** Multi-select of Contact records
- **Competitive Landscape:** Other firms winning their RFPs
- **Strategic Notes:** Internal observations about agency
- **Procurement Patterns:** Timing, frequency, typical contract values
- **Political Environment:** Board dynamics, leadership changes
- **Decision Factors:** What's important to this client

#### Certifications & Compliance
- **Certified DBE?: ** Yes/No
- **Certified SBE:** Yes/No
- **Certified MBE:** Yes/No
- **Other Certifications:** Free text field
- **Certification Valid Until:** Expiration date

#### Historical Performance
- **Total Win Rate:** Percentage of proposals won (calculated)
- **Recent Wins:** Last 5 wins listed
- **Recent Losses:** Last 5 losses listed
- **Preferred Team:** Staff most valued by this client
- **Known Issues/Risks:** Past problems or friction points

### Contacts Fields (Individual People)

#### Identification
- **First Name:** Contact first name
- **Last Name:** Contact last name
- **Title:** Job title or position
- **Email:** Work email address
- **Phone:** Work phone number
- **Mobile:** Personal mobile number (if provided)
- **Company:** Link to Companies record

#### Role & Authority
- **Role:** Dropdown classification
  - Decision Maker
  - Procurement Officer
  - Project Manager
  - Budget Authority
  - Influencer
  - Gatekeeper
  - Other
- **Decision Authority:** Level of authority for RFP/contract decisions
- **Reporting To:** Their supervisor (if known)
- **Budget Control:** Estimated annual budget controlled

#### Communication Preferences
- **Preferred Contact Method:** Email, phone, meeting, etc.
- **Best Time to Contact:** Morning, afternoon, specific days
- **Communication Frequency Preference:** How often contact

#### Relationship History
- **Date Last Contacted:** Most recent interaction
- **Interaction Type:** Meeting, email, phone, other
- **Notes from Last Contact:** Key points discussed
- **Known Interests:** Project types, service areas
- **Relationships to Other Contacts:** Internal connections within client

#### Personal Information (if shared)
- **LinkedIn Profile:** URL link
- **Background:** Previous employers, experience
- **Certifications/Credentials:** Professional qualifications
- **Interests:** Outside work interests (if known)

#### Intelligence
- **Influence Level:** How much they influence decisions
- **Likelihood to Recommend VSCE:** High, Medium, Low
- **Known Issues:** Personality quirks, sensitivities
- **Key Motivators:** What's important to this person
- **Competition Awareness:** Who they prefer, relationships with other firms

---

## Data Set 3: Team Member Profiles

### Information Section

#### Basic Profile
- **Full Name:** Employee full legal name
- **VSCE Title:** Current position (CEO, VP PM, Senior Engineer, etc.)
- **Department:** Business Development, Operations, Delivery, etc.
- **Reports To:** Direct manager
- **Office Location:** Primary work location
- **Status:** Active, Inactive, On-Leave, Contractor
- **Employment Type:** Full-time, Part-time, Contract, Subcontractor
- **Start Date:** VSCE employment start date
- **Photo/Headshot:** Professional headshot for proposals/website

#### Contact Information
- **VSCE Email:** Company email address
- **VSCE Phone:** Office phone extension
- **Cell Phone:** Mobile number (if for client work)
- **VSCE Office Address:** Office location details

### Social Section

#### Professional Networks
- **LinkedIn Profile:** URL link
- **Twitter/X Profile:** If maintaining professional presence
- **Professional Bio Link:** Website bio page

#### Social Presence
- **Industry Association Memberships:** APTA, ASCE, TRB, etc.
- **Speaking Engagements:** Conferences, panels, etc.
- **Publications:** Journal articles, whitepapers, books authored
- **Social Media Profiles:** Professional accounts (if public)

### Education Section

#### Degree Credentials
- **College/University 1:** School name
- **Degree 1:** BA, BS, MA, MS, PhD
- **Major/Discipline 1:** Field of study
- **Graduation Year 1:** Year completed
- **College/University 2:** Additional degree
- **Degree 2:** Type
- **Major/Discipline 2:** Field of study
- **Graduation Year 2:** Year completed
- **Continuing Education:** Courses, certifications in progress

#### Academic Honors
- **Honors/Recognition:** Dean's list, scholarships, etc.
- **GPA (if notable):** Grade point average

### Credentials Section

#### Professional Licenses & Certifications
- **PE (Professional Engineer):** State, license number, status
  - State:
  - License #:
  - Issue Date:
  - Renewal Date:
- **RA (Registered Architect):** License details
- **PMP (Project Management Professional):** PMI certification
  - Certification ID:
  - Expiration:
- **Other Certifications:** CPM, ASPE, other
- **Small Business Certifications:** DBE, MBE, SBE (if applicable)

#### Language Skills
- **Languages Spoken:** List with proficiency level
  - Spanish (Fluent, Intermediate, Basic)
  - Vietnamese (Fluent, Intermediate, Basic)
  - Other languages

#### Specialized Training
- **Safety Training:** OSHA, site safety, etc.
- **Compliance Training:** Federal contractor compliance, prevailing wage
- **Technical Training:** Software skills, specialized tools

### Career Section

#### Career History
- **Previous Employer 1:** Company name
  - Title:
  - Years:
  - Key Accomplishments:
- **Previous Employer 2:** Company name
- **Previous Employer 3:** Company name
- **Total Years of Experience:** Calculated from education and history
- **Career Path Summary:** Brief narrative of career progression

#### Relevant Experience
- **Experience with Client Agencies:** BART (8 years), VTA (5 years), etc.
- **Experience with Project Types:** Transit, Highway, Port, Water, etc.
- **Geographic Expertise:** Bay Area, Southern California, Central Valley
- **Service Line Expertise:** Construction Management, Program Management, etc.
- **Government Agency Experience:** Years in public sector roles

### Awards & Recognition Section

#### Professional Awards
- **Industry Recognition:** Awards and honors received
  - APTA awards
  - Professional recognition
  - Industry publications
- **Internal Recognition:** VSCE awards or recognition
- **Client Commendations:** Positive feedback from clients

### Publications Section

#### Written Work
- **Publications List:** Articles, papers, white papers
  - Title:
  - Publisher/Journal:
  - Date:
  - Topic:
- **Speaking Engagements:** Conferences and panel discussions
  - Event:
  - Date:
  - Topic:
  - Audience:

### Projects Section

#### Notable Projects
- **Project 1:** Link to Opportunities/Projects record
  - Role:
  - Budget:
  - Duration:
  - Key Contribution:
- **Project 2:** Link to project record
- **Project 3:** Link to project record
- Up to 10-12 key projects listed

#### Team Composition Records
- **Current Assignments:** Active projects/clients
- **Past Assignments:** Historical project involvement
- **Lead Roles:** Projects where member served as lead

### Staffing & Capacity Fields

#### Availability & Utilization
- **Full-Time Equivalent (FTE):** Percentage available for billable work
- **Billable Hours/Year:** Target billable hours
- **Utilization Rate:** Actual hours billed / available hours
- **Current Utilization:** Real-time status (%, hours)
- **Capacity Status:** Full, Available, Overallocated

#### Salary & Compensation (Internal Only)
- **Salary Bracket:** Low, Medium, High (no actual amounts stored)
- **Billable Rate:** Standard hourly rate for clients
- **Cost to Company:** For project margin calculation
- **Bonus Structure:** If applicable

#### Performance Metrics
- **Proposal Contributions:** Number of proposals written/reviewed
- **Proposal Win Rate:** Percentage of proposals with this team member that won
- **Client Satisfaction Rating:** Average from project feedback
- **Utilization Trend:** 3-month, 6-month trends
- **Billable Hours YTD:** Year-to-date hours charged

---

## Data Relationships & Integrity Rules

### Primary Relationships

#### Opportunity ← Companies (Client Agency)
- One opportunity links to one client company
- Multiple opportunities can link to same company
- Essential field (cannot be null)

#### Opportunity ← Contacts (Client Contact)
- One opportunity links to one primary contact
- Contacts must belong to linked company
- Used for proposal submission and follow-up

#### Opportunity ← Team Members
- One opportunity links to multiple team members
- Team members linked through RACI matrix
- Proposal Lead, Technical Lead, etc. specifically defined

#### Companies ← Contacts
- One company has multiple contacts
- Each contact belongs to one company
- Contacts provide communication and relationship tracking

#### Team Members ← Opportunities
- Team member can be assigned to multiple opportunities
- Capacity planning based on assignments
- Utilization tracking across projects

### Referential Integrity Rules

1. **Opportunity must have Client Agency (required)**
   - RFP cannot be created without company selection
   - If company deleted, all related opportunities deleted

2. **Team Member assignment must be active VSCE employee**
   - Cannot assign inactive team members to opportunities
   - Proposal lead and technical lead required fields

3. **Contacts must belong to assigned Company**
   - System validates contact company matches opportunity company
   - Prevents orphaned contact relationships

4. **Financial fields must be consistent**
   - Current budget >= Original budget OR documented increase
   - Projected profit = (Projected revenue - Cost of delivery)
   - Margin % = Projected profit / Projected revenue

### Data Quality Standards

#### Opportunity Records
- All required fields populated before go/no-go decision
- Updated weekly during proposal development
- Final update required before submission
- Post-award closure documenting outcome

#### Contact Records
- Email and phone required for active contacts
- Last contact date updated after each interaction
- At least one primary contact per active company

#### Team Member Records
- Current employment status maintained
- Certifications updated annually
- Availability/utilization updated monthly
- Photo and complete profile for proposal inclusion

---

## Financial Data Fields (Detailed)

### Budget Tracking
- **Original Budget:** Estimated at RFP go/no-go decision
- **Current Budget:** Updated as scope changes
- **Budget Change Log:** Historical tracking of changes and reasons

### Revenue Projections
- **Projected Revenue:** Expected VSCE fee/contract value
- **Actual Revenue (if awarded):** Confirmed contract value
- **Change Orders (if awarded):** Additional work and revenue

### Cost Structure
- **Cost of Delivery:** Estimated labor costs to deliver
  - Proposal lead hours × rate
  - Technical lead hours × rate
  - Team member hours × rate
  - Subcontractor costs
  - Other direct costs
- **Overhead Allocation:** Corporate overhead applied
- **Total Cost of Delivery:** Sum of above

### Margin & Profit
- **Gross Margin %:** (Revenue - Direct Costs) / Revenue
- **Projected Profit:** Revenue - Total Cost
- **Margin $ Amount:** Dollar amount of projected profit
- **Margin Status:** On-track, at-risk, etc.

---

## Reporting & Analytics

### Standard Reports
1. **Pipeline Report:** Active opportunities by stage and value
2. **Win/Loss Analysis:** Proposal outcomes and trends
3. **Client Revenue Summary:** Revenue by client, region, service type
4. **Team Utilization:** Hours billed, utilization rates, capacity
5. **Margin Analysis:** Project profitability and trends
6. **Competitive Analysis:** Win rate vs. specific competitors
7. **Certification Tracking:** DBE/MBE/SBE certifications and expiration

### Dashboards
- **Executive Dashboard:** Pipeline, win rate, margin trends
- **BD Dashboard:** Opportunity pipeline, go/no-go decisions, competitive analysis
- **Project Dashboard:** Active projects, team utilization, financials
- **CRM Dashboard:** Contact activity, relationship tracking, follow-up tasks

---

**Document Version:** 1.0
**Last Updated:** February 2025
**Maintained By:** Allen Wong (CRM Owner), IT/Operations Team
**Next Review:** Quarterly or upon system updates

