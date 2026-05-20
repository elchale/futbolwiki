import type { Confederation } from "../../../src/generated/prisma/client";
import { prisma } from "../client";
import { upsertSource } from "../sources";
import { cite } from "../citations";
import { log } from "../util";
import { NATIONAL_TEAM_STORIES } from "../stories/national-teams";

type NTSeed = {
  slug: string;
  name: string;
  nickname?: string;
  confederation: Confederation;
  countryIso: string;
  wikipediaEs: string;
};

const NATIONAL_TEAMS: NTSeed[] = [
  { slug: "seleccion-peruana", name: "Selección de fútbol del Perú", nickname: "La Blanquirroja", confederation: "CONMEBOL", countryIso: "PER", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_del_Per%C3%BA" },
  { slug: "seleccion-argentina", name: "Selección de fútbol de Argentina", nickname: "La Albiceleste", confederation: "CONMEBOL", countryIso: "ARG", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Argentina" },
  { slug: "seleccion-brasil", name: "Selección de fútbol de Brasil", nickname: "La Canarinha", confederation: "CONMEBOL", countryIso: "BRA", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Brasil" },
  { slug: "seleccion-uruguay", name: "Selección de fútbol de Uruguay", nickname: "La Celeste", confederation: "CONMEBOL", countryIso: "URU", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Uruguay" },
  { slug: "seleccion-colombia", name: "Selección de fútbol de Colombia", nickname: "Los Cafeteros", confederation: "CONMEBOL", countryIso: "COL", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Colombia" },
  { slug: "seleccion-chile", name: "Selección de fútbol de Chile", nickname: "La Roja", confederation: "CONMEBOL", countryIso: "CHI", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Chile" },
  { slug: "seleccion-ecuador", name: "Selección de fútbol de Ecuador", nickname: "La Tri", confederation: "CONMEBOL", countryIso: "ECU", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Ecuador" },
  { slug: "seleccion-paraguay", name: "Selección de fútbol de Paraguay", nickname: "La Albirroja", confederation: "CONMEBOL", countryIso: "PAR", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Paraguay" },
  { slug: "seleccion-bolivia", name: "Selección de fútbol de Bolivia", nickname: "La Verde", confederation: "CONMEBOL", countryIso: "BOL", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Bolivia" },
  { slug: "seleccion-venezuela", name: "Selección de fútbol de Venezuela", nickname: "La Vinotinto", confederation: "CONMEBOL", countryIso: "VEN", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Venezuela" },
  { slug: "seleccion-espana", name: "Selección de fútbol de España", nickname: "La Roja", confederation: "UEFA", countryIso: "ESP", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Espa%C3%B1a" },
  { slug: "seleccion-francia", name: "Selección de fútbol de Francia", nickname: "Les Bleus", confederation: "UEFA", countryIso: "FRA", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Francia" },
  { slug: "seleccion-alemania", name: "Selección de fútbol de Alemania", nickname: "Die Mannschaft", confederation: "UEFA", countryIso: "GER", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Alemania" },
  { slug: "seleccion-italia", name: "Selección de fútbol de Italia", nickname: "La Azzurra", confederation: "UEFA", countryIso: "ITA", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Italia" },
  { slug: "seleccion-inglaterra", name: "Selección de fútbol de Inglaterra", nickname: "The Three Lions", confederation: "UEFA", countryIso: "ENG", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Inglaterra" },
  { slug: "seleccion-portugal", name: "Selección de fútbol de Portugal", nickname: "A Seleção", confederation: "UEFA", countryIso: "POR", wikipediaEs: "https://es.wikipedia.org/wiki/Selecci%C3%B3n_de_f%C3%BAtbol_de_Portugal" },
];

export async function seedNationalTeams(): Promise<void> {
  let count = 0;
  for (const n of NATIONAL_TEAMS) {
    const country = await prisma.country.findUnique({ where: { isoCode: n.countryIso } });
    if (!country) {
      log.warn(`country not found for NT ${n.slug}: ${n.countryIso}`);
      continue;
    }
    const sourceId = await upsertSource({
      url: n.wikipediaEs,
      title: `${n.name} — Wikipedia`,
      publisher: "Wikipedia",
      type: "WIKIPEDIA_ES",
      language: "es",
    });
    const story = NATIONAL_TEAM_STORIES[n.slug] ?? null;
    const upserted = await prisma.nationalTeam.upsert({
      where: { slug: n.slug },
      create: {
        slug: n.slug,
        name: n.name,
        nickname: n.nickname ?? null,
        confederation: n.confederation,
        countryId: country.id,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
      update: {
        name: n.name,
        nickname: n.nickname ?? null,
        confederation: n.confederation,
        countryId: country.id,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
    });
    await cite({
      entityType: "NATIONAL_TEAM",
      entityId: upserted.id,
      sourceIds: [sourceId],
      fields: ["name", "nickname", "confederation"],
    });
    log.upsert(n.slug, "national-team");
    count++;
  }
  log.done("national-teams", count);
}
