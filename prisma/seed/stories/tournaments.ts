import { wiki, type Story } from "./_types";

export const TOURNAMENT_STORIES: Record<string, Story> = {
  "copa-mundial-fifa": {
    sections: [
      {
        id: "historia",
        title: "Historia del torneo",
        paragraphs: [
          "La Copa Mundial de la FIFA se disputa desde 1930. La primera edición fue organizada por Uruguay, que también ganó el torneo derrotando a Argentina en la final. Desde entonces se juega cada cuatro años con interrupciones por guerras mundiales (1942 y 1946).",
          "El formato actual reúne a 32 selecciones (que pasarán a 48 en 2026), tras un proceso de eliminatorias continentales. Es el evento deportivo más visto del planeta: la final de Qatar 2022 tuvo una audiencia global estimada en 1.500 millones de personas.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Copa_Mundial_de_F%C3%BAtbol", "Copa Mundial de Fútbol — Wikipedia")],
      },
      {
        id: "campeones",
        title: "Campeones históricos",
        paragraphs: [
          "Brasil es el máximo ganador con cinco títulos (1958, 1962, 1970, 1994, 2002), seguido por Alemania e Italia con cuatro cada uno, Argentina con tres (1978, 1986, 2022), Uruguay y Francia con dos, e Inglaterra y España con uno.",
          "Solo ocho selecciones han ganado el torneo en sus casi 100 años de historia, lo que refleja la dificultad extrema de coronarse campeón mundial. Sudamérica suma nueve títulos, Europa doce.",
        ],
      },
      {
        id: "momentos-iconicos",
        title: "Momentos icónicos",
        paragraphs: [
          "El 'Maracanazo' de 1950 (Uruguay 2 - Brasil 1) en el estadio de Río de Janeiro está considerado uno de los momentos más impactantes de la historia del deporte mundial. Sumió a Brasil en una depresión nacional duradera.",
          "El 'Gol del siglo' de Diego Maradona contra Inglaterra en México 1986 —después del 'Mano de Dios'— es la jugada individual más recordada de la historia del torneo. Sesenta metros, cinco rivales eludidos, gol.",
          "El 'Cabezazo de Zidane' contra Materazzi en la final de 2006, que culminó la carrera del francés con expulsión, sigue siendo uno de los misterios más comentados del deporte.",
          "La final de Qatar 2022 (Argentina 3-3 Francia, 4-2 en penales) cerró la era Messi con la consagración global del argentino. Mbappé marcó tres goles en una final, hazaña no vista desde Geoff Hurst en 1966.",
        ],
      },
      {
        id: "futuro",
        title: "Mundial 2026: tres países, 48 selecciones",
        paragraphs: [
          "La edición 2026 será coorganizada por Estados Unidos, México y Canadá, y por primera vez tendrá 48 selecciones en lugar de 32. Es la primera vez que el Mundial se disputa simultáneamente en tres países norteamericanos.",
          "Para el Perú, esta edición presenta una oportunidad histórica: el formato ampliado da más cupos a la Conmebol, pero la 'bicolor' no logró clasificar a través de las eliminatorias.",
        ],
      },
    ],
  },

  "copa-america": {
    sections: [
      {
        id: "historia",
        title: "El campeonato más antiguo",
        paragraphs: [
          "La Copa América se disputa desde 1916, lo que la convierte en el torneo de selecciones más antiguo del mundo. Es organizada por la Conmebol y reúne históricamente a las diez selecciones sudamericanas, con invitados puntuales de otras confederaciones.",
          "El formato y la frecuencia han variado significativamente a lo largo de las décadas: hubo ediciones cada dos años, irregulares, y desde 2007 se estabilizó en un ciclo cuatrienal.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Copa_Am%C3%A9rica", "Copa América — Wikipedia")],
      },
      {
        id: "campeones",
        title: "Reyes del continente",
        paragraphs: [
          "Uruguay y Argentina lideran el palmarés con 16 títulos cada uno. Brasil suma nueve, Perú dos (1939 y 1975), Paraguay dos, Chile dos, Bolivia y Colombia uno.",
          "Perú ganó su segundo título en 1975 con un equipo histórico que incluía a Hugo Sotil, Teófilo Cubillas, Héctor Chumpitaz y otros nombres de oro del fútbol peruano. Aquella copa, disputada con sede rotativa, se cerró con un triunfo sobre Colombia en el desempate.",
        ],
      },
      {
        id: "anecdotas",
        title: "Momentos memorables",
        paragraphs: [
          "La final de la Copa América 2021, jugada en el Maracaná, dio a Lionel Messi su primer título mayor con la selección argentina, tras derrotar a Brasil 1-0 con gol de Ángel Di María. Era el final de una sequía de 28 años.",
          "El 'Maracanazo' chileno de 2015 (Chile campeón ante Argentina en penales en Santiago) inició el tricampeonato chileno con los famosos 'Chile 2015 y Centenario 2016'.",
          "Perú alcanzó la final de la Copa América 2019 ante Brasil en Maracaná, en una de las gestas más recordadas del fútbol peruano contemporáneo bajo Ricardo Gareca.",
        ],
      },
    ],
  },

  "eurocopa": {
    sections: [
      {
        id: "historia",
        title: "Historia",
        paragraphs: [
          "La Eurocopa se disputa desde 1960, organizada por la UEFA. Originalmente conocida como Copa de Naciones de Europa, adoptó su nombre actual en 1968. Se juega cada cuatro años, alternándose con el Mundial.",
          "Alemania y España son los máximos ganadores con cuatro títulos cada uno, seguidos por Italia y Francia con dos.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Eurocopa", "Eurocopa — Wikipedia")],
      },
      {
        id: "espana-2024",
        title: "La Eurocopa 2024",
        paragraphs: [
          "España ganó la Eurocopa 2024 en Alemania, su cuarto título continental. La final 2-1 sobre Inglaterra en Berlín consagró a una nueva generación con Lamine Yamal (16 años, mejor joven del torneo), Nico Williams (autor del primer gol) y la veteranía de Rodri.",
          "El torneo se caracterizó por la presencia de un Cristiano Ronaldo final de ciclo, una Francia con Mbappé lesionado, una Inglaterra inestable, y una España que jugó el mejor fútbol con diferencia.",
        ],
      },
    ],
  },

  "copa-libertadores": {
    sections: [
      {
        id: "historia",
        title: "El gran torneo continental",
        paragraphs: [
          "La Copa Libertadores fue creada en 1960 por la Conmebol como respuesta a la Copa de Europa de la UEFA. Es el principal torneo de clubes de Sudamérica y uno de los más prestigiosos del fútbol mundial.",
          "Independiente de Argentina es el máximo ganador con siete títulos. Boca Juniors y Peñarol siguen con seis, River Plate con cuatro, Estudiantes y São Paulo con tres, Santos, Olimpia, Grêmio, Internacional, Cruzeiro, Palmeiras, Flamengo, Atlético Mineiro y Nacional con dos o más.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Copa_Libertadores", "Copa Libertadores — Wikipedia")],
      },
      {
        id: "peruanos",
        title: "Equipos peruanos en la Libertadores",
        paragraphs: [
          "El único peruano en disputar la final de la Copa Libertadores fue Universitario de Deportes en 1972, frente a Independiente de Avellaneda. La 'U' perdió aquella final disputada en dos partidos, pero quedó como la mejor campaña internacional de un club peruano en la Libertadores.",
          "Sporting Cristal alcanzó las semifinales en 1997, año en que disputó la final de Copa Sudamericana. Alianza Lima ha tenido campañas notables en distintas ediciones. Cienciano disputó la fase de grupos en varias oportunidades tras su corona en Copa Sudamericana 2003.",
        ],
      },
      {
        id: "anecdotas",
        title: "Momentos legendarios",
        paragraphs: [
          "La final de 2018 entre Boca Juniors y River Plate —disputada en Madrid tras los incidentes en el Monumental porteño— fue una de las más extrañas y dramáticas de la historia del torneo. River ganó 3-1 en el alargue y se consagró bicampeón.",
          "Bicampeonatos consecutivos del Flamengo (2019, 2022), del Palmeiras (2020, 2021) y la consagración de Atlético Mineiro en 2024 muestran un dominio brasileño contemporáneo en el torneo.",
        ],
      },
    ],
  },

  "uefa-champions-league": {
    sections: [
      {
        id: "historia",
        title: "De Copa de Europa a Champions League",
        paragraphs: [
          "La actual UEFA Champions League nació en 1955 como la Copa de Campeones de Europa, originalmente abierta solo a los campeones de cada liga. En 1992 cambió de formato y de nombre, adoptando la liguilla de fase de grupos antes de las eliminatorias.",
          "Real Madrid es el máximo ganador con 15 títulos. Le siguen Milan (siete), Liverpool y Bayern de Múnich (seis), Barcelona (cinco), Ajax (cuatro), Manchester United (tres), Inter de Milán (tres) y otros.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Liga_de_Campeones_de_la_UEFA", "Champions League — Wikipedia")],
      },
      {
        id: "momentos-clave",
        title: "Momentos clave",
        paragraphs: [
          "La 'Cinco veces' del Real Madrid (1956-1960) y el dominio del Milan de los 80-90 son las épocas de mayor concentración de títulos. En el siglo XXI, el Real Madrid ha ganado seis Champions, en una dinastía contemporánea sin precedentes.",
          "La remontada del Barça 6-1 al PSG (2017) sigue siendo uno de los partidos más impactantes del torneo. La Decimocuarta del Madrid (2022, 1-0 a Liverpool con gol de Vinícius) y la Decimoquinta (2024, 2-0 a Borussia Dortmund) son los hitos más recientes.",
          "La primera Champions del PSG (2024-25) cerró una década de espera para el club parisino, con una final 5-0 frente al Inter de Milán en Múnich, posiblemente la final más asimétrica desde la era moderna del torneo.",
        ],
      },
    ],
  },

  "copa-sudamericana": {
    sections: [
      {
        id: "historia",
        title: "El segundo torneo continental",
        paragraphs: [
          "La Copa Sudamericana es el segundo torneo más importante de clubes de la Conmebol, equivalente a la UEFA Europa League. Se disputa desde 2002 y nuclea a clubes no clasificados directamente a la Copa Libertadores.",
          "Boca Juniors, Independiente y Athletico Paranaense lideran el palmarés. Para Cienciano del Cusco, su título de 2003 (en la primera edición conmebol pura) es el único trofeo internacional de un club peruano, lo que le otorga un lugar especial en la historia continental.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Copa_Sudamericana", "Copa Sudamericana — Wikipedia")],
      },
    ],
  },
};
