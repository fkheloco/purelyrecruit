import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, jobOpenings, candidates } from "@/db/schema";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { desc, eq, sql, and } from "drizzle-orm";
import { enqueueJob } from "@/lib/jobs/queue";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "25");
  const jobId = searchParams.get("jobId");
  const status = searchParams.get("status");
  const offset = (page - 1) * pageSize;

  let conditions: any[] = [];

  if (context.role === "client_admin" || context.role === "client_user") {
    conditions.push(eq(applications.tenantId, context.tenantId!));
  }

  if (context.role === "candidate") {
    // Get candidate ID from userId
    const [candidate] = await db
      .select({ id: candidates.id })
      .from(candidates)
      .where(eq(candidates.userId, context.userId))
      .limit(1);

    if (!candidate) {
      // No candidate record found, return empty results
      return NextResponse.json({
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      });
    }
    conditions.push(eq(applications.candidateId, candidate.id));
  }

  if (jobId) conditions.push(eq(applications.jobOpeningId, jobId));
  if (status) conditions.push(eq(applications.status, status as any));

  let query = db.select().from(applications);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const data = await query
    .orderBy(desc(applications.appliedAt))
    .limit(pageSize)
    .offset(offset);

  const countQuery = db.select({ count: sql<number>`count(*)` }).from(applications);
  const countQueryWithConditions = conditions.length > 0
    ? countQuery.where(and(...conditions)) as any
    : countQuery;
  const [{ count }] = await countQueryWithConditions;

  return NextResponse.json({
    data,
    total: Number(count),
    page,
    pageSize,
    totalPages: Math.ceil(Number(count) / pageSize),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Allow public applications from career sites
  const isPublicApplication = body.source === "career_site" || body.source === "talent_pool_match" ||
                              body.tenantId === undefined; // If no tenantId specified, treat as public

  const context = await getAuthContext();

  // If not a public application, require authentication
  if (!isPublicApplication && !context) {
    return unauthorized();
  }

  // Get tenant ID from job if not provided
  let tenantId = body.tenantId;
  if (!tenantId && body.jobOpeningId) {
    const job = await db.select({ tenantId: jobOpenings.tenantId })
      .from(jobOpenings)
      .where(eq(jobOpenings.id, body.jobOpeningId));
    tenantId = job[0]?.tenantId;
  }

  const [app] = await db.insert(applications).values({
    candidateId: body.candidateId,
    jobOpeningId: body.jobOpeningId,
    tenantId: tenantId || context?.tenantId,
    resumeId: body.resumeId,
    source: body.source || "direct_apply",
    status: "new",
  }).returning();

  await enqueueJob("score-application", { applicationId: app.id });

  return NextResponse.json({ data: app }, { status: 201 });
}
