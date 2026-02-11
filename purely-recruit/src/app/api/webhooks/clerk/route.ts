import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

type WebhookEvent = {
  type: string;
  data: Record<string, any>;
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  switch (event.type) {
    case "user.created": {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      const email = email_addresses?.[0]?.email_address;
      if (email) {
        await db.insert(users).values({
          clerkId: id,
          email,
          firstName: first_name || null,
          lastName: last_name || null,
          avatarUrl: image_url || null,
          role: "candidate",
        }).onConflictDoNothing();
      }
      break;
    }

    case "user.updated": {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      const email = email_addresses?.[0]?.email_address;
      await db.update(users).set({
        email: email || undefined,
        firstName: first_name || null,
        lastName: last_name || null,
        avatarUrl: image_url || null,
        updatedAt: new Date(),
      }).where(eq(users.clerkId, id));
      break;
    }

    case "user.deleted": {
      const { id } = event.data;
      await db.update(users).set({
        updatedAt: new Date(),
      }).where(eq(users.clerkId, id));
      break;
    }

    case "organization.created": {
      const { id, name, slug, image_url } = event.data;
      await db.insert(tenants).values({
        clerkOrgId: id,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        logoUrl: image_url || null,
      }).onConflictDoNothing();
      break;
    }

    case "organizationMembership.created": {
      const { organization, public_user_data, role } = event.data;
      const [tenant] = await db.select().from(tenants)
        .where(eq(tenants.clerkOrgId, organization.id)).limit(1);
      
      if (tenant && public_user_data?.user_id) {
        const dbRole = role === "admin" ? "client_admin" : "client_user";
        await db.update(users).set({
          tenantId: tenant.id,
          role: dbRole as any,
          updatedAt: new Date(),
        }).where(eq(users.clerkId, public_user_data.user_id));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
