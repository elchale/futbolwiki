import Link from "next/link";
import { notFound } from "next/navigation";
import { Flag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerPortrait } from "@/components/player/player-portrait";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { SourceCitation } from "@/components/citation/source-citation";
import { StoryView } from "@/components/common/story-view";
import { parseStory } from "@/types/story";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const teams = await prisma.nationalTeam.findMany({ select: { slug: true } });
  return teams.map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const t = await prisma.nationalTeam.findUnique({ where: { slug } });
  return { title: t?.name ?? "Selección" };
}

export default async function SeleccionPage({ params }: Props) {
  const { slug } = await params;
  const team = await prisma.nationalTeam.findUnique({
    where: { slug },
    include: { country: true },
  });
  if (!team) notFound();

  const caps = await prisma.nationalTeamCap.findMany({
    where: { nationalTeamId: team.id },
    orderBy: [{ goals: "desc" }, { caps: "desc" }],
    include: { player: { select: { slug: true, fullName: true, knownAs: true, position: true, portraitUrl: true } } },
  });

  return (
    <PageShell className="space-y-12">
      <header className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-6 text-center md:flex-row md:items-end md:p-10 md:text-left">
        {team.country?.flagUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={team.country.flagUrl}
            alt={team.country.name}
            className="size-20 rounded-lg object-cover ring-2 ring-border md:size-28"
          />
        ) : (
          <Flag className="size-20 text-muted-foreground" aria-hidden />
        )}
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {(STRINGS.confederation as Record<string, string>)[team.confederation] ?? team.confederation}
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            {team.name}
          </h1>
          {team.nickname ? <p className="italic text-muted-foreground">{team.nickname}</p> : null}
          <p className="text-sm text-muted-foreground">
            <SourceCitation entityType="NATIONAL_TEAM" entityId={team.id} />
          </p>
        </div>
      </header>

      {(() => {
        const story = parseStory(team.story);
        return story && story.sections.length > 0 ? <StoryView story={story} /> : null;
      })()}

      <Section title="Convocados y top goleadores" subtitle="Ordenados por goles y partidos">
        {caps.length === 0 ? (
          <ComingSoonBlock body="Iremos sumando los goleadores y máximos convocados a medida que verifiquemos fuentes." />
        ) : (
          <Card>
            <ul className="divide-y divide-border">
              {caps.map((c) => (
                <li key={c.id} className="flex items-center gap-4 p-4">
                  <PlayerPortrait
                    name={c.player.knownAs ?? c.player.fullName}
                    portraitUrl={c.player.portraitUrl}
                    size="md"
                  />
                  <div className="flex-1">
                    <Link
                      href={ROUTES.jugador(c.player.slug)}
                      className="font-display text-base font-semibold hover:underline"
                    >
                      {c.player.knownAs ?? c.player.fullName}
                    </Link>
                    <Badge variant="secondary" className="ml-2 font-normal align-middle">
                      {STRINGS.position[c.player.position]}
                    </Badge>
                  </div>
                  <div className="text-right text-sm">
                    <p>
                      <span className="font-display text-base font-semibold tabular-nums">{c.caps}</span>
                      <span className="ml-1 text-xs text-muted-foreground">PJ</span>
                    </p>
                    <p>
                      <span className="font-display text-base font-semibold tabular-nums">{c.goals}</span>
                      <span className="ml-1 text-xs text-muted-foreground">goles</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Section>
    </PageShell>
  );
}
