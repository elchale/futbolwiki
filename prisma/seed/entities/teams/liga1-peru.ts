import { prisma } from "../../client";
import { upsertSource } from "../../sources";
import { cite } from "../../citations";
import { log } from "../../util";
import { LIGA1_TEAM_STORIES } from "../../stories/teams-liga1";

type TeamSeed = {
  slug: string;
  name: string;
  shortName: string;
  nicknames: string[];
  foundedYear: number;
  stadiumSlug?: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  badgeUrl?: string;
  wikipediaEs: string;
};

const TEAMS: TeamSeed[] = [
  {
    slug: "alianza-lima",
    name: "Club Alianza Lima",
    shortName: "Alianza Lima",
    nicknames: ["Íntimos", "Blanquiazul", "Los compadres"],
    foundedYear: 1901,
    stadiumSlug: "estadio-alejandro-villanueva",
    primaryColor: "#1E3A8A",
    secondaryColor: "#FFFFFF",
    description:
      "Club fundado en 1901 en La Victoria, Lima. Uno de los clubes más laureados y populares del Perú, con campeonatos nacionales en múltiples décadas. Su rivalidad con Universitario de Deportes da forma al clásico del fútbol peruano.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Club_Alianza_Lima",
  },
  {
    slug: "universitario-de-deportes",
    name: "Club Universitario de Deportes",
    shortName: "Universitario",
    nicknames: ["La U", "Los cremas", "Los Merengues"],
    foundedYear: 1924,
    stadiumSlug: "estadio-monumental-u",
    primaryColor: "#9F1B22",
    secondaryColor: "#FFFFFF",
    description:
      "Club fundado en 1924 por estudiantes de la Universidad Nacional Mayor de San Marcos. Es el club con más títulos de Primera División del Perú. Su rivalidad con Alianza Lima define el clásico del balompié peruano.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Club_Universitario_de_Deportes",
  },
  {
    slug: "sporting-cristal",
    name: "Club Sporting Cristal",
    shortName: "Sporting Cristal",
    nicknames: ["Los celestes", "Rímac", "Bajopontinos"],
    foundedYear: 1955,
    stadiumSlug: "estadio-alberto-gallardo",
    primaryColor: "#0EA5E9",
    secondaryColor: "#FFFFFF",
    description:
      "Club fundado en 1955 por la cervecería Backus tras la fusión del Sporting Tabaco y el Club Sportivo Cristal. Tradicionalmente identificado con el distrito del Rímac, en Lima.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Club_Sporting_Cristal",
  },
  {
    slug: "cienciano",
    name: "Club Sportivo Cienciano",
    shortName: "Cienciano",
    nicknames: ["El papá de América", "Rojo matador"],
    foundedYear: 1901,
    stadiumSlug: "estadio-inca-garcilaso-de-la-vega",
    primaryColor: "#DC2626",
    secondaryColor: "#FFFFFF",
    description:
      "Club fundado en 1901 en la ciudad del Cusco. En 2003 se convirtió en el primer equipo peruano en ganar un torneo internacional al alzar la Copa Sudamericana.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Club_Sportivo_Cienciano",
  },
  {
    slug: "sport-boys",
    name: "Sport Boys Association",
    shortName: "Sport Boys",
    nicknames: ["Misilero", "Rosado"],
    foundedYear: 1927,
    stadiumSlug: "estadio-miguel-grau",
    primaryColor: "#F472B6",
    secondaryColor: "#000000",
    description:
      "Club fundado en 1927 en el Callao. Su característica camiseta rosada y su barra son íconos del fútbol chalaco.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Sport_Boys",
  },
  {
    slug: "fbc-melgar",
    name: "Foot Ball Club Melgar",
    shortName: "Melgar",
    nicknames: ["El León del Sur", "Dominó"],
    foundedYear: 1915,
    stadiumSlug: "estadio-monumental-de-la-uns-de-arequipa",
    primaryColor: "#1E40AF",
    secondaryColor: "#DC2626",
    description:
      "Club arequipeño fundado en 1915. Campeón nacional en 1981, 2015 y otras temporadas, es el club más representativo del sur peruano.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Foot_Ball_Club_Melgar",
  },
  {
    slug: "cusco-fc",
    name: "Cusco Fútbol Club",
    shortName: "Cusco FC",
    nicknames: ["Los Imperiales", "El equipo del Cuzco"],
    foundedYear: 2009,
    stadiumSlug: "estadio-inca-garcilaso-de-la-vega",
    primaryColor: "#7C3AED",
    secondaryColor: "#FBBF24",
    description:
      "Club fundado en 2009 en la ciudad imperial del Cusco. Antes conocido como Real Garcilaso, adoptó su nombre actual tras una reestructuración.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Cusco_FC",
  },
  {
    slug: "atletico-grau",
    name: "Club Atlético Grau",
    shortName: "Atlético Grau",
    nicknames: ["Albo", "Heroico"],
    foundedYear: 1919,
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    description:
      "Club piurano fundado en 1919, llamado así en honor al almirante Miguel Grau. Tras su histórico ascenso, se consolidó como una de las plazas del norte peruano.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Club_Atl%C3%A9tico_Grau",
  },
  {
    slug: "union-comercio",
    name: "Club Unión Comercio",
    shortName: "Unión Comercio",
    nicknames: ["Los Comerciantes", "La Banda Verde"],
    foundedYear: 1979,
    primaryColor: "#16A34A",
    secondaryColor: "#FFFFFF",
    description:
      "Club fundado en 1979 en Nueva Cajamarca, San Martín. Representa una de las plazas más importantes de la selva peruana.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Club_Uni%C3%B3n_Comercio",
  },
  {
    slug: "adt",
    name: "Asociación Deportiva Tarma",
    shortName: "ADT",
    nicknames: ["Rojo Matador", "ADT"],
    foundedYear: 1929,
    primaryColor: "#DC2626",
    secondaryColor: "#FFFFFF",
    description:
      "Club tarmeño fundado en 1929. Ha jugado en la máxima categoría peruana de manera intermitente.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Asociaci%C3%B3n_Deportiva_Tarma",
  },
  {
    slug: "comerciantes-unidos",
    name: "Club Deportivo Comerciantes Unidos",
    shortName: "Comerciantes Unidos",
    nicknames: ["Los Cumbe"],
    foundedYear: 1986,
    primaryColor: "#FBBF24",
    secondaryColor: "#000000",
    description:
      "Club cajamarquino con sede en Cutervo. Llegó a la Liga 1 tras campañas destacadas en Liga 2.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Club_Deportivo_Comerciantes_Unidos",
  },
  {
    slug: "juan-pablo-ii-college",
    name: "Juan Pablo II College",
    shortName: "Juan Pablo II",
    nicknames: ["JPII", "Los Pontificios"],
    foundedYear: 2014,
    primaryColor: "#FACC15",
    secondaryColor: "#1E3A8A",
    description:
      "Club fundado en 2014 con sede en Chongoyape, Lambayeque. Un club joven que escaló rápidamente las divisiones del fútbol peruano.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Juan_Pablo_II_College",
  },
  {
    slug: "deportivo-garcilaso",
    name: "Club Deportivo Garcilaso",
    shortName: "Deportivo Garcilaso",
    nicknames: ["Los Inkas"],
    foundedYear: 1942,
    stadiumSlug: "estadio-inca-garcilaso-de-la-vega",
    primaryColor: "#7C3AED",
    secondaryColor: "#FBBF24",
    description:
      "Club cusqueño fundado en 1942. Ascendió a la Primera División de Perú en 2022 tras ganar la Liga 2.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Club_Deportivo_Garcilaso",
  },
  {
    slug: "los-chankas",
    name: "Cultural Hijos de Apurímac (Los Chankas)",
    shortName: "Los Chankas",
    nicknames: ["Los Chankas", "Los Apurímeños"],
    foundedYear: 2014,
    primaryColor: "#0EA5E9",
    secondaryColor: "#FFFFFF",
    description:
      "Club de Apurímac fundado en 2014. Representa la región del antiguo pueblo chanka en el sur andino peruano.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Cultural_Hijos_de_Apur%C3%ADmac",
  },
  {
    slug: "alianza-atletico",
    name: "Alianza Atlético de Sullana",
    shortName: "Alianza Atlético",
    nicknames: ["Los Churres"],
    foundedYear: 1920,
    primaryColor: "#0EA5E9",
    secondaryColor: "#FFFFFF",
    description:
      "Club piurano fundado en 1920 en Sullana. Uno de los más antiguos del norte del país.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Alianza_Atl%C3%A9tico_de_Sullana",
  },
  {
    slug: "alianza-universidad",
    name: "Alianza Universidad",
    shortName: "Alianza Universidad",
    nicknames: ["La Universidad de Huánuco"],
    foundedYear: 1942,
    primaryColor: "#1E3A8A",
    secondaryColor: "#FBBF24",
    description:
      "Club huanuqueño con sede en la Universidad de Huánuco. Compite en las primeras divisiones desde hace varias temporadas.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Alianza_Universidad",
  },
  {
    slug: "utc-cajamarca",
    name: "Universidad Técnica de Cajamarca",
    shortName: "UTC",
    nicknames: ["El Gavilán del Norte"],
    foundedYear: 1964,
    primaryColor: "#16A34A",
    secondaryColor: "#FFFFFF",
    description:
      "Club universitario fundado en Cajamarca en 1964. Disputa la Primera División de manera intermitente.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Universidad_T%C3%A9cnica_de_Cajamarca",
  },
  {
    slug: "ayacucho-fc",
    name: "Ayacucho Fútbol Club",
    shortName: "Ayacucho FC",
    nicknames: ["Los Zorros"],
    foundedYear: 1969,
    primaryColor: "#7C3AED",
    secondaryColor: "#FACC15",
    description:
      "Club ayacuchano fundado en 1969 (originalmente como Inti Gas). Tras su reestructuración compitió durante años en Primera División.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Ayacucho_F%C3%BAtbol_Club",
  },
];

export async function seedLiga1Teams(): Promise<void> {
  const peru = await prisma.country.findUnique({ where: { isoCode: "PER" } });
  if (!peru) throw new Error("Peru country not found — run countries seed first");
  const league = await prisma.league.findUnique({ where: { slug: "liga-1-peru" } });
  if (!league) throw new Error("Liga 1 not found — run leagues seed first");

  // global league source — used as the foundedYear / official-listing source if no per-team one
  const leagueListingSource = await upsertSource({
    url: "https://es.wikipedia.org/wiki/Torneo_Descentralizado_2026",
    title: "Liga 1 2026 (Perú) — Wikipedia",
    publisher: "Wikipedia",
    type: "WIKIPEDIA_ES",
    language: "es",
  });

  let count = 0;
  for (const t of TEAMS) {
    const stadium = t.stadiumSlug
      ? await prisma.stadium.findUnique({ where: { slug: t.stadiumSlug } })
      : null;

    const sourceId = await upsertSource({
      url: t.wikipediaEs,
      title: `${t.name} — Wikipedia`,
      publisher: "Wikipedia",
      type: "WIKIPEDIA_ES",
      language: "es",
    });

    const story = LIGA1_TEAM_STORIES[t.slug] ?? null;
    const upserted = await prisma.team.upsert({
      where: { slug: t.slug },
      create: {
        slug: t.slug,
        name: t.name,
        shortName: t.shortName,
        nicknames: t.nicknames,
        foundedYear: t.foundedYear,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor,
        description: t.description,
        story: story ?? undefined,
        countryId: peru.id,
        stadiumId: stadium?.id ?? null,
        isActive: true,
        lastResearchedAt: new Date(),
      },
      update: {
        name: t.name,
        shortName: t.shortName,
        nicknames: t.nicknames,
        foundedYear: t.foundedYear,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor,
        description: t.description,
        story: story ?? undefined,
        countryId: peru.id,
        stadiumId: stadium?.id ?? null,
        isActive: true,
        lastResearchedAt: new Date(),
      },
    });

    await cite({
      entityType: "TEAM",
      entityId: upserted.id,
      sourceIds: [sourceId, leagueListingSource],
      fields: ["foundedYear", "description", "nicknames", "primaryColor"],
    });
    await cite({
      entityType: "TEAM",
      entityId: upserted.id,
      sourceIds: [leagueListingSource],
      fields: ["liga2026"],
      note: "Participación confirmada en la Liga 1 2026.",
    });

    // current-season TeamSeason row (Liga 1 2026)
    const season = await prisma.season.findUnique({
      where: { leagueId_year: { leagueId: league.id, year: "2026" } },
    });
    if (season) {
      await prisma.teamSeason.upsert({
        where: { teamId_seasonId: { teamId: upserted.id, seasonId: season.id } },
        create: {
          teamId: upserted.id,
          seasonId: season.id,
          leagueId: league.id,
          played: 0,
        },
        update: {},
      });
    }

    log.upsert(t.slug, "team(liga1)");
    count++;
  }
  log.done("liga1-teams", count);
}
