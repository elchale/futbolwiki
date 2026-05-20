import { ExternalLink, BadgeCheck, Info } from "lucide-react";
import { getCitations } from "@/lib/citations";
import type { EntityType, CitationView } from "@/types/citation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { STRINGS } from "@/lib/strings";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/format";

type SourceCitationProps = {
  entityType: EntityType;
  entityId: string;
  field?: string;
  /** When true, never render anything if no citations exist (default true) */
  hideIfEmpty?: boolean;
  className?: string;
};

/**
 * Server Component. Loads citations for an entity+field and renders an
 * inline source pill with a popover preview. If no citations exist,
 * renders nothing (when hideIfEmpty is true, which is the default).
 */
export async function SourceCitation({
  entityType,
  entityId,
  field,
  hideIfEmpty = true,
  className,
}: SourceCitationProps) {
  const citations = await getCitations(entityType, entityId, field);
  if (citations.length === 0) {
    return hideIfEmpty ? null : (
      <span className="ml-1 text-[0.65rem] text-muted-foreground">(sin fuente)</span>
    );
  }
  return <SourcePill citations={citations} className={className} />;
}

/**
 * The visual pill — also exported so seed-time data can pass pre-loaded
 * citation rows (e.g., for MatchContext.factsJson facts).
 */
export function SourcePill({
  citations,
  label,
  className,
}: {
  citations: CitationView[];
  label?: string;
  className?: string;
}) {
  const count = citations.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${STRINGS.source.label}${count > 1 ? `s (${count})` : ""}`}
          className={cn(
            "inline-flex h-5 items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-1.5 align-text-top font-mono text-[0.65rem] font-medium leading-none text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          {label ?? <ExternalLink className="size-3" aria-hidden />}
          {count > 1 ? <span className="tabular-nums">{count}</span> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b border-border bg-muted/40 px-4 py-2.5">
          <p className="font-display text-sm font-semibold">
            {count === 1 ? STRINGS.source.label : STRINGS.citation.sourcesLabel}
          </p>
        </div>
        <ul className="divide-y divide-border">
          {citations.map((c) => (
            <li key={c.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug">{c.sourceTitle}</p>
                {c.confidence === "VERIFIED" ? (
                  <BadgeCheck
                    className="mt-0.5 size-4 shrink-0 text-success"
                    aria-label="Verificada"
                  />
                ) : c.confidence === "PROBABLE" ? (
                  <Info
                    className="mt-0.5 size-4 shrink-0 text-warning"
                    aria-label="Probable"
                  />
                ) : null}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="font-normal">
                  {STRINGS.sourceType[c.sourceType as keyof typeof STRINGS.sourceType] ?? c.sourceType}
                </Badge>
                {c.sourcePublisher ? <span>· {c.sourcePublisher}</span> : null}
              </div>
              {c.note ? (
                <p className="mt-2 text-xs italic text-muted-foreground">{c.note}</p>
              ) : null}
              <a
                href={c.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {STRINGS.source.viewSource}
                <ExternalLink className="size-3" aria-hidden />
              </a>
              <p className="mt-1 text-[0.65rem] text-muted-foreground">
                {STRINGS.source.accessedOn} {formatShortDate(c.accessedAt)}
              </p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
