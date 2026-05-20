import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/common/page-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";

export default function NotFound() {
  return (
    <PageShell className="py-20">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="mb-6 inline-flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Compass className="size-7" aria-hidden />
        </span>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Error 404
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {STRINGS.errors.notFound.title}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{STRINGS.errors.notFound.body}</p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.home}>
            {STRINGS.errors.notFound.cta}
            <ArrowRight className="ml-1 size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
