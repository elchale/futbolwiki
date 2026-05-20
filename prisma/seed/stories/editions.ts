import { wiki, type Story } from "./_types";

/** Tournament edition stories — keyed by `${tournamentSlug}/${year}` */
export const EDITION_STORIES: Record<string, Story> = {
  "copa-mundial-fifa/2022": {
    sections: [
      {
        id: "contexto",
        title: "Qatar: una sede polémica",
        paragraphs: [
          "El Mundial 2022 fue el primero disputado en Oriente Medio y el segundo en Asia (tras Corea-Japón 2002). La elección de Qatar en 2010 fue polémica desde su anuncio: por temperaturas extremas del verano árabe (motivo por el que se jugó en noviembre-diciembre), por acusaciones de corrupción en la votación de la FIFA y por preocupaciones sobre los derechos laborales de los trabajadores migrantes que construyeron los estadios.",
          "El torneo se disputó en ocho estadios de Doha y alrededores, todos relativamente cerca entre sí. Por primera vez en la historia, los aficionados podían asistir a más de un partido por día sin tener que viajar largas distancias.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Copa_Mundial_de_F%C3%BAtbol_de_2022", "Mundial 2022 — Wikipedia")],
      },
      {
        id: "fase-grupos",
        title: "Fase de grupos: las sorpresas",
        paragraphs: [
          "Arabia Saudita derrotó 2-1 a la Argentina de Messi en el debut, una de las sorpresas más grandes de la historia del torneo. Argentina parecía sentenciada, pero se recompuso y terminó campeona.",
          "Japón derrotó a Alemania y a España, lo que le permitió liderar el 'grupo de la muerte' por delante de ambas selecciones europeas. Marruecos, por su parte, terminó primero en su grupo por delante de Croacia.",
          "Marruecos avanzó luego a cuartos eliminando a España (penales) y a Portugal (1-0), y se convirtió en la primera selección africana en alcanzar las semifinales de un Mundial. La emoción del continente africano en torno a ese equipo fue uno de los hitos sociales del torneo.",
        ],
      },
      {
        id: "rumbo-a-la-final",
        title: "Camino de Argentina hacia la consagración",
        paragraphs: [
          "Tras la derrota inicial con Arabia, Argentina ganó a México 2-0 y a Polonia 2-0. En octavos venció 2-1 a Australia. En cuartos, una de las series más recordadas del torneo: empató 2-2 con Países Bajos tras ir 2-0 arriba, y ganó por penales en una serie cargada de gestos provocadores entre Messi y van Gaal.",
          "Las semifinales se decidieron con Argentina 3-0 Croacia (con un gol clave de Julián Álvarez tras una corrida individual) y Francia 2-0 Marruecos. La final estaba lista.",
        ],
      },
      {
        id: "final",
        title: "La final más recordada",
        paragraphs: [
          "El 18 de diciembre de 2022, en el Estadio Lusail de Doha, Argentina y Francia disputaron una de las finales más recordadas en la historia del fútbol. Argentina dominó la primera hora, con Messi de penal (23') y Ángel Di María (36') marcando para el 2-0. Parecía sentenciado.",
          "Pero Francia despertó en los últimos diez minutos del tiempo reglamentario: Kylian Mbappé marcó dos goles en 90 segundos (80' y 81', el segundo un volea espectacular) para el 2-2. El partido se fue al alargue.",
          "En el tiempo extra, Messi anotó el 3-2 en el minuto 108 tras un rebote dentro del área. Tres minutos antes del final, Mbappé selló su hat-trick con otro penal para el 3-3 final.",
          "La tanda de penales fue ganada por Argentina 4-2: Martínez (acabó atajando a Coman), Dybala, Paredes y Montiel anotaron por Argentina; Mbappé y Kolo Muani anotaron por Francia, pero Coman y Tchouaméni fallaron. Messi alzó la copa.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Final_de_la_Copa_Mundial_de_F%C3%BAtbol_de_2022", "Final 2022 — Wikipedia")],
      },
      {
        id: "premios",
        title: "Premios individuales",
        paragraphs: [
          "Lionel Messi obtuvo el Balón de Oro al mejor jugador del torneo. Era su segunda copa (la primera había sido en 2014, como subcampeón), lo que lo convirtió en el primer futbolista en ganar el Balón de Oro mundialista dos veces.",
          "Kylian Mbappé se llevó la Bota de Oro al máximo goleador del torneo con 8 goles, incluidos los tres de la final. Fue, además, el primero en hacer un hat-trick en una final mundialista desde Geoff Hurst en Inglaterra 1966.",
          "Emiliano Martínez ganó el Guante de Oro como mejor portero, tras atajadas decisivas (incluidas las del final del alargue ante Kolo Muani) y un protagonismo en los penales que pasó a la historia.",
          "El joven Enzo Fernández, debutante a los 21 años, fue elegido Mejor Jugador Joven del torneo, premiando su irrupción en el centro del campo argentino.",
        ],
      },
    ],
  },
};
