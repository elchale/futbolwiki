/**
 * Helpers for parsing URL search-params into Prisma-compatible filter values.
 * Used by Server Components to translate ?country=PER&sort=goals_desc into
 * { where: {...}, orderBy: {...} }.
 */

export type SearchParams = Record<string, string | string[] | undefined>;

export function readParam(params: SearchParams, key: string): string | null {
  const v = params[key];
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

export function readParams(params: SearchParams, keys: string[]): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const k of keys) out[k] = readParam(params, k);
  return out;
}
