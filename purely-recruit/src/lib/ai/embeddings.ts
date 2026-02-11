import { anthropic } from "./client";
import { db } from "@/db";
import { sql } from "drizzle-orm";

// Note: Claude doesn't have an embedding API, so we use text matching via pgvector
// In production, you'd use OpenAI embeddings or Voyage AI
// For now, the full-text search in PostgreSQL handles matching

export async function generateEmbedding(text: string): Promise<number[]> {
  // Placeholder: In production, use an embedding model API
  // For now, the app works with PostgreSQL full-text search
  console.log("Embedding generation placeholder - using full-text search instead");
  return [];
}

export async function storeEmbedding(
  table: "candidate_embeddings" | "job_embeddings",
  id: string,
  text: string,
) {
  // Placeholder for when embedding API is added
  console.log(`Would store embedding for ${table}:${id}`);
}
