import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { UserRole } from "./roles";

export type AuthContext = {
  clerkId: string;
  userId: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
  firstName: string | null;
  lastName: string | null;
};

export async function getAuthContext(): Promise<AuthContext | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user) return null;

  return {
    clerkId,
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
    tenantId: user.tenantId,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function requireRole(context: AuthContext, ...roles: UserRole[]) {
  if (!roles.includes(context.role)) {
    return forbidden();
  }
  return null;
}
