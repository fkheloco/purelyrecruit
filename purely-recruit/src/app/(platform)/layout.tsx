import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  try {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
  } catch (error) {
    // Auth not available during build
    redirect("/sign-in");
  }

  return <>{children}</>;
}
