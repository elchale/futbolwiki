import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { TeamCard } from "@/components/team/team-card";
import { EmptyState } from "@/components/state/empty-state";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { STRINGS } from "@/lib/strings";
import { readParams, type SearchParams } from "@/lib/filters";
import type { Confederation } from "@/types/entities";

export const revalidate = 86400;

export const metadata = { title: "Equipos" };

const SORT_OPTIONS = [
  { value: "name_asc", label: "Nombre (A → Z)" },
  { value: "founded_asc", label: "Más antiguos primero" },
  { value: "founded_desc", label: "Más nuevos primero" },
];

const CONFEDERATIONS: Confederation[] = ["CONMEBOL", "UEFA", "CONCACAF", "AFC", "CAF", "OFC"];

type Props = { searchParams: Promise<SearchParams> };

export default async function EquiposPage({ searchParams }: Props) {
  const params = await searchParams;
  const { country, confederation, sort } = readParams(params, ["country", "confederation", "sort"]);

  const allCountries = await prisma.country.findMany({
    orderBy: { name: "asc" },
    select: { isoCode: true, name: true, confederation: true },
  });

  const countryRow = country
    ? await prisma.country.findUnique({ where: { isoCode: country }, select: { id: true } })
    : null;

  const where = {
    isActive: true,
    ...(countryRow ? { countryId: countryRow.id } : {}),
    ...(confederation ? { country: { confederation: confederation as Confederation } } : {}),
  };

  const orderByMap: Record<string, "asc" | "desc"> = {
    founded_asc: "asc",
    founded_desc: "desc",
  };
  const orderBy =
    sort === "founded_asc" || sort === "founded_desc"
      ? [{ foundedYear: orderByMap[sort] as "asc" | "desc" }, { name: "asc" as const }]
      : [{ name: "asc" as const }];

  const teams = await prisma.team.findMany({
    where,
    orderBy,
    include: { country: { select: { name: true, isoCode: true, confederation: true } } },
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
        title="Equipos"
        subtitle="Todos los clubes en el wiki."
      />

      <FilterBar
        filters={filters}
        sort={{ options: SORT_OPTIONS, defaultValue: "name_asc" }}
        totalCount={teams.length}
        resultLabel={{ singular: "equipo", plural: "equipos" }}
      />

      {teams.length === 0 ? (
        <EmptyState icon={Users} title={STRINGS.empty.equipos.title} body={STRINGS.empty.equipos.body} />
      ) : sort && sort !== "name_asc" ? (
        <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((t) => (
            <StaggerItem key={t.id}>
              <TeamCard team={t} />
            </StaggerItem>
          ))}
        </StaggerIn>
      ) : (
        // group by country when sort is "name_asc"
        (() => {
          const byCountry = new Map<string, typeof teams>();
          for (const t of teams) {
            const key = t.country?.name ?? "Sin país";
            const arr = byCountry.get(key) ?? [];
            arr.push(t);
            byCountry.set(key, arr);
          }
          const ordered = Array.from(byCountry.entries()).sort(([a], [b]) => {
            if (a === "Perú") return -1;
            if (b === "Perú") return 1;
            return a.localeCompare(b);
          });
          return (
            <div className="space-y-12">
              {ordered.map(([countryName, list]) => (
                <Section key={countryName} title={countryName} subtitle={`${list.length} clubes`}>
                  <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {list.map((t) => (
                      <StaggerItem key={t.id}>
                        <TeamCard team={t} />
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
