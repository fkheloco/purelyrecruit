import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
export type Database = typeof db;

// Auto-migrate on startup if needed
let migrated = false;

if (!migrated && process.env.NODE_ENV === "production") {
  migrated = true;
  migrate(db, {
    migrationsFolder: "drizzle/migrations",
  }).catch((err) => {
    console.error("Migration error:", err);
  });
}
