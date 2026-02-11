import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and, desc, gt } from "drizzle-orm";
import { getAuthContext, unauthorized } from "@/lib/auth/middleware";

export async function GET(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");

  let conditions: any[] = [eq(notifications.userId, context.userId)];

  if (since) {
    conditions.push(gt(notifications.createdAt, new Date(parseInt(since))));
  }

  const items = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  const unreadCount = items.filter((n) => !n.isRead).length;

  return NextResponse.json({ notifications: items, unreadCount, timestamp: Date.now() });
}

export async function PATCH(req: NextRequest) {
  const context = await getAuthContext();
  if (!context) return unauthorized();

  const { notificationIds } = await req.json();

  for (const id of notificationIds) {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, context.userId)));
  }

  return NextResponse.json({ success: true });
}
