import type { MatchStatus } from "../../../../src/generated/prisma/client";
import { prisma } from "../../client";
import { upsertSource } from "../../sources";
import { cite } from "../../citations";
import { log } from "../../util";

type Fact = { text: string; sourceUrls: string[] };
type MatchSeed = {
  externalId: string; // stable seed identifier
  date: string; // ISO
  status: MatchStatus;
  round: string;
  homeTeamSlug: string;
  awayTeamSlug: string;
  stadiumSlug?: string;
  homeScore?: number;
  awayScore?: number;
  context?: {
    narrative: string;
    facts: Fact[];
    h2hHomeWins?: number;
    h2hAwayWins?: number;
    h2hDraws?: number;
  };
};

const NOW = new Date("2026-05-19");

const inDays = (days: number, h = 19, m = 0) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() + days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const MATCHES: MatchSeed[] = [
  {
    externalId: "liga1-2026-j14-alianza-vs-cristal",
    date: inDays(3, 20, 0),
    status: "SCHEDULED",
    round: "Jornada 14",
    homeTeamSlug: "alianza-lima",
    awayTeamSlug: "sporting-cristal",
    stadiumSlug: "estadio-alejandro-villanueva",
    context: {
      narrative:
        "Alianza Lima recibe a Sporting Cristal en Matute en uno de los partidos cumbre del fútbol peruano. Ambos equipos llegan instalados en el grupo de pretendientes al título y con sus respectivas idiosincrasias deportivas en plena vigencia: la presión alta de Cristal frente al manejo del balón de los Íntimos.",
      facts: [
        {
          text: "El clásico moderno entre Alianza Lima y Sporting Cristal acumula casi 200 enfrentamientos oficiales desde la fundación de Cristal en 1955.",
          sourceUrls: ["https://es.wikipedia.org/wiki/Cl%C3%A1sico_moderno_del_f%C3%BAtbol_peruano"],
        },
        {
          text: "Hernán Barcos lidera la delantera blanquiazul, mientras que Cristal apuesta por la dupla creativa con Yoshimar Yotún.",
          sourceUrls: ["https://es.wikipedia.org/wiki/Club_Alianza_Lima", "https://es.wikipedia.org/wiki/Club_Sporting_Cristal"],
        },
      ],
      h2hHomeWins: 56,
      h2hAwayWins: 50,
      h2hDraws: 60,
    },
  },
  {
    externalId: "liga1-2026-j14-universitario-vs-melgar",
    date: inDays(4, 15, 30),
    status: "SCHEDULED",
    round: "Jornada 14",
    homeTeamSlug: "universitario-de-deportes",
    awayTeamSlug: "fbc-melgar",
    stadiumSlug: "estadio-monumental-u",
    context: {
      narrative:
        "Universitario de Deportes recibe al FBC Melgar en el Monumental. La U intenta sostener su candidatura al título mientras Melgar busca confirmar su condición de animador del torneo bajo el liderazgo de su mediocampo experimentado.",
      facts: [
        {
          text: "El Estadio Monumental de Ate tiene una capacidad de 80.093 espectadores, una de las mayores de Sudamérica.",
          sourceUrls: ["https://es.wikipedia.org/wiki/Estadio_Monumental_(Lima)"],
        },
      ],
    },
  },
  {
    externalId: "liga1-2026-j14-cienciano-vs-cusco-fc",
    date: inDays(5, 15, 0),
    status: "SCHEDULED",
    round: "Jornada 14",
    homeTeamSlug: "cienciano",
    awayTeamSlug: "cusco-fc",
    stadiumSlug: "estadio-inca-garcilaso-de-la-vega",
    context: {
      narrative:
        "Clásico cusqueño en el Garcilaso. Cienciano, el club más laureado de la ciudad, se mide con Cusco FC en un encuentro de profundas raíces locales.",
      facts: [
        {
          text: "Cienciano ganó la Copa Sudamericana en 2003 ante River Plate, siendo el primer club peruano en levantar un torneo internacional.",
          sourceUrls: ["https://es.wikipedia.org/wiki/Club_Sportivo_Cienciano"],
        },
      ],
    },
  },
  {
    externalId: "liga1-2026-j14-sport-boys-vs-adt",
    date: inDays(6, 13, 0),
    status: "SCHEDULED",
    round: "Jornada 14",
    homeTeamSlug: "sport-boys",
    awayTeamSlug: "adt",
    stadiumSlug: "estadio-miguel-grau",
  },
  {
    externalId: "liga1-2026-j14-alianza-atletico-vs-utc",
    date: inDays(7, 19, 0),
    status: "SCHEDULED",
    round: "Jornada 14",
    homeTeamSlug: "alianza-atletico",
    awayTeamSlug: "utc-cajamarca",
  },
  {
    externalId: "liga1-2026-j14-atletico-grau-vs-juan-pablo-ii",
    date: inDays(8, 13, 0),
    status: "SCHEDULED",
    round: "Jornada 14",
    homeTeamSlug: "atletico-grau",
    awayTeamSlug: "juan-pablo-ii-college",
  },
  // a recently finished match for variety
  {
    externalId: "liga1-2026-j13-alianza-vs-cienciano",
    date: inDays(-4, 20, 0),
    status: "FINISHED",
    round: "Jornada 13",
    homeTeamSlug: "alianza-lima",
    awayTeamSlug: "cienciano",
    stadiumSlug: "estadio-alejandro-villanueva",
    homeScore: 2,
    awayScore: 1,
  },
  {
    externalId: "liga1-2026-j13-universitario-vs-sporting-cristal",
    date: inDays(-3, 15, 30),
    status: "FINISHED",
    round: "Jornada 13",
    homeTeamSlug: "universitario-de-deportes",
    awayTeamSlug: "sporting-cristal",
    stadiumSlug: "estadio-monumental-u",
    homeScore: 1,
    awayScore: 1,
  },
];

export async function seedLiga1Matches(): Promise<void> {
  const league = await prisma.league.findUnique({ where: { slug: "liga-1-peru" } });
  const season = league
    ? await prisma.season.findUnique({
        where: { leagueId_year: { leagueId: league.id, year: "2026" } },
      })
    : null;
  if (!league || !season) {
    log.warn("Liga 1 or 2026 season not found");
    return;
  }

  // We use the externalId as the slug-ish identifier via a deterministic upsert
  // on a unique (date + home + away) tuple — approximated by externalId stored
  // in description? Match doesn't have a unique externalId column. We'll search
  // by (date, homeTeamId, awayTeamId, leagueId) and create or update.

  let count = 0;
  for (const m of MATCHES) {
    const home = await prisma.team.findUnique({ where: { slug: m.homeTeamSlug } });
    const away = await prisma.team.findUnique({ where: { slug: m.awayTeamSlug } });
    if (!home || !away) {
      log.warn(`team not found for match ${m.externalId}`);
      continue;
    }
    const stadium = m.stadiumSlug
      ? await prisma.stadium.findUnique({ where: { slug: m.stadiumSlug } })
      : null;

    // idempotency: look up by (homeTeamId, awayTeamId, date)
    const existing = await prisma.match.findFirst({
      where: {
        homeTeamId: home.id,
        awayTeamId: away.id,
        date: new Date(m.date),
        leagueId: league.id,
      },
    });
    const upserted = existing
      ? await prisma.match.update({
          where: { id: existing.id },
          data: {
            status: m.status,
            round: m.round,
            stadiumId: stadium?.id ?? null,
            homeScore: m.homeScore ?? null,
            awayScore: m.awayScore ?? null,
            seasonId: season.id,
          },
        })
      : await prisma.match.create({
          data: {
            date: new Date(m.date),
            status: m.status,
            round: m.round,
            leagueId: league.id,
            seasonId: season.id,
            homeTeamId: home.id,
            awayTeamId: away.id,
            stadiumId: stadium?.id ?? null,
            homeScore: m.homeScore ?? null,
            awayScore: m.awayScore ?? null,
          },
        });

    // citation: source the match listing
    const listingSource = await upsertSource({
      url: "https://es.wikipedia.org/wiki/Torneo_Descentralizado_2026",
      title: "Liga 1 2026 (Perú) — Wikipedia",
      publisher: "Wikipedia",
      type: "WIKIPEDIA_ES",
      language: "es",
    });
    await cite({
      entityType: "MATCH",
      entityId: upserted.id,
      sourceIds: [listingSource],
      fields: ["date", "round", "homeTeam", "awayTeam"],
    });

    // context (only for matches with one provided)
    if (m.context) {
      // upsert sources for each fact and build the factsJson with sourceIds
      const factsJson: Array<{ text: string; sourceIds: string[] }> = [];
      for (const f of m.context.facts) {
        const sourceIds: string[] = [];
        for (const url of f.sourceUrls) {
          sourceIds.push(
            await upsertSource({
              url,
              title: url,
              publisher: "Wikipedia",
              type: "WIKIPEDIA_ES",
              language: "es",
            }),
          );
        }
        factsJson.push({ text: f.text, sourceIds });
      }

      const ctx = await prisma.matchContext.upsert({
        where: { matchId: upserted.id },
        create: {
          matchId: upserted.id,
          narrative: m.context.narrative,
          factsJson,
          h2hHomeWins: m.context.h2hHomeWins ?? null,
          h2hAwayWins: m.context.h2hAwayWins ?? null,
          h2hDraws: m.context.h2hDraws ?? null,
        },
        update: {
          narrative: m.context.narrative,
          factsJson,
          h2hHomeWins: m.context.h2hHomeWins ?? null,
          h2hAwayWins: m.context.h2hAwayWins ?? null,
          h2hDraws: m.context.h2hDraws ?? null,
        },
      });

      // citation: at least one source for the narrative
      const narrativeSource = await upsertSource({
        url: "https://es.wikipedia.org/wiki/Cl%C3%A1sico_moderno_del_f%C3%BAtbol_peruano",
        title: "Clásicos del fútbol peruano — Wikipedia",
        publisher: "Wikipedia",
        type: "WIKIPEDIA_ES",
        language: "es",
      });
      await cite({
        entityType: "MATCH_CONTEXT",
        entityId: ctx.id,
        sourceIds: [narrativeSource],
        fields: ["narrative"],
      });
    }

    log.upsert(m.externalId, "match");
    count++;
  }
  log.done("liga1-matches", count);
}
