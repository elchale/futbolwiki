import { prisma } from "../client";
import { log } from "../util";

type SeasonSeed = {
  leagueSlug: string;
  year: string;
  startDate?: string;
  endDate?: string;
  status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
};

// We seed the active + recent two seasons per league we cover.
const SEASONS: SeasonSeed[] = [
  // Liga 1 Perú
  { leagueSlug: "liga-1-peru", year: "2026", startDate: "2026-02-14", endDate: "2026-11-30", status: "IN_PROGRESS" },
  { leagueSlug: "liga-1-peru", year: "2025", startDate: "2025-02-08", endDate: "2025-12-08", status: "COMPLETED" },
  { leagueSlug: "liga-1-peru", year: "2024", startDate: "2024-02-23", endDate: "2024-11-30", status: "COMPLETED" },
  { leagueSlug: "liga-1-peru", year: "2023", startDate: "2023-01-21", endDate: "2023-11-04", status: "COMPLETED" },
  { leagueSlug: "liga-1-peru", year: "2022", startDate: "2022-01-29", endDate: "2022-10-30", status: "COMPLETED" },
  // LaLiga
  { leagueSlug: "laliga", year: "2025-26", startDate: "2025-08-15", endDate: "2026-05-24", status: "IN_PROGRESS" },
  { leagueSlug: "laliga", year: "2024-25", startDate: "2024-08-16", endDate: "2025-05-25", status: "COMPLETED" },
  // Premier League
  { leagueSlug: "premier-league", year: "2025-26", startDate: "2025-08-16", endDate: "2026-05-24", status: "IN_PROGRESS" },
  { leagueSlug: "premier-league", year: "2024-25", startDate: "2024-08-16", endDate: "2025-05-25", status: "COMPLETED" },
  // Serie A
  { leagueSlug: "serie-a", year: "2025-26", startDate: "2025-08-23", endDate: "2026-05-24", status: "IN_PROGRESS" },
  // Bundesliga
  { leagueSlug: "bundesliga", year: "2025-26", startDate: "2025-08-22", endDate: "2026-05-16", status: "IN_PROGRESS" },
  // Ligue 1
  { leagueSlug: "ligue-1", year: "2025-26", startDate: "2025-08-15", endDate: "2026-05-16", status: "IN_PROGRESS" },
];

export async function seedSeasons(): Promise<void> {
  let count = 0;
  for (const s of SEASONS) {
    const league = await prisma.league.findUnique({ where: { slug: s.leagueSlug } });
    if (!league) {
      log.warn(`league not found for season: ${s.leagueSlug}`);
      continue;
    }
    await prisma.season.upsert({
      where: { leagueId_year: { leagueId: league.id, year: s.year } },
      create: {
        leagueId: league.id,
        year: s.year,
        status: s.status,
        startDate: s.startDate ? new Date(s.startDate) : null,
        endDate: s.endDate ? new Date(s.endDate) : null,
      },
      update: {
        status: s.status,
        startDate: s.startDate ? new Date(s.startDate) : null,
        endDate: s.endDate ? new Date(s.endDate) : null,
      },
    });
    count++;
  }
  log.done("seasons", count);
}
