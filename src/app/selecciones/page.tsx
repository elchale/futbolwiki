import Link from "next/link";
import { Flag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/state/empty-state";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";
import { FilterBar, type FilterDef } from "@/components/common/filter-bar";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";
import { readParams, type SearchParams } from "@/lib/filters";
import type { Confederation } from "@/types/entities";

export const revalidate = 86400;

export const metadata = { title: "Selecciones" };

const SORT_OPTIONS = [
  { value: "name_asc", label: "Nombre (A → Z)" },
  { value: "confederation_asc", label: "Por confederación" },
];

const CONFEDERATIONS: Confederation[] = ["CONMEBOL", "UEFA", "CONCACAF", "AFC", "CAF", "OFC"];

type Props = { searchParams: Promise<SearchParams> };

export default async function SeleccionesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { confederation, sort } = readParams(params, ["confederation", "sort"]);

  const where = confederation ? { confederation: confederation as Confederation } : {};
  const orderBy =
    sort === "confederation_asc"
      ? [{ confederation: "asc" as const }, { name: "asc" as const }]
      : [{ name: "asc" as const }];

  const teams = await prisma.nationalTeam.findMany({
    where,
    orderBy,
    include: { country: true },
  });

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
        title="Selecciones"
        subtitle="Las selecciones nacionales que cubrimos."
      />

      <FilterBar
        filters={filters}
        sort={{ options: SORT_OPTIONS, defaultValue: "confederation_asc" }}
        totalCount={teams.length}
        resultLabel={{ singular: "selección", plural: "selecciones" }}
      />

      {teams.length === 0 ? (
        <EmptyState icon={Flag} title={STRINGS.empty.selecciones.title} body={STRINGS.empty.selecciones.body} />
      ) : sort === "name_asc" ? (
        <StaggerIn className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((t) => (
            <StaggerItem key={t.id}>
              <NTRow t={t} />
            </StaggerItem>
          ))}
        </StaggerIn>
      ) : (
        (() => {
          const byConfederation = new Map<string, typeof teams>();
          for (const t of teams) {
            const arr = byConfederation.get(t.confederation) ?? [];
            arr.push(t);
            byConfederation.set(t.confederation, arr);
          }
          return (
            <div className="space-y-12">
              {Array.from(byConfederation.entries()).map(([conf, list]) => (
                <Section
                  key={conf}
                  title={(STRINGS.confederation as Record<string, string>)[conf] ?? conf}
                  subtitle={`${list.length} selecciones`}
                >
                  <StaggerIn className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((t) => (
                      <StaggerItem key={t.id}>
                        <NTRow t={t} />
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

function NTRow({
  t,
}: {
  t: {
    slug: string;
    name: string;
    nickname: string | null;
    country: { name: string; flagUrl: string | null } | null;
  };
}) {
  return (
    <Card asChild className="group p-0 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={ROUTES.seleccion(t.slug)}
        className="flex items-center gap-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t.country?.flagUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.country.flagUrl}
            alt={t.country.name}
            className="size-10 rounded object-cover ring-1 ring-border"
          />
        ) : (
          <Flag className="size-10 text-muted-foreground" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold leading-tight">
            {t.country?.name ?? t.name}
          </p>
          {t.nickname ? <p className="text-xs italic text-muted-foreground">{t.nickname}</p> : null}
        </div>
      </Link>
    </Card>
  );
}
