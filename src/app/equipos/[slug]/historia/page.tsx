import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { Card } from "@/components/ui/card";
import { SourceCitation } from "@/components/citation/source-citation";
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
  return { title: team ? `${team.shortName ?? team.name} — Historia` : "Historia" };
}

export default async function HistoriaPage({ params }: Props) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
    include: { country: true, stadium: true },
  });
  if (!team) notFound();

  const coachStints = await prisma.coachTeamStint.findMany({
    where: { teamId: team.id },
    orderBy: { startDate: "desc" },
    include: { coach: true },
  });

  return (
    <PageShell className="space-y-10">
      <PageHeader
        eyebrow={team.shortName ?? team.name}
        title={STRINGS.team.history}
        subtitle="Cronología, hitos y entrenadores históricos."
      />

      <Section title="Reseña">
        {team.description ? (
          <Card>
            <div className="space-y-4 p-6 max-w-prose">
              <p className="text-base leading-relaxed">
                {team.description}{" "}
                <SourceCitation entityType="TEAM" entityId={team.id} field="description" />
              </p>
              {team.foundedYear ? (
                <p className="text-sm text-muted-foreground">
                  Año de fundación: <span className="font-medium text-foreground">{team.foundedYear}</span>{" "}
                  <SourceCitation entityType="TEAM" entityId={team.id} field="foundedYear" />
                </p>
              ) : null}
            </div>
          </Card>
        ) : (
          <ComingSoonBlock title={STRINGS.empty.historia.title} body={STRINGS.empty.historia.body} />
        )}
      </Section>

      <Section title="Cuerpo técnico — pasado y presente">
        {coachStints.length === 0 ? (
          <ComingSoonBlock body="La historia de entrenadores se completará en próximas iteraciones." />
        ) : (
          <Card>
            <ul className="divide-y divide-border">
              {coachStints.map((s) => (
                <li key={s.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <p className="font-display text-base font-semibold">{s.coach.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.startDate.toLocaleDateString("es")} —{" "}
                      {s.endDate ? s.endDate.toLocaleDateString("es") : "Actualidad"}
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
