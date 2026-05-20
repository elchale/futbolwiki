import type { Position, Foot } from "../../../../src/generated/prisma/client";
import { prisma } from "../../client";
import { upsertSource } from "../../sources";
import { cite } from "../../citations";
import { log } from "../../util";
import { PLAYER_STORIES } from "../../stories/players";
import { PLAYER_STINT_STATS } from "../../stories/player-stats";

type PlayerSeed = {
  slug: string;
  fullName: string;
  knownAs?: string;
  birthDate?: string;
  birthplace?: string;
  birthCountryIso: string;
  position: Position;
  foot: Foot;
  heightCm?: number;
  shirtNumber?: number;
  currentTeamSlug?: string;
  bio?: string;
  wikipediaEs: string;
};

const PLAYERS: PlayerSeed[] = [
  // Real Madrid
  { slug: "vinicius-junior", fullName: "Vinícius José Paixão de Oliveira Júnior", knownAs: "Vinícius Júnior", birthDate: "2000-07-12", birthplace: "São Gonçalo, Brasil", birthCountryIso: "BRA", position: "FWD", foot: "RIGHT", heightCm: 176, shirtNumber: 7, currentTeamSlug: "real-madrid", bio: "Extremo brasileño llegado del Flamengo en 2018. Pieza fundamental del Real Madrid contemporáneo y figura habitual del once de la Champions League.", wikipediaEs: "https://es.wikipedia.org/wiki/Vin%C3%ADcius_J%C3%BAnior" },
  { slug: "jude-bellingham", fullName: "Jude Victor William Bellingham", knownAs: "Jude Bellingham", birthDate: "2003-06-29", birthplace: "Stourbridge, Inglaterra", birthCountryIso: "ENG", position: "MID", foot: "RIGHT", heightCm: 186, shirtNumber: 5, currentTeamSlug: "real-madrid", bio: "Mediocampista inglés llegado del Borussia Dortmund en 2023. Se consolidó rápidamente como referente del centro del campo merengue.", wikipediaEs: "https://es.wikipedia.org/wiki/Jude_Bellingham" },
  { slug: "kylian-mbappe", fullName: "Kylian Mbappé Lottin", knownAs: "Kylian Mbappé", birthDate: "1998-12-20", birthplace: "Bondy, Francia", birthCountryIso: "FRA", position: "FWD", foot: "RIGHT", heightCm: 178, shirtNumber: 10, currentTeamSlug: "real-madrid", bio: "Delantero francés campeón del mundo en 2018. Recaló en el Real Madrid en 2024 tras siete temporadas en el PSG.", wikipediaEs: "https://es.wikipedia.org/wiki/Kylian_Mbapp%C3%A9" },

  // Barcelona
  { slug: "lamine-yamal", fullName: "Lamine Yamal Nasraoui Ebana", knownAs: "Lamine Yamal", birthDate: "2007-07-13", birthplace: "Esplugues de Llobregat, España", birthCountryIso: "ESP", position: "FWD", foot: "LEFT", heightCm: 180, shirtNumber: 19, currentTeamSlug: "fc-barcelona", bio: "Extremo nacido en 2007, formado en La Masia y debutante con el primer equipo del Barcelona en 2023. Campeón de la Eurocopa 2024 con España.", wikipediaEs: "https://es.wikipedia.org/wiki/Lamine_Yamal" },
  { slug: "pedri", fullName: "Pedro González López", knownAs: "Pedri", birthDate: "2002-11-25", birthplace: "Tegueste, España", birthCountryIso: "ESP", position: "MID", foot: "RIGHT", heightCm: 174, shirtNumber: 8, currentTeamSlug: "fc-barcelona", bio: "Mediocampista canario referente del estilo de juego asociativo del Barcelona y de la selección española.", wikipediaEs: "https://es.wikipedia.org/wiki/Pedri" },
  { slug: "robert-lewandowski", fullName: "Robert Lewandowski", knownAs: "Robert Lewandowski", birthDate: "1988-08-21", birthplace: "Varsovia, Polonia", birthCountryIso: "POL", position: "FWD", foot: "RIGHT", heightCm: 185, shirtNumber: 9, currentTeamSlug: "fc-barcelona", bio: "Delantero polaco, máximo goleador histórico de la selección polaca y uno de los nueve más eficientes de las últimas dos décadas.", wikipediaEs: "https://es.wikipedia.org/wiki/Robert_Lewandowski" },

  // Atlético de Madrid
  { slug: "antoine-griezmann", fullName: "Antoine Griezmann", knownAs: "Antoine Griezmann", birthDate: "1991-03-21", birthplace: "Mâcon, Francia", birthCountryIso: "FRA", position: "FWD", foot: "LEFT", heightCm: 176, shirtNumber: 8, currentTeamSlug: "atletico-madrid", bio: "Delantero francés, campeón del mundo en 2018 y referente histórico del Atlético de Madrid.", wikipediaEs: "https://es.wikipedia.org/wiki/Antoine_Griezmann" },
  { slug: "julian-alvarez", fullName: "Julián Álvarez", knownAs: "Julián Álvarez", birthDate: "2000-01-31", birthplace: "Calchín, Córdoba, Argentina", birthCountryIso: "ARG", position: "FWD", foot: "RIGHT", heightCm: 170, shirtNumber: 19, currentTeamSlug: "atletico-madrid", bio: "La Araña, delantero argentino campeón del mundo con la selección en 2022 y de la Champions con Manchester City en 2022-23. Fichó por el Atlético de Madrid en 2024.", wikipediaEs: "https://es.wikipedia.org/wiki/Juli%C3%A1n_%C3%81lvarez_(futbolista)" },

  // Manchester City
  { slug: "erling-haaland", fullName: "Erling Braut Haaland", knownAs: "Erling Haaland", birthDate: "2000-07-21", birthplace: "Leeds, Inglaterra", birthCountryIso: "ENG", position: "FWD", foot: "LEFT", heightCm: 195, shirtNumber: 9, currentTeamSlug: "manchester-city", bio: "Delantero noruego, hijo de Alf-Inge Haaland. Llegó al Manchester City en 2022 y rompió récords goleadores en la Premier League.", wikipediaEs: "https://es.wikipedia.org/wiki/Erling_Haaland" },
  { slug: "phil-foden", fullName: "Philip Walter Foden", knownAs: "Phil Foden", birthDate: "2000-05-28", birthplace: "Stockport, Inglaterra", birthCountryIso: "ENG", position: "MID", foot: "LEFT", heightCm: 171, shirtNumber: 47, currentTeamSlug: "manchester-city", bio: "Producto de la cantera del Manchester City. Mediocampista creativo con varios títulos de Premier y la Champions League.", wikipediaEs: "https://es.wikipedia.org/wiki/Phil_Foden" },
  { slug: "rodri", fullName: "Rodrigo Hernández Cascante", knownAs: "Rodri", birthDate: "1996-06-22", birthplace: "Madrid, España", birthCountryIso: "ESP", position: "MID", foot: "RIGHT", heightCm: 191, shirtNumber: 16, currentTeamSlug: "manchester-city", bio: "Mediocentro defensivo del Manchester City y la selección española. Ganador del Balón de Oro 2024.", wikipediaEs: "https://es.wikipedia.org/wiki/Rodri" },

  // Liverpool
  { slug: "mohamed-salah", fullName: "Mohamed Salah Ghaly", knownAs: "Mohamed Salah", birthDate: "1992-06-15", birthplace: "Nagrig, Egipto", birthCountryIso: "EGY", position: "FWD", foot: "LEFT", heightCm: 175, shirtNumber: 11, currentTeamSlug: "liverpool", bio: "Extremo egipcio y máximo referente del Liverpool moderno. Campeón de la Champions League 2018-19.", wikipediaEs: "https://es.wikipedia.org/wiki/Mohamed_Salah" },
  { slug: "virgil-van-dijk", fullName: "Virgil van Dijk", knownAs: "Virgil van Dijk", birthDate: "1991-07-08", birthplace: "Breda, Países Bajos", birthCountryIso: "NED", position: "DEF", foot: "RIGHT", heightCm: 193, shirtNumber: 4, currentTeamSlug: "liverpool", bio: "Defensor central neerlandés, considerado uno de los mejores zagueros del fútbol contemporáneo. Capitán del Liverpool y de los Países Bajos.", wikipediaEs: "https://es.wikipedia.org/wiki/Virgil_van_Dijk" },

  // Manchester United
  { slug: "bruno-fernandes", fullName: "Bruno Miguel Borges Fernandes", knownAs: "Bruno Fernandes", birthDate: "1994-09-08", birthplace: "Maia, Portugal", birthCountryIso: "POR", position: "MID", foot: "RIGHT", heightCm: 179, shirtNumber: 8, currentTeamSlug: "manchester-united", bio: "Mediocampista portugués, capitán del Manchester United desde 2022.", wikipediaEs: "https://es.wikipedia.org/wiki/Bruno_Fernandes" },

  // Arsenal
  { slug: "bukayo-saka", fullName: "Bukayo Ayoyinka Temidayo Saka", knownAs: "Bukayo Saka", birthDate: "2001-09-05", birthplace: "Londres, Inglaterra", birthCountryIso: "ENG", position: "FWD", foot: "LEFT", heightCm: 178, shirtNumber: 7, currentTeamSlug: "arsenal", bio: "Producto de la cantera Hale End del Arsenal. Internacional inglés y referente del proyecto de Arteta.", wikipediaEs: "https://es.wikipedia.org/wiki/Bukayo_Saka" },
  { slug: "martin-odegaard", fullName: "Martin Ødegaard", knownAs: "Martin Ødegaard", birthDate: "1998-12-17", birthplace: "Drammen, Noruega", birthCountryIso: "ENG", position: "MID", foot: "LEFT", heightCm: 178, shirtNumber: 8, currentTeamSlug: "arsenal", bio: "Capitán del Arsenal y de la selección de Noruega. Llegó al Arsenal cedido desde el Real Madrid y luego se quedó en propiedad.", wikipediaEs: "https://es.wikipedia.org/wiki/Martin_%C3%98degaard" },

  // Bayern
  { slug: "harry-kane", fullName: "Harry Edward Kane", knownAs: "Harry Kane", birthDate: "1993-07-28", birthplace: "Walthamstow, Inglaterra", birthCountryIso: "ENG", position: "FWD", foot: "RIGHT", heightCm: 188, shirtNumber: 9, currentTeamSlug: "bayern-munich", bio: "Capitán de la selección inglesa y máximo goleador histórico de su selección. Llegó al Bayern desde Tottenham en 2023.", wikipediaEs: "https://es.wikipedia.org/wiki/Harry_Kane" },
  { slug: "jamal-musiala", fullName: "Jamal Musiala", knownAs: "Jamal Musiala", birthDate: "2003-02-26", birthplace: "Stuttgart, Alemania", birthCountryIso: "GER", position: "MID", foot: "RIGHT", heightCm: 184, shirtNumber: 42, currentTeamSlug: "bayern-munich", bio: "Mediocampista creativo formado en la cantera del Bayern, una de las grandes figuras de su generación en el fútbol alemán.", wikipediaEs: "https://es.wikipedia.org/wiki/Jamal_Musiala" },

  // PSG
  { slug: "ousmane-dembele", fullName: "Masour Ousmane Dembélé", knownAs: "Ousmane Dembélé", birthDate: "1997-05-15", birthplace: "Vernon, Francia", birthCountryIso: "FRA", position: "FWD", foot: "BOTH", heightCm: 178, shirtNumber: 10, currentTeamSlug: "paris-saint-germain", bio: "Extremo francés campeón del mundo en 2018. Llegó al PSG en 2023 desde el Barcelona y fue protagonista de la Champions 2024-25.", wikipediaEs: "https://es.wikipedia.org/wiki/Ousmane_Demb%C3%A9l%C3%A9" },

  // Juventus
  { slug: "dusan-vlahovic", fullName: "Dušan Vlahović", knownAs: "Dušan Vlahović", birthDate: "2000-01-28", birthplace: "Belgrado, Serbia", birthCountryIso: "ITA", position: "FWD", foot: "LEFT", heightCm: 190, shirtNumber: 9, currentTeamSlug: "juventus", bio: "Delantero serbio fichado por la Juventus en 2022 desde la Fiorentina.", wikipediaEs: "https://es.wikipedia.org/wiki/Du%C5%A1an_Vlahovi%C4%87" },
];

export async function seedTopEuropeanPlayers(): Promise<void> {
  let count = 0;
  for (const p of PLAYERS) {
    const country = await prisma.country.findUnique({ where: { isoCode: p.birthCountryIso } });
    if (!country) {
      log.warn(`country not found for player ${p.slug}: ${p.birthCountryIso}`);
      continue;
    }
    const team = p.currentTeamSlug
      ? await prisma.team.findUnique({ where: { slug: p.currentTeamSlug } })
      : null;

    const sourceId = await upsertSource({
      url: p.wikipediaEs,
      title: `${p.knownAs ?? p.fullName} — Wikipedia`,
      publisher: "Wikipedia",
      type: "WIKIPEDIA_ES",
      language: "es",
    });

    const story = PLAYER_STORIES[p.slug] ?? null;
    const upserted = await prisma.player.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        fullName: p.fullName,
        knownAs: p.knownAs ?? null,
        birthDate: p.birthDate ? new Date(p.birthDate) : null,
        birthplace: p.birthplace ?? null,
        birthCountryId: country.id,
        position: p.position,
        foot: p.foot,
        heightCm: p.heightCm ?? null,
        shirtNumber: p.shirtNumber ?? null,
        currentTeamId: team?.id ?? null,
        bio: p.bio ?? null,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
      update: {
        fullName: p.fullName,
        knownAs: p.knownAs ?? null,
        birthDate: p.birthDate ? new Date(p.birthDate) : null,
        birthplace: p.birthplace ?? null,
        birthCountryId: country.id,
        position: p.position,
        foot: p.foot,
        heightCm: p.heightCm ?? null,
        shirtNumber: p.shirtNumber ?? null,
        currentTeamId: team?.id ?? null,
        bio: p.bio ?? null,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
    });

    await cite({
      entityType: "PLAYER",
      entityId: upserted.id,
      sourceIds: [sourceId],
      fields: ["fullName", "birthDate", "birthplace", "position", "bio"],
    });

    if (team) {
      const stats = PLAYER_STINT_STATS[p.slug] ?? {};
      const existing = await prisma.playerTeamStint.findFirst({
        where: { playerId: upserted.id, teamId: team.id, endDate: null },
      });
      if (existing) {
        await prisma.playerTeamStint.update({
          where: { id: existing.id },
          data: {
            appearances: stats.appearances ?? existing.appearances,
            goals: stats.goals ?? existing.goals,
            assists: stats.assists ?? existing.assists,
          },
        });
      } else {
        await prisma.playerTeamStint.create({
          data: {
            playerId: upserted.id,
            teamId: team.id,
            startDate: new Date("2024-07-01"),
            isLoan: false,
            appearances: stats.appearances ?? null,
            goals: stats.goals ?? null,
            assists: stats.assists ?? null,
          },
        });
      }
    }

    log.upsert(p.slug, "player(european)");
    count++;
  }
  log.done("top-european-players", count);
}
