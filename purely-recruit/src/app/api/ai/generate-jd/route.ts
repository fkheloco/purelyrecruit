import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, unauthorized, requireRole } from "@/lib/auth/middleware";
import { generateJobDescription } from "@/lib/ai/job-description";

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const roleCheck = requireRole(context, "platform_admin", "recruiter", "client_admin");
  if (roleCheck) return roleCheck;

  const body = await req.json();
  const result = await generateJobDescription(body);

  return NextResponse.json({ data: result });
}
