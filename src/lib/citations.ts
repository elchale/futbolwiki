import "server-only";
import { prisma } from "@/lib/prisma";
import type { EntityType, CitationView } from "@/types/citation";

/**
 * Returns all citations for a given entity (and optional specific field),
 * joined with Source rows and shaped for the <SourceCitation /> component.
 *
 * Unverified citations are filtered out — pages should never show
 * unverified facts. To include unverified, pass { includeUnverified: true }.
 */
export async function getCitations(
  entityType: EntityType,
  entityId: string,
  field?: string,
  opts: { includeUnverified?: boolean } = {},
): Promise<CitationView[]> {
  const rows = await prisma.factCitation.findMany({
    where: {
      entityType,
      entityId,
      ...(field ? { fieldName: field } : {}),
      ...(opts.includeUnverified ? {} : { confidence: { not: "UNVERIFIED" } }),
    },
    include: { source: true },
    orderBy: [
      { confidence: "asc" }, // VERIFIED first (alphabetical)
      { source: { accessedAt: "desc" } },
    ],
  });

  return rows.map(
    (row): CitationView => ({
      id: row.id,
      sourceId: row.source.id,
      sourceTitle: row.source.title,
      sourcePublisher: row.source.publisher,
      sourceUrl: row.source.url,
      sourceType: row.source.type,
      language: row.source.language,
      confidence: row.confidence,
      accessedAt: row.source.accessedAt.toISOString(),
      note: row.note,
    }),
  );
}

/**
 * Batch helper: fetch citations for many fields of a single entity in one query.
 * Returned as a map keyed by fieldName.
 */
export async function getCitationsByField(
  entityType: EntityType,
  entityId: string,
): Promise<Record<string, CitationView[]>> {
  const rows = await prisma.factCitation.findMany({
    where: {
      entityType,
      entityId,
      confidence: { not: "UNVERIFIED" },
    },
    include: { source: true },
    orderBy: [{ confidence: "asc" }, { source: { accessedAt: "desc" } }],
  });

  const map: Record<string, CitationView[]> = {};
  for (const row of rows) {
    const key = row.fieldName ?? "_entity";
    const view: CitationView = {
      id: row.id,
      sourceId: row.source.id,
      sourceTitle: row.source.title,
      sourcePublisher: row.source.publisher,
      sourceUrl: row.source.url,
      sourceType: row.source.type,
      language: row.source.language,
      confidence: row.confidence,
      accessedAt: row.source.accessedAt.toISOString(),
      note: row.note,
    };
    if (!map[key]) map[key] = [];
    map[key].push(view);
  }
  return map;
}
