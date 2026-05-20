import Link from "next/link";
import { ArrowRight, CalendarDays, Trophy, Users, Globe2, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";
import { PageShell } from "@/components/common/page-shell";
import { Section } from "@/components/common/section";
import { MatchCard } from "@/components/match/match-card";
import { TeamCard } from "@/components/team/team-card";
import { PlayerCard } from "@/components/player/player-card";
import { TournamentCard } from "@/components/tournament/tournament-card";
import { Button } from "@/components/ui/button";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";
import { EmptyState } from "@/components/state/empty-state";

export const revalidate = 3600;

export default async function HomePage() {
  const now = new Date();
  const [upcoming, featuredTeams, featuredPlayers, tournaments] = await Promise.all([
    prisma.match.findMany({
      where: { date: { gte: now }, status: "SCHEDULED" },
      orderBy: { date: "asc" },
      take: 6,
      include: {
        homeTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
        awayTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
        league: { select: { slug: true, name: true } },
        stadium: { select: { name: true } },
      },
    }),
    prisma.team.findMany({
      where: { slug: { in: ["alianza-lima", "universitario-de-deportes", "sporting-cristal", "real-madrid", "fc-barcelona", "manchester-city"] } },
      include: { country: { select: { name: true } } },
    }),
    prisma.player.findMany({
      where: { slug: { in: ["paolo-guerrero", "lamine-yamal", "vinicius-junior", "kylian-mbappe", "erling-haaland", "yoshimar-yotun"] } },
      include: { currentTeam: { select: { name: true, shortName: true } } },
    }),
    prisma.tournament.findMany({
      where: { slug: { in: ["copa-mundial-fifa", "copa-libertadores", "uefa-champions-league", "copa-america"] } },
      orderBy: { foundedYear: "asc" },
    }),
  ]);

  return (
    <>
      <Hero />
      <PageShell className="space-y-16">
        <Section
          eyebrow="Calendario"
          title="Próximos partidos"
          subtitle="La fecha que se viene en el fútbol que cubrimos."
          href={ROUTES.partidos}
          hrefLabel="Ver todos los partidos"
        >
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title={STRINGS.empty.partidos.title}
              body={STRINGS.empty.partidos.body}
              cta={{ label: STRINGS.empty.partidos.cta, href: ROUTES.equipos }}
            />
          ) : (
            <StaggerIn className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {upcoming.map((m) => (
                <StaggerItem key={m.id}>
                  <MatchCard match={m} />
                </StaggerItem>
              ))}
            </StaggerIn>
          )}
        </Section>

        <Section
          eyebrow="Destacados"
          title="Equipos para explorar"
          subtitle="Una muestra de los clubes que ya están en el wiki."
          href={ROUTES.equipos}
          hrefLabel="Ver todos los equipos"
        >
          <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTeams.map((t) => (
              <StaggerItem key={t.id}>
                <TeamCard team={t} />
              </StaggerItem>
            ))}
          </StaggerIn>
        </Section>

        <Section
          eyebrow="Figuras"
          title="Jugadores en circulación"
          subtitle="Perfiles con biografía, trayectoria y fuentes verificadas."
          href={ROUTES.jugadores}
          hrefLabel="Ver más jugadores"
        >
          <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPlayers.map((p) => (
              <StaggerItem key={p.id}>
                <PlayerCard player={p} />
              </StaggerItem>
            ))}
          </StaggerIn>
        </Section>

        <Section
          eyebrow="Torneos"
          title="Copas históricas"
          subtitle="Los grandes campeonatos de selecciones y clubes."
          href={ROUTES.torneos}
          hrefLabel="Ver todos los torneos"
        >
          <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tournaments.map((t) => (
              <StaggerItem key={t.id}>
                <TournamentCard tournament={t} />
              </StaggerItem>
            ))}
          </StaggerIn>
        </Section>
      </PageShell>
    </>
  );
}

function Hero() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Fútbol Wiki · Edición 2026
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
              La <span className="text-primary">enciclopedia</span> del fútbol,
              <br className="hidden sm:block" /> en español.
            </h1>
            <p className="max-w-prose text-lg text-muted-foreground">
              Partidos, historia, plantillas y datos curiosos —{" "}
              <strong className="text-foreground">todo con fuentes verificadas</strong>.
              Desde la Liga 1 hasta el Mundial.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={ROUTES.partidos}>
                  Ver próximos partidos
                  <ArrowRight className="ml-1 size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={ROUTES.equipos}>Explorar equipos</Link>
              </Button>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:gap-4">
            <HighlightTile icon={CalendarDays} title="Partidos" subtitle="Calendario y contexto" href={ROUTES.partidos} />
            <HighlightTile icon={Users} title="Equipos" subtitle="Liga 1 y el mundo" href={ROUTES.equipos} />
            <HighlightTile icon={Trophy} title="Torneos" subtitle="Copas históricas" href={ROUTES.torneos} />
            <HighlightTile icon={Globe2} title="Selecciones" subtitle="Mundiales y más" href={ROUTES.selecciones} />
          </ul>
        </div>
        <p className="mt-10 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="size-3.5" aria-hidden /> Cada dato tiene su fuente — Wikipedia, sitios oficiales y federaciones.
        </p>
      </div>
    </section>
  );
}

function HighlightTile({
  icon: Icon,
  title,
  subtitle,
  href,
}: {
  icon: typeof CalendarDays;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex h-full flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icon className="size-5 text-primary" aria-hidden />
        <div>
          <p className="font-display text-base font-semibold leading-tight">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </Link>
    </li>
  );
}
