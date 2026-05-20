import { prisma } from "../client";
import { upsertSource } from "../sources";
import { cite } from "../citations";
import { log } from "../util";

type StadiumSeed = {
  slug: string;
  name: string;
  city: string;
  countryIso: string;
  capacity?: number;
  openedYear?: number;
  surface?: string;
  wikipediaEs: string;
};

const STADIUMS: StadiumSeed[] = [
  // Perú
  { slug: "estadio-nacional-lima", name: "Estadio Nacional", city: "Lima", countryIso: "PER", capacity: 50000, openedYear: 1952, surface: "Césped natural", wikipediaEs: "https://es.wikipedia.org/wiki/Estadio_Nacional_del_Per%C3%BA" },
  { slug: "estadio-alejandro-villanueva", name: "Estadio Alejandro Villanueva", city: "Lima", countryIso: "PER", capacity: 35000, openedYear: 1974, surface: "Césped natural", wikipediaEs: "https://es.wikipedia.org/wiki/Estadio_Alejandro_Villanueva" },
  { slug: "estadio-monumental-u", name: "Estadio Monumental U", city: "Lima", countryIso: "PER", capacity: 80093, openedYear: 2000, surface: "Césped natural", wikipediaEs: "https://es.wikipedia.org/wiki/Estadio_Monumental_(Lima)" },
  { slug: "estadio-alberto-gallardo", name: "Estadio Alberto Gallardo", city: "Lima", countryIso: "PER", capacity: 11000, openedYear: 1953, surface: "Césped natural", wikipediaEs: "https://es.wikipedia.org/wiki/Estadio_Alberto_Gallardo" },
  { slug: "estadio-miguel-grau", name: "Estadio Miguel Grau", city: "Callao", countryIso: "PER", capacity: 17000, openedYear: 1953, surface: "Césped natural", wikipediaEs: "https://es.wikipedia.org/wiki/Estadio_Miguel_Grau_(Callao)" },
  { slug: "estadio-inca-garcilaso-de-la-vega", name: "Estadio Inca Garcilaso de la Vega", city: "Cusco", countryIso: "PER", capacity: 42056, openedYear: 1950, surface: "Césped natural", wikipediaEs: "https://es.wikipedia.org/wiki/Estadio_Inca_Garcilaso_de_la_Vega" },
  { slug: "estadio-monumental-de-la-uns-de-arequipa", name: "Estadio Monumental de la UNSA", city: "Arequipa", countryIso: "PER", capacity: 40370, openedYear: 2004, surface: "Césped natural", wikipediaEs: "https://es.wikipedia.org/wiki/Estadio_Monumental_de_la_UNSA" },
  // Europa
  { slug: "santiago-bernabeu", name: "Santiago Bernabéu", city: "Madrid", countryIso: "ESP", capacity: 78297, openedYear: 1947, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Estadio_Santiago_Bernab%C3%A9u" },
  { slug: "spotify-camp-nou", name: "Spotify Camp Nou", city: "Barcelona", countryIso: "ESP", capacity: 99354, openedYear: 1957, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Camp_Nou" },
  { slug: "metropolitano", name: "Riyadh Air Metropolitano", city: "Madrid", countryIso: "ESP", capacity: 70460, openedYear: 2017, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Estadio_Metropolitano" },
  { slug: "etihad-stadium", name: "Etihad Stadium", city: "Mánchester", countryIso: "ENG", capacity: 53400, openedYear: 2002, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Etihad_Stadium" },
  { slug: "anfield", name: "Anfield", city: "Liverpool", countryIso: "ENG", capacity: 61276, openedYear: 1884, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Anfield" },
  { slug: "old-trafford", name: "Old Trafford", city: "Mánchester", countryIso: "ENG", capacity: 74310, openedYear: 1910, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Old_Trafford" },
  { slug: "emirates-stadium", name: "Emirates Stadium", city: "Londres", countryIso: "ENG", capacity: 60704, openedYear: 2006, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Emirates_Stadium" },
  { slug: "allianz-arena", name: "Allianz Arena", city: "Múnich", countryIso: "GER", capacity: 75024, openedYear: 2005, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Allianz_Arena" },
  { slug: "parc-des-princes", name: "Parc des Princes", city: "París", countryIso: "FRA", capacity: 47929, openedYear: 1972, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Parque_de_los_Pr%C3%ADncipes" },
  { slug: "juventus-stadium", name: "Allianz Stadium", city: "Turín", countryIso: "ITA", capacity: 41507, openedYear: 2011, surface: "Híbrido", wikipediaEs: "https://es.wikipedia.org/wiki/Allianz_Stadium" },
];

export async function seedStadiums(): Promise<void> {
  let count = 0;
  for (const s of STADIUMS) {
    const country = await prisma.country.findUnique({ where: { isoCode: s.countryIso } });
    if (!country) {
      log.warn(`country not found for stadium ${s.slug}: ${s.countryIso}`);
      continue;
    }
    const sourceId = await upsertSource({
      url: s.wikipediaEs,
      title: `${s.name} — Wikipedia`,
      publisher: "Wikipedia",
      type: "WIKIPEDIA_ES",
      language: "es",
    });
    const upserted = await prisma.stadium.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        name: s.name,
        city: s.city,
        countryId: country.id,
        capacity: s.capacity ?? null,
        openedYear: s.openedYear ?? null,
        surface: s.surface ?? null,
        lastResearchedAt: new Date(),
      },
      update: {
        name: s.name,
        city: s.city,
        countryId: country.id,
        capacity: s.capacity ?? null,
        openedYear: s.openedYear ?? null,
        surface: s.surface ?? null,
        lastResearchedAt: new Date(),
      },
    });
    await cite({
      entityType: "STADIUM",
      entityId: upserted.id,
      sourceIds: [sourceId],
      fields: ["name", "city", "capacity", "openedYear"],
    });
    log.upsert(s.slug, "stadium");
    count++;
  }
  log.done("stadiums", count);
}
