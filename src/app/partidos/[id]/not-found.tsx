import Link from "next/link";
import { CalendarOff, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/common/page-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function MatchNotFound() {
  return (
    <PageShell className="py-20">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="mb-6 inline-flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CalendarOff className="size-7" aria-hidden />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Partido no encontrado
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          El encuentro que buscás no existe o aún no está cargado.
        </p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.partidos}>
            Ver todos los partidos
            <ArrowRight className="ml-1 size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
