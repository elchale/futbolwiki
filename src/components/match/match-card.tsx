import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamCrest } from "@/components/team/team-crest";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";
import { formatMatchDate, formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Match, MatchStatus } from "@/types/entities";

type MatchTeamSummary = {
  slug: string;
  name: string;
  shortName: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
};

type MatchCardData = Pick<Match, "id" | "date" | "status" | "homeScore" | "awayScore" | "round"> & {
  homeTeam: MatchTeamSummary | null;
  awayTeam: MatchTeamSummary | null;
  league?: { name: string; slug: string } | null;
  stadium?: { name: string } | null;
};

const STATUS_LABEL: Record<MatchStatus, string> = {
  SCHEDULED: STRINGS.match.upcoming,
  LIVE: STRINGS.match.live,
  FINISHED: STRINGS.match.finished,
  POSTPONED: STRINGS.match.postponed,
  CANCELLED: STRINGS.match.cancelled,
  ABANDONED: STRINGS.match.abandoned,
};

export function MatchCard({ match }: { match: MatchCardData }) {
  const home = match.homeTeam;
  const away = match.awayTeam;
  const isFinished = match.status === "FINISHED";

  return (
    <Card asChild className="group overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={ROUTES.partido(match.id)} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge
              variant={isFinished ? "secondary" : "default"}
              className={cn(
                "font-medium",
                match.status === "LIVE" && "bg-success text-success-foreground",
                match.status === "POSTPONED" && "bg-warning text-warning-foreground",
              )}
            >
              {STATUS_LABEL[match.status]}
            </Badge>
            {match.league ? (
              <span className="truncate">· {match.league.name}{match.round ? ` · ${match.round}` : ""}</span>
            ) : match.round ? (
              <span className="truncate">{match.round}</span>
            ) : null}
          </div>
          <span className="hidden tabular-nums sm:inline">{formatMatchDate(match.date)}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-5">
          <TeamSide team={home} align="end" />
          <div className="flex flex-col items-center">
            {isFinished ? (
              <span className="font-display text-2xl font-bold tabular-nums">
                {formatScore(match.homeScore, match.awayScore)}
              </span>
            ) : (
              <span className="font-display text-lg font-semibold text-muted-foreground">
                {STRINGS.match.vs}
              </span>
            )}
          </div>
          <TeamSide team={away} align="start" />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground sm:hidden">
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden />
            <span className="tabular-nums">{formatMatchDate(match.date)}</span>
          </span>
        </div>
        {match.stadium ? (
          <div className="hidden flex-wrap items-center gap-x-4 gap-y-1 border-t border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {match.stadium.name}
            </span>
          </div>
        ) : null}
      </Link>
    </Card>
  );
}

function TeamSide({ team, align }: { team: MatchTeamSummary | null; align: "start" | "end" }) {
  if (!team) {
    return <span className="text-sm text-muted-foreground">Por definir</span>;
  }
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "end" ? "flex-row-reverse text-right" : "flex-row text-left",
      )}
    >
      <TeamCrest team={team} size="lg" />
      <div className={cn("min-w-0", align === "end" && "items-end")}>
        <p className="truncate font-display text-base font-semibold leading-tight">
          {team.shortName ?? team.name}
        </p>
      </div>
    </div>
  );
}
