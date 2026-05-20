import { prisma } from "../client";
import { upsertSource } from "../sources";
import { cite } from "../citations";
import { log } from "../util";
import { COACH_STORIES } from "../stories/coaches";

type CoachSeed = {
  slug: string;
  fullName: string;
  birthDate?: string;
  nationalityIso: string;
  bio?: string;
  currentTeamSlug?: string;
  wikipediaEs: string;
};

const COACHES: CoachSeed[] = [
  // Liga 1 — current head coaches (selected; we won't enumerate every coach in v1)
  { slug: "nestor-gorosito", fullName: "Néstor Raúl Gorosito", birthDate: "1964-05-14", nationalityIso: "ARG", currentTeamSlug: "alianza-lima", bio: "Entrenador argentino con paso por clubes de Argentina, Paraguay y Perú. En 2025 asume Alianza Lima.", wikipediaEs: "https://es.wikipedia.org/wiki/N%C3%A9stor_Gorosito" },
  { slug: "jorge-fossati", fullName: "Jorge Luis Fossati Lurachi", birthDate: "1952-11-22", nationalityIso: "URU", currentTeamSlug: "universitario-de-deportes", bio: "Entrenador uruguayo, ex-DT de la selección peruana y campeón con Universitario.", wikipediaEs: "https://es.wikipedia.org/wiki/Jorge_Fossati" },
  { slug: "paulo-autuori", fullName: "Paulo Antônio Autuori de Melo", birthDate: "1956-05-25", nationalityIso: "BRA", currentTeamSlug: "sporting-cristal", bio: "Entrenador brasileño con paso por Brasil, Perú y otros países sudamericanos. Campeón de Copa Libertadores en 2005 con São Paulo.", wikipediaEs: "https://es.wikipedia.org/wiki/Paulo_Autuori" },
  // Europa — current head coaches
  { slug: "carlo-ancelotti", fullName: "Carlo Ancelotti", birthDate: "1959-06-10", nationalityIso: "ITA", bio: "Entrenador italiano, uno de los más laureados de la historia, ganador de cinco Ligas de Campeones (tres como entrenador del Milan y dos del Real Madrid, hasta su salida en 2025).", wikipediaEs: "https://es.wikipedia.org/wiki/Carlo_Ancelotti" },
  { slug: "hansi-flick", fullName: "Hans-Dieter Flick", birthDate: "1965-02-24", nationalityIso: "GER", currentTeamSlug: "fc-barcelona", bio: "Entrenador alemán ganador del sextete con el Bayern de Múnich en 2019-20. Asumió el FC Barcelona en 2024.", wikipediaEs: "https://es.wikipedia.org/wiki/Hansi_Flick" },
  { slug: "diego-simeone", fullName: "Diego Pablo Simeone", birthDate: "1970-04-28", nationalityIso: "ARG", currentTeamSlug: "atletico-madrid", bio: "El Cholo Simeone es entrenador del Atlético de Madrid desde 2011, marcando una era de competitividad para el club.", wikipediaEs: "https://es.wikipedia.org/wiki/Diego_Simeone" },
  { slug: "pep-guardiola", fullName: "Josep Guardiola Sala", birthDate: "1971-01-18", nationalityIso: "ESP", currentTeamSlug: "manchester-city", bio: "Considerado uno de los entrenadores más influyentes del siglo XXI. Triplete con FC Barcelona en 2008-09 y triplete con Manchester City en 2022-23.", wikipediaEs: "https://es.wikipedia.org/wiki/Pep_Guardiola" },
  { slug: "arne-slot", fullName: "Arne Slot", birthDate: "1978-09-17", nationalityIso: "NED", currentTeamSlug: "liverpool", bio: "Entrenador neerlandés que tomó las riendas del Liverpool en 2024 tras Jürgen Klopp.", wikipediaEs: "https://es.wikipedia.org/wiki/Arne_Slot" },
  { slug: "mikel-arteta", fullName: "Mikel Arteta Amatriain", birthDate: "1982-03-26", nationalityIso: "ESP", currentTeamSlug: "arsenal", bio: "Ex jugador, asistente de Pep Guardiola y, desde 2019, entrenador del Arsenal donde renovó el proyecto deportivo.", wikipediaEs: "https://es.wikipedia.org/wiki/Mikel_Arteta" },
  { slug: "vincent-kompany", fullName: "Vincent Kompany", birthDate: "1986-04-10", nationalityIso: "BEL", currentTeamSlug: "bayern-munich", bio: "Ex defensor estrella del Manchester City. Asumió como entrenador del Bayern de Múnich en 2024.", wikipediaEs: "https://es.wikipedia.org/wiki/Vincent_Kompany" },
  { slug: "luis-enrique", fullName: "Luis Enrique Martínez García", birthDate: "1970-05-08", nationalityIso: "ESP", currentTeamSlug: "paris-saint-germain", bio: "Triplete con FC Barcelona en 2014-15. Campeón de la Champions League con el PSG en 2024-25.", wikipediaEs: "https://es.wikipedia.org/wiki/Luis_Enrique_Mart%C3%ADnez_Garc%C3%ADa" },
];

export async function seedCoaches(): Promise<void> {
  let count = 0;
  for (const c of COACHES) {
    const nationality = await prisma.country.findUnique({ where: { isoCode: c.nationalityIso } });
    if (!nationality) {
      log.warn(`nationality not found for coach ${c.slug}: ${c.nationalityIso}`);
      continue;
    }
    const sourceId = await upsertSource({
      url: c.wikipediaEs,
      title: `${c.fullName} — Wikipedia`,
      publisher: "Wikipedia",
      type: "WIKIPEDIA_ES",
      language: "es",
    });
    const story = COACH_STORIES[c.slug] ?? null;
    const upserted = await prisma.coach.upsert({
      where: { slug: c.slug },
      create: {
        slug: c.slug,
        fullName: c.fullName,
        birthDate: c.birthDate ? new Date(c.birthDate) : null,
        nationalityCountryId: nationality.id,
        bio: c.bio ?? null,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
      update: {
        fullName: c.fullName,
        birthDate: c.birthDate ? new Date(c.birthDate) : null,
        nationalityCountryId: nationality.id,
        bio: c.bio ?? null,
        story: story ?? undefined,
        lastResearchedAt: new Date(),
      },
    });
    await cite({
      entityType: "COACH",
      entityId: upserted.id,
      sourceIds: [sourceId],
      fields: ["fullName", "birthDate", "bio"],
    });

    // assign as current head coach if specified
    if (c.currentTeamSlug) {
      const team = await prisma.team.findUnique({ where: { slug: c.currentTeamSlug } });
      if (team) {
        await prisma.team.update({
          where: { id: team.id },
          data: { currentCoachId: upserted.id },
        });
      }
    }

    log.upsert(c.slug, "coach");
    count++;
  }
  log.done("coaches", count);
}
