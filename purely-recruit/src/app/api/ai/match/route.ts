import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, unauthorized, requireRole } from "@/lib/auth/middleware";
import { matchTalentPool } from "@/lib/ai/matching";

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const roleCheck = requireRole(context, "platform_admin", "recruiter");
  if (roleCheck) return roleCheck;

  const { jobOpeningId } = await req.json();
  const matches = await matchTalentPool({ jobOpeningId });

  return NextResponse.json({ data: matches });
}
