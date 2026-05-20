import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Users, Crown, History, CalendarRange, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { TeamCrest } from "@/components/team/team-crest";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/common/section";
import { PlayerCard } from "@/components/player/player-card";
import { MatchCard } from "@/components/match/match-card";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";
import { SourceCitation } from "@/components/citation/source-citation";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { StoryView } from "@/components/common/story-view";
import { parseStory } from "@/types/story";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const teams = await prisma.team.findMany({ select: { slug: true } });
  return teams.map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({ where: { slug } });
  return { title: team?.name ?? "Equipo" };
}

export default async function EquipoPage({ params }: Props) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      country: true,
      stadium: true,
      currentCoach: { select: { slug: true, fullName: true } },
    },
  });
  if (!team) notFound();

  const now = new Date();
  const [squad, upcoming, recent] = await Promise.all([
    prisma.player.findMany({
      where: { currentTeamId: team.id },
      orderBy: [{ position: "asc" }, { shirtNumber: "asc" }],
      take: 8,
      include: { currentTeam: { select: { name: true, shortName: true } } },
    }),
    prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
        date: { gte: now },
        status: { in: ["SCHEDULED", "LIVE"] },
      },
      orderBy: { date: "asc" },
      take: 3,
      include: {
        homeTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
        awayTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
        league: { select: { slug: true, name: true } },
        stadium: { select: { name: true } },
      },
    }),
    prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
        status: "FINISHED",
      },
      orderBy: { date: "desc" },
      take: 3,
      include: {
        homeTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
        awayTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
        league: { select: { slug: true, name: true } },
        stadium: { select: { name: true } },
      },
    }),
  ]);

  return (
    <PageShell className="space-y-12">
      <Hero team={team} />

      {/* Quick facts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.foundedYear ? (
          <FactCard label={STRINGS.team.founded} value={String(team.foundedYear)} />
        ) : null}
        {team.country ? (
          <FactCard label={STRINGS.team.country} value={team.country.name} />
        ) : null}
        {team.stadium ? (
          <FactCard label={STRINGS.team.stadium} value={team.stadium.name} />
        ) : null}
        {team.currentCoach ? (
          <FactCard
            label={STRINGS.team.coach}
            value={team.currentCoach.fullName}
            href={ROUTES.entrenador(team.currentCoach.slug)}
          />
        ) : null}
      </div>

      {/* Overview */}
      {team.description ? (
        <Section title="Sobre el club">
          <Card>
            <div className="p-6">
              <p className="max-w-prose text-base leading-relaxed">
                {team.description}{" "}
                <SourceCitation entityType="TEAM" entityId={team.id} field="description" />
              </p>
              {team.nicknames.length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {STRINGS.team.nicknames}:
                  </span>
                  {team.nicknames.map((n) => (
                    <Badge key={n} variant="outline" className="font-normal">{n}</Badge>
                  ))}
                  <SourceCitation entityType="TEAM" entityId={team.id} field="nicknames" />
                </div>
              ) : null}
            </div>
          </Card>
        </Section>
      ) : null}

      {/* Long-form story */}
      {(() => {
        const story = parseStory(team.story);
        return story && story.sections.length > 0 ? <StoryView story={story} /> : null;
      })()}

      {/* Squad preview */}
      <Section
        title={STRINGS.team.squad}
        subtitle={squad.length > 0 ? `${squad.length} jugadores en el wiki` : undefined}
        href={ROUTES.equipoPlantilla(team.slug)}
        hrefLabel="Ver plantilla completa"
      >
        {squad.length === 0 ? (
          <ComingSoonBlock title={STRINGS.empty.plantilla.title} body={STRINGS.empty.plantilla.body} />
        ) : (
          <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {squad.map((p) => (
              <StaggerItem key={p.id}>
                <PlayerCard player={p} />
              </StaggerItem>
            ))}
          </StaggerIn>
        )}
      </Section>

      {/* Upcoming + recent matches */}
      {(upcoming.length > 0 || recent.length > 0) && (
        <Section title="Partidos">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold">Próximos</h3>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin partidos programados.</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold">Recientes</h3>
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin partidos recientes registrados.</p>
              ) : (
                <div className="space-y-3">
                  {recent.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Quick links */}
      <Section title="Más sobre este club">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink icon={History} title={STRINGS.team.history} href={ROUTES.equipoHistoria(team.slug)} />
          <QuickLink icon={Users} title={STRINGS.team.squad} href={ROUTES.equipoPlantilla(team.slug)} />
          <QuickLink icon={Crown} title={STRINGS.team.formerPlayers} href={ROUTES.equipoExJugadores(team.slug)} />
        </div>
      </Section>
    </PageShell>
  );
}

function Hero({
  team,
}: {
  team: { id: string; name: string; shortName: string | null; primaryColor: string | null; secondaryColor: string | null; nicknames: string[]; country: { name: string } | null; stadium: { name: string; city: string } | null };
}) {
  return (
    <header className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
        <TeamCrest team={team} size="xl" />
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {team.country?.name ?? "—"}
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            {team.name}
          </h1>
          {team.stadium ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden />
              {team.stadium.name} · {team.stadium.city}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function FactCard({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block transition-all hover:-translate-y-0.5 hover:shadow-md">
      {inner}
    </Link>
  ) : inner;
}

function QuickLink({ icon: Icon, title, href }: { icon: typeof CalendarRange; title: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="size-5 text-primary" aria-hidden />
      <p className="flex-1 font-display text-base font-semibold">{title}</p>
      <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
    </Link>
  );
}
