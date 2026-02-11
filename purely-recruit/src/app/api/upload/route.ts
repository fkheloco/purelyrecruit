import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { enqueueJob } from "@/lib/jobs/queue";
import { db } from "@/db";
import { resumes } from "@/db/schema";

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const candidateId = formData.get("candidateId") as string;

  if (!file || !candidateId) {
    return NextResponse.json({ error: "File and candidateId required" }, { status: 400 });
  }

  const blob = await put(
    `resumes/${candidateId}/${Date.now()}-${file.name}`,
    file,
    { access: "public" },
  );

  const [resume] = await db
    .insert(resumes)
    .values({
      candidateId,
      fileUrl: blob.url,
      fileName: file.name,
      fileType: file.type,
      fileSize: String(file.size),
      isPrimary: true,
    })
    .returning();

  await enqueueJob("parse-resume", { resumeId: resume.id, candidateId });

  return NextResponse.json({ resume, blobUrl: blob.url }, { status: 201 });
}
