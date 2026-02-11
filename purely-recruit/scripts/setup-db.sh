#!/bin/bash
# Setup script for Purely Recruit database
echo "Running Drizzle migrations..."
npx drizzle-kit push

echo "Setting up PostgreSQL extensions..."
echo "NOTE: Run scripts/setup-extensions.sql manually in your Neon console"
echo "  - Enables pgvector extension"
echo "  - Creates vector columns"
echo "  - Creates HNSW and GIN indexes"

echo "Database setup complete!"
