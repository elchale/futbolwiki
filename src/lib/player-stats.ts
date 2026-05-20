import "server-only";
import { prisma } from "@/lib/prisma";

export type PlayerStatsSummary = {
  clubGoals: number;
  clubAppearances: number;
  clubAssists: number;
  ntCaps: number;
  ntGoals: number;
};

/**
 * Aggregate player stats across all club stints + all national-team caps.
 * Used on player cards and profiles.
 */
export async function getPlayerStats(playerId: string): Promise<PlayerStatsSummary> {
  const [stintAgg, ntAgg] = await Promise.all([
    prisma.playerTeamStint.aggregate({
      where: { playerId },
      _sum: { goals: true, appearances: true, assists: true },
    }),
    prisma.nationalTeamCap.aggregate({
      where: { playerId },
      _sum: { caps: true, goals: true },
    }),
  ]);
  return {
    clubGoals: stintAgg._sum.goals ?? 0,
    clubAppearances: stintAgg._sum.appearances ?? 0,
    clubAssists: stintAgg._sum.assists ?? 0,
    ntCaps: ntAgg._sum.caps ?? 0,
    ntGoals: ntAgg._sum.goals ?? 0,
  };
}

/**
 * Batch version — accepts many player IDs and returns a Map keyed by playerId.
 * Used on directory pages to avoid N+1.
 */
export async function getPlayerStatsBatch(
  playerIds: string[],
): Promise<Map<string, PlayerStatsSummary>> {
  if (playerIds.length === 0) return new Map();
  const [stints, caps] = await Promise.all([
    prisma.playerTeamStint.groupBy({
      by: ["playerId"],
      where: { playerId: { in: playerIds } },
      _sum: { goals: true, appearances: true, assists: true },
    }),
    prisma.nationalTeamCap.groupBy({
      by: ["playerId"],
      where: { playerId: { in: playerIds } },
      _sum: { caps: true, goals: true },
    }),
  ]);
  const map = new Map<string, PlayerStatsSummary>();
  for (const id of playerIds) {
    map.set(id, {
      clubGoals: 0,
      clubAppearances: 0,
      clubAssists: 0,
      ntCaps: 0,
      ntGoals: 0,
    });
  }
  for (const r of stints) {
    const s = map.get(r.playerId);
    if (s) {
      s.clubGoals = r._sum.goals ?? 0;
      s.clubAppearances = r._sum.appearances ?? 0;
      s.clubAssists = r._sum.assists ?? 0;
    }
  }
  for (const r of caps) {
    const s = map.get(r.playerId);
    if (s) {
      s.ntCaps = r._sum.caps ?? 0;
      s.ntGoals = r._sum.goals ?? 0;
    }
  }
  return map;
}
