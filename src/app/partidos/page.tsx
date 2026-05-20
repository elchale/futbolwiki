import { CalendarOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { MatchCard } from "@/components/match/match-card";
import { EmptyState } from "@/components/state/empty-state";
import { Section } from "@/components/common/section";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";
import { readParams, type SearchParams } from "@/lib/filters";
import type { MatchStatus } from "@/types/entities";

export const revalidate = 3600;

export const metadata = { title: "Partidos" };

const STATUS_OPTIONS: { value: MatchStatus; label: string }[] = [
  { value: "SCHEDULED", label: STRINGS.match.upcoming },
  { value: "LIVE", label: STRINGS.match.live },
  { value: "FINISHED", label: STRINGS.match.finished },
  { value: "POSTPONED", label: STRINGS.match.postponed },
];

const SORT_OPTIONS = [
  { value: "date_asc", label: "Fecha ↑ (próximos primero)" },
  { value: "date_desc", label: "Fecha ↓ (recientes primero)" },
];

type Props = { searchParams: Promise<SearchParams> };

export default async function PartidosPage({ searchParams }: Props) {
  const params = await searchParams;
  const { league, team, status, sort } = readParams(params, ["league", "team", "status", "sort"]);

  const allLeagues = await prisma.league.findMany({
    orderBy: [{ tier: "asc" }, { name: "asc" }],
    select: { slug: true, name: true, shortName: true },
  });
  const allTeams = await prisma.team.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { slug: true, name: true, shortName: true },
  });

  const leagueRow = league ? await prisma.league.findUnique({ where: { slug: league }, select: { id: true } }) : null;
  const teamRow = team ? await prisma.team.findUnique({ where: { slug: team }, select: { id: true } }) : null;

  const filtersWhere = {
    ...(leagueRow ? { leagueId: leagueRow.id } : {}),
    ...(teamRow ? { OR: [{ homeTeamId: teamRow.id }, { awayTeamId: teamRow.id }] } : {}),
    ...(status ? { status: status as MatchStatus } : {}),
  };

  const orderBy = sort === "date_desc" ? [{ date: "desc" as const }] : [{ date: "asc" as const }];
  const include = {
    homeTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
    awayTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
    league: { select: { slug: true, name: true } },
    stadium: { select: { name: true } },
  };

  const matches = await prisma.match.findMany({
    where: filtersWhere,
    orderBy,
    take: 60,
    include,
  });

  // when no filters and default sort, split into upcoming/finished sections
  const hasAnyFilter = league || team || status || sort;
  let upcoming = matches;
  let finished: typeof matches = [];
  if (!hasAnyFilter) {
    const now = new Date();
    upcoming = matches.filter((m) => m.date >= now && (m.status === "SCHEDULED" || m.status === "LIVE"));
    finished = await prisma.match.findMany({
      where: { status: "FINISHED" },
      orderBy: { date: "desc" },
      take: 12,
      include,
    });
  }

  const filterDefs: FilterDef[] = [
    {
      key: "status",
      label: "Estado",
      placeholder: "Cualquier estado",
      options: STATUS_OPTIONS,
      order: 1,
    },
    {
      key: "league",
      label: "Liga",
      placeholder: "Todas las ligas",
      options: allLeagues.map((l) => ({ value: l.slug, label: l.shortName ?? l.name })),
      order: 2,
    },
    {
      key: "team",
      label: "Equipo",
      placeholder: "Todos los equipos",
      options: allTeams.map((t) => ({ value: t.slug, label: t.shortName ?? t.name })),
      order: 3,
    },
  ];

  return (
    <PageShell className="space-y-8">
      <PageHeader
        eyebrow="Calendario"
        title="Partidos"
        subtitle="Próximos encuentros y resultados recientes del fútbol que cubrimos."
      />

      <FilterBar
        filters={filterDefs}
        sort={{ options: SORT_OPTIONS, defaultValue: "date_asc" }}
        totalCount={hasAnyFilter ? matches.length : upcoming.length + finished.length}
        resultLabel={{ singular: "partido", plural: "partidos" }}
      />

      {!hasAnyFilter ? (
        <>
          <Section title="Próximamente" subtitle={`${upcoming.length} partidos programados`}>
            {upcoming.length === 0 ? (
              <EmptyState
                icon={CalendarOff}
                title={STRINGS.empty.partidos.title}
                body={STRINGS.empty.partidos.body}
                cta={{ label: STRINGS.empty.partidos.cta, href: ROUTES.equipos }}
              />
            ) : (
              <StaggerIn className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {upcoming.map((m) => (
                  <StaggerItem key={m.id}>
                    <MatchCard match={m} />
                  </StaggerItem>
                ))}
              </StaggerIn>
            )}
          </Section>
          {finished.length > 0 ? (
            <Section title="Resultados recientes" subtitle="Lo más reciente del balompié peruano y mundial">
              <StaggerIn className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {finished.map((m) => (
                  <StaggerItem key={m.id}>
                    <MatchCard match={m} />
                  </StaggerItem>
                ))}
              </StaggerIn>
            </Section>
          ) : null}
        </>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={CalendarOff}
          title="Sin partidos con esos filtros"
          body="Probá relajar algún criterio."
        />
      ) : (
        <StaggerIn className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((m) => (
            <StaggerItem key={m.id}>
              <MatchCard match={m} />
            </StaggerItem>
          ))}
        </StaggerIn>
      )}
    </PageShell>
  );
}
