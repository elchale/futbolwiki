import Link from "next/link";
import { notFound } from "next/navigation";
import { Cake, Globe, Footprints, Ruler, Hash } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PlayerPortrait } from "@/components/player/player-portrait";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/common/section";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { SourceCitation } from "@/components/citation/source-citation";
import { StoryView } from "@/components/common/story-view";
import { parseStory } from "@/types/story";
import { getPlayerStats } from "@/lib/player-stats";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";
import { formatLongDate, formatAge } from "@/lib/format";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const players = await prisma.player.findMany({ select: { slug: true } });
  return players.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await prisma.player.findUnique({ where: { slug } });
  return { title: p?.knownAs ?? p?.fullName ?? "Jugador" };
}

export default async function JugadorPage({ params }: Props) {
  const { slug } = await params;
  const player = await prisma.player.findUnique({
    where: { slug },
    include: {
      currentTeam: { include: { country: true } },
      birthCountry: true,
      stints: {
        orderBy: { startDate: "desc" },
        include: { team: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } } },
      },
      nationalTeamCaps: {
        include: { nationalTeam: { include: { country: true } } },
      },
    },
  });
  if (!player) notFound();

  const display = player.knownAs ?? player.fullName;
  const stats = await getPlayerStats(player.id);
  const hasStats = stats.clubGoals > 0 || stats.clubAppearances > 0 || stats.ntCaps > 0;

  return (
    <PageShell className="space-y-12">
      {/* HERO */}
      <header className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-6 text-center md:flex-row md:items-end md:p-10 md:text-left">
        <PlayerPortrait name={display} portraitUrl={player.portraitUrl} size="xl" />
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {STRINGS.position[player.position]}
            {player.shirtNumber ? ` · #${player.shirtNumber}` : ""}
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            {display}
          </h1>
          {player.knownAs && player.knownAs !== player.fullName ? (
            <p className="text-sm text-muted-foreground">
              {STRINGS.player.fullName}: {player.fullName}
            </p>
          ) : null}
          {player.currentTeam ? (
            <Link
              href={ROUTES.equipo(player.currentTeam.slug)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
            >
              {STRINGS.player.currentTeam}: <span className="font-medium">{player.currentTeam.name}</span>
            </Link>
          ) : null}
        </div>
      </header>

      {/* Quick facts */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {player.birthDate ? (
          <FactCard
            icon={Cake}
            label={STRINGS.player.birthDate}
            value={`${formatLongDate(player.birthDate)} (${formatAge(player.birthDate, player.deathDate)} años)`}
          />
        ) : null}
        {player.birthplace ? (
          <FactCard icon={Globe} label={STRINGS.player.birthplace} value={player.birthplace} />
        ) : null}
        <FactCard icon={Footprints} label={STRINGS.player.foot} value={STRINGS.foot[player.foot]} />
        {player.heightCm ? (
          <FactCard icon={Ruler} label={STRINGS.player.height} value={`${player.heightCm} cm`} />
        ) : null}
        {player.shirtNumber ? (
          <FactCard icon={Hash} label={STRINGS.player.shirtNumber} value={`#${player.shirtNumber}`} />
        ) : null}
      </div>

      {hasStats ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <BigStat label="Goles (clubes)" value={stats.clubGoals} />
          <BigStat label="Partidos" value={stats.clubAppearances} />
          <BigStat label="Asistencias" value={stats.clubAssists} />
          <BigStat label="Selección · PJ" value={stats.ntCaps} />
          <BigStat label="Selección · Goles" value={stats.ntGoals} />
        </div>
      ) : null}

      {/* Bio (short summary) */}
      {player.bio ? (
        <Section title={STRINGS.player.biography}>
          <Card>
            <div className="p-6 max-w-prose space-y-4">
              <p className="text-base leading-relaxed">
                {player.bio}{" "}
                <SourceCitation entityType="PLAYER" entityId={player.id} field="bio" />
              </p>
            </div>
          </Card>
        </Section>
      ) : null}

      {/* Long-form story */}
      {(() => {
        const story = parseStory(player.story);
        return story && story.sections.length > 0 ? <StoryView story={story} /> : null;
      })()}

      {/* Career */}
      <Section title={STRINGS.player.career}>
        {player.stints.length === 0 ? (
          <ComingSoonBlock body="Iremos sumando los pasos por cada club a medida que verifiquemos las fechas exactas." />
        ) : (
          <Card>
            <ul className="divide-y divide-border">
              {player.stints.map((s) => (
                <li key={s.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <Link
                      href={ROUTES.equipo(s.team.slug)}
                      className="font-display text-base font-semibold hover:underline"
                    >
                      {s.team.shortName ?? s.team.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {s.startDate.toLocaleDateString("es")} —{" "}
                      {s.endDate ? s.endDate.toLocaleDateString("es") : "Actualidad"}
                      {s.isLoan ? " · Cedido" : ""}
                    </p>
                  </div>
                  {(s.appearances ?? null) !== null ? (
                    <div className="text-right text-xs">
                      <span className="block tabular-nums font-medium">{s.appearances} PJ</span>
                      <span className="block text-muted-foreground tabular-nums">{s.goals ?? 0} g · {s.assists ?? 0} a</span>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Section>

      {/* National team caps */}
      {player.nationalTeamCaps.length > 0 ? (
        <Section title={STRINGS.player.nationalTeam}>
          <div className="grid gap-3 sm:grid-cols-2">
            {player.nationalTeamCaps.map((c) => (
              <Card key={c.id}>
                <div className="space-y-2 p-4">
                  <p className="font-display text-base font-semibold">{c.nationalTeam.name}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      <span className="font-medium text-foreground tabular-nums">{c.caps}</span> partidos
                    </span>
                    <span>
                      <span className="font-medium text-foreground tabular-nums">{c.goals}</span> goles
                    </span>
                    {c.debutDate ? (
                      <span>Debut: {c.debutDate.toLocaleDateString("es")}</span>
                    ) : null}
                  </div>
                  <SourceCitation
                    entityType="NATIONAL_TEAM_CAP"
                    entityId={`${player.id}__${c.nationalTeamId}`}
                  />
                </div>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}
    </PageShell>
  );
}

function FactCard({ icon: Icon, label, value }: { icon: typeof Cake; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </p>
      <p className="mt-1 font-display text-base font-semibold leading-tight">{value}</p>
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <p className="font-display text-3xl font-bold tabular-nums leading-none">{value}</p>
      <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
