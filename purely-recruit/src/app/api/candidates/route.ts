import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { candidates } from "@/db/schema";
import { getAuthContext, unauthorized, requireRole } from "@/lib/auth/middleware";
import { desc, eq, sql, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "25");
  const offset = (page - 1) * pageSize;
  const self = searchParams.get("self") === "true";

  let query = db.select().from(candidates);
  let conditions: any[] = [];

  // If self=true and user is a candidate, return only their record
  if (self && context.role === "candidate") {
    conditions.push(eq(candidates.userId, context.userId));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const data = await query
    .orderBy(desc(candidates.updatedAt))
    .limit(pageSize)
    .offset(offset);

  const countQuery = db.select({ count: sql<number>`count(*)` }).from(candidates);
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
  const context = await getAuthContext();

  // If source is career_site or tenant_career_site, allow public creation
  const isPublicApplication = body.source === "career_site" || body.source === "tenant_career_site";

  // Otherwise, require authentication
  if (!isPublicApplication && !context) {
    return unauthorized();
  }

  if (!isPublicApplication && context) {
    const roleCheck = requireRole(context, "platform_admin", "recruiter");
    if (roleCheck) return roleCheck;
  }

  const [candidate] = await db.insert(candidates).values({
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    locationCity: body.locationCity,
    locationState: body.locationState,
    currentTitle: body.currentTitle,
    currentCompany: body.currentCompany,
    yearsExperience: body.yearsExperience,
    linkedinUrl: body.linkedinUrl,
    bio: body.bio,
    source: body.source || "manual",
  }).returning();

  return NextResponse.json({ data: candidate }, { status: 201 });
}
