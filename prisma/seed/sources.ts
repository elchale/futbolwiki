import type { SourceType } from "../../src/generated/prisma/client";
import { prisma } from "./client";

export type SourceInput = {
  url: string;
  title: string;
  publisher?: string;
  type: SourceType;
  language?: string;
};

/**
 * Idempotent: upsert by URL (URLs are unique enough for our needs).
 * Returns the Source.id.
 */
export async function upsertSource(input: SourceInput): Promise<string> {
  const existing = await prisma.source.findFirst({ where: { url: input.url } });
  if (existing) {
    // refresh accessedAt to "now"
    const updated = await prisma.source.update({
      where: { id: existing.id },
      data: {
        title: input.title,
        publisher: input.publisher ?? existing.publisher,
        type: input.type,
        language: input.language ?? existing.language,
        accessedAt: new Date(),
      },
    });
    return updated.id;
  }
  const created = await prisma.source.create({
    data: {
      url: input.url,
      title: input.title,
      publisher: input.publisher ?? null,
      type: input.type,
      language: input.language ?? "es",
    },
  });
  return created.id;
}

/**
 * Convenience for the common "Wikipedia ES + EN of a topic" pattern.
 */
export async function upsertWikipediaSources(args: {
  topic: string;
  esUrl?: string;
  enUrl?: string;
}): Promise<string[]> {
  const ids: string[] = [];
  if (args.esUrl) {
    ids.push(
      await upsertSource({
        url: args.esUrl,
        title: `${args.topic} — Wikipedia (es)`,
        publisher: "Wikipedia",
        type: "WIKIPEDIA_ES",
        language: "es",
      }),
    );
  }
  if (args.enUrl) {
    ids.push(
      await upsertSource({
        url: args.enUrl,
        title: `${args.topic} — Wikipedia (en)`,
        publisher: "Wikipedia",
        type: "WIKIPEDIA_EN",
        language: "en",
      }),
    );
  }
  return ids;
}
