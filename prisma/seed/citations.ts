import type { CitationConfidence } from "../../src/generated/prisma/client";
import { prisma } from "./client";

export type CiteInput = {
  entityType: string;
  entityId: string;
  sourceIds: string[];
  fields?: string[];
  confidence?: CitationConfidence;
  note?: string;
};

/**
 * Idempotent: removes any existing FactCitation rows for the
 * (entity, field) pair before inserting fresh ones. This ensures
 * a seed re-run reflects the latest set of sources rather than
 * accumulating duplicates.
 *
 * If `fields` is empty/undefined, the citation applies at the
 * entity-level (fieldName = null).
 */
export async function cite(input: CiteInput): Promise<number> {
  const { entityType, entityId, sourceIds, fields, confidence = "VERIFIED", note } = input;
  if (sourceIds.length === 0) {
    throw new Error(`cite() called with no sourceIds for ${entityType} ${entityId}`);
  }
  const fieldList: (string | null)[] = fields && fields.length > 0 ? fields : [null];
  let inserted = 0;

  for (const field of fieldList) {
    await prisma.factCitation.deleteMany({
      where: { entityType, entityId, fieldName: field },
    });
    await prisma.factCitation.createMany({
      data: sourceIds.map((sourceId) => ({
        entityType,
        entityId,
        fieldName: field,
        sourceId,
        confidence,
        note: note ?? null,
      })),
    });
    inserted += sourceIds.length;
  }
  return inserted;
}

/**
 * Audit helper — counts entity records of a given type that have
 * fewer than 1 FactCitation row. Logged at end of seed for visibility.
 */
export async function auditUncitedCount(entityType: string, ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  const cited = await prisma.factCitation.findMany({
    where: { entityType, entityId: { in: ids } },
    select: { entityId: true },
    distinct: ["entityId"],
  });
  const citedSet = new Set(cited.map((c) => c.entityId));
  return ids.filter((id) => !citedSet.has(id)).length;
}
