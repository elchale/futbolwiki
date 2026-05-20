/**
 * Mirror of src/types/story.ts kept locally so seed scripts (which run via tsx
 * outside the Next.js bundler) don't need to traverse the `server-only` package.
 */

import type { SourceType } from "../../../src/generated/prisma/client";

export type StorySource = {
  url: string;
  title: string;
  publisher?: string;
  type: SourceType;
};

export type StorySection = {
  id: string;
  title: string;
  paragraphs: string[];
  sources?: StorySource[];
};

export type Story = {
  sections: StorySection[];
};

/** Wikipedia-ES helper for the common case. */
export const wiki = (url: string, title: string): StorySource => ({
  url,
  title,
  publisher: "Wikipedia",
  type: "WIKIPEDIA_ES",
});
