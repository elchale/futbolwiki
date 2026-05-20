import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerPortrait } from "@/components/player/player-portrait";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";
import type { Position } from "@/types/entities";
import type { PlayerStatsSummary } from "@/lib/player-stats";

type PlayerCardData = {
  slug: string;
  fullName: string;
  knownAs: string | null;
  portraitUrl: string | null;
  position: Position;
  shirtNumber: number | null;
  currentTeam: { name: string; shortName: string | null } | null;
};

export function PlayerCard({
  player,
  stats,
}: {
  player: PlayerCardData;
  stats?: PlayerStatsSummary;
}) {
  const displayName = player.knownAs ?? player.fullName;
  return (
    <Card asChild className="group p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        href={ROUTES.jugador(player.slug)}
        className="flex flex-col gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-4">
          <PlayerPortrait name={displayName} portraitUrl={player.portraitUrl} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold leading-tight">
              {displayName}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <Badge variant="secondary" className="font-normal">
                {STRINGS.position[player.position]}
              </Badge>
              {player.currentTeam ? (
                <span className="truncate">
                  · {player.currentTeam.shortName ?? player.currentTeam.name}
                </span>
              ) : null}
              {player.shirtNumber ? (
                <span className="ml-auto font-mono tabular-nums">#{player.shirtNumber}</span>
              ) : null}
            </div>
          </div>
        </div>

        {stats && (stats.clubGoals > 0 || stats.ntCaps > 0) ? (
          <div className="grid grid-cols-3 gap-1 rounded-md bg-muted/50 px-3 py-2 text-center">
            <Stat label="Goles" value={stats.clubGoals} />
            <Stat label="PJ" value={stats.clubAppearances} />
            <Stat
              label="Selección"
              value={stats.ntCaps > 0 ? `${stats.ntGoals}g / ${stats.ntCaps}` : "—"}
              wide
            />
          </div>
        ) : null}
      </Link>
    </Card>
  );
}

function Stat({ label, value, wide }: { label: string; value: string | number; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-1" : ""}>
      <p className="font-display text-sm font-semibold tabular-nums leading-tight">{value}</p>
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
