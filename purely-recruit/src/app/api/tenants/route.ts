import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { getAuthContext, unauthorized, requireRole } from "@/lib/auth/middleware";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  // Public endpoint - allow access to tenant by slug for public job board
  if (slug) {
    const data = await db.select().from(tenants).where(eq(tenants.slug, slug));
    return NextResponse.json({ data });
  }

  // Protected endpoint - requires auth
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const roleCheck = requireRole(context, "platform_admin", "recruiter");
  if (roleCheck) return roleCheck;

  const data = await db.select().from(tenants).orderBy(desc(tenants.createdAt));
  return NextResponse.json({ data });
}
