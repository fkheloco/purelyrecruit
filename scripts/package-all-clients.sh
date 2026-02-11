#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
for dir in "$ROOT_DIR/client-agents"/*; do
  slug="$(basename "$dir")"
  case "$slug" in
    _template|00-client-agent-builder|README.md|.DS_Store) continue;;
  esac
  if [[ -d "$dir" ]]; then
    echo "Packaging $slug ..."
    "$ROOT_DIR/scripts/package-client.sh" "$slug"
  fi
done

echo "✔ All clients packaged. See dist/clients"
