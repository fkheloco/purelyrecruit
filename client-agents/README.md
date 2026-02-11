Client Agents — Portable, Per-Client Workspaces

This directory contains one folder per client (e.g., vsce/, brio-solutions/, etc.). Each is designed to be self-contained so you can share only that client's materials with their team.

Create a new client from template

Commands (run from repository root):

```sh
chmod +x scripts/*.sh
scripts/create-client.sh "Client Name" client-slug "Primary Contact" primary@example.com
```

This will create client-agents/client-slug/ with a ready-to-customize structure.

Package a client for distribution

```sh
scripts/package-client.sh client-slug
```

Outputs a zip at dist/clients/client-slug-YYYYMMDD-HHMMSS.zip excluding node_modules, .next, and secrets.

Enrich a client (research scaffold + prompt)

```sh
scripts/enrich-client.sh client-slug [client-website]
```

This generates a ready-to-use research prompt at client-agents/client-slug/research/prompts/ and creates additive target files ending with .additions.md under brand/ and knowledge-base/. Paste curated research into those files — never overwrite existing content.

Enrich all clients

```sh
scripts/enrich-all-clients.sh
```

Creates the same scaffold across all client folders (skips templates).

Notes
- Keep secrets in .env files locally; do not commit .env*
- If a client has an app under outputs/, follow that app's README for setup
- You (Farid) retain master access to the full Agentic Brain; share per-client folders as needed
