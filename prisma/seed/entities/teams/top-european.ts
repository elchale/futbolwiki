import { prisma } from "../../client";
import { upsertSource } from "../../sources";
import { cite } from "../../citations";
import { log } from "../../util";
import { EUROPEAN_TEAM_STORIES } from "../../stories/teams-european";

type TeamSeed = {
  slug: string;
  name: string;
  shortName: string;
  nicknames: string[];
  foundedYear: number;
  countryIso: string;
  stadiumSlug?: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  wikipediaEs: string;
};

const TEAMS: TeamSeed[] = [
  {
    slug: "real-madrid",
    name: "Real Madrid Club de Fútbol",
    shortName: "Real Madrid",
    nicknames: ["Los Blancos", "Los Merengues", "Los Vikingos"],
    foundedYear: 1902,
    countryIso: "ESP",
    stadiumSlug: "santiago-bernabeu",
    primaryColor: "#FFFFFF",
    secondaryColor: "#FEBE10",
    description:
      "Club fundado en 1902 en Madrid, España. Máximo ganador de la Liga de Campeones y uno de los clubes más exitosos del mundo. Bajo la presidencia de Florentino Pérez ha mantenido un dominio sostenido en Europa.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Real_Madrid_Club_de_F%C3%BAtbol",
  },
  {
    slug: "fc-barcelona",
    name: "Fútbol Club Barcelona",
    shortName: "FC Barcelona",
    nicknames: ["Barça", "Blaugrana", "Culés"],
    foundedYear: 1899,
    countryIso: "ESP",
    stadiumSlug: "spotify-camp-nou",
    primaryColor: "#A50044",
    secondaryColor: "#004D98",
    description:
      "Club fundado en 1899 en Barcelona por Hans Gamper. Reconocido por su estilo de juego de posesión y por figuras históricas como Cruyff, Messi y Xavi. La Masia es una de las canteras más prestigiosas del mundo.",
    wikipediaEs: "https://es.wikipedia.org/wiki/F%C3%BAtbol_Club_Barcelona",
  },
  {
    slug: "atletico-madrid",
    name: "Club Atlético de Madrid",
    shortName: "Atlético de Madrid",
    nicknames: ["Los Colchoneros", "Los Rojiblancos", "El Atleti"],
    foundedYear: 1903,
    countryIso: "ESP",
    stadiumSlug: "metropolitano",
    primaryColor: "#CB3524",
    secondaryColor: "#FFFFFF",
    description:
      "Club fundado en 1903 en Madrid. Históricamente competitivo bajo la dirección de Diego Simeone, ganador de LaLiga en 2014 y 2021 y de torneos europeos como la Europa League.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Club_Atl%C3%A9tico_de_Madrid",
  },
  {
    slug: "manchester-city",
    name: "Manchester City Football Club",
    shortName: "Man City",
    nicknames: ["The Citizens", "The Sky Blues"],
    foundedYear: 1880,
    countryIso: "ENG",
    stadiumSlug: "etihad-stadium",
    primaryColor: "#6CABDD",
    secondaryColor: "#FFFFFF",
    description:
      "Club fundado en 1880 en Mánchester. Bajo la propiedad del City Football Group y la conducción de Pep Guardiola se consolidó como una potencia mundial, ganando la Premier League en múltiples temporadas y la Champions League en 2022-23.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Manchester_City_Football_Club",
  },
  {
    slug: "liverpool",
    name: "Liverpool Football Club",
    shortName: "Liverpool",
    nicknames: ["The Reds", "Los Reds"],
    foundedYear: 1892,
    countryIso: "ENG",
    stadiumSlug: "anfield",
    primaryColor: "#C8102E",
    secondaryColor: "#00B2A9",
    description:
      "Club fundado en 1892 en Liverpool. Hexacampeón de Europa, con uno de los himnos más icónicos del fútbol mundial. Su tradición ofensiva ha sido renovada en la última década por entrenadores como Jürgen Klopp.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Liverpool_Football_Club",
  },
  {
    slug: "manchester-united",
    name: "Manchester United Football Club",
    shortName: "Man United",
    nicknames: ["The Red Devils", "Los Diablos Rojos"],
    foundedYear: 1878,
    countryIso: "ENG",
    stadiumSlug: "old-trafford",
    primaryColor: "#DA291C",
    secondaryColor: "#FBE122",
    description:
      "Club fundado en 1878 como Newton Heath. Es uno de los clubes con mayor patrimonio histórico en Inglaterra, con 20 títulos de liga y la era dorada bajo Sir Alex Ferguson (1986-2013).",
    wikipediaEs: "https://es.wikipedia.org/wiki/Manchester_United_Football_Club",
  },
  {
    slug: "arsenal",
    name: "Arsenal Football Club",
    shortName: "Arsenal",
    nicknames: ["The Gunners", "Los Gunners"],
    foundedYear: 1886,
    countryIso: "ENG",
    stadiumSlug: "emirates-stadium",
    primaryColor: "#EF0107",
    secondaryColor: "#FFFFFF",
    description:
      "Club londinense fundado en 1886. La era de Arsène Wenger (1996-2018) marcó una identidad ofensiva que culminó con la temporada invicta de 2003-04, conocida como 'The Invincibles'.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Arsenal_Football_Club",
  },
  {
    slug: "bayern-munich",
    name: "Fußball-Club Bayern München",
    shortName: "Bayern Múnich",
    nicknames: ["Die Bayern", "Der FCB", "Los Bávaros"],
    foundedYear: 1900,
    countryIso: "GER",
    stadiumSlug: "allianz-arena",
    primaryColor: "#DC052D",
    secondaryColor: "#FFFFFF",
    description:
      "Club fundado en 1900 en Múnich. Es el club más laureado de Alemania y uno de los mayores de Europa, con varios títulos de Champions League. Tradición de fichajes internos del fútbol alemán.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Bayern_de_M%C3%BAnich",
  },
  {
    slug: "paris-saint-germain",
    name: "Paris Saint-Germain Football Club",
    shortName: "PSG",
    nicknames: ["Les Parisiens", "Los Parisinos"],
    foundedYear: 1970,
    countryIso: "FRA",
    stadiumSlug: "parc-des-princes",
    primaryColor: "#004170",
    secondaryColor: "#DA291C",
    description:
      "Club fundado en 1970 en París. Tras la adquisición por Qatar Sports Investments en 2011, se transformó en una potencia mundial. En 2024-25 conquistó por primera vez la Champions League.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Paris_Saint-Germain_Football_Club",
  },
  {
    slug: "juventus",
    name: "Juventus Football Club",
    shortName: "Juventus",
    nicknames: ["La Vecchia Signora", "La Vieja Dama", "Bianconeri"],
    foundedYear: 1897,
    countryIso: "ITA",
    stadiumSlug: "juventus-stadium",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    description:
      "Club fundado en 1897 en Turín. El más laureado de Italia, con más de 35 títulos de Serie A. Tradicionalmente identificado con el rigor defensivo y la mística italiana.",
    wikipediaEs: "https://es.wikipedia.org/wiki/Juventus_Football_Club",
  },
];

export async function seedTopEuropeanTeams(): Promise<void> {
  let count = 0;
  for (const t of TEAMS) {
    const country = await prisma.country.findUnique({ where: { isoCode: t.countryIso } });
    if (!country) {
      log.warn(`country not found for team ${t.slug}: ${t.countryIso}`);
      continue;
    }
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

    const story = EUROPEAN_TEAM_STORIES[t.slug] ?? null;
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
        countryId: country.id,
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
        countryId: country.id,
        stadiumId: stadium?.id ?? null,
        isActive: true,
        lastResearchedAt: new Date(),
      },
    });

    await cite({
      entityType: "TEAM",
      entityId: upserted.id,
      sourceIds: [sourceId],
      fields: ["foundedYear", "description", "nicknames"],
    });

    log.upsert(t.slug, "team(european)");
    count++;
  }
  log.done("top-european-teams", count);
}
