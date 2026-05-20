import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";

type LeagueCardData = {
  slug: string;
  name: string;
  shortName: string | null;
  tier: number;
  foundedYear: number | null;
  country: { name: string } | null;
};

export function LeagueCard({ league }: { league: LeagueCardData }) {
  const tierLabel =
    (STRINGS.league.tier as Record<number, string>)[league.tier] ?? `División ${league.tier}`;
  return (
    <Card asChild className="group p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        href={ROUTES.liga(league.slug)}
        className="flex items-center gap-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          aria-hidden
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-gold-muted text-brand-gold"
        >
          <Trophy className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold leading-tight">
            {league.name}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {league.country?.name ? <span>{league.country.name}</span> : null}
            <Badge variant="outline" className="font-normal">
              {tierLabel}
            </Badge>
            {league.foundedYear ? <span>Desde {league.foundedYear}</span> : null}
          </div>
        </div>
      </Link>
    </Card>
  );
}
