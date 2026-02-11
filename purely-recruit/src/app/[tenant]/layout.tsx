import { notFound } from "next/navigation";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    tenant: string;
  }>;
}

async function getTenant(slug: string) {
  const tenant = await db.select().from(tenants).where(eq(tenants.slug, slug));
  return tenant[0] || null;
}

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const tenantData = await getTenant(tenant);

  if (!tenantData) {
    return {
      title: "Not Found",
      description: "This page could not be found",
    };
  }

  return {
    title: `${tenantData.name} Jobs — Powered by Purely Recruit`,
    description: tenantData.description || `View open positions at ${tenantData.name}`,
  };
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant } = await params;
  const { userId } = await auth();
  const tenantData = await getTenant(tenant);

  if (!tenantData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ "--primary": tenantData?.primaryColor, "--accent": tenantData?.accentColor } as any}>
      <header className="border-b" style={{ borderColor: (tenantData?.primaryColor || "#455E7F") + "20" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href={`/${tenant}/jobs`} className="flex items-center gap-3">
              {tenantData?.logoUrl && (
                <img
                  src={tenantData.logoUrl}
                  alt={tenantData?.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-xl font-bold" style={{ color: tenantData?.primaryColor || "#455E7F" } as React.CSSProperties}>
                  {tenantData?.name}
                </h1>
                <p className="text-xs text-gray-500">Powered by Purely Recruit</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href={`/${tenant}/jobs`}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Our Jobs
              </Link>

              {tenantData?.website && (
                <Link
                  href={tenantData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  About Us
                </Link>
              )}

              {userId ? (
                <>
                  <Link
                    href="/recruiter/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/sign-out"
                    className="text-sm font-medium"
                    style={{ color: tenantData?.primaryColor || "#455E7F" } as React.CSSProperties}
                  >
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
                    style={{ backgroundColor: tenantData?.primaryColor || "#455E7F" } as React.CSSProperties}
                  >
                    Apply
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {tenantData?.name} — Careers Portal
            </p>
            <p className="text-xs text-gray-500">
              Powered by Purely Recruit, AI-Enhanced Recruiting
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
