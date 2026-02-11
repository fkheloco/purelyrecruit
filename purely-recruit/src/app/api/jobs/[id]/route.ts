import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobOpenings } from "@/db/schema";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const { id } = await params;
  const [job] = await db.select().from(jobOpenings).where(eq(jobOpenings.id, id)).limit(1);
  
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: job });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const { id } = await params;
  const body = await req.json();
  
  const [updated] = await db.update(jobOpenings).set({
    ...body,
    updatedAt: new Date(),
  }).where(eq(jobOpenings.id, id)).returning();
  
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
