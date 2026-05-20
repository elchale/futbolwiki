import { prisma, disconnect } from "./client";
import { withSection } from "./util";
import { seedCountries } from "./entities/countries";
import { seedStadiums } from "./entities/stadiums";
import { seedLeagues } from "./entities/leagues";
import { seedSeasons } from "./entities/seasons";
import { seedNationalTeams } from "./entities/national-teams";
import { seedTournaments } from "./entities/tournaments";
import { seedCoaches } from "./entities/coaches";
import { seedLiga1Teams } from "./entities/teams/liga1-peru";
import { seedTopEuropeanTeams } from "./entities/teams/top-european";
import { seedLiga1Players } from "./entities/players/liga1-peru";
import { seedTopEuropeanPlayers } from "./entities/players/top-european";
import { seedSeleccionPeruana } from "./entities/players/seleccion-peruana";
import { seedLiga1Matches } from "./entities/matches/liga1-upcoming";
import { seedWorldCupRecent } from "./entities/tournaments/world-cup-recent";
import { buildSearchIndex } from "./build-search-index";

async function main() {
  process.stdout.write("===== futbol seed =====\n");

  await withSection("countries", seedCountries);
  await withSection("stadiums", seedStadiums);
  await withSection("leagues", seedLeagues);
  await withSection("seasons", seedSeasons);
  await withSection("national-teams", seedNationalTeams);
  await withSection("tournaments", seedTournaments);
  await withSection("coaches", seedCoaches);
  await withSection("liga1-teams", seedLiga1Teams);
  await withSection("top-european-teams", seedTopEuropeanTeams);
  await withSection("liga1-players", seedLiga1Players);
  await withSection("top-european-players", seedTopEuropeanPlayers);
  await withSection("seleccion-peruana", seedSeleccionPeruana);
  await withSection("liga1-matches", seedLiga1Matches);
  await withSection("world-cup-recent", seedWorldCupRecent);
  await withSection("search-index", buildSearchIndex);

  process.stdout.write("===== seed complete =====\n");
}

main()
  .catch((e) => {
    process.stderr.write(`SEED FAILED: ${e.stack ?? e}\n`);
    return disconnect().finally(() => process.exit(1));
  })
  .finally(() => disconnect());

export { prisma };
