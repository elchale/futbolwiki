import Link from "next/link";
import { notFound } from "next/navigation";
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
import { ROUTES } from "@/lib/routes";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const ts = await prisma.tournament.findMany({ select: { slug: true } });
  return ts.map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const t = await prisma.tournament.findUnique({ where: { slug } });
  return { title: t?.name ?? "Torneo" };
}

export default async function TorneoPage({ params }: Props) {
  const { slug } = await params;
  const tournament = await prisma.tournament.findUnique({ where: { slug } });
  if (!tournament) notFound();

  const editions = await prisma.tournamentEdition.findMany({
    where: { tournamentId: tournament.id },
    orderBy: { year: "desc" },
    include: {
      championTeam: { select: { slug: true, name: true } },
      championNationalTeam: { select: { slug: true, name: true } },
      hostCountry: { select: { name: true } },
    },
  });

  return (
    <PageShell className="space-y-12">
      <PageHeader eyebrow={tournament.organizer ?? undefined} title={tournament.name} />

      {tournament.description ? (
        <Card>
          <div className="p-6 max-w-prose">
            <p className="text-base leading-relaxed">
              {tournament.description}{" "}
              <SourceCitation entityType="TOURNAMENT" entityId={tournament.id} field="description" />
            </p>
            {tournament.foundedYear ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Fundado en {tournament.foundedYear}.{" "}
                <SourceCitation entityType="TOURNAMENT" entityId={tournament.id} field="foundedYear" />
              </p>
            ) : null}
          </div>
        </Card>
      ) : null}

      {(() => {
        const story = parseStory(tournament.story);
        return story && story.sections.length > 0 ? <StoryView story={story} /> : null;
      })()}

      <Section title="Ediciones">
        {editions.length === 0 ? (
          <ComingSoonBlock body="Iremos sumando ediciones a medida que verifiquemos sus datos." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {editions.map((e) => {
              const champion = e.championNationalTeam ?? e.championTeam;
              return (
                <Card key={e.id}>
                  <Link
                    href={ROUTES.torneoEdicion(tournament.slug, e.year)}
                    className="block space-y-2 p-4 hover:bg-muted/30"
                  >
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Edición
                    </p>
                    <p className="font-display text-2xl font-semibold">{e.year}</p>
                    {e.hostCountry ? (
                      <Badge variant="outline" className="font-normal">Sede: {e.hostCountry.name}</Badge>
                    ) : null}
                    {champion ? (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Campeón: </span>
                        <span className="font-medium">{champion.name}</span>
                      </p>
                    ) : null}
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
