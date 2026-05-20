import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, Medal, Target, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { SourceCitation } from "@/components/citation/source-citation";
import { StoryView } from "@/components/common/story-view";
import { parseStory } from "@/types/story";
import { MatchCard } from "@/components/match/match-card";
import { ROUTES } from "@/lib/routes";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const editions = await prisma.tournamentEdition.findMany({
    include: { tournament: { select: { slug: true } } },
  });
  return editions.map((e) => ({ slug: e.tournament.slug, year: e.year }));
}

type Props = { params: Promise<{ slug: string; year: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug, year } = await params;
  const t = await prisma.tournament.findUnique({ where: { slug } });
  return { title: t ? `${t.name} ${year}` : `Edición ${year}` };
}

export default async function EdicionPage({ params }: Props) {
  const { slug, year } = await params;
  const tournament = await prisma.tournament.findUnique({ where: { slug } });
  if (!tournament) notFound();

  const edition = await prisma.tournamentEdition.findUnique({
    where: { tournamentId_year: { tournamentId: tournament.id, year } },
    include: {
      hostCountry: true,
      championTeam: { select: { slug: true, name: true } },
      championNationalTeam: { select: { slug: true, name: true } },
      runnerUpTeam: { select: { slug: true, name: true } },
      runnerUpNationalTeam: { select: { slug: true, name: true } },
      topScorerPlayer: { select: { slug: true, knownAs: true, fullName: true } },
      matches: {
        orderBy: { date: "desc" },
        include: {
          homeTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
          awayTeam: { select: { slug: true, name: true, shortName: true, primaryColor: true, secondaryColor: true } },
          league: { select: { slug: true, name: true } },
          stadium: { select: { name: true } },
        },
        take: 5,
      },
    },
  });
  if (!edition) notFound();

  const champion = edition.championNationalTeam ?? edition.championTeam;
  const runnerUp = edition.runnerUpNationalTeam ?? edition.runnerUpTeam;
  const championIsNational = !!edition.championNationalTeam;

  return (
    <PageShell className="space-y-12">
      <PageHeader
        eyebrow={tournament.name}
        title={`Edición ${edition.year}`}
        subtitle={edition.hostCountry ? `Sede: ${edition.hostCountry.name}` : undefined}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {edition.hostCountry ? (
          <FactCard icon={MapPin} label="Sede" value={edition.hostCountry.name} />
        ) : null}
        {champion ? (
          <FactCard
            icon={Crown}
            label="Campeón"
            value={champion.name}
            href={championIsNational ? ROUTES.seleccion(champion.slug) : ROUTES.equipo(champion.slug)}
          />
        ) : null}
        {runnerUp ? (
          <FactCard
            icon={Medal}
            label="Subcampeón"
            value={runnerUp.name}
            href={championIsNational ? ROUTES.seleccion(runnerUp.slug) : ROUTES.equipo(runnerUp.slug)}
          />
        ) : null}
        {edition.topScorerPlayer ? (
          <FactCard
            icon={Target}
            label="Goleador"
            value={edition.topScorerPlayer.knownAs ?? edition.topScorerPlayer.fullName}
            href={ROUTES.jugador(edition.topScorerPlayer.slug)}
          />
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">
        <SourceCitation entityType="TOURNAMENT_EDITION" entityId={edition.id} />
      </p>

      {(() => {
        const story = parseStory(edition.story);
        return story && story.sections.length > 0 ? <StoryView story={story} /> : null;
      })()}

      {edition.matches.length > 0 ? (
        <Section title="Partidos">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {edition.matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </Section>
      ) : (
        <Section title="Partidos">
          <ComingSoonBlock body="Los partidos detallados de esta edición se publicarán próximamente." />
        </Section>
      )}
    </PageShell>
  );
}

function FactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Crown;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </p>
      <p className="mt-1 font-display text-base font-semibold leading-tight">{value}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block transition-all hover:-translate-y-0.5 hover:shadow-md">
      {inner}
    </Link>
  ) : inner;
}
