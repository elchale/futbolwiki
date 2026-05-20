import { Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { LeagueCard } from "@/components/league/league-card";
import { EmptyState } from "@/components/state/empty-state";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { STRINGS } from "@/lib/strings";
import { readParams, type SearchParams } from "@/lib/filters";
import type { Confederation } from "@/types/entities";

export const revalidate = 86400;

export const metadata = { title: "Ligas" };

const SORT_OPTIONS = [
  { value: "name_asc", label: "Nombre (A → Z)" },
  { value: "tier_asc", label: "División (1ª primero)" },
  { value: "founded_asc", label: "Más antiguas primero" },
];

const CONFEDERATIONS: Confederation[] = ["CONMEBOL", "UEFA", "CONCACAF", "AFC", "CAF", "OFC"];

type Props = { searchParams: Promise<SearchParams> };

export default async function LigasPage({ searchParams }: Props) {
  const params = await searchParams;
  const { confederation, country, sort } = readParams(params, ["confederation", "country", "sort"]);

  const allCountries = await prisma.country.findMany({
    orderBy: { name: "asc" },
    select: { isoCode: true, name: true },
  });
  const countryRow = country
    ? await prisma.country.findUnique({ where: { isoCode: country }, select: { id: true } })
    : null;

  const where = {
    ...(countryRow ? { countryId: countryRow.id } : {}),
    ...(confederation ? { country: { confederation: confederation as Confederation } } : {}),
  };

  const orderBy =
    sort === "tier_asc"
      ? [{ tier: "asc" as const }, { name: "asc" as const }]
      : sort === "founded_asc"
        ? [{ foundedYear: "asc" as const }, { name: "asc" as const }]
        : [{ name: "asc" as const }];

  const leagues = await prisma.league.findMany({
    where,
    orderBy,
    include: { country: { select: { name: true, confederation: true } } },
  });

  const filters: FilterDef[] = [
    {
      key: "confederation",
      label: "Confederación",
      placeholder: "Todas las confederaciones",
      options: CONFEDERATIONS.map((c) => ({ value: c, label: STRINGS.confederation[c] })),
      order: 1,
    },
    {
      key: "country",
      label: "País",
      placeholder: "Todos los países",
      options: allCountries.map((c) => ({ value: c.isoCode, label: c.name })),
      order: 2,
    },
  ];

  return (
    <PageShell className="space-y-8">
      <PageHeader
        eyebrow="Directorio"
        title="Ligas"
        subtitle="Las competiciones que cubrimos."
      />

      <FilterBar
        filters={filters}
        sort={{ options: SORT_OPTIONS, defaultValue: "name_asc" }}
        totalCount={leagues.length}
        resultLabel={{ singular: "liga", plural: "ligas" }}
      />

      {leagues.length === 0 ? (
        <EmptyState icon={Trophy} title={STRINGS.empty.ligas.title} body={STRINGS.empty.ligas.body} />
      ) : sort && sort !== "name_asc" ? (
        <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((l) => (
            <StaggerItem key={l.id}>
              <LeagueCard league={l} />
            </StaggerItem>
          ))}
        </StaggerIn>
      ) : (
        (() => {
          const byConfederation = new Map<string, typeof leagues>();
          for (const l of leagues) {
            const key = l.country?.confederation ?? "Otros";
            const arr = byConfederation.get(key) ?? [];
            arr.push(l);
            byConfederation.set(key, arr);
          }
          const ordered = Array.from(byConfederation.entries()).sort(([a], [b]) => a.localeCompare(b));
          return (
            <div className="space-y-12">
              {ordered.map(([conf, list]) => (
                <Section
                  key={conf}
                  title={(STRINGS.confederation as Record<string, string>)[conf] ?? conf}
                  subtitle={`${list.length} ligas`}
                >
                  <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((l) => (
                      <StaggerItem key={l.id}>
                        <LeagueCard league={l} />
                      </StaggerItem>
                    ))}
                  </StaggerIn>
                </Section>
              ))}
            </div>
          );
        })()
      )}
    </PageShell>
  );
}
