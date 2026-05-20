import { prisma } from "../client";
import { upsertSource } from "../sources";
import { cite } from "../citations";
import { log } from "../util";
import { LEAGUE_STORIES } from "../stories/leagues";

type LeagueSeed = {
  slug: string;
  name: string;
  shortName: string;
  countryIso: string;
  tier: number;
  foundedYear: number;
  organizer: string;
  description: string;
  logoUrl?: string;
  wikipediaEs: string;
};

const LEAGUES: LeagueSeed[] = [
  {
    slug: "liga-1-peru",
    name: "Liga 1 — Perú",
    shortName: "Liga 1",
    countryIso: "PER",
    tier: 1,
    foundedYear: 1912,
    organizer: "Federación Peruana de Fútbol",
    description:
      "Máxima categoría del fútbol peruano. Organizada por la FPF y disputada anualmente desde 1912. Conocida como Primera División durante gran parte de su historia, adoptó el nombre Liga 1 en 2019.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Primera_Divisi%C3%B3n_del_Per%C3%BA",
  },
  {
    slug: "liga-2-peru",
    name: "Liga 2 — Perú",
    shortName: "Liga 2",
    countryIso: "PER",
    tier: 2,
    foundedYear: 1984,
    organizer: "Federación Peruana de Fútbol",
    description:
      "Segunda categoría del fútbol peruano. Sus campeones ascienden a Liga 1 al término de cada temporada.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Segunda_Divisi%C3%B3n_del_Per%C3%BA",
  },
  {
    slug: "liga-3-peru",
    name: "Liga 3 — Perú",
    shortName: "Liga 3",
    countryIso: "PER",
    tier: 3,
    foundedYear: 2023,
    organizer: "Federación Peruana de Fútbol",
    description:
      "Tercera categoría del fútbol peruano. Creada por la FPF en 2023 como puente entre el fútbol regional y la Liga 2.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Liga_3_(Per%C3%BA)",
  },
  {
    slug: "laliga",
    name: "LaLiga",
    shortName: "LaLiga",
    countryIso: "ESP",
    tier: 1,
    foundedYear: 1929,
    organizer: "Liga Nacional de Fútbol Profesional",
    description:
      "Primera división del fútbol español. Sus clubes históricos —Real Madrid, FC Barcelona y Atlético de Madrid— se cuentan entre los más laureados del mundo.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Primera_Divisi%C3%B3n_de_Espa%C3%B1a",
  },
  {
    slug: "premier-league",
    name: "Premier League",
    shortName: "Premier",
    countryIso: "ENG",
    tier: 1,
    foundedYear: 1992,
    organizer: "The Football Association",
    description:
      "Máxima categoría del fútbol inglés desde 1992. Sucesora directa de la First Division (1888). Considerada la liga más vista del planeta.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Premier_League",
  },
  {
    slug: "serie-a",
    name: "Serie A",
    shortName: "Serie A",
    countryIso: "ITA",
    tier: 1,
    foundedYear: 1898,
    organizer: "Lega Serie A",
    description:
      "Máxima categoría del fútbol italiano. Conocida por su tradición táctica y por clubes como Juventus, Milan e Inter.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Serie_A_(Italia)",
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    shortName: "Bundesliga",
    countryIso: "GER",
    tier: 1,
    foundedYear: 1963,
    organizer: "Deutsche Fußball Liga",
    description:
      "Primera división del fútbol alemán. Históricamente dominada por el FC Bayern de Múnich.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Bundesliga",
  },
  {
    slug: "ligue-1",
    name: "Ligue 1",
    shortName: "Ligue 1",
    countryIso: "FRA",
    tier: 1,
    foundedYear: 1932,
    organizer: "Ligue de Football Professionnel",
    description:
      "Máxima categoría del fútbol francés. Históricamente disputada por clubes como Saint-Étienne, Olympique de Marsella y, en la última década, por el Paris Saint-Germain.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Ligue_1",
  },
];

export async function seedLeagues(): Promise<void> {
  let count = 0;
  for (const l of LEAGUES) {
    const country = await prisma.country.findUnique({ where: { isoCode: l.countryIso } });
    if (!country) {
      log.warn(`country not found for league ${l.slug}: ${l.countryIso}`);
      continue;
    }
    const sourceId = await upsertSource({
      url: l.wikipediaEs,
      title: `${l.name} — Wikipedia`,
      publisher: "Wikipedia",
      type: "WIKIPEDIA_ES",
      language: "es",
    });
    const story = LEAGUE_STORIES[l.slug] ?? null;
    const upserted = await prisma.league.upsert({
      where: { slug: l.slug },
      create: {
        slug: l.slug,
        name: l.name,
        shortName: l.shortName,
        tier: l.tier,
        foundedYear: l.foundedYear,
        organizer: l.organizer,
        description: l.description,
        countryId: country.id,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
      update: {
        name: l.name,
        shortName: l.shortName,
        tier: l.tier,
        foundedYear: l.foundedYear,
        organizer: l.organizer,
        description: l.description,
        countryId: country.id,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
    });
    await cite({
      entityType: "LEAGUE",
      entityId: upserted.id,
      sourceIds: [sourceId],
      fields: ["name", "foundedYear", "organizer", "description"],
    });
    log.upsert(l.slug, "league");
    count++;
  }
  log.done("leagues", count);
}
