import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users } from "../src/db/schema/users";
import { eq } from "drizzle-orm";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const sql = neon(url);
  const db = drizzle(sql);

  let [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    console.log(`No DB user for ${email}. Attempting to fetch from Clerk and create...`);
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (!clerkSecret) throw new Error("CLERK_SECRET_KEY is required to create the user from Clerk");
    const search = await fetch(`https://api.clerk.com/v1/users?email_address[]=${encodeURIComponent(email)}` ,{
      headers: { Authorization: `Bearer ${clerkSecret}` }
    });
    if (!search.ok) throw new Error(`Clerk search failed: ${search.status}`);
    const arr = await search.json();
    const u = arr?.[0];
    if (!u) throw new Error(`No Clerk user found for ${email}`);
    const primaryEmail = u.email_addresses?.find((e: any) => e.id === u.primary_email_address_id)?.email_address || u.email_addresses?.[0]?.email_address || email;
    await db.insert(users).values({
      clerkId: u.id,
      email: primaryEmail,
      firstName: u.first_name ?? null,
      lastName: u.last_name ?? null,
      avatarUrl: u.image_url ?? null,
      role: "platform_admin" as any,
    });
    console.log(`✔ Created DB user and set platform_admin for ${email}`);
    ;[user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  } else {
    await db.update(users).set({ role: "platform_admin", updatedAt: new Date() as any }).where(eq(users.email, email));
    console.log(`✔ Updated DB role to platform_admin for ${email}`);
  }

  const clerkSecret = process.env.CLERK_SECRET_KEY;
  if (clerkSecret && user.clerkId) {
    const res = await fetch(`https://api.clerk.com/v1/users/${user.clerkId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${clerkSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_metadata: { role: "platform_admin" } }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`⚠ Clerk update failed (${res.status}): ${text}`);
    } else {
      console.log("✔ Updated Clerk public_metadata.role to platform_admin");
    }
  } else {
    console.log("ℹ Skipped Clerk update (missing CLERK_SECRET_KEY or clerkId)");
  }

  console.log("All done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
