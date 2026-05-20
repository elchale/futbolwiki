import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body?: string;
  cta?: { label: string; href: string };
  className?: string;
};

export function EmptyState({ icon: Icon, title, body, cta, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "mx-auto flex max-w-md flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
        {body ? <p className="text-sm text-muted-foreground">{body}</p> : null}
      </div>
      {cta ? (
        <Button asChild size="sm" variant="outline">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}
