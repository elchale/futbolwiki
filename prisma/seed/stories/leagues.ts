import { wiki, type Story } from "./_types";

export const LEAGUE_STORIES: Record<string, Story> = {
  "liga-1-peru": {
    sections: [
      {
        id: "historia",
        title: "Historia",
        paragraphs: [
          "La Primera División del Perú es la máxima categoría del fútbol peruano. Su origen se remonta a 1912 con la creación de la Liga Peruana de Fútbol, lo que la convierte en una de las ligas más antiguas de Sudamérica. Durante sus primeros 40 años fue un torneo limeño; recién en 1966 se incorporaron equipos de provincias, comenzando un proceso de descentralización que llevó décadas.",
          "El nombre 'Liga 1' fue adoptado oficialmente en 2019 como parte de una reforma estructural que buscó modernizar la administración del torneo. Antes había sido conocida como Campeonato Descentralizado, Torneo Descentralizado y otras denominaciones a lo largo de su historia.",
          "La Federación Peruana de Fútbol (FPF) organiza el torneo. Los campeones obtienen plaza directa en la Copa Libertadores, mientras que los siguientes mejores acceden a Copa Sudamericana.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Primera_Divisi%C3%B3n_del_Per%C3%BA", "Primera División del Perú — Wikipedia")],
      },
      {
        id: "los-grandes",
        title: "Los tres grandes",
        paragraphs: [
          "Tres clubes históricos dominan el palmarés: Universitario de Deportes (más de 27 títulos), Alianza Lima (más de 25 títulos) y Sporting Cristal (alrededor de 20). Estos tres equipos limeños han concentrado la mayor parte de los campeonatos desde los inicios profesionales del torneo.",
          "Equipos provincianos como Cienciano (Cusco), FBC Melgar (Arequipa) y Universitario de Sport en sus primeros años han roto esa hegemonía en distintas ocasiones. La aparición de equipos andinos con la ventaja de la altura introdujo una variable única al fútbol peruano.",
        ],
      },
      {
        id: "formato",
        title: "Formato actual",
        paragraphs: [
          "La temporada se disputa en dos torneos cortos por temporada calendario: Apertura y Clausura. Los ganadores de cada uno se enfrentan en una final nacional, salvo que un mismo equipo gane ambos —en cuyo caso obtiene el campeonato sin necesidad de play-off. Los 18 equipos juegan también una tabla acumulada que define descensos y cupos internacionales.",
          "El sistema de descensos genera cada año una pelea paralela: los dos últimos de la tabla acumulada bajan a Liga 2, mientras que los ganadores del torneo de ascenso suben.",
        ],
      },
      {
        id: "anecdotas",
        title: "Anécdotas y momentos memorables",
        paragraphs: [
          "El primer título de Universitario en 1929 se decidió por descalificación del Alianza Lima, lo que sembró una de las primeras controversias del clásico. Aún hoy aliancistas y cremas discuten la legitimidad de ese campeonato.",
          "El 25 de noviembre de 2023, Universitario consagró el bicampeonato (2023-2024) precisamente en el año de su centenario, frente a Alianza Lima en el Estadio Monumental. Pocas postales podrían superar simbólicamente ese cierre.",
          "El bicampeonato de Alianza Lima en 2021-2022 fue uno de los más celebrados, con la idolatría a Hernán Barcos como leitmotiv. Aquellas dos temporadas marcaron uno de los pasajes más recordados del fútbol peruano reciente.",
        ],
      },
    ],
  },

  "laliga": {
    sections: [
      {
        id: "historia",
        title: "Historia",
        paragraphs: [
          "LaLiga, conocida formalmente como Primera División de España, fue fundada en 1929 cuando un grupo de diez clubes —entre ellos Barcelona, Real Madrid y Athletic Club— se unieron para crear un campeonato nacional. Es una de las ligas europeas más prestigiosas y la que ha producido más ganadores de la Champions League (Real Madrid 15, Barcelona 5, Atlético en finales).",
          "El dominio histórico se reparte entre Real Madrid, Barcelona y Atlético de Madrid, aunque equipos como el Athletic Club, el Valencia, el Sevilla o el Deportivo de La Coruña han tenido épocas relevantes.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Primera_Divisi%C3%B3n_de_Espa%C3%B1a", "Primera División de España — Wikipedia")],
      },
      {
        id: "el-clasico",
        title: "El Clásico, el corazón del torneo",
        paragraphs: [
          "El Real Madrid - FC Barcelona es probablemente el partido más visto del fútbol mundial cada año. La rivalidad histórica entre Madrid y Cataluña, las polaridades políticas, las superestrellas presentes en ambos lados (Di Stéfano-Cruyff; Messi-Ronaldo; ahora Yamal-Mbappé) hacen del partido un fenómeno global.",
        ],
      },
      {
        id: "era-moderna",
        title: "Era moderna",
        paragraphs: [
          "La era de Messi y Cristiano Ronaldo (2009-2018) convirtió a LaLiga en el escenario donde se decidía el Balón de Oro cada año. Récords goleadores cayeron en serie, y los Clásicos se transmitieron a más de 200 países.",
          "Tras la salida de ambos a otros destinos, LaLiga vive una etapa de renovación: Lamine Yamal, Vinícius, Bellingham, Pedri y Mbappé son protagonistas del presente y del futuro inmediato del campeonato.",
        ],
      },
    ],
  },

  "premier-league": {
    sections: [
      {
        id: "historia",
        title: "Historia",
        paragraphs: [
          "La Premier League fue fundada en 1992, separándose de la English Football League. Es la sucesora moderna de la First Division (creada en 1888), por lo que su historia institucional formal es relativamente joven, pero la tradición del fútbol inglés es la más antigua del mundo.",
          "Desde su creación, ha sido dominada en distintas épocas por Manchester United (era Ferguson), Chelsea (Abramovich), Manchester City (era Guardiola) y Liverpool (era Klopp), entre otros.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Premier_League", "Premier League — Wikipedia")],
      },
      {
        id: "fenomeno-global",
        title: "Fenómeno televisivo global",
        paragraphs: [
          "La Premier League es la liga más vista del planeta, con derechos televisivos vendidos a casi todos los países. Sus ingresos masivos han permitido a sus clubes pagar los salarios más altos del fútbol mundial.",
          "Esta atracción económica ha llevado a fenómenos como la 'Big Six' (United, City, Liverpool, Chelsea, Arsenal, Tottenham), un grupo informal de clubes que durante años concentró buena parte del talento y de los títulos.",
        ],
      },
      {
        id: "invencibles",
        title: "Récords y mitos",
        paragraphs: [
          "Los récords de la Premier incluyen: los 49 partidos invictos consecutivos del Arsenal de Wenger (2003-2004), los 100 puntos del Manchester City 2017-18 ('los Centuriones'), los 38 goles de Erling Haaland en una sola temporada (2022-23) y el primer título de Liverpool en 30 años bajo Klopp (2019-20).",
        ],
      },
    ],
  },

  "serie-a": {
    sections: [
      {
        id: "historia",
        title: "Historia",
        paragraphs: [
          "La Serie A italiana se fundó en 1898 y formalizó su estructura actual en 1929. Es una de las ligas más antiguas de Europa, históricamente reconocida por su énfasis táctico y por la calidad defensiva de sus equipos.",
          "Juventus, Milan e Inter de Milán son los tres clubes más laureados, con presencia internacional sostenida durante décadas.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Serie_A_(Italia)", "Serie A — Wikipedia")],
      },
      {
        id: "calciopoli",
        title: "Calciopoli y la era moderna",
        paragraphs: [
          "El escándalo del Calciopoli en 2006 reveló una red de influencias arbitrales que terminó con la Juventus descendida administrativamente y otros clubes sancionados. La crisis golpeó duro al fútbol italiano y a sus equipos en torneos europeos.",
          "La Serie A se recuperó parcialmente en la década de 2010-2020 con el dominio de la Juventus (nueve scudettos consecutivos), y más recientemente con el resurgir del Napoli (campeón 2022-23 tras 33 años) y del Inter (2023-24).",
        ],
      },
    ],
  },

  "bundesliga": {
    sections: [
      {
        id: "historia",
        title: "Historia",
        paragraphs: [
          "La Bundesliga es la máxima categoría del fútbol alemán desde 1963. Antes de su creación, el campeonato alemán se disputaba en formato regional con una fase nacional, un sistema que era menos competitivo que el de otros países europeos.",
          "Históricamente dominada por el Bayern de Múnich (más de 30 títulos), con periodos de protagonismo del Borussia Dortmund, Hamburgo, Werder Bremen, Stuttgart y otros.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Bundesliga", "Bundesliga — Wikipedia")],
      },
      {
        id: "cultura-de-aficionados",
        title: "Cultura de aficionados",
        paragraphs: [
          "La Bundesliga es admirada por su modelo de '50+1', que requiere que los socios de los clubes mantengan al menos el 50% más uno del control. Esto preserva la propiedad de los clubes en manos de los aficionados y resiste la entrada de inversores externos (con excepciones como Wolfsburg, Bayer Leverkusen y RB Leipzig).",
          "Los estadios alemanes son icónicos por la 'Yellow Wall' del Dortmund y por la masividad asequible de las entradas, comparada con la Premier League.",
        ],
      },
    ],
  },

  "ligue-1": {
    sections: [
      {
        id: "historia",
        title: "Historia",
        paragraphs: [
          "La Ligue 1 se fundó en 1932 y es la máxima categoría del fútbol francés. Tiene un perfil más modesto que las otras grandes ligas europeas, pero con una tradición sólida y con clubes como Saint-Étienne, Olympique de Marsella, Nantes, Burdeos y Mónaco como ganadores históricos.",
          "Desde 2011, el panorama cambió con la compra del PSG por Qatar Sports Investments. El club parisino ha ganado 11 de las últimas 13 ligas, lo que ha reducido la incertidumbre deportiva pero ha elevado el nivel financiero del torneo.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Ligue_1", "Ligue 1 — Wikipedia")],
      },
    ],
  },

  "liga-2-peru": {
    sections: [
      {
        id: "historia",
        title: "Historia",
        paragraphs: [
          "La Liga 2 (antes llamada Segunda División) es la segunda categoría del fútbol peruano. Sus campeones ascienden directamente a Liga 1 cada temporada.",
          "El torneo nuclea a equipos de Lima y provincias que buscan el ascenso, además de los descendidos del año anterior. Es una categoría con presupuestos modestos pero con presencia de clubes históricos en distintas etapas.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Segunda_Divisi%C3%B3n_del_Per%C3%BA", "Segunda División del Perú — Wikipedia")],
      },
    ],
  },

  "liga-3-peru": {
    sections: [
      {
        id: "historia",
        title: "Historia",
        paragraphs: [
          "La Liga 3 fue creada por la Federación Peruana de Fútbol en 2023 como un puente entre el fútbol regional (Copa Perú) y la Liga 2. Su objetivo es elevar la competitividad de los clubes regionales y darles una vía profesional hacia la primera división.",
          "Es la categoría más joven del fútbol peruano profesional. Su consolidación es uno de los proyectos en curso del balompié nacional.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Liga_3_(Per%C3%BA)", "Liga 3 — Wikipedia")],
      },
    ],
  },
};
