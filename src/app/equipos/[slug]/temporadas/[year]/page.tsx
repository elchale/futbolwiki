import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const teamSeasons = await prisma.teamSeason.findMany({
    include: { team: { select: { slug: true } }, season: { select: { year: true } } },
    take: 200,
  });
  return teamSeasons.map((ts) => ({ slug: ts.team.slug, year: ts.season.year }));
}

type Props = { params: Promise<{ slug: string; year: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug, year } = await params;
  const team = await prisma.team.findUnique({ where: { slug } });
  return { title: team ? `${team.shortName ?? team.name} ${year}` : `Temporada ${year}` };
}

export default async function TemporadaPage({ params }: Props) {
  const { slug, year } = await params;
  const team = await prisma.team.findUnique({ where: { slug } });
  if (!team) notFound();

  const teamSeason = await prisma.teamSeason.findFirst({
    where: { teamId: team.id, season: { year } },
    include: { league: true, season: true },
  });

  return (
    <PageShell className="space-y-8">
      <PageHeader
        eyebrow={team.shortName ?? team.name}
        title={`Temporada ${year}`}
        subtitle={teamSeason?.league.name ?? undefined}
      />
      {!teamSeason ? (
        <ComingSoonBlock body="Esta temporada todavía no fue procesada en el wiki." />
      ) : (
        <Card>
          <div className="grid gap-4 p-6 sm:grid-cols-4">
            <Stat label="Partidos" value={String(teamSeason.played)} />
            <Stat label="Puntos" value={String(teamSeason.points)} />
            <Stat label="G - E - P" value={`${teamSeason.won} - ${teamSeason.drawn} - ${teamSeason.lost}`} />
            <Stat label="GF - GC" value={`${teamSeason.goalsFor} - ${teamSeason.goalsAgainst}`} />
            {teamSeason.finalPosition ? (
              <Stat label="Posición" value={`#${teamSeason.finalPosition}`} />
            ) : null}
          </div>
          {teamSeason.outcome ? (
            <div className="border-t border-border bg-muted/40 px-6 py-3">
              <Badge variant="secondary" className="font-normal">
                {teamSeason.outcome.replace(/_/g, " ")}
              </Badge>
            </div>
          ) : null}
        </Card>
      )}
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
