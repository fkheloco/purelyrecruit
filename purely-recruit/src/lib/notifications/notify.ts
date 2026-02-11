import { db } from "@/db";
import { notifications } from "@/db/schema";

type NotifyParams = {
  userId: string;
  tenantId?: string;
  type: string;
  title: string;
  body?: string;
  referenceType?: string;
  referenceId?: string;
};

export async function notify(params: NotifyParams) {
  await db.insert(notifications).values({
    userId: params.userId,
    tenantId: params.tenantId || null,
    type: params.type,
    title: params.title,
    body: params.body,
    referenceType: params.referenceType,
    referenceId: params.referenceId,
    isRead: false,
  });

  if (process.env.RESEND_API_KEY) {
    const { enqueueJob } = await import("@/lib/jobs/queue");
    await enqueueJob("send-notification", {
      ...params,
      channel: "email",
    });
  }
}
