# HubSpot → Client KB (Additive)

Purpose
- Use the HubSpot VS Code extension (or HubSpot web app) to pull citable client details, then append to each client’s .additions.md targets.

Setup
- Install the HubSpot HubL extension (HubSpot.hubl) for HubSpot CMS/dev workflows. For CRM data browsing, use the HubSpot web app (unless you have a specific CRM extension to share).
- Optional: Create a HubSpot Private App token for API-based exports later (not required now). Keep tokens out of git.

Per-Client Preparation
- Run: scripts/enrich-client.sh client-slug [client-website]
- This creates: client-agents/<slug>/research/inputs/hubspot-template.md and hubspot-mapping.sample.json
- Fill mapping with the company name (primary), and optionally domain or company ID if you have them.

What to Capture (map to KB targets)
- Company Overview → knowledge-base/company/about.additions.md
- Products/Services → knowledge-base/services/services.additions.md
- ICP & Roles → knowledge-base/sales/ideal-customer-profile.additions.md
- Messaging/Positioning → knowledge-base/sales/messaging.additions.md
- Brand (typography, colors, voice) → brand/*/*.additions.md
- Sources (URLs) → knowledge-base/company/sources.additions.md

How to Work
1) Open client-agents/<slug>/research/inputs/hubspot-template.md
2) For each section, collect specific fields from HubSpot (Company, Contacts, Deals, Notes, Attachments).
3) Paste curated bullets (with URLs) into the corresponding .additions.md files — always append, never overwrite.
4) Commit changes.

Field Hints
- Company: domain, industry, size (employees), HQ location, founded year, lifecycle, owners, custom fields
- Contacts: roles/titles, seniority, buyer committee
- Deals: segments, product bundles, typical ACV signals (if present), close reasons
- Activities/Notes: language examples for voice/tone, value props

Quality
- Every factual claim needs a source URL (HubSpot records often include links to websites, LinkedIn, documents). If not public, mark “Internal (no public URL)”.
- Keep bullets concise and additive.

API Fallback (later, optional)
- When ready, we can add a small script to export Companies/Contacts by name/domain into research/outputs/hubspot/, then curate into .additions.md. Tokens stay in local .env (never committed).
