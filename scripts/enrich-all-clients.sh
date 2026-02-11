#!/usr/bin/env zsh
set -e
set -u
setopt pipefail

# Usage: scripts/enrich-all-clients.sh [default-website-domain-suffix]
# Example: scripts/enrich-all-clients.sh ".com" (only used when guessing; this script does not guess by default)

ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"

for dir in "$ROOT_DIR/client-agents"/*; do
  slug="$(basename "$dir")"
  case "$slug" in
    _template|00-client-agent-builder|README.md|.DS_Store) continue;;
  esac
  if [[ -d "$dir" ]]; then
    echo "Enriching $slug ..."
    "$ROOT_DIR/scripts/enrich-client.sh" "$slug" || {
      echo "⚠️  Skipped $slug due to error" >&2
    }
  fi
done

echo "✔ Enrichment scaffolds generated for all clients"
