import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobOpenings } from "@/db/schema";
import { getAuthContext, unauthorized, requireRole } from "@/lib/auth/middleware";
import { desc, eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "25");
  const status = searchParams.get("status");
  const offset = (page - 1) * pageSize;

  let query = db.select().from(jobOpenings);
  
  if (context.role === "client_admin" || context.role === "client_user") {
    query = query.where(eq(jobOpenings.tenantId, context.tenantId!)) as any;
  }

  const data = await query.orderBy(desc(jobOpenings.updatedAt)).limit(pageSize).offset(offset);
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(jobOpenings);

  return NextResponse.json({
    data,
    total: Number(count),
    page,
    pageSize,
    totalPages: Math.ceil(Number(count) / pageSize),
  });
}

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const roleCheck = requireRole(context, "platform_admin", "recruiter", "client_admin");
  if (roleCheck) return roleCheck;

  const body = await req.json();
  
  const tenantId = context.role === "client_admin" ? context.tenantId! : body.tenantId;
  
  const [job] = await db.insert(jobOpenings).values({
    tenantId,
    title: body.title,
    department: body.department,
    locationCity: body.locationCity,
    locationState: body.locationState,
    locationType: body.locationType,
    employmentType: body.employmentType,
    salaryMin: body.salaryMin,
    salaryMax: body.salaryMax,
    description: body.description,
    requirements: body.requirements,
    goodIndicators: body.goodIndicators,
    badIndicators: body.badIndicators,
    status: body.status || "draft",
    createdBy: context.userId,
    assignedRecruiter: body.assignedRecruiter,
  }).returning();

  return NextResponse.json({ data: job }, { status: 201 });
}
