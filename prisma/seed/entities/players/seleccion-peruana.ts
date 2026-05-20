import type { Position, Foot } from "../../../../src/generated/prisma/client";
import { prisma } from "../../client";
import { upsertSource } from "../../sources";
import { cite } from "../../citations";
import { log } from "../../util";
import { PLAYER_STORIES } from "../../stories/players";

/**
 * Adds Selección Peruana caps. Players already inserted by other seeds
 * (Liga 1 or top European) are looked up by slug; players new to the DB
 * (e.g. ones playing abroad outside top European) are created here.
 */

type SeleccionMember = {
  slug: string;
  // Optional: when player is not already in DB, create a stub Player here
  createIfMissing?: {
    fullName: string;
    knownAs?: string;
    birthDate: string;
    birthplace: string;
    birthCountryIso?: string;
    position: Position;
    foot: Foot;
    heightCm?: number;
    bio?: string;
    wikipediaEs: string;
  };
  // cap snapshot
  caps: number;
  goals: number;
  debutDate: string;
  lastCapDate: string;
  wikipediaEs?: string;
};

const MEMBERS: SeleccionMember[] = [
  // already in DB
  { slug: "paolo-guerrero", caps: 124, goals: 41, debutDate: "2004-09-08", lastCapDate: "2025-11-15", wikipediaEs: "https://es.wikipedia.org/wiki/Paolo_Guerrero" },
  { slug: "yoshimar-yotun", caps: 130, goals: 8, debutDate: "2011-06-05", lastCapDate: "2025-11-18", wikipediaEs: "https://es.wikipedia.org/wiki/Yoshimar_Yot%C3%BAn" },
  { slug: "christian-cueva", caps: 105, goals: 12, debutDate: "2011-09-02", lastCapDate: "2025-10-15", wikipediaEs: "https://es.wikipedia.org/wiki/Christian_Cueva" },
  { slug: "edison-flores", caps: 91, goals: 19, debutDate: "2014-06-05", lastCapDate: "2025-11-18", wikipediaEs: "https://es.wikipedia.org/wiki/Edison_Flores" },
  { slug: "alex-valera", caps: 17, goals: 4, debutDate: "2022-01-27", lastCapDate: "2025-11-18", wikipediaEs: "https://es.wikipedia.org/wiki/Alex_Valera" },
  { slug: "kevin-quevedo", caps: 14, goals: 0, debutDate: "2018-09-07", lastCapDate: "2024-11-19" },
  { slug: "joao-grimaldo", caps: 8, goals: 1, debutDate: "2023-06-19", lastCapDate: "2025-11-18", wikipediaEs: "https://es.wikipedia.org/wiki/Joao_Grimaldo" },
  // create-if-missing players
  {
    slug: "pedro-gallese",
    caps: 105,
    goals: 0,
    debutDate: "2015-09-03",
    lastCapDate: "2025-11-18",
    createIfMissing: {
      fullName: "Pedro Gallese Quiroz",
      knownAs: "Pedro Gallese",
      birthDate: "1990-02-23",
      birthplace: "Lima, Perú",
      birthCountryIso: "PER",
      position: "GK",
      foot: "RIGHT",
      heightCm: 191,
      bio: "Arquero peruano titular de la selección y referente del Orlando City en la MLS.",
      wikipediaEs: "https://es.wikipedia.org/wiki/Pedro_Gallese",
    },
  },
  {
    slug: "renato-tapia",
    caps: 88,
    goals: 2,
    debutDate: "2015-06-26",
    lastCapDate: "2025-09-09",
    createIfMissing: {
      fullName: "Renato Tapia Cortijo",
      knownAs: "Renato Tapia",
      birthDate: "1995-07-28",
      birthplace: "Lima, Perú",
      birthCountryIso: "PER",
      position: "MID",
      foot: "RIGHT",
      heightCm: 185,
      bio: "Mediocentro defensivo formado en Esther Grande de Bentín y consagrado en el Feyenoord. Tras varios años en el Celta de Vigo recaló en el Leganés.",
      wikipediaEs: "https://es.wikipedia.org/wiki/Renato_Tapia",
    },
  },
  {
    slug: "luis-advincula",
    caps: 124,
    goals: 4,
    debutDate: "2010-08-11",
    lastCapDate: "2025-11-18",
    createIfMissing: {
      fullName: "Luis Jan Piers Advíncula Castrillón",
      knownAs: "Luis Advíncula",
      birthDate: "1990-03-02",
      birthplace: "Tacna, Perú",
      birthCountryIso: "PER",
      position: "DEF",
      foot: "RIGHT",
      heightCm: 178,
      bio: "Lateral derecho con pasos por Hoffenheim, Newell's, Bursaspor, Rayo Vallecano y Boca Juniors. Una de las cartas más fijas del lateral de la selección peruana.",
      wikipediaEs: "https://es.wikipedia.org/wiki/Luis_Advinc%C3%BAla",
    },
  },
  {
    slug: "andre-carrillo",
    caps: 117,
    goals: 6,
    debutDate: "2011-09-02",
    lastCapDate: "2025-11-18",
    createIfMissing: {
      fullName: "André Martín Carrillo Díaz",
      knownAs: "André Carrillo",
      birthDate: "1991-06-14",
      birthplace: "Lima, Perú",
      birthCountryIso: "PER",
      position: "MID",
      foot: "LEFT",
      heightCm: 173,
      bio: "Extremo derecho con paso por Sporting de Lisboa, Benfica, Watford y Corinthians, asentado actualmente en la liga saudí.",
      wikipediaEs: "https://es.wikipedia.org/wiki/Andr%C3%A9_Carrillo",
    },
  },
  {
    slug: "gianluca-lapadula",
    caps: 32,
    goals: 9,
    debutDate: "2020-10-09",
    lastCapDate: "2025-11-18",
    createIfMissing: {
      fullName: "Gianluca Lapadula Vargas",
      knownAs: "Gianluca Lapadula",
      birthDate: "1990-02-07",
      birthplace: "Turín, Italia",
      birthCountryIso: "PER",
      position: "FWD",
      foot: "RIGHT",
      heightCm: 184,
      bio: "Delantero ítalo-peruano, ex-juvenil del Atalanta y del Milan. Nacionalizó al país de su madre y representa al Perú desde 2020. Actualmente milita en el Cagliari.",
      wikipediaEs: "https://es.wikipedia.org/wiki/Gianluca_Lapadula",
    },
  },
  {
    slug: "oliver-sonne",
    caps: 12,
    goals: 0,
    debutDate: "2024-03-22",
    lastCapDate: "2025-11-18",
    createIfMissing: {
      fullName: "Oliver Sonne Christensen",
      knownAs: "Oliver Sonne",
      birthDate: "2000-11-10",
      birthplace: "Frederikshavn, Dinamarca",
      birthCountryIso: "PER",
      position: "DEF",
      foot: "RIGHT",
      heightCm: 184,
      bio: "Defensor ítalo-peruano nacido en Dinamarca. Tras un proceso administrativo, debutó por Perú en 2024.",
      wikipediaEs: "https://es.wikipedia.org/wiki/Oliver_Sonne",
    },
  },
];

export async function seedSeleccionPeruana(): Promise<void> {
  const peruNT = await prisma.nationalTeam.findUnique({ where: { slug: "seleccion-peruana" } });
  if (!peruNT) throw new Error("Selección Peruana not found — run national teams seed first");

  let count = 0;
  for (const m of MEMBERS) {
    let player = await prisma.player.findUnique({ where: { slug: m.slug } });

    if (!player && m.createIfMissing) {
      const c = m.createIfMissing;
      const country = await prisma.country.findUnique({
        where: { isoCode: c.birthCountryIso ?? "PER" },
      });
      if (!country) {
        log.warn(`country not found for ${m.slug}`);
        continue;
      }
      const sourceId = await upsertSource({
        url: c.wikipediaEs,
        title: `${c.knownAs ?? c.fullName} — Wikipedia`,
        publisher: "Wikipedia",
        type: "WIKIPEDIA_ES",
        language: "es",
      });
      const story = PLAYER_STORIES[m.slug] ?? null;
      player = await prisma.player.create({
        data: {
          slug: m.slug,
          fullName: c.fullName,
          knownAs: c.knownAs ?? null,
          birthDate: new Date(c.birthDate),
          birthplace: c.birthplace,
          birthCountryId: country.id,
          position: c.position,
          foot: c.foot,
          heightCm: c.heightCm ?? null,
          bio: c.bio ?? null,
          story: story ?? undefined,
          lastResearchedAt: new Date(),
        },
      });
      await cite({
        entityType: "PLAYER",
        entityId: player.id,
        sourceIds: [sourceId],
        fields: ["fullName", "birthDate", "birthplace", "position", "bio"],
      });
    }
    if (!player) {
      log.warn(`player not found and no createIfMissing block: ${m.slug}`);
      continue;
    }

    // upsert national-team cap
    await prisma.nationalTeamCap.upsert({
      where: { playerId_nationalTeamId: { playerId: player.id, nationalTeamId: peruNT.id } },
      create: {
        playerId: player.id,
        nationalTeamId: peruNT.id,
        caps: m.caps,
        goals: m.goals,
        debutDate: new Date(m.debutDate),
        lastCapDate: new Date(m.lastCapDate),
      },
      update: {
        caps: m.caps,
        goals: m.goals,
        debutDate: new Date(m.debutDate),
        lastCapDate: new Date(m.lastCapDate),
      },
    });

    if (m.wikipediaEs) {
      const sourceId = await upsertSource({
        url: m.wikipediaEs,
        title: `${player.knownAs ?? player.fullName} — Wikipedia`,
        publisher: "Wikipedia",
        type: "WIKIPEDIA_ES",
        language: "es",
      });
      await cite({
        entityType: "NATIONAL_TEAM_CAP",
        entityId: `${player.id}__${peruNT.id}`,
        sourceIds: [sourceId],
        fields: ["caps", "goals", "debutDate"],
      });
    }

    log.upsert(m.slug, "seleccion-cap");
    count++;
  }
  log.done("seleccion-peruana", count);
}
