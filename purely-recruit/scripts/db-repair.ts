import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(url);
  console.log("Dropping potentially partially-created objects (if any)...");
  try {
    const enums = [
      'user_role',
      'skill_category',
      'application_status',
      'application_source',
      'importance',
      'note_visibility',
      'job_queue_status',
      'job_status',
      'employment_type',
      'location_type',
      'proficiency',
      'message_channel',
      'availability',
    ];
    for (const e of enums) {
      // Attempt simple drop with IF EXISTS; if it doesn't exist, it's a no-op
      await (sql as any).query(`DROP TYPE IF EXISTS "public"."${e}" CASCADE;`);
      console.log(`✔ ${e} enum checked/dropped`);
    }
  } catch (err) {
    console.error("Failed dropping objects:", err);
    process.exit(1);
  }
}

main().then(() => {
  console.log("Repair completed");
  process.exit(0);
});
