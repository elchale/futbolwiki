import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { PlayerCard } from "@/components/player/player-card";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { StaggerIn, StaggerItem } from "@/components/motion/stagger-in";

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
  return { title: team ? `${team.shortName ?? team.name} — Ex-jugadores` : "Ex-jugadores" };
}

export default async function ExJugadoresPage({ params }: Props) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({ where: { slug } });
  if (!team) notFound();

  // Ex players: had a stint, currently not at this team
  const stints = await prisma.playerTeamStint.findMany({
    where: { teamId: team.id, endDate: { not: null } },
    include: {
      player: { include: { currentTeam: { select: { name: true, shortName: true } } } },
    },
    orderBy: { endDate: "desc" },
    take: 50,
  });
  const seen = new Set<string>();
  const players = stints
    .map((s) => s.player)
    .filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

  return (
    <PageShell className="space-y-10">
      <PageHeader
        eyebrow={team.shortName ?? team.name}
        title="Ex-jugadores"
        subtitle="Jugadores que pasaron por el club."
      />
      {players.length === 0 ? (
        <ComingSoonBlock
          title="Aún sin ex-jugadores registrados"
          body="Iremos sumando perfiles a medida que verifiquemos sus pasos por el club."
        />
      ) : (
        <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {players.map((p) => (
            <StaggerItem key={p.id}>
              <PlayerCard player={p} />
            </StaggerItem>
          ))}
        </StaggerIn>
      )}
    </PageShell>
  );
}
