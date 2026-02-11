import { db } from "@/db";
import { candidates, jobOpenings } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function searchCandidates(
  query: string,
  filters?: {
    locationState?: string;
    minExperience?: number;
    availability?: string;
  },
) {
  const tsquery = query.trim().split(/\s+/).join(" & ");

  let whereClause = sql`to_tsvector('english',
    coalesce(${candidates.firstName}, '') || ' ' ||
    coalesce(${candidates.lastName}, '') || ' ' ||
    coalesce(${candidates.currentTitle}, '') || ' ' ||
    coalesce(${candidates.currentCompany}, '') || ' ' ||
    coalesce(${candidates.bio}, '')
  ) @@ to_tsquery('english', ${tsquery})`;

  if (filters?.locationState) {
    whereClause = sql`${whereClause} AND ${candidates.locationState} = ${filters.locationState}`;
  }
  if (filters?.minExperience) {
    whereClause = sql`${whereClause} AND ${candidates.yearsExperience} >= ${filters.minExperience}`;
  }

  return db
    .select()
    .from(candidates)
    .where(whereClause)
    .orderBy(sql`ts_rank(to_tsvector('english',
      coalesce(${candidates.firstName}, '') || ' ' ||
      coalesce(${candidates.lastName}, '') || ' ' ||
      coalesce(${candidates.currentTitle}, '') || ' ' ||
      coalesce(${candidates.currentCompany}, '') || ' ' ||
      coalesce(${candidates.bio}, '')
    ), to_tsquery('english', ${tsquery})) DESC`)
    .limit(50);
}

export async function searchJobs(
  query: string,
  filters?: {
    tenantId?: string;
    status?: string;
    locationType?: string;
  },
) {
  const tsquery = query.trim().split(/\s+/).join(" & ");

  let whereClause = sql`to_tsvector('english',
    coalesce(${jobOpenings.title}, '') || ' ' ||
    coalesce(${jobOpenings.department}, '') || ' ' ||
    coalesce(${jobOpenings.description}, '')
  ) @@ to_tsquery('english', ${tsquery})`;

  if (filters?.tenantId) {
    whereClause = sql`${whereClause} AND ${jobOpenings.tenantId} = ${filters.tenantId}`;
  }
  if (filters?.status) {
    whereClause = sql`${whereClause} AND ${jobOpenings.status} = ${filters.status}`;
  }

  return db
    .select()
    .from(jobOpenings)
    .where(whereClause)
    .orderBy(sql`ts_rank(to_tsvector('english',
      coalesce(${jobOpenings.title}, '') || ' ' ||
      coalesce(${jobOpenings.department}, '') || ' ' ||
      coalesce(${jobOpenings.description}, '')
    ), to_tsquery('english', ${tsquery})) DESC`)
    .limit(50);
}
