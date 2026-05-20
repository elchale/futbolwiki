import type { Confederation } from "../../../src/generated/prisma/client";
import { prisma } from "../client";
import { upsertSource } from "../sources";
import { cite } from "../citations";
import { log } from "../util";
import { TOURNAMENT_STORIES } from "../stories/tournaments";

type TournamentSeed = {
  slug: string;
  name: string;
  shortName?: string;
  organizer: string;
  confederation?: Confederation;
  foundedYear: number;
  description: string;
  logoUrl?: string;
  wikipediaEs: string;
};

const TOURNAMENTS: TournamentSeed[] = [
  {
    slug: "copa-mundial-fifa",
    name: "Copa Mundial de la FIFA",
    shortName: "Mundial",
    organizer: "FIFA",
    foundedYear: 1930,
    description:
      "Principal torneo internacional de selecciones masculinas. Se disputa cada cuatro años desde 1930 (con la excepción de 1942 y 1946). Es el evento deportivo más visto del planeta.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Copa_Mundial_de_F%C3%BAtbol",
  },
  {
    slug: "copa-america",
    name: "Copa América",
    shortName: "Copa América",
    organizer: "Conmebol",
    confederation: "CONMEBOL",
    foundedYear: 1916,
    description:
      "Torneo internacional de selecciones organizado por la Conmebol. Es el campeonato continental más antiguo del mundo.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Copa_Am%C3%A9rica",
  },
  {
    slug: "eurocopa",
    name: "Eurocopa",
    shortName: "Eurocopa",
    organizer: "UEFA",
    confederation: "UEFA",
    foundedYear: 1960,
    description:
      "Campeonato de selecciones de Europa organizado por la UEFA. Se disputa cada cuatro años desde 1960.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Eurocopa",
  },
  {
    slug: "copa-libertadores",
    name: "Copa Libertadores",
    shortName: "Libertadores",
    organizer: "Conmebol",
    confederation: "CONMEBOL",
    foundedYear: 1960,
    description:
      "Principal torneo internacional de clubes de Sudamérica. Equivale en prestigio a la Champions League europea.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Copa_Libertadores",
  },
  {
    slug: "uefa-champions-league",
    name: "UEFA Champions League",
    shortName: "Champions",
    organizer: "UEFA",
    confederation: "UEFA",
    foundedYear: 1955,
    description:
      "Máximo torneo de clubes de Europa. Conocida originalmente como Copa de Europa, adoptó su formato y nombre actuales en 1992.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Liga_de_Campeones_de_la_UEFA",
  },
  {
    slug: "copa-sudamericana",
    name: "Copa Sudamericana",
    shortName: "Sudamericana",
    organizer: "Conmebol",
    confederation: "CONMEBOL",
    foundedYear: 2002,
    description:
      "Segundo torneo de clubes en importancia de Sudamérica. Equivale a la Europa League.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Copa_Sudamericana",
  },
];

export async function seedTournaments(): Promise<void> {
  let count = 0;
  for (const t of TOURNAMENTS) {
    const sourceId = await upsertSource({
      url: t.wikipediaEs,
      title: `${t.name} — Wikipedia`,
      publisher: "Wikipedia",
      type: "WIKIPEDIA_ES",
      language: "es",
    });
    const story = TOURNAMENT_STORIES[t.slug] ?? null;
    const upserted = await prisma.tournament.upsert({
      where: { slug: t.slug },
      create: {
        slug: t.slug,
        name: t.name,
        shortName: t.shortName ?? null,
        organizer: t.organizer,
        confederation: t.confederation ?? null,
        foundedYear: t.foundedYear,
        description: t.description,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
      update: {
        name: t.name,
        shortName: t.shortName ?? null,
        organizer: t.organizer,
        confederation: t.confederation ?? null,
        foundedYear: t.foundedYear,
        description: t.description,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
    });
    await cite({
      entityType: "TOURNAMENT",
      entityId: upserted.id,
      sourceIds: [sourceId],
      fields: ["name", "foundedYear", "description"],
    });
    log.upsert(t.slug, "tournament");
    count++;
  }
  log.done("tournaments", count);
}
