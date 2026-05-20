import type { SourceType } from "@/generated/prisma/client";

/** A single citable source inline in a story section. */
export type StorySource = {
  url: string;
  title: string;
  publisher?: string;
  type: SourceType;
};

/** One section of a long-form story (e.g. "Historia", "Anécdotas"). */
export type StorySection = {
  /** stable slug used for anchoring + citation field names */
  id: string;
  title: string;
  paragraphs: string[];
  sources?: StorySource[];
};

export type Story = {
  sections: StorySection[];
};

/** Type guard: safely parse an unknown `story` JSON column into a Story. */
export function parseStory(json: unknown): Story | null {
  if (!json || typeof json !== "object") return null;
  const obj = json as Record<string, unknown>;
  if (!Array.isArray(obj.sections)) return null;
  const sections: StorySection[] = [];
  for (const raw of obj.sections) {
    if (!raw || typeof raw !== "object") continue;
    const s = raw as Record<string, unknown>;
    if (typeof s.id !== "string" || typeof s.title !== "string") continue;
    if (!Array.isArray(s.paragraphs)) continue;
    sections.push({
      id: s.id,
      title: s.title,
      paragraphs: s.paragraphs.filter((p): p is string => typeof p === "string"),
      sources: Array.isArray(s.sources)
        ? (s.sources as StorySource[]).filter(
            (src) => src && typeof src.url === "string" && typeof src.title === "string",
          )
        : undefined,
    });
  }
  return { sections };
}
