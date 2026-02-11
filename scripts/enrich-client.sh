#!/usr/bin/env zsh
set -e
set -u
setopt pipefail

# Usage: scripts/enrich-client.sh client-slug [client-website]

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 client-slug [client-website]" >&2
  exit 1
fi

CLIENT_SLUG="$1"
CLIENT_WEBSITE="${2:-}" # optional
ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
CLIENT_DIR="$ROOT_DIR/client-agents/$CLIENT_SLUG"
PROMPT_SRC="$ROOT_DIR/prompts/client-enrichment-prompt.md"
DATE_SHORT="$(date +%Y-%m-%d)"
NOW_STAMP="$(date +%Y%m%d-%H%M%S)"

if [[ ! -d "$CLIENT_DIR" ]]; then
  echo "Client folder not found: $CLIENT_DIR" >&2
  exit 1
fi

# Read client name from .clientrc.json when available, else fallback to slug
CLIENT_NAME="$CLIENT_SLUG"
if [[ -f "$CLIENT_DIR/.clientrc.json" ]]; then
  if command -v jq >/dev/null 2>&1; then
    CLIENT_NAME="$(jq -r '.name // empty' "$CLIENT_DIR/.clientrc.json" 2>/dev/null || true)"
  else
    CLIENT_NAME="$(grep -E '"name"\s*:\s*"' "$CLIENT_DIR/.clientrc.json" | sed -E 's/.*"name"\s*:\s*"([^"]+)".*/\1/' | head -n1)"
  fi
  [[ -z "$CLIENT_NAME" ]] && CLIENT_NAME="$CLIENT_SLUG"
fi

# Create research workspace inside client dir
RESEARCH_DIR="$CLIENT_DIR/research"
mkdir -p "$RESEARCH_DIR/inputs" "$RESEARCH_DIR/outputs" "$RESEARCH_DIR/prompts"

# HubSpot capture templates (optional helper for using HubSpot extension)
HUBSPOT_TPL="$RESEARCH_DIR/inputs/hubspot-template.md"
HUBSPOT_MAP="$RESEARCH_DIR/inputs/hubspot-mapping.sample.json"
if [[ ! -f "$HUBSPOT_TPL" ]]; then
  cat > "$HUBSPOT_TPL" <<'EOF'
# HubSpot Capture Template

## Company Overview (append to knowledge-base/company/about.additions.md)
- Summary bullets…
- Evidence URLs…

## Products & Services (append to knowledge-base/services/services.additions.md)
- …

## ICP (append to knowledge-base/sales/ideal-customer-profile.additions.md)
- …

## Messaging (append to knowledge-base/sales/messaging.additions.md)
- …

## Brand — Typography (append to brand/fonts/typography.additions.md)
- …

## Brand — Colors (append to brand/colors/palette.additions.md)
- …

## Brand — Voice & Tone (append to brand/guidelines/voice-and-tone.additions.md)
- …

## Landscape (append to knowledge-base/company/landscape.additions.md)
- …

## Sources (append to knowledge-base/company/sources.additions.md)
- … list of URLs with one-line notes …
EOF
fi

if [[ ! -f "$HUBSPOT_MAP" ]]; then
  cat > "$HUBSPOT_MAP" <<EOF
{
  "company_name": "",
  "company_domain": "",
  "primary_company_id": "",
  "notes": "Fill with HubSpot identifiers to streamline exports; do not commit secrets."
}
EOF
fi

# Ensure additive KB target files exist (do not overwrite)
TARGETS=(
  "$CLIENT_DIR/brand/fonts/typography.additions.md"
  "$CLIENT_DIR/brand/colors/palette.additions.md"
  "$CLIENT_DIR/brand/guidelines/voice-and-tone.additions.md"
  "$CLIENT_DIR/knowledge-base/company/about.additions.md"
  "$CLIENT_DIR/knowledge-base/company/landscape.additions.md"
  "$CLIENT_DIR/knowledge-base/company/sources.additions.md"
  "$CLIENT_DIR/knowledge-base/services/services.additions.md"
  "$CLIENT_DIR/knowledge-base/sales/ideal-customer-profile.additions.md"
  "$CLIENT_DIR/knowledge-base/sales/messaging.additions.md"
)

for path in "$TARGETS[@]"; do
  dir="${path:h}"
  mkdir -p "$dir"
  if [[ ! -f "$path" ]]; then
    cat > "$path" <<EOF
# Additions — $CLIENT_NAME ($DATE_SHORT)

<!-- Paste new, citable additions below this line. Do not remove prior content. -->

EOF
  fi
done

# Materialize a client-specific prompt with tokens filled
PROMPT_OUT="$RESEARCH_DIR/prompts/client-enrichment-$NOW_STAMP.md"
if [[ ! -f "$PROMPT_SRC" ]]; then
  echo "Prompt template missing: $PROMPT_SRC" >&2
  exit 1
fi

# Prepare token values
TOK_CLIENT_NAME="$CLIENT_NAME"
TOK_CLIENT_SLUG="$CLIENT_SLUG"
TOK_CLIENT_WEBSITE="$CLIENT_WEBSITE"
TOK_TODAY="$DATE_SHORT"

perl -0777 -pe \
  "s/\\{\\{CLIENT_NAME\\}\\}/$TOK_CLIENT_NAME/g; \
   s/\\{\\{CLIENT_SLUG\\}\\}/$TOK_CLIENT_SLUG/g; \
   s/\\{\\{CLIENT_WEBSITE\\}\\}/$TOK_CLIENT_WEBSITE/g; \
   s/\\{\\{TODAY\\}\\}/$TOK_TODAY/g;" \
  "$PROMPT_SRC" > "$PROMPT_OUT"

# Quick README for the research flow (one-time)
FLOW_DOC="$CLIENT_DIR/research/README.md"
if [[ ! -f "$FLOW_DOC" ]]; then
  cat > "$FLOW_DOC" <<EOF
# Research Flow — $CLIENT_NAME

1) Open the latest file in prompts/ and paste it into your AI tool of choice.
2) Conduct research; ensure every claim has a source URL.
3) For each section, paste the "Summary" and "Evidence" into the matching *.additions.md target files at the top.
4) Commit changes. Prior additions remain — never delete earlier content.

Targets:
- brand/fonts/typography.additions.md
- brand/colors/palette.additions.md
- brand/guidelines/voice-and-tone.additions.md
- knowledge-base/company/about.additions.md
- knowledge-base/company/landscape.additions.md
- knowledge-base/company/sources.additions.md
- knowledge-base/services/services.additions.md
- knowledge-base/sales/ideal-customer-profile.additions.md
- knowledge-base/sales/messaging.additions.md

Tip: Keep outputs/ for raw dumps. Curate final bullets into the *.additions.md files.
EOF
fi

echo "✔ Enrichment scaffold ready for $CLIENT_SLUG"
echo "  Prompt: $PROMPT_OUT"
echo "  Targets created (additive): *.additions.md under brand/ and knowledge-base/"
