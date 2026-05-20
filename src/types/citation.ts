import type { SourceType, CitationConfidence } from "@/generated/prisma/client";

export type EntityType =
  | "TEAM"
  | "PLAYER"
  | "COACH"
  | "LEAGUE"
  | "SEASON"
  | "TEAM_SEASON"
  | "TOURNAMENT"
  | "TOURNAMENT_EDITION"
  | "MATCH"
  | "MATCH_CONTEXT"
  | "MATCH_EVENT"
  | "STADIUM"
  | "COUNTRY"
  | "NATIONAL_TEAM"
  | "HONOR"
  | "PLAYER_STINT"
  | "COACH_STINT"
  | "NATIONAL_TEAM_CAP";

export type CitationView = {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourcePublisher: string | null;
  sourceUrl: string;
  sourceType: SourceType;
  language: string;
  confidence: CitationConfidence;
  accessedAt: string;
  note: string | null;
};
