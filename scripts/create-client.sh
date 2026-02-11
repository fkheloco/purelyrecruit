#!/usr/bin/env zsh
set -euo pipefail

# Usage: scripts/create-client.sh "Client Name" client-slug "Primary Contact" primary@example.com

if [[ $# -lt 4 ]]; then
  echo "Usage: $0 \"Client Name\" client-slug \"Primary Contact\" primary@example.com" >&2
  exit 1
fi

CLIENT_NAME="$1"
CLIENT_SLUG="$2"
PRIMARY_CONTACT="$3"
PRIMARY_EMAIL="$4"
DATE="$(date +%Y-%m-%d)"
ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
TEMPLATE_DIR="$ROOT_DIR/client-agents/_template"
TARGET_DIR="$ROOT_DIR/client-agents/$CLIENT_SLUG"

if [[ -d "$TARGET_DIR" ]]; then
  echo "Target already exists: $TARGET_DIR" >&2
  exit 1
fi

# Copy template
rsync -a --exclude 'node_modules' --exclude '.next' "$TEMPLATE_DIR/" "$TARGET_DIR/"

# Create .env.sample at client root
cat > "$TARGET_DIR/.env.sample" <<EOF
# Example environment variables for apps under outputs/
# Copy to .env locally and fill in values. Keep secrets out of version control.
# EXAMPLE_API_KEY=
EOF

# Replacement function: prefer gsed, else use perl -pi for portability
function replace_tokens() {
  local file="$1"
  if command -v gsed >/dev/null 2>&1; then
    gsed -i \
      -e "s/{{CLIENT_NAME}}/${CLIENT_NAME//\//\\\/}/g" \
      -e "s/{{CLIENT_SLUG}}/${CLIENT_SLUG//\//\\\/}/g" \
      -e "s/{{PRIMARY_CONTACT}}/${PRIMARY_CONTACT//\//\\\/}/g" \
      -e "s/{{PRIMARY_EMAIL}}/${PRIMARY_EMAIL//\//\\\/}/g" \
      -e "s/{{DATE}}/${DATE//\//\\\/}/g" "$file"
  else
    perl -0777 -pe \
      "s/{{CLIENT_NAME}}/$CLIENT_NAME/g; s/{{CLIENT_SLUG}}/$CLIENT_SLUG/g; s/{{PRIMARY_CONTACT}}/$PRIMARY_CONTACT/g; s/{{PRIMARY_EMAIL}}/$PRIMARY_EMAIL/g; s/{{DATE}}/$DATE/g" \
      -i "$file"
  fi
}

# Replace tokens in text files
print -r -- "Replacing tokens in $TARGET_DIR ..."
if command -v fd >/dev/null 2>&1; then
  FILES_CMD=(fd --type f . "$TARGET_DIR" -0)
else
  FILES_CMD=(find "$TARGET_DIR" -type f -print0)
fi
while IFS= read -r -d '' f; do
  case "$(basename "$f")" in
    *.png|*.jpg|*.jpeg|*.gif|*.pdf|*.zip) continue;;
  esac
  replace_tokens "$f" || true
done < <("${FILES_CMD[@]}")

# Write metadata
cat > "$TARGET_DIR/.clientrc.json" <<JSON
{
  "name": "$CLIENT_NAME",
  "slug": "$CLIENT_SLUG",
  "primary_contact": "$PRIMARY_CONTACT",
  "email": "$PRIMARY_EMAIL",
  "created_at": "$DATE"
}
JSON

print -r -- "✔ Created client at: $TARGET_DIR"
print -r -- "Next steps:"
print -r -- "  1) Customize brand/ and knowledge-base/"
print -r -- "  2) Fill Claude.md with real details"
print -r -- "  3) If apps exist, configure outputs/<app>/.env from .env.example"

# Optionally scaffold enrichment research prompt/targets
if [[ -x "$ROOT_DIR/scripts/enrich-client.sh" ]]; then
  print -r -- "Scaffolding enrichment research prompt and targets ..."
  "$ROOT_DIR/scripts/enrich-client.sh" "$CLIENT_SLUG" || true
fi
