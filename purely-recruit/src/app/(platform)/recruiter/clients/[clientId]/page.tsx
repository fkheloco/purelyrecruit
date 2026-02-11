import { db } from "@/db";
import { tenants, jobOpenings, applications } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";

export default async function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, clientId)).limit(1);
  if (!tenant) notFound();

  const [jobCount] = await db.select({ count: sql<number>`count(*)` }).from(jobOpenings).where(eq(jobOpenings.tenantId, clientId));
  const [appCount] = await db.select({ count: sql<number>`count(*)` }).from(applications).where(eq(applications.tenantId, clientId));

  return (
    <div>
      <PageHeader title={tenant.name} description={tenant.industry || "Client organization"} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard label="Total Jobs" value={Number(jobCount.count)} />
        <StatCard label="Total Applications" value={Number(appCount.count)} />
        <StatCard label="Portal" value={`/${tenant.slug}/jobs`} />
      </div>

      <div className="mt-8 rounded-lg border bg-white p-6">
        <h3 className="text-lg font-semibold">Client Details</h3>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-gray-500">Slug</dt><dd className="font-medium">{tenant.slug}</dd></div>
          <div><dt className="text-gray-500">Website</dt><dd className="font-medium">{tenant.website || "—"}</dd></div>
          <div><dt className="text-gray-500">Custom Domain</dt><dd className="font-medium">{tenant.customDomain || "—"}</dd></div>
          <div><dt className="text-gray-500">Industry</dt><dd className="font-medium">{tenant.industry || "—"}</dd></div>
          <div><dt className="text-gray-500">Brand Color</dt><dd className="flex items-center gap-2"><span className="h-4 w-4 rounded" style={{ backgroundColor: tenant.primaryColor || "#455E7F" }} />{tenant.primaryColor}</dd></div>
        </dl>
      </div>
    </div>
  );
}
