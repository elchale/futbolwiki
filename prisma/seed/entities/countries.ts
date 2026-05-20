import type { Confederation } from "../../../src/generated/prisma/client";
import { prisma } from "../client";
import { upsertSource } from "../sources";
import { cite } from "../citations";
import { log } from "../util";

type CountrySeed = {
  isoCode: string;
  name: string;
  confederation: Confederation;
  flagUrl: string;
  wikipediaEs: string;
};

const COUNTRIES: CountrySeed[] = [
  // CONMEBOL
  { isoCode: "ARG", name: "Argentina", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Argentina" },
  { isoCode: "BOL", name: "Bolivia", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Bolivia" },
  { isoCode: "BRA", name: "Brasil", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Brasil" },
  { isoCode: "CHI", name: "Chile", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_Chile.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Chile" },
  { isoCode: "COL", name: "Colombia", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Colombia" },
  { isoCode: "ECU", name: "Ecuador", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Ecuador.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Ecuador" },
  { isoCode: "PAR", name: "Paraguay", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Paraguay.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Paraguay" },
  { isoCode: "PER", name: "Perú", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Per%C3%BA" },
  { isoCode: "URU", name: "Uruguay", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Uruguay.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Uruguay" },
  { isoCode: "VEN", name: "Venezuela", confederation: "CONMEBOL", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Venezuela.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Venezuela" },
  // UEFA (top)
  { isoCode: "ESP", name: "España", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Espa%C3%B1a" },
  { isoCode: "ENG", name: "Inglaterra", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_England.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Inglaterra" },
  { isoCode: "GER", name: "Alemania", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Alemania" },
  { isoCode: "ITA", name: "Italia", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Italia" },
  { isoCode: "FRA", name: "Francia", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Francia" },
  { isoCode: "POR", name: "Portugal", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Portugal" },
  { isoCode: "NED", name: "Países Bajos", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Pa%C3%ADses_Bajos" },
  { isoCode: "BEL", name: "Bélgica", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_Belgium_%28civil%29.svg", wikipediaEs: "https://es.wikipedia.org/wiki/B%C3%A9lgica" },
  { isoCode: "CRO", name: "Croacia", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Croacia" },
  { isoCode: "POL", name: "Polonia", confederation: "UEFA", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_Poland.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Polonia" },
  // CONCACAF
  { isoCode: "MEX", name: "México", confederation: "CONCACAF", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg", wikipediaEs: "https://es.wikipedia.org/wiki/M%C3%A9xico" },
  { isoCode: "USA", name: "Estados Unidos", confederation: "CONCACAF", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Estados_Unidos" },
  { isoCode: "CAN", name: "Canadá", confederation: "CONCACAF", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Canad%C3%A1" },
  { isoCode: "CRC", name: "Costa Rica", confederation: "CONCACAF", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Costa_Rica_%28state%29.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Costa_Rica" },
  // CAF
  { isoCode: "MAR", name: "Marruecos", confederation: "CAF", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Marruecos" },
  { isoCode: "SEN", name: "Senegal", confederation: "CAF", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Senegal" },
  { isoCode: "EGY", name: "Egipto", confederation: "CAF", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Egipto" },
  // AFC
  { isoCode: "JPN", name: "Japón", confederation: "AFC", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Jap%C3%B3n" },
  { isoCode: "KOR", name: "Corea del Sur", confederation: "AFC", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Corea_del_Sur" },
  { isoCode: "QAT", name: "Catar", confederation: "AFC", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Qatar.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Catar" },
  { isoCode: "AUS", name: "Australia", confederation: "AFC", flagUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Australia.svg", wikipediaEs: "https://es.wikipedia.org/wiki/Australia" },
];

export async function seedCountries(): Promise<void> {
  const ids: string[] = [];
  for (const c of COUNTRIES) {
    const sourceId = await upsertSource({
      url: c.wikipediaEs,
      title: `${c.name} — Wikipedia`,
      publisher: "Wikipedia",
      type: "WIKIPEDIA_ES",
      language: "es",
    });
    const upserted = await prisma.country.upsert({
      where: { isoCode: c.isoCode },
      create: {
        isoCode: c.isoCode,
        name: c.name,
        confederation: c.confederation,
        flagUrl: c.flagUrl,
        lastResearchedAt: new Date(),
      },
      update: {
        name: c.name,
        confederation: c.confederation,
        flagUrl: c.flagUrl,
        lastResearchedAt: new Date(),
      },
    });
    ids.push(upserted.id);
    await cite({
      entityType: "COUNTRY",
      entityId: upserted.id,
      sourceIds: [sourceId],
      fields: ["name", "confederation", "flagUrl"],
    });
    log.upsert(c.isoCode, "country");
  }
  log.done("countries", ids.length);
}
