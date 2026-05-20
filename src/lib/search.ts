import "server-only";
import { prisma } from "@/lib/prisma";

export type SearchHit = {
  entityType: string;
  entityId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  body: string;
  rank: number;
};

/**
 * Spanish full-text search across the SearchDocument table.
 * Uses Postgres `tsvector` (built by the search_vector generated column).
 * Returns results ranked by `ts_rank_cd` with title-weight bias.
 */
export async function searchAll(
  query: string,
  opts: { limit?: number; types?: string[] } = {},
): Promise<SearchHit[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const limit = Math.min(Math.max(opts.limit ?? 30, 1), 100);
  // build tsquery — split words, sanitize, add prefix wildcard to each
  const tsquery = trimmed
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[^\p{Letter}\p{Number}]+/gu, ""))
    .filter(Boolean)
    .map((w) => `${w}:*`)
    .join(" & ");

  if (!tsquery) return [];

  const typeFilter = opts.types && opts.types.length > 0;

  const rows = await prisma.$queryRawUnsafe<SearchHit[]>(
    `
    SELECT
      "entityType",
      "entityId",
      "slug",
      "title",
      "subtitle",
      LEFT("body", 200) AS "body",
      ts_rank_cd("search_vector", to_tsquery('spanish', $1)) AS "rank"
    FROM "SearchDocument"
    WHERE "search_vector" @@ to_tsquery('spanish', $1)
    ${typeFilter ? `AND "entityType" = ANY ($3::text[])` : ""}
    ORDER BY "rank" DESC, "title" ASC
    LIMIT $2
    `,
    tsquery,
    limit,
    ...(typeFilter ? [opts.types as string[]] : []),
  );

  return rows;
}

export function groupHitsByType(hits: SearchHit[]): Record<string, SearchHit[]> {
  const groups: Record<string, SearchHit[]> = {};
  for (const h of hits) {
    if (!groups[h.entityType]) groups[h.entityType] = [];
    groups[h.entityType].push(h);
  }
  return groups;
}
