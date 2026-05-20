import Link from "next/link";
import { notFound } from "next/navigation";
import { Cake, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card } from "@/components/ui/card";
import { ComingSoonBlock } from "@/components/state/coming-soon-block";
import { SourceCitation } from "@/components/citation/source-citation";
import { StoryView } from "@/components/common/story-view";
import { parseStory } from "@/types/story";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";
import { formatLongDate, formatAge } from "@/lib/format";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const coaches = await prisma.coach.findMany({ select: { slug: true } });
  return coaches.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = await prisma.coach.findUnique({ where: { slug } });
  return { title: c?.fullName ?? "Entrenador" };
}

export default async function EntrenadorPage({ params }: Props) {
  const { slug } = await params;
  const coach = await prisma.coach.findUnique({
    where: { slug },
    include: {
      nationality: true,
      currentTeams: { select: { slug: true, name: true } },
      stints: {
        orderBy: { startDate: "desc" },
        include: { team: { select: { slug: true, name: true, shortName: true } } },
      },
    },
  });
  if (!coach) notFound();

  return (
    <PageShell className="space-y-10">
      <PageHeader
        eyebrow={STRINGS.coach.nationality}
        title={coach.fullName}
        subtitle={coach.nationality?.name ?? undefined}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coach.birthDate ? (
          <FactCard
            icon={Cake}
            label="Nacimiento"
            value={`${formatLongDate(coach.birthDate)} (${formatAge(coach.birthDate)} años)`}
          />
        ) : null}
        {coach.nationality ? (
          <FactCard icon={Globe} label={STRINGS.coach.nationality} value={coach.nationality.name} />
        ) : null}
      </div>

      {coach.bio ? (
        <Section title={STRINGS.coach.biography}>
          <Card>
            <div className="p-6 max-w-prose">
              <p className="text-base leading-relaxed">
                {coach.bio}{" "}
                <SourceCitation entityType="COACH" entityId={coach.id} field="bio" />
              </p>
            </div>
          </Card>
        </Section>
      ) : null}

      {(() => {
        const story = parseStory(coach.story);
        return story && story.sections.length > 0 ? <StoryView story={story} /> : null;
      })()}

      {coach.currentTeams.length > 0 ? (
        <Section title={STRINGS.coach.currentTeam}>
          <div className="grid gap-3 sm:grid-cols-2">
            {coach.currentTeams.map((t) => (
              <Card key={t.slug}>
                <Link href={ROUTES.equipo(t.slug)} className="block p-4 font-display text-base font-semibold hover:underline">
                  {t.name}
                </Link>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title={STRINGS.coach.career}>
        {coach.stints.length === 0 ? (
          <ComingSoonBlock body="Iremos sumando los pasos por cada club a medida que verifiquemos las fechas." />
        ) : (
          <Card>
            <ul className="divide-y divide-border">
              {coach.stints.map((s) => (
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
