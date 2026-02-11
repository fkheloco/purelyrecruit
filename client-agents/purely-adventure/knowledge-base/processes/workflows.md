# Purely Adventure — Processes & Workflows

## Daily Content Workflow

### Automated Pipeline (AI-Driven)

**Step 1: RSS Scanning (Automated — 6 AM)**
* AI agent scans 50-100+ RSS feeds from adventure, overlanding, boating, and travel sources
* Sources include: Overland Journal, Expedition Portal, Cruising World, Sail Magazine, adventure blogs, gear manufacturer newsrooms, travel publications

**Step 2: Clustering & Summarization (Automated)**
* AI clusters stories by category: Land, Sea, Air, Travel
* AI generates unique summaries — never copy-paste, always original rewriting
* AI identifies affiliate link opportunities in product mentions
* AI flags stories as family-friendly or general

**Step 3: Content Generation (Automated)**
* AI compiles daily digest per category with:
  * Lead story
  * News roundup (3-5 stories)
  * Product spotlight
  * Community pick (when available)
  * Sponsor message (when applicable)
* AI generates platform-specific versions:
  * Website/blog post (.MD format)
  * Email newsletter digest
  * Social media posts (Reddit, YouTube Community, Instagram captions)
  * Short-form video scripts (YouTube Shorts, Instagram Reels)

**Step 4: Founder Review (Manual — 30 min)**
* Review flagged items and AI-generated content
* Approve or edit as needed
* Quality check on affiliate links and sponsor placements

**Step 5: Publishing (Automated)**
* Website content publishes on schedule
* Email digest sends (7 AM target)
* Social media posts scheduled throughout the day
* Cross-platform distribution automated via scheduling tools

## Publishing System

### Markdown-to-Publish Pipeline

The core workflow:
1. Content created as **.MD (Markdown) files**
2. .MD files dropped into the publishing pipeline
3. Agent handles:
   * Formatting for website CMS
   * Image sourcing and placement
   * Affiliate link insertion
   * SEO metadata generation
   * Category tagging and family-friendly flagging
   * Social media post generation
   * Email newsletter inclusion
4. Content publishes automatically

### Content Management

* **Editorial Calendar:** Managed by AI agent with founder oversight
* **Content Queue:** Stories queued 24-48 hours ahead when possible
* **Evergreen Content:** Gear reviews, destination guides, and how-to content on a recurring refresh schedule
* **Seasonal Content:** Pre-planned seasonal roundups (summer camping, winter sailing, etc.)

## Quality Control Process

* AI generates content → automated quality checks (grammar, tone, accuracy flags)
* Founder reviews daily output (30-minute morning review)
* Affiliate links verified for accuracy and relevance
* Sponsored content clearly labeled
* Community content moderated before publishing

## Tools Stack

### Content & Automation
* **RSS Aggregation:** Feedly or RSS.app
* **Workflow Automation:** Zapier or Make.com
* **AI Content Generation:** Claude API (primary) with custom prompts
* **Publishing:** WordPress or custom CMS with Markdown support

### Social Media
* **Reddit:** PRAW (Python library) or IFTTT for automated posting
* **YouTube:** YouTube API via Zapier (Shorts + Community tab)
* **Instagram:** SocialPilot or Publer for scheduling
* **Email:** Beehiiv or EmailOctopus for newsletter management

### Video (AI-Generated)
* **Shorts/Reels:** Synthesia or Descript for automated video from text
* **Thumbnails:** AI-generated via Canva API or similar

### Analytics & Monitoring
* Google Analytics (traffic)
* Google Search Console (SEO)
* Affiliate dashboard tracking
* Ad network reporting
* Social media analytics per platform

## Estimated Monthly Costs

* RSS tools: $10-30/month
* Automation (Zapier/Make): $20-50/month
* AI API usage (Claude/GPT): $30-100/month
* Social scheduling tools: $20-50/month
* Email platform: $0-30/month (free tier to start)
* Video generation: $30-50/month
* Hosting: $10-30/month
* **Total estimated: $120-340/month**

## Founder Time Commitment

* **Daily:** 30-minute morning review of AI-generated content
* **Weekly:** 1-2 hours for strategic review, editorial planning, sponsor/affiliate management
* **Monthly:** 2-3 hours for performance review, strategy adjustments, tool optimization
* **Total:** ~5-8 hours/week
