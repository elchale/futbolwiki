import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TeamCrest } from "@/components/team/team-crest";
import { ROUTES } from "@/lib/routes";

type TeamCardData = {
  slug: string;
  name: string;
  shortName: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  badgeUrl: string | null;
  foundedYear: number | null;
  country: { name: string } | null;
};

export function TeamCard({ team }: { team: TeamCardData }) {
  return (
    <Card asChild className="group p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        href={ROUTES.equipo(team.slug)}
        className="flex items-center gap-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <TeamCrest team={team} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold leading-tight">
            {team.shortName ?? team.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {team.country?.name ?? ""}
            {team.foundedYear ? ` · Desde ${team.foundedYear}` : ""}
          </p>
        </div>
      </Link>
    </Card>
  );
}
