import Link from "next/link";
import { Search, SearchX, Users, UserSearch, Trophy, Award, Flag } from "lucide-react";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/state/empty-state";
import { searchAll, groupHitsByType, type SearchHit } from "@/lib/search";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";

export const dynamic = "force-dynamic";

export const metadata = { title: STRINGS.nav.buscar };

const ICONS = {
  TEAM: Users,
  PLAYER: UserSearch,
  COACH: UserSearch,
  LEAGUE: Trophy,
  TOURNAMENT: Award,
  NATIONAL_TEAM: Flag,
} as const;

const TYPE_LABEL: Record<string, string> = {
  TEAM: "Equipos",
  PLAYER: "Jugadores",
  COACH: "Entrenadores",
  LEAGUE: "Ligas",
  TOURNAMENT: "Torneos",
  NATIONAL_TEAM: "Selecciones",
};

function routeForHit(h: SearchHit): string {
  switch (h.entityType) {
    case "TEAM": return ROUTES.equipo(h.slug);
    case "PLAYER": return ROUTES.jugador(h.slug);
    case "COACH": return ROUTES.entrenador(h.slug);
    case "LEAGUE": return ROUTES.liga(h.slug);
    case "TOURNAMENT": return ROUTES.torneo(h.slug);
    case "NATIONAL_TEAM": return ROUTES.seleccion(h.slug);
    default: return "/";
  }
}

type SearchProps = { searchParams: Promise<{ q?: string }> };

export default async function BuscarPage({ searchParams }: SearchProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const hits = query ? await searchAll(query, { limit: 60 }) : [];
  const groups = groupHitsByType(hits);
  const groupOrder = ["TEAM", "PLAYER", "COACH", "LEAGUE", "TOURNAMENT", "NATIONAL_TEAM"];

  return (
    <PageShell className="space-y-10">
      <PageHeader
        eyebrow="Buscador"
        title="Buscar"
        subtitle={query ? STRINGS.search.resultsFor(query) : "Encontrá equipos, jugadores, ligas, torneos y más."}
      />

      <form action={ROUTES.buscar} method="get" className="flex flex-col gap-3 sm:flex-row">
        <Input
          name="q"
          defaultValue={query}
          placeholder={STRINGS.search.placeholder}
          aria-label={STRINGS.search.placeholder}
          autoFocus
          className="flex-1"
        />
        <Button type="submit">
          <Search className="mr-1 size-4" aria-hidden /> {STRINGS.search.submit}
        </Button>
      </form>

      {!query ? null : hits.length === 0 ? (
        <EmptyState icon={SearchX} title={STRINGS.empty.search.title} body={STRINGS.empty.search.body} />
      ) : (
        <div className="space-y-10">
          {groupOrder.map((type) => {
            const group = groups[type] ?? [];
            if (group.length === 0) return null;
            const Icon = ICONS[type as keyof typeof ICONS] ?? Search;
            return (
              <Section key={type} title={TYPE_LABEL[type] ?? type} subtitle={`${group.length} resultados`}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((h) => (
                    <Card key={`${h.entityType}-${h.entityId}`} asChild className="p-0 transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <Link
                        href={routeForHit(h)}
                        className="flex items-start gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                        <div className="min-w-0">
                          <p className="truncate font-display text-base font-semibold">{h.title}</p>
                          {h.subtitle ? (
                            <p className="truncate text-xs text-muted-foreground">{h.subtitle}</p>
                          ) : null}
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </Section>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
