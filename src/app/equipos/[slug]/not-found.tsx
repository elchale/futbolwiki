import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/common/page-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";

export default function TeamNotFound() {
  return (
    <PageShell className="py-20">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="mb-6 inline-flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Users className="size-7" aria-hidden />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {STRINGS.team.notFound}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          El club que buscás no existe o aún no está cargado.
        </p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.equipos}>
            Ver todos los equipos
            <ArrowRight className="ml-1 size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
