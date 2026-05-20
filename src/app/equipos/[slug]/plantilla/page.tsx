import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { PlayerCard } from "@/components/player/player-card";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";
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
  return { title: team ? `${team.shortName ?? team.name} — Plantilla` : "Plantilla" };
}

export default async function PlantillaPage({ params }: Props) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({ where: { slug } });
  if (!team) notFound();

  const squad = await prisma.player.findMany({
    where: { currentTeamId: team.id },
    orderBy: [{ position: "asc" }, { shirtNumber: "asc" }, { fullName: "asc" }],
    include: { currentTeam: { select: { name: true, shortName: true } } },
  });

  const byPosition: Record<string, typeof squad> = { GK: [], DEF: [], MID: [], FWD: [], UNKNOWN: [] };
  for (const p of squad) byPosition[p.position]?.push(p);
  const positionsOrder = ["GK", "DEF", "MID", "FWD", "UNKNOWN"] as const;

  return (
    <PageShell className="space-y-10">
      <PageHeader
        eyebrow={team.shortName ?? team.name}
        title="Plantilla"
        subtitle={squad.length > 0 ? `${squad.length} jugadores cargados` : undefined}
      />
      {squad.length === 0 ? (
        <ComingSoonBlock title={STRINGS.empty.plantilla.title} body={STRINGS.empty.plantilla.body} />
      ) : (
        positionsOrder.map((pos) => {
          const players = byPosition[pos] ?? [];
          if (players.length === 0) return null;
          return (
            <Section key={pos} title={STRINGS.position[pos]}>
              <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {players.map((p) => (
                  <StaggerItem key={p.id}>
                    <PlayerCard player={p} />
                  </StaggerItem>
                ))}
              </StaggerIn>
            </Section>
          );
        })
      )}
    </PageShell>
  );
}
