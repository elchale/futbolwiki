"use client";

import { useEffect } from "react";
import { PageShell } from "@/components/common/page-shell";
import { ErrorState } from "@/components/state/error-state";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface to whatever logging infra is wired later.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [error]);

  return (
    <PageShell className="py-20">
      <ErrorState onRetry={reset} />
    </PageShell>
  );
}
