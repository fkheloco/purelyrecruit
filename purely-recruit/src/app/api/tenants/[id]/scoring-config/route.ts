import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { scoringConfigs } from "@/db/schema";
import { getAuthContext, unauthorized, requireRole } from "@/lib/auth/middleware";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const { id } = await params;
  const [config] = await db.select().from(scoringConfigs).where(eq(scoringConfigs.tenantId, id)).limit(1);
  
  return NextResponse.json({ data: config || null });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const roleCheck = requireRole(context, "platform_admin", "recruiter", "client_admin");
  if (roleCheck) return roleCheck;
  
  const { id } = await params;
  const body = await req.json();
  
  const [existing] = await db.select().from(scoringConfigs).where(eq(scoringConfigs.tenantId, id)).limit(1);
  
  if (existing) {
    const [updated] = await db.update(scoringConfigs).set({
      module1Weight: body.module1Weight,
      module2Weight: body.module2Weight,
      module3Weight: body.module3Weight,
      mandatorySkillPenalty: body.mandatorySkillPenalty,
      goodIndicatorBonus: body.goodIndicatorBonus,
      badIndicatorPenalty: body.badIndicatorPenalty,
      customWeights: body.customWeights,
      updatedBy: context.userId,
      updatedAt: new Date(),
    }).where(eq(scoringConfigs.tenantId, id)).returning();
    return NextResponse.json({ data: updated });
  } else {
    const [created] = await db.insert(scoringConfigs).values({
      tenantId: id,
      module1Weight: body.module1Weight || 0.40,
      module2Weight: body.module2Weight || 0.30,
      module3Weight: body.module3Weight || 0.30,
      updatedBy: context.userId,
    }).returning();
    return NextResponse.json({ data: created }, { status: 201 });
  }
}
