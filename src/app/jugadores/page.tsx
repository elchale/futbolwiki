import { UserSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { PlayerCard } from "@/components/player/player-card";
import { EmptyState } from "@/components/state/empty-state";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { STRINGS } from "@/lib/strings";
import { readParams, type SearchParams } from "@/lib/filters";
import { getPlayerStatsBatch } from "@/lib/player-stats";
import type { Position } from "@/types/entities";

export const revalidate = 86400;

export const metadata = { title: "Jugadores" };

const POSITION_OPTIONS = (["GK", "DEF", "MID", "FWD"] as const).map((p) => ({
  value: p,
  label: STRINGS.position[p],
}));

const SORT_OPTIONS = [
  { value: "name_asc", label: "Nombre (A → Z)" },
  { value: "goals_desc", label: "Más goles (club)" },
  { value: "ntcaps_desc", label: "Más partidos en selección" },
  { value: "ntgoals_desc", label: "Más goles en selección" },
  { value: "age_asc", label: "Más jóvenes primero" },
  { value: "age_desc", label: "Más veteranos primero" },
];

type Props = { searchParams: Promise<SearchParams> };

export default async function JugadoresPage({ searchParams }: Props) {
  const params = await searchParams;
  const { position, team, country, sort } = readParams(params, ["position", "team", "country", "sort"]);

  const [allTeams, allCountries] = await Promise.all([
    prisma.team.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { slug: true, name: true, shortName: true },
    }),
    prisma.country.findMany({
      orderBy: { name: "asc" },
      select: { isoCode: true, name: true },
    }),
  ]);

  const teamRow = team ? await prisma.team.findUnique({ where: { slug: team }, select: { id: true } }) : null;
  const countryRow = country
    ? await prisma.country.findUnique({ where: { isoCode: country }, select: { id: true } })
    : null;

  const where = {
    ...(position ? { position: position as Position } : {}),
    ...(teamRow ? { currentTeamId: teamRow.id } : {}),
    ...(countryRow ? { birthCountryId: countryRow.id } : {}),
  };

  const players = await prisma.player.findMany({
    where,
    orderBy: { fullName: "asc" },
    take: 300,
    include: { currentTeam: { select: { name: true, shortName: true } } },
  });

  const statsMap = await getPlayerStatsBatch(players.map((p) => p.id));

  // sort
  const sorted = [...players];
  const sortKey = sort ?? "name_asc";
  sorted.sort((a, b) => {
    switch (sortKey) {
      case "goals_desc":
        return (statsMap.get(b.id)?.clubGoals ?? 0) - (statsMap.get(a.id)?.clubGoals ?? 0);
      case "ntcaps_desc":
        return (statsMap.get(b.id)?.ntCaps ?? 0) - (statsMap.get(a.id)?.ntCaps ?? 0);
      case "ntgoals_desc":
        return (statsMap.get(b.id)?.ntGoals ?? 0) - (statsMap.get(a.id)?.ntGoals ?? 0);
      case "age_asc":
        return (a.birthDate?.getTime() ?? 0) > (b.birthDate?.getTime() ?? 0) ? -1 : 1;
      case "age_desc":
        return (a.birthDate?.getTime() ?? 0) < (b.birthDate?.getTime() ?? 0) ? -1 : 1;
      default:
        return a.fullName.localeCompare(b.fullName, "es");
    }
  });

  const filters: FilterDef[] = [
    {
      key: "position",
      label: "Posición",
      placeholder: "Todas las posiciones",
      options: POSITION_OPTIONS,
      order: 1,
    },
    {
      key: "team",
      label: "Equipo",
      placeholder: "Todos los equipos",
      options: allTeams.map((t) => ({ value: t.slug, label: t.shortName ?? t.name })),
      order: 2,
    },
    {
      key: "country",
      label: "Nacionalidad",
      placeholder: "Todas las nacionalidades",
      options: allCountries.map((c) => ({ value: c.isoCode, label: c.name })),
      order: 3,
    },
  ];

  return (
    <PageShell className="space-y-8">
      <PageHeader
        eyebrow="Directorio"
        title="Jugadores"
        subtitle="Perfiles cargados con fuentes verificadas."
      />

      <FilterBar
        filters={filters}
        sort={{ options: SORT_OPTIONS, defaultValue: "name_asc" }}
        totalCount={sorted.length}
        resultLabel={{ singular: "jugador", plural: "jugadores" }}
      />

      {sorted.length === 0 ? (
        <EmptyState icon={UserSearch} title={STRINGS.empty.jugadores.title} body={STRINGS.empty.jugadores.body} />
      ) : (
        <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((p) => (
            <StaggerItem key={p.id}>
              <PlayerCard player={p} stats={statsMap.get(p.id)} />
            </StaggerItem>
          ))}
        </StaggerIn>
      )}
    </PageShell>
  );
}
