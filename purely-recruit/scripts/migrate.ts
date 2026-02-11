import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const main = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("⏳ Running migrations...");
  await migrate(db, {
    migrationsFolder: "./drizzle/migrations",
  });
  console.log("✅ Migrations completed successfully");
  process.exit(0);
};

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
