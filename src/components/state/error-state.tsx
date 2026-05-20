"use client";

import { TriangleAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STRINGS } from "@/lib/strings";

export function ErrorState({
  title,
  body,
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {title ?? STRINGS.errors.generic.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {body ?? STRINGS.errors.generic.body}
        </p>
      </div>
      {onRetry ? (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 size-4" aria-hidden />
          {STRINGS.retry}
        </Button>
      ) : null}
    </div>
  );
}
