import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="space-y-2">
          <Link
            href={ROUTES.home}
            className="font-display text-lg font-semibold"
            aria-label={STRINGS.site.name}
          >
            <span className="text-primary">Fútbol</span>
            <span className="ml-1">Wiki</span>
          </Link>
          <p className="max-w-prose text-sm text-muted-foreground">
            {STRINGS.site.description}
          </p>
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href={ROUTES.partidos} className="hover:text-foreground">{STRINGS.nav.partidos}</Link>
          <Link href={ROUTES.equipos} className="hover:text-foreground">{STRINGS.nav.equipos}</Link>
          <Link href={ROUTES.jugadores} className="hover:text-foreground">{STRINGS.nav.jugadores}</Link>
          <Link href={ROUTES.ligas} className="hover:text-foreground">{STRINGS.nav.ligas}</Link>
          <Link href={ROUTES.torneos} className="hover:text-foreground">{STRINGS.nav.torneos}</Link>
          <Link href={ROUTES.selecciones} className="hover:text-foreground">{STRINGS.nav.selecciones}</Link>
          <Link href={ROUTES.sobre} className="hover:text-foreground">{STRINGS.nav.sobre}</Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} {STRINGS.site.name}.</span>
          <span>Contenido en español, con fuentes verificadas.</span>
        </div>
      </div>
    </footer>
  );
}
