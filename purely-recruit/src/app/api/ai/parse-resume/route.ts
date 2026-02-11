import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { enqueueJob } from "@/lib/jobs/queue";

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { resumeId, candidateId } = await req.json();
  await enqueueJob("parse-resume", { resumeId, candidateId });

  return NextResponse.json({ message: "Parsing queued", resumeId });
}
