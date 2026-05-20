import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamCrest } from "@/components/team/team-crest";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { SourceCitation } from "@/components/citation/source-citation";
import { StoryView } from "@/components/common/story-view";
import { parseStory } from "@/types/story";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const leagues = await prisma.league.findMany({ select: { slug: true } });
  return leagues.map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const l = await prisma.league.findUnique({ where: { slug } });
  return { title: l?.name ?? "Liga" };
}

export default async function LigaPage({ params }: Props) {
  const { slug } = await params;
  const league = await prisma.league.findUnique({
    where: { slug },
    include: { country: true },
  });
  if (!league) notFound();

  const currentSeason = await prisma.season.findFirst({
    where: { leagueId: league.id, status: { in: ["IN_PROGRESS", "UPCOMING"] } },
    orderBy: [{ status: "asc" }, { startDate: "desc" }],
  });

  const teamsThisSeason = currentSeason
    ? await prisma.teamSeason.findMany({
        where: { seasonId: currentSeason.id },
        include: { team: { include: { country: true } } },
        orderBy: [{ points: "desc" }, { goalsFor: "desc" }],
      })
    : [];

  const pastSeasons = await prisma.season.findMany({
    where: { leagueId: league.id, status: "COMPLETED" },
    orderBy: { year: "desc" },
    take: 8,
  });

  return (
    <PageShell className="space-y-12">
      <PageHeader
        eyebrow={league.country?.name ?? undefined}
        title={league.name}
        subtitle={league.description ?? undefined}
      />

      {league.description ? (
        <p className="max-w-prose text-base text-muted-foreground">
          <SourceCitation entityType="LEAGUE" entityId={league.id} field="description" />
        </p>
      ) : null}

      {(() => {
        const story = parseStory(league.story);
        return story && story.sections.length > 0 ? <StoryView story={story} /> : null;
      })()}

      {currentSeason ? (
        <Section
          title={`${STRINGS.league.season} ${currentSeason.year}`}
          subtitle={`Equipos participantes`}
        >
          {teamsThisSeason.length === 0 ? (
            <ComingSoonBlock body="Las posiciones se publicarán cuando avance la temporada." />
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                      <th className="px-4 py-2 text-left font-medium">#</th>
                      <th className="px-4 py-2 text-left font-medium">Equipo</th>
                      <th className="px-3 py-2 text-right font-medium tabular-nums">PJ</th>
                      <th className="px-3 py-2 text-right font-medium tabular-nums">G</th>
                      <th className="px-3 py-2 text-right font-medium tabular-nums">E</th>
                      <th className="px-3 py-2 text-right font-medium tabular-nums">P</th>
                      <th className="px-3 py-2 text-right font-medium tabular-nums">GF</th>
                      <th className="px-3 py-2 text-right font-medium tabular-nums">GC</th>
                      <th className="px-3 py-2 text-right font-medium tabular-nums">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamsThisSeason.map((ts, i) => (
                      <tr key={ts.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                        <td className="px-4 py-3 text-muted-foreground tabular-nums">{ts.finalPosition ?? i + 1}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={ROUTES.equipo(ts.team.slug)}
                            className="inline-flex items-center gap-2 font-medium hover:underline"
                          >
                            <TeamCrest team={ts.team} size="sm" />
                            <span className="truncate">{ts.team.shortName ?? ts.team.name}</span>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">{ts.played}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{ts.won}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{ts.drawn}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{ts.lost}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{ts.goalsFor}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{ts.goalsAgainst}</td>
                        <td className="px-3 py-3 text-right font-display font-semibold tabular-nums">{ts.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </Section>
      ) : null}

      {pastSeasons.length > 0 ? (
        <Section title={STRINGS.league.pastSeasons}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pastSeasons.map((s) => (
              <Link
                key={s.id}
                href={ROUTES.ligaTemporada(league.slug, s.year)}
                className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Temporada
                </p>
                <p className="mt-1 font-display text-xl font-semibold">{s.year}</p>
                <Badge variant="secondary" className="mt-2 font-normal">
                  <Trophy className="mr-1 size-3" aria-hidden /> Finalizada
                </Badge>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </PageShell>
  );
}
