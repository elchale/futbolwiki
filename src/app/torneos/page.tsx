import { Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { TournamentCard } from "@/components/tournament/tournament-card";
import { EmptyState } from "@/components/state/empty-state";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { STRINGS } from "@/lib/strings";
import { readParams, type SearchParams } from "@/lib/filters";
import type { Confederation } from "@/types/entities";

export const revalidate = 86400;

export const metadata = { title: "Torneos" };

const SORT_OPTIONS = [
  { value: "name_asc", label: "Nombre (A → Z)" },
  { value: "founded_asc", label: "Más antiguos primero" },
  { value: "founded_desc", label: "Más nuevos primero" },
];

const CONFEDERATIONS: Confederation[] = ["CONMEBOL", "UEFA", "CONCACAF", "AFC", "CAF", "OFC"];

type Props = { searchParams: Promise<SearchParams> };

export default async function TorneosPage({ searchParams }: Props) {
  const params = await searchParams;
  const { confederation, sort } = readParams(params, ["confederation", "sort"]);

  const where = confederation ? { confederation: confederation as Confederation } : {};
  const orderBy =
    sort === "founded_desc"
      ? [{ foundedYear: "desc" as const }]
      : sort === "founded_asc"
        ? [{ foundedYear: "asc" as const }]
        : [{ name: "asc" as const }];

  const tournaments = await prisma.tournament.findMany({ where, orderBy });

  const filters: FilterDef[] = [
    {
      key: "confederation",
      label: "Confederación",
      placeholder: "Todas las confederaciones",
      options: CONFEDERATIONS.map((c) => ({ value: c, label: STRINGS.confederation[c] })),
      order: 1,
    },
  ];

  return (
    <PageShell className="space-y-8">
      <PageHeader
        eyebrow="Directorio"
        title="Torneos"
        subtitle="Las copas más importantes del mundo del fútbol."
      />

      <FilterBar
        filters={filters}
        sort={{ options: SORT_OPTIONS, defaultValue: "name_asc" }}
        totalCount={tournaments.length}
        resultLabel={{ singular: "torneo", plural: "torneos" }}
      />

      {tournaments.length === 0 ? (
        <EmptyState icon={Award} title={STRINGS.empty.torneos.title} body={STRINGS.empty.torneos.body} />
      ) : (
        <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((t) => (
            <StaggerItem key={t.id}>
              <TournamentCard tournament={t} />
            </StaggerItem>
          ))}
        </StaggerIn>
      )}
    </PageShell>
  );
}
