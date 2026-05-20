import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";
import { ROUTES } from "@/lib/routes";

type TournamentCardData = {
  slug: string;
  name: string;
  shortName: string | null;
  organizer: string | null;
  foundedYear: number | null;
};

export function TournamentCard({ tournament }: { tournament: TournamentCardData }) {
  return (
    <Card asChild className="group p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        href={ROUTES.torneo(tournament.slug)}
        className="flex items-center gap-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          aria-hidden
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
        >
          <Award className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold leading-tight">
            {tournament.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {tournament.organizer}
            {tournament.foundedYear ? ` · Desde ${tournament.foundedYear}` : ""}
          </p>
        </div>
      </Link>
    </Card>
  );
}
