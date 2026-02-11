import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, unauthorized, requireRole } from "@/lib/auth/middleware";
import { enqueueJob } from "@/lib/jobs/queue";

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();
  
  const roleCheck = requireRole(context, "platform_admin", "recruiter", "client_admin");
  if (roleCheck) return roleCheck;

  const { applicationId } = await req.json();
  await enqueueJob("score-application", { applicationId });

  return NextResponse.json({ message: "Scoring queued", applicationId });
}
