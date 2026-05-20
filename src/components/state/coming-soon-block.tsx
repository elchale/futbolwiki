import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { STRINGS } from "@/lib/strings";

export function ComingSoonBlock({
  title,
  body,
  className,
}: {
  title?: string;
  body?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-5 py-4",
        className,
      )}
    >
      <Sparkles className="mt-0.5 size-5 shrink-0 text-brand-gold" aria-hidden />
      <div>
        <p className="font-display text-base font-semibold leading-tight">
          {title ?? STRINGS.comingSoon.title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {body ?? STRINGS.comingSoon.body}
        </p>
      </div>
    </div>
  );
}
