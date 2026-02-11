-- Run this in Neon SQL Editor after migration

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector columns (not managed by Drizzle)
ALTER TABLE candidate_embeddings ADD COLUMN IF NOT EXISTS embedding vector(1536);
ALTER TABLE job_embeddings ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create vector indexes (HNSW for fast cosine similarity)
CREATE INDEX IF NOT EXISTS candidate_embedding_idx ON candidate_embeddings
  USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS job_embedding_idx ON job_embeddings
  USING hnsw (embedding vector_cosine_ops);

-- Create full-text search indexes (GIN for fast text search)
CREATE INDEX IF NOT EXISTS candidates_search_idx ON candidates
  USING gin (to_tsvector('english',
    coalesce(first_name, '') || ' ' ||
    coalesce(last_name, '') || ' ' ||
    coalesce(current_title, '') || ' ' ||
    coalesce(current_company, '') || ' ' ||
    coalesce(bio, '')
  ));

CREATE INDEX IF NOT EXISTS jobs_search_idx ON job_openings
  USING gin (to_tsvector('english',
    coalesce(title, '') || ' ' ||
    coalesce(department, '') || ' ' ||
    coalesce(description, '')
  ));
