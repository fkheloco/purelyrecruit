import { db } from "@/db";
import { candidates, jobOpenings, applications } from "@/db/schema";
import { eq, sql, not, inArray } from "drizzle-orm";

export async function matchTalentPool(payload: { jobOpeningId: string }) {
  const [job] = await db.select().from(jobOpenings)
    .where(eq(jobOpenings.id, payload.jobOpeningId)).limit(1);
  if (!job) return [];

  const existingApps = await db.select({ candidateId: applications.candidateId })
    .from(applications)
    .where(eq(applications.jobOpeningId, job.id));
  
  const excludeIds = existingApps.map(a => a.candidateId);

  const searchTerms = [job.title, job.department, ...(job.description || "").split(" ").slice(0, 10)]
    .filter(Boolean).join(" & ");

  const matched = await db.select().from(candidates)
    .where(sql`to_tsvector('english',
      coalesce(${candidates.firstName}, '') || ' ' ||
      coalesce(${candidates.lastName}, '') || ' ' ||
      coalesce(${candidates.currentTitle}, '') || ' ' ||
      coalesce(${candidates.currentCompany}, '') || ' ' ||
      coalesce(${candidates.bio}, '')
    ) @@ to_tsquery('english', ${searchTerms})
    ${excludeIds.length > 0 ? sql`AND ${candidates.id} NOT IN (${sql.join(excludeIds.map(id => sql`${id}`), sql`, `)})` : sql``}`)
    .orderBy(sql`ts_rank(to_tsvector('english',
      coalesce(${candidates.currentTitle}, '') || ' ' ||
      coalesce(${candidates.bio}, '')
    ), to_tsquery('english', ${searchTerms})) DESC`)
    .limit(20);

  return matched;
}
