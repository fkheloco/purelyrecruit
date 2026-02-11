import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const { id } = await params;
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
  
  if (!tenant) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: tenant });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const { id } = await params;
  const body = await req.json();
  
  const [updated] = await db.update(tenants).set({
    ...body,
    updatedAt: new Date(),
  }).where(eq(tenants.id, id)).returning();
  
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
