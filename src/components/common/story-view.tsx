import { SourcePill } from "@/components/citation/source-citation";
import type { Story, StorySection, StorySource } from "@/types/story";
import type { CitationView } from "@/types/citation";
import { cn } from "@/lib/utils";

const sourceToCitation = (s: StorySource, i: number): CitationView => ({
  id: `inline-${i}-${s.url}`,
  sourceId: `inline-${i}`,
  sourceTitle: s.title,
  sourcePublisher: s.publisher ?? null,
  sourceUrl: s.url,
  sourceType: s.type,
  language: "es",
  confidence: "VERIFIED",
  accessedAt: new Date().toISOString(),
  note: null,
});

export function StoryView({ story, className }: { story: Story; className?: string }) {
  if (!story.sections || story.sections.length === 0) return null;
  return (
    <div className={cn("space-y-16", className)}>
      {story.sections.map((section) => (
        <StorySectionView key={section.id} section={section} />
      ))}
    </div>
  );
}

function StorySectionView({ section }: { section: StorySection }) {
  const citations = section.sources?.map(sourceToCitation) ?? [];
  return (
    <section id={section.id} className="scroll-mt-24 space-y-5">
      <header className="flex items-end justify-between gap-3 border-b border-border pb-3">
        <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {section.title}
        </h2>
        {citations.length > 0 ? <SourcePill citations={citations} /> : null}
      </header>
      <div className="max-w-prose space-y-5 text-base leading-relaxed text-foreground">
        {section.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

/**
 * A right-rail table of contents for long stories — only shown on large screens.
 */
export function StoryToc({ story }: { story: Story }) {
  if (!story.sections || story.sections.length < 2) return null;
  return (
    <aside className="sticky top-20 hidden self-start lg:block">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        En esta página
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {story.sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
