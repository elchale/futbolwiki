import { notFound } from "next/navigation";
import { CalendarClock, MapPin, Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { TeamCrest } from "@/components/team/team-crest";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/common/section";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { SourceCitation, SourcePill } from "@/components/citation/source-citation";
import { STRINGS } from "@/lib/strings";
import { formatMatchDate, formatScore, formatLongDate } from "@/lib/format";
import { getCitations } from "@/lib/citations";

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const matches = await prisma.match.findMany({ select: { id: true }, take: 200 });
  return matches.map((m) => ({ id: m.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const m = await prisma.match.findUnique({
    where: { id },
    include: { homeTeam: true, awayTeam: true },
  });
  if (!m) return { title: "Partido" };
  const home = m.homeTeam?.shortName ?? m.homeTeam?.name ?? "—";
  const away = m.awayTeam?.shortName ?? m.awayTeam?.name ?? "—";
  return { title: `${home} vs ${away}` };
}

export default async function PartidoPage({ params }: Props) {
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      homeNationalTeam: true,
      awayNationalTeam: true,
      stadium: { include: { country: true } },
      league: true,
      season: true,
      tournamentEdition: { include: { tournament: true } },
      events: {
        include: {
          player: { select: { slug: true, fullName: true, knownAs: true } },
          assistPlayer: { select: { slug: true, fullName: true, knownAs: true } },
        },
        orderBy: { minute: "asc" },
      },
      context: true,
    },
  });
  if (!match) notFound();

  const home = match.homeTeam ?? match.homeNationalTeam ?? null;
  const away = match.awayTeam ?? match.awayNationalTeam ?? null;
  const homeSummary = match.homeTeam
    ? {
        slug: match.homeTeam.slug,
        name: match.homeTeam.name,
        shortName: match.homeTeam.shortName,
        primaryColor: match.homeTeam.primaryColor,
        secondaryColor: match.homeTeam.secondaryColor,
      }
    : null;
  const awaySummary = match.awayTeam
    ? {
        slug: match.awayTeam.slug,
        name: match.awayTeam.name,
        shortName: match.awayTeam.shortName,
        primaryColor: match.awayTeam.primaryColor,
        secondaryColor: match.awayTeam.secondaryColor,
      }
    : null;

  const isFinished = match.status === "FINISHED";

  // Pre-resolve citations per fact for the narrative facts
  let factsWithCitations: Array<{ text: string; citations: Awaited<ReturnType<typeof getCitations>> }> = [];
  if (match.context?.factsJson && Array.isArray(match.context.factsJson)) {
    const arr = match.context.factsJson as unknown as Array<{ text: string; sourceIds: string[] }>;
    for (const f of arr) {
      const sources = await prisma.source.findMany({ where: { id: { in: f.sourceIds ?? [] } } });
      factsWithCitations.push({
        text: f.text,
        citations: sources.map((s) => ({
          id: s.id,
          sourceId: s.id,
          sourceTitle: s.title,
          sourcePublisher: s.publisher,
          sourceUrl: s.url,
          sourceType: s.type,
          language: s.language,
          confidence: "VERIFIED" as const,
          accessedAt: s.accessedAt.toISOString(),
          note: null,
        })),
      });
    }
  }

  return (
    <PageShell className="space-y-10">
      {/* HERO */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {match.league ? (
            <Badge variant="secondary" className="font-normal">{match.league.name}</Badge>
          ) : null}
          {match.tournamentEdition ? (
            <Badge variant="secondary" className="font-normal">
              {match.tournamentEdition.tournament.name} {match.tournamentEdition.year}
            </Badge>
          ) : null}
          {match.round ? <span>· {match.round}</span> : null}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl border border-border bg-card p-6 sm:gap-8 sm:p-10">
          <TeamHero name={home?.name ?? "—"} short={(home as { shortName?: string | null })?.shortName ?? null} crest={homeSummary} align="end" />
          <div className="text-center">
            <Badge variant={isFinished ? "secondary" : "default"} className="mb-3">
              {STRINGS.match[isFinished ? "finished" : match.status === "LIVE" ? "live" : "upcoming"]}
            </Badge>
            {isFinished ? (
              <p className="font-display text-4xl font-bold tabular-nums md:text-6xl">
                {formatScore(match.homeScore, match.awayScore)}
              </p>
            ) : (
              <p className="font-display text-4xl font-bold text-muted-foreground md:text-6xl">{STRINGS.match.vs}</p>
            )}
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {formatMatchDate(match.date)}
            </p>
          </div>
          <TeamHero name={away?.name ?? "—"} short={(away as { shortName?: string | null })?.shortName ?? null} crest={awaySummary} align="start" />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-4" aria-hidden /> {formatLongDate(match.date)}
          </span>
          {match.stadium ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden /> {match.stadium.name}
              {match.stadium.country ? `, ${match.stadium.country.name}` : ""}
            </span>
          ) : null}
          <SourceCitation entityType="MATCH" entityId={match.id} />
        </div>
      </header>

      {/* CONTEXT */}
      <Section title={STRINGS.match.narrative}>
        {match.context ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                {(homeSummary?.shortName ?? home?.name)} vs {(awaySummary?.shortName ?? away?.name)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base leading-relaxed text-foreground">
                {match.context.narrative}{" "}
                <SourceCitation entityType="MATCH_CONTEXT" entityId={match.context.id} field="narrative" />
              </p>
              {factsWithCitations.length > 0 ? (
                <div>
                  <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground">
                    {STRINGS.match.keyFacts}
                  </p>
                  <ul className="space-y-3">
                    {factsWithCitations.map((f, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed">
                        <span aria-hidden className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          {f.text}{" "}
                          {f.citations.length > 0 ? <SourcePill citations={f.citations} /> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {(match.context.h2hHomeWins != null || match.context.h2hAwayWins != null) ? (
                <H2HBlock
                  homeName={(homeSummary?.shortName ?? home?.name) ?? "Local"}
                  awayName={(awaySummary?.shortName ?? away?.name) ?? "Visita"}
                  wins={match.context.h2hHomeWins ?? 0}
                  losses={match.context.h2hAwayWins ?? 0}
                  draws={match.context.h2hDraws ?? 0}
                />
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <ComingSoonBlock title={STRINGS.empty.matchContext.title} body={STRINGS.empty.matchContext.body} />
        )}
      </Section>

      {/* EVENTS */}
      {match.events.length > 0 ? (
        <Section title={STRINGS.match.events}>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {match.events.map((ev) => (
                  <li key={ev.id} className="flex items-center gap-4 px-4 py-3 text-sm">
                    <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {ev.minute}&apos;
                    </span>
                    <Badge variant="outline" className="shrink-0 font-normal">
                      {ev.type.replace(/_/g, " ")}
                    </Badge>
                    <span className="flex-1 truncate">
                      {ev.player ? (ev.player.knownAs ?? ev.player.fullName) : "—"}
                      {ev.assistPlayer ? (
                        <span className="text-muted-foreground"> · asist. {ev.assistPlayer.knownAs ?? ev.assistPlayer.fullName}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Section>
      ) : isFinished ? (
        <Section title={STRINGS.match.events}>
          <ComingSoonBlock title={STRINGS.match.noEvents} body="Los eventos detallados se publicarán cuando estén verificados." />
        </Section>
      ) : null}
    </PageShell>
  );
}

function TeamHero({
  name,
  short,
  crest,
  align,
}: {
  name: string;
  short: string | null;
  crest: { name: string; shortName?: string | null; primaryColor: string | null; secondaryColor: string | null } | null;
  align: "start" | "end";
}) {
  return (
    <div className={`flex flex-col items-center gap-3 ${align === "end" ? "sm:items-end" : "sm:items-start"} text-center sm:text-${align}`}>
      {crest ? <TeamCrest team={crest} size="xl" /> : <Trophy className="size-12 text-muted-foreground" aria-hidden />}
      <p className="font-display text-lg font-semibold leading-tight md:text-xl">{short ?? name}</p>
    </div>
  );
}

function H2HBlock({
  homeName,
  awayName,
  wins,
  losses,
  draws,
}: {
  homeName: string;
  awayName: string;
  wins: number;
  losses: number;
  draws: number;
}) {
  const total = wins + losses + draws;
  if (total === 0) return null;
  const pct = (n: number) => Math.round((n / total) * 100);
  return (
    <div>
      <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground">
        {STRINGS.match.h2h}
      </p>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-3 divide-x divide-border bg-muted text-xs">
          <Cell label={homeName} value={wins} pct={pct(wins)} accent="primary" />
          <Cell label="Empates" value={draws} pct={pct(draws)} accent="muted" />
          <Cell label={awayName} value={losses} pct={pct(losses)} accent="primary" />
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value, pct, accent }: { label: string; value: number; pct: number; accent: "primary" | "muted" }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-card px-3 py-4">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
      <span className={`font-display text-2xl font-bold tabular-nums ${accent === "primary" ? "text-primary" : "text-foreground"}`}>{value}</span>
      <span className="text-[0.65rem] text-muted-foreground">{pct}%</span>
    </div>
  );
}
