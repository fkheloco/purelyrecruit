# Client Research & Enrichment Workflow

Overview
- Goal: Enrich each client’s brand and company knowledge additively — never overwrite existing materials. Every fact must be citable.
- Outputs: New bullets appended into .additions.md files under each client’s brand/ and knowledge-base/ folders.

Quick Start
1) Generate scaffold and prompt
   - Single client: `scripts/enrich-client.sh client-slug [client-website]`
   - All clients: `scripts/enrich-all-clients.sh`
2) Open the generated prompt at: client-agents/<slug>/research/prompts/
3) Paste it into your AI tool and run the research.
4) Curate the AI’s “Summary” and “Evidence” into the matching *.additions.md target files (listed in the prompt and research/README.md).
5) Commit changes. Keep prior additions; append new sections with today’s date.

Additive Targets (per client)
- brand/fonts/typography.additions.md
- brand/colors/palette.additions.md
- brand/guidelines/voice-and-tone.additions.md
- knowledge-base/company/about.additions.md
- knowledge-base/company/landscape.additions.md
- knowledge-base/company/sources.additions.md
- knowledge-base/services/services.additions.md
- knowledge-base/sales/ideal-customer-profile.additions.md
- knowledge-base/sales/messaging.additions.md

Prompt Template
- See: prompts/client-enrichment-prompt.md
- The scaffold fills tokens for name, slug, website, and today’s date.

HubSpot
- See: HUBSPOT_CAPTURE.md for step-by-step capture with the HubSpot VS Code extension (or HubSpot web UI) and how to map details into the additive KB files.

Quality Bar
- Cite sources for every factual claim (first-party preferred).
- Prefer concise, high-signal bullets; mark low-confidence inferences clearly.
- Avoid duplicating what’s already present; add only new insight.
