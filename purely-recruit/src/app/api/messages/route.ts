import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";
import { desc, eq, or } from "drizzle-orm";
import { notify } from "@/lib/notifications/notify";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const data = await db.select().from(messages)
    .where(or(eq(messages.senderId, context.userId), eq(messages.recipientId, context.userId)))
    .orderBy(desc(messages.createdAt))
    .limit(50);

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const body = await req.json();
  
  const [message] = await db.insert(messages).values({
    senderId: context.userId,
    recipientId: body.recipientId,
    tenantId: context.tenantId,
    candidateId: body.candidateId,
    applicationId: body.applicationId,
    subject: body.subject,
    body: body.body,
    channel: "in_app",
  }).returning();

  if (body.recipientId) {
    await notify({
      userId: body.recipientId,
      tenantId: context.tenantId || undefined,
      type: "new_message",
      title: `New message from ${context.firstName || "Team"}`,
      body: body.subject || body.body?.slice(0, 100),
      referenceType: "message",
      referenceId: message.id,
    });
  }

  return NextResponse.json({ data: message }, { status: 201 });
}
