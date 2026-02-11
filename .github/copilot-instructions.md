<!-- Copied/merged from workspace `Claude.md`, `client-agents/*/Claude.md`, and `client-agents/00-client-agent-builder/SKILL.md` -->
# Copilot instructions for working in this workspace

Purpose: give AI coding agents the minimal, actionable context to be immediately productive in this repository.

1) Big picture
- This repo is a documentation-first workspace for Purely Works and client agents. Major folders:
  - `brand/` — colors, fonts, logos, templates and voice-and-tone guidance.
  - `knowledge-base/` — canonical content used to author proposals, SOQs, and research (services, icp, sales-intel).
  - `client-agents/` — per-client agent training and outputs. Each client folder often contains a `Claude.md` training file.
  - `training-files/` and `client-agents/*/training-files/` — dropzone for new assets; agents process these into the KB.
  - `outputs/` — generated proposals, reports, spreadsheets, and decks (persist outputs here).

2) Primary goals for AI agents
- Produce client-facing Markdown and Notion pages that match the knowledge base and brand guidelines.
- Use existing `Claude.md` files as authoritative training templates and voice references (see root `Claude.md` and each `client-agents/*/Claude.md`).
- When creating sales intelligence reports: save `.md` to `outputs/reports/`, save spreadsheets to `outputs/reports/` and publish a Notion page with the Notion URL in the delivery message.

3) Writing & format conventions (project-specific)
- Always write in the owner's voice per `Claude.md` (short paragraphs, asterisk bullets, links on their own line).
- Use Markdown only (Notion-compatible). Prefer a single idea per paragraph and 1–3 sentence paragraphs.
- Bullets: use `*` not `-` for casual writing (this repository follows that convention in `Claude.md`).
- File names: use kebab-case or Title Case for training docs (follow existing files e.g. `company-overview.md`, `key-differentiators.md`).

4) Key workflows & rules (discoverable in `SKILL.md` and `knowledge-base/`)
- Training flow: new files are dropped in `training-files/`; agent runs a process that extracts content, updates `knowledge-base/`, and moves processed files to `training-files/previous-training/`.
- Sales-intel flow: produce scored spreadsheets (xlsx) and Markdown reports; save to `outputs/reports/`; publish to Notion and include both Notion URL and local path in final message. See `knowledge-base/sales-intelligence/` for scoring rules and templates.
- Proposals: reference `brand/` assets (colors, logos, typography) and `knowledge-base/proposals/key-differentiators.md` for boilerplate.

5) Examples & files to consult (quick links)
- Root voice & brand example: `Claude.md` (root)
- Agent training pattern: `client-agents/*/Claude.md` (many clients follow same template)
- Agent builder & procedural guide: `client-agents/00-client-agent-builder/SKILL.md`
- Sales-intel instructions: `knowledge-base/sales-intelligence/agent-instructions.md`
- Brand palette and templates: `brand/colors/palette.md`, `brand/logos/README.md`, `brand/guidelines/voice-and-tone.md`
- Outputs: `outputs/reports/` and `outputs/proposals/`

6) What to avoid / non-discoverable assumptions
- Do not assume CI/build commands or language runtimes — this repository is content-first (no universal `npm`/`pip` lifecycle defined). If you find code subprojects, open their local `README.md` and follow those commands.
- Do not publish or modify Notion pages without including the Notion page URL and local backup path in your response.

7) When you make changes
- Add or update Markdown under the appropriate folder (brand, knowledge-base, client-agents). Commit with clear messages: "chore(docs): update <path> — agent sync".
- Preserve existing `Claude.md` sections; if generating a new `Claude.md`, follow the `SKILL.md` template and include sections: Who You Are, About, Communication Style, Brand System, Knowledge Base references, and Core Responsibilities.

8) Quick checklist for deliveries
- Save artifacts to `outputs/` (reports/proposals/spreadsheets).
- Update or cite the KB file(s) you used (path in the header of the `.md`).
- Provide Notion URL(s) and local path(s).
- Keep writing in the Farid/client voice and follow brand colors/typography.

If any of these areas are unclear or you want the instructions tuned to a specific subproject (e.g., `client-agents/vsce`), tell me which target and I'll update this file with concrete examples and one-click commands.
