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
  // Alianza Lima
  { slug: "paolo-guerrero", fullName: "José Paolo Guerrero Gonzales", knownAs: "Paolo Guerrero", birthDate: "1984-01-01", birthplace: "Lima, Perú", birthCountryIso: "PER", position: "FWD", foot: "RIGHT", heightCm: 184, currentTeamSlug: "alianza-lima", bio: "Máximo goleador histórico de la selección peruana. Desarrolló buena parte de su carrera en Bayern Múnich, Hamburgo, Corinthians, Flamengo e Internacional de Porto Alegre antes de regresar al Perú.", wikipediaEs: "https://es.wikipedia.org/wiki/Paolo_Guerrero" },
  { slug: "hernan-barcos", fullName: "Hernán Hugo Barcos Vélez", knownAs: "Hernán Barcos", birthDate: "1984-05-10", birthplace: "Pergamino, Argentina", birthCountryIso: "ARG", position: "FWD", foot: "RIGHT", heightCm: 184, currentTeamSlug: "alianza-lima", bio: "Delantero argentino con larga trayectoria en Sudamérica. Es uno de los referentes históricos de Alianza Lima en su segunda era victoriana.", wikipediaEs: "https://es.wikipedia.org/wiki/Hern%C3%A1n_Barcos" },
  { slug: "kevin-quevedo", fullName: "Kevin Junior Quevedo Loza", knownAs: "Kevin Quevedo", birthDate: "1997-08-04", birthplace: "Lima, Perú", birthCountryIso: "PER", position: "FWD", foot: "LEFT", currentTeamSlug: "alianza-lima", bio: "Extremo izquierdo peruano formado en Alianza Lima. Internacional con la selección peruana.", wikipediaEs: "https://es.wikipedia.org/wiki/Kevin_Quevedo" },

  // Universitario
  { slug: "rodrigo-urena", fullName: "Rodrigo Antonio Ureña Estay", knownAs: "Rodrigo Ureña", birthDate: "1993-03-19", birthplace: "Quillota, Chile", birthCountryIso: "CHI", position: "MID", foot: "RIGHT", currentTeamSlug: "universitario-de-deportes", bio: "Volante chileno conocido por su despliegue defensivo. Pieza clave del bicampeonato del Universitario.", wikipediaEs: "https://es.wikipedia.org/wiki/Rodrigo_Ure%C3%B1a" },
  { slug: "alex-valera", fullName: "Alex Eli Valera Caján", knownAs: "Alex Valera", birthDate: "1996-04-29", birthplace: "Bellavista, Sullana, Perú", birthCountryIso: "PER", position: "FWD", foot: "RIGHT", currentTeamSlug: "universitario-de-deportes", bio: "Delantero peruano formado en Carlos A. Mannucci y consolidado en Universitario. Internacional con la selección peruana.", wikipediaEs: "https://es.wikipedia.org/wiki/Alex_Valera" },
  { slug: "edison-flores", fullName: "Edison Michael Flores Peralta", knownAs: "Edison Flores", birthDate: "1994-05-14", birthplace: "Lima, Perú", birthCountryIso: "PER", position: "MID", foot: "RIGHT", currentTeamSlug: "universitario-de-deportes", bio: "Apodado 'Orejas', es uno de los jugadores con mayor trayectoria internacional de su generación, con pasos por Aalborg, Monarcas, DC United y Atlas. Internacional con Perú.", wikipediaEs: "https://es.wikipedia.org/wiki/Edison_Flores" },

  // Sporting Cristal
  { slug: "yoshimar-yotun", fullName: "Yoshimar Mauricio Yotún Flores", knownAs: "Yoshimar Yotún", birthDate: "1990-04-07", birthplace: "Callao, Perú", birthCountryIso: "PER", position: "MID", foot: "LEFT", currentTeamSlug: "sporting-cristal", bio: "Mediocampista zurdo con paso por Sporting Lisboa, Malmö, Orlando City, Veracruz y Cruz Azul. Referente histórico de la selección peruana.", wikipediaEs: "https://es.wikipedia.org/wiki/Yoshimar_Yot%C3%BAn" },
  { slug: "martin-cauteruccio", fullName: "Martín Andrés Cauteruccio Pedrós", knownAs: "Martín Cauteruccio", birthDate: "1987-04-15", birthplace: "Montevideo, Uruguay", birthCountryIso: "URU", position: "FWD", foot: "RIGHT", currentTeamSlug: "sporting-cristal", bio: "Delantero uruguayo con pasos por Independiente, Sao Paulo, Cerro Porteño y Aucas, entre otros.", wikipediaEs: "https://es.wikipedia.org/wiki/Mart%C3%ADn_Cauteruccio" },
  { slug: "joao-grimaldo", fullName: "Joao Patrick Grimaldo Espinoza", knownAs: "Joao Grimaldo", birthDate: "2003-08-25", birthplace: "Lima, Perú", birthCountryIso: "PER", position: "FWD", foot: "RIGHT", currentTeamSlug: "sporting-cristal", bio: "Extremo formado en Sporting Cristal, joven promesa del fútbol peruano y una de las apariciones más prometedoras del último ciclo.", wikipediaEs: "https://es.wikipedia.org/wiki/Joao_Grimaldo" },

  // Cienciano
  { slug: "christian-cueva", fullName: "Christian Martín Cueva Bravo", knownAs: "Christian Cueva", birthDate: "1991-11-23", birthplace: "Huamachuco, Perú", birthCountryIso: "PER", position: "MID", foot: "RIGHT", currentTeamSlug: "cienciano", bio: "Mediocampista ofensivo apodado 'Aladino'. Es uno de los talentos más mediáticos del fútbol peruano del último ciclo, con pasos por São Paulo, Krasnodar, Pachuca y Al-Fateh.", wikipediaEs: "https://es.wikipedia.org/wiki/Christian_Cueva" },
];

export async function seedLiga1Players(): Promise<void> {
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

    // current PlayerTeamStint with aggregated career stats
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
            startDate: new Date("2025-01-01"),
            isLoan: false,
            appearances: stats.appearances ?? null,
            goals: stats.goals ?? null,
            assists: stats.assists ?? null,
          },
        });
      }
    }

    log.upsert(p.slug, "player(liga1)");
    count++;
  }
  log.done("liga1-players", count);
}
