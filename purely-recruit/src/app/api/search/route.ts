import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { searchCandidates, searchJobs } from "@/lib/search/fulltext";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "candidates";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  if (type === "candidates") {
    const results = await searchCandidates(q, {
      locationState: searchParams.get("state") || undefined,
      minExperience: searchParams.get("minExp") ? parseInt(searchParams.get("minExp")!) : undefined,
    });
    return NextResponse.json({ results });
  }

  if (type === "jobs") {
    const results = await searchJobs(q, {
      tenantId: context.role === "client_admin" ? context.tenantId || undefined : undefined,
      status: searchParams.get("status") || undefined,
    });
    return NextResponse.json({ results });
  }

  return NextResponse.json({ results: [] });
}
