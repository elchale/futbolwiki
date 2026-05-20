import { prisma } from "../../client";
import { upsertSource } from "../../sources";
import { cite } from "../../citations";
import { log } from "../../util";
import { EDITION_STORIES } from "../../stories/editions";

/**
 * Seeds the most recent finished World Cup edition (Qatar 2022) with
 * its champion (Argentina), runner-up (France), and top scorer (Mbappé).
 * Also stamps the final match itself with context.
 */
export async function seedWorldCupRecent(): Promise<void> {
  const tournament = await prisma.tournament.findUnique({ where: { slug: "copa-mundial-fifa" } });
  if (!tournament) {
    log.warn("Copa Mundial tournament not found");
    return;
  }

  const arg = await prisma.nationalTeam.findUnique({ where: { slug: "seleccion-argentina" } });
  const fra = await prisma.nationalTeam.findUnique({ where: { slug: "seleccion-francia" } });
  const qat = await prisma.country.findUnique({ where: { isoCode: "QAT" } });
  if (!arg || !fra) {
    log.warn("Argentina or France national team not found");
    return;
  }

  const wikiSource = await upsertSource({
    url: "https://es.wikipedia.org/wiki/Copa_Mundial_de_F%C3%BAtbol_de_2022",
    title: "Copa Mundial de Fútbol de 2022 — Wikipedia",
    publisher: "Wikipedia",
    type: "WIKIPEDIA_ES",
    language: "es",
  });
  const finalSource = await upsertSource({
    url: "https://es.wikipedia.org/wiki/Final_de_la_Copa_Mundial_de_F%C3%BAtbol_de_2022",
    title: "Final de la Copa Mundial de Fútbol de 2022 — Wikipedia",
    publisher: "Wikipedia",
    type: "WIKIPEDIA_ES",
    language: "es",
  });
  const mbappeSource = await upsertSource({
    url: "https://es.wikipedia.org/wiki/Kylian_Mbapp%C3%A9",
    title: "Kylian Mbappé — Wikipedia",
    publisher: "Wikipedia",
    type: "WIKIPEDIA_ES",
    language: "es",
  });

  const mbappe = await prisma.player.findUnique({ where: { slug: "kylian-mbappe" } });

  const editionStory = EDITION_STORIES["copa-mundial-fifa/2022"] ?? null;
  const edition = await prisma.tournamentEdition.upsert({
    where: { tournamentId_year: { tournamentId: tournament.id, year: "2022" } },
    create: {
      tournamentId: tournament.id,
      year: "2022",
      hostCountryId: qat?.id ?? null,
      championNationalTeamId: arg.id,
      runnerUpNationalTeamId: fra.id,
      topScorerPlayerId: mbappe?.id ?? null,
      story: editionStory ?? undefined,
      lastResearchedAt: new Date(),
    },
    update: {
      hostCountryId: qat?.id ?? null,
      championNationalTeamId: arg.id,
      runnerUpNationalTeamId: fra.id,
      topScorerPlayerId: mbappe?.id ?? null,
      story: editionStory ?? undefined,
      lastResearchedAt: new Date(),
    },
  });

  await cite({
    entityType: "TOURNAMENT_EDITION",
    entityId: edition.id,
    sourceIds: [wikiSource],
    fields: ["champion", "runnerUp", "hostCountry"],
  });
  if (mbappe) {
    await cite({
      entityType: "TOURNAMENT_EDITION",
      entityId: edition.id,
      sourceIds: [mbappeSource],
      fields: ["topScorer"],
      note: "Bota de Oro 2022 con 8 goles.",
    });
  }

  // Final match itself: Argentina 3 - 3 France (4-2 en penales)
  const finalDate = new Date("2022-12-18T15:00:00Z");
  const existing = await prisma.match.findFirst({
    where: {
      tournamentEditionId: edition.id,
      homeNationalTeamId: arg.id,
      awayNationalTeamId: fra.id,
      date: finalDate,
    },
  });
  const finalMatch = existing
    ? await prisma.match.update({
        where: { id: existing.id },
        data: {
          status: "FINISHED",
          round: "Final",
          homeScore: 3,
          awayScore: 3,
        },
      })
    : await prisma.match.create({
        data: {
          date: finalDate,
          status: "FINISHED",
          round: "Final",
          tournamentEditionId: edition.id,
          homeNationalTeamId: arg.id,
          awayNationalTeamId: fra.id,
          homeScore: 3,
          awayScore: 3,
        },
      });

  await cite({
    entityType: "MATCH",
    entityId: finalMatch.id,
    sourceIds: [finalSource],
    fields: ["date", "homeScore", "awayScore"],
  });

  // Context for the final
  const factsJson = [
    {
      text:
        "Argentina ganó 4-2 en la tanda de penales tras un 3-3 que incluyó un hat-trick de Mbappé y un doblete de Messi.",
      sourceIds: [finalSource],
    },
    {
      text:
        "Lionel Messi obtuvo el Balón de Oro del torneo; fue su tercer Mundial como titular indiscutido.",
      sourceIds: [wikiSource],
    },
    {
      text:
        "Kylian Mbappé se llevó la Bota de Oro al ser el máximo goleador del torneo con 8 tantos.",
      sourceIds: [mbappeSource],
    },
  ];
  const ctx = await prisma.matchContext.upsert({
    where: { matchId: finalMatch.id },
    create: {
      matchId: finalMatch.id,
      narrative:
        "La final del Mundial de Qatar 2022 entre Argentina y Francia es recordada como una de las más dramáticas de la historia del torneo. El partido pasó por todos los estadios emocionales: dominio inicial de la Albiceleste, reacción francesa al cierre, alargue épico y desenlace en penales para que Lionel Messi, en su última cita mundialista, levantara la copa que le faltaba.",
      factsJson,
    },
    update: {
      narrative:
        "La final del Mundial de Qatar 2022 entre Argentina y Francia es recordada como una de las más dramáticas de la historia del torneo. El partido pasó por todos los estadios emocionales: dominio inicial de la Albiceleste, reacción francesa al cierre, alargue épico y desenlace en penales para que Lionel Messi, en su última cita mundialista, levantara la copa que le faltaba.",
      factsJson,
    },
  });
  await cite({
    entityType: "MATCH_CONTEXT",
    entityId: ctx.id,
    sourceIds: [finalSource, wikiSource],
    fields: ["narrative"],
  });

  // Honor: Argentina campeón
  const existingHonor = await prisma.honor.findFirst({
    where: { ownerType: "NATIONAL_TEAM", ownerId: arg.id, tournamentEditionId: edition.id, type: "CHAMPION" },
  });
  if (!existingHonor) {
    await prisma.honor.create({
      data: {
        ownerType: "NATIONAL_TEAM",
        ownerId: arg.id,
        tournamentEditionId: edition.id,
        type: "CHAMPION",
        year: "2022",
        note: "Tercer título mundial de Argentina (1978, 1986, 2022).",
      },
    });
  }
  log.upsert("world-cup-2022", "tournament-edition");
  log.done("world-cup-recent", 1);
}
