#!/usr/bin/env zsh
set -euo pipefail

# Usage: scripts/package-client.sh client-slug

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 client-slug" >&2
  exit 1
fi

CLIENT_SLUG="$1"
ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
CLIENT_DIR="$ROOT_DIR/client-agents/$CLIENT_SLUG"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DIST_DIR="$ROOT_DIR/dist/clients"
ARCHIVE="$DIST_DIR/${CLIENT_SLUG}-${TIMESTAMP}.zip"

if [[ ! -d "$CLIENT_DIR" ]]; then
  echo "Client folder not found: $CLIENT_DIR" >&2
  exit 1
fi

mkdir -p "$DIST_DIR"

# Exclusions: common build dirs and secrets
EXCLUDES=(
  "*.DS_Store"
  "*/node_modules/*"
  "*/.next/*"
  "*/.turbo/*"
  "*/.vercel/*"
  "*/.env"
  "*/.env.*"
  "*/.git/*"
)

# Build zip with exclusions
pushd "$ROOT_DIR" >/dev/null
zip -r "$ARCHIVE" "client-agents/$CLIENT_SLUG" ${(v)EXCLUDES/#/-x }
popd >/dev/null

print -r -- "✔ Packaged: $ARCHIVE"
