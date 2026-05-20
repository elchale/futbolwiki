import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { TeamCrest } from "@/components/team/team-crest";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { ROUTES } from "@/lib/routes";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const seasons = await prisma.season.findMany({
    include: { league: { select: { slug: true } } },
    take: 100,
  });
  return seasons.map((s) => ({ slug: s.league.slug, year: s.year }));
}

type Props = { params: Promise<{ slug: string; year: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug, year } = await params;
  const l = await prisma.league.findUnique({ where: { slug } });
  return { title: l ? `${l.name} ${year}` : `Temporada ${year}` };
}

export default async function LigaTemporadaPage({ params }: Props) {
  const { slug, year } = await params;
  const league = await prisma.league.findUnique({ where: { slug } });
  if (!league) notFound();

  const season = await prisma.season.findUnique({
    where: { leagueId_year: { leagueId: league.id, year } },
  });
  if (!season) notFound();

  const teamSeasons = await prisma.teamSeason.findMany({
    where: { seasonId: season.id },
    include: { team: true },
    orderBy: [{ points: "desc" }, { goalsFor: "desc" }],
  });

  return (
    <PageShell className="space-y-10">
      <PageHeader
        eyebrow={league.name}
        title={`Temporada ${year}`}
        subtitle={season.status === "COMPLETED" ? "Resultados finales" : "En curso"}
      />
      {teamSeasons.length === 0 ? (
        <ComingSoonBlock body="Aún no hay datos de equipos para esta temporada." />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-4 py-2 text-left font-medium">#</th>
                  <th className="px-4 py-2 text-left font-medium">Equipo</th>
                  <th className="px-3 py-2 text-right font-medium tabular-nums">Pts</th>
                </tr>
              </thead>
              <tbody>
                {teamSeasons.map((ts, i) => (
                  <tr key={ts.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{ts.finalPosition ?? i + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={ROUTES.equipo(ts.team.slug)}
                        className="inline-flex items-center gap-2 font-medium hover:underline"
                      >
                        <TeamCrest team={ts.team} size="sm" />
                        <span>{ts.team.shortName ?? ts.team.name}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right font-display font-semibold tabular-nums">{ts.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
