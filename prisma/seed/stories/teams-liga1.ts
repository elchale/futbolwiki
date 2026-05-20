import { wiki, type Story } from "./_types";

/**
 * Long-form stories for Liga 1 (Perú) clubs.
 * Each entry maps a team slug → multi-section Story.
 */

export const LIGA1_TEAM_STORIES: Record<string, Story> = {
  "alianza-lima": {
    sections: [
      {
        id: "origenes",
        title: "Fundación y orígenes",
        paragraphs: [
          "Alianza Lima nace el 15 de febrero de 1901 en el barrio limeño de La Victoria, en una época en la que el fútbol recién comenzaba a echar raíces en el Perú. Su origen está ligado a los caballos: un grupo de muchachos del jirón Cotabambas que trabajaban en la caballeriza del presidente Augusto B. Leguía fundó el club bajo el nombre original de Sport Alianza, en referencia a una popular yegua de carrera.",
          "Durante sus primeros años, el club osciló entre el amateurismo de los potreros y la formalización progresiva del balompié peruano. La afición popular lo adoptó como propio desde temprano, en parte porque sus jugadores provenían de los sectores trabajadores de Lima. La camiseta blanquiazul —blanco en la franja del pecho, azul en el resto— quedó como una de las identidades más reconocibles del fútbol sudamericano.",
          "La denominación 'Alianza Lima' se consolidó hacia mediados de los años 20, junto con la profesionalización paulatina del fútbol nacional. Para entonces, el club ya era un referente cultural del distrito de La Victoria, dueño de un orgullo barrial que sigue intacto más de un siglo después.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Club_Alianza_Lima", "Club Alianza Lima — Wikipedia")],
      },
      {
        id: "eras-doradas",
        title: "Eras doradas e ídolos históricos",
        paragraphs: [
          "La primera gran generación íntima fue la del 'Rodillo Negro' de los años 30, una mezcla de futbolistas afroperuanos de extraordinaria habilidad que cambió la manera de entender el fútbol en el Perú. Alejandro Villanueva, considerado por muchos el primer gran ídolo del balompié peruano, fue el rostro y el alma de ese equipo. Su número 9 dejó una huella tan profunda que el estadio del club lleva hoy su nombre.",
          "Décadas más tarde, los años 70 vieron emerger a 'Los Potrillos', una camada juvenil deslumbrante con figuras como Cubillas, Cueto, Sotil y otros nombres que también marcaron a la selección peruana. Esa generación nutrió al equipo que ganó la Copa América 1975 y firmó actuaciones inolvidables en la Copa Libertadores.",
          "El final de los 80 trajo otro grupo brillante, conocido como 'Los Potrillos del 87', truncado por la tragedia del 8 de diciembre de 1987, cuando el avión Fokker F27 de la Marina de Guerra del Perú que transportaba al plantel se precipitó al mar frente a Ventanilla. Murieron jugadores, dirigentes, árbitros y la tripulación. Aquella herida marcó al club y al fútbol peruano para siempre.",
          "En el plano de los títulos, Alianza acumula múltiples campeonatos nacionales (incluyendo el bicampeonato 2021-2022) y un lugar firme entre los clubes más laureados del país.",
        ],
        sources: [
          wiki("https://es.wikipedia.org/wiki/Club_Alianza_Lima", "Club Alianza Lima — Wikipedia"),
          wiki("https://es.wikipedia.org/wiki/Tragedia_de_Alianza_Lima", "Tragedia de Alianza Lima — Wikipedia"),
        ],
      },
      {
        id: "rivalidades",
        title: "El clásico con Universitario",
        paragraphs: [
          "El clásico Alianza Lima — Universitario de Deportes es uno de los más antiguos y disputados de Sudamérica. Se juega de manera regular desde 1928 y ha enfrentado a las dos hinchadas más grandes del Perú a lo largo del siglo XX y XXI. La rivalidad nació no sólo en el campo, sino también en la geografía social: Alianza, identificado con el pueblo y los barrios populares; la U, asociada a las clases medias y a la tradición universitaria.",
          "Más allá del componente sociológico, lo que distingue al clásico son los pasajes de fútbol espectacular, las tardes de patadas y los goles agónicos. Cada edición altera la temperatura del país durante toda la semana previa: las portadas, las radios y hasta las conversaciones en la calle giran alrededor del partido.",
          "El historial está extraordinariamente parejo. Cada victoria modifica matemáticas y orgullos, lo que mantiene viva una de las pasiones más persistentes del balompié peruano.",
        ],
        sources: [
          wiki("https://es.wikipedia.org/wiki/Cl%C3%A1sico_del_f%C3%BAtbol_peruano", "Clásico del fútbol peruano — Wikipedia"),
        ],
      },
      {
        id: "cultura",
        title: "Matute, la hinchada y el sentido de pertenencia",
        paragraphs: [
          "El Estadio Alejandro Villanueva, popularmente conocido como Matute, es desde 1974 la casa de Alianza Lima. Ubicado en el corazón de La Victoria, es un escenario peculiar para el fútbol sudamericano: pequeño, con tribunas que casi se vuelcan sobre el campo, ofrece una intimidad sonora que pocos estadios del continente reproducen.",
          "La hinchada blanquiazul es una de las más numerosas y arraigadas del Perú, con presencia masiva en provincias y en colonias peruanas alrededor del mundo. Sus cánticos —algunos heredados de generación en generación— forman parte del imaginario cultural limeño tanto como la propia camiseta.",
          "Cada 8 de diciembre, en el aniversario de la tragedia, Matute se enciende con cirios, retratos y minutos de silencio. Es un rito íntimo que conecta a un club centenario con su memoria viva.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Estadio_Alejandro_Villanueva", "Estadio Alejandro Villanueva — Wikipedia")],
      },
      {
        id: "anecdotas",
        title: "Anécdotas e historias mínimas",
        paragraphs: [
          "Una tradición que sobrevivió a las décadas es la del 'Hermandad': Alianza juega cada año un partido amistoso en el aniversario de la tragedia, generalmente contra clubes que enviaron condolencias en 1987. Brasileños, argentinos y europeos forman parte de esta lista no oficial.",
          "Otra costumbre es la de 'la noche blanquiazul' en la presentación del plantel cada inicio de año. Matute se convierte en un escenario semireligioso: bombazos, banderolas gigantes y el saludo uno por uno de los nuevos jugadores ante la hinchada.",
          "Hernán Barcos, delantero argentino llegado en 2021, se ganó el cariño del público no sólo por sus goles sino por adoptar a Lima como propia: su esposa peruana, sus videos en redes con frases criollas y su gesto de hablarle a la tribuna en idioma 'íntimo' le valieron rápidamente el respeto del barrio.",
        ],
      },
    ],
  },

  "universitario-de-deportes": {
    sections: [
      {
        id: "origenes",
        title: "El nacimiento de un club universitario",
        paragraphs: [
          "Universitario de Deportes nació el 7 de agosto de 1924, fundado por un grupo de estudiantes de la Universidad Nacional Mayor de San Marcos, la más antigua de América. Originalmente se llamó Federación Universitaria de Fútbol, y representaba a los muchachos de la facultad de Letras en torneos amateurs limeños.",
          "El espíritu universitario y la pertenencia a la clase media educada de Lima marcaron desde el inicio la identidad del club. La camiseta crema —inspirada en los colores de San Marcos— y la 'U' bordada al pecho son símbolos que sobrevivieron más de un siglo con poquísimas alteraciones.",
          "Conocido afectuosamente como 'la U', 'los cremas' o 'los merengues', el club se distinguió por ser el primer equipo peruano organizado bajo principios deportivos modernos: estatutos, formación de divisiones inferiores y vinculación académica.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Club_Universitario_de_Deportes", "Club Universitario de Deportes — Wikipedia")],
      },
      {
        id: "eras-doradas",
        title: "Generaciones doradas",
        paragraphs: [
          "El 'Equipo de Ensueño' de mediados del siglo XX —con figuras como Lolo Fernández, ídolo eterno y máximo goleador histórico de la U— consolidó la primera era dorada. Lolo, hijo del rector universitario y futbolista de excepción, marcó más de 150 goles oficiales con el club y se convirtió en uno de los grandes símbolos del fútbol peruano.",
          "El equipo del 'Plan Cobras' de los años 60 y posteriormente el de los 70, con Hugo Sotil, Percy Rojas y Juan José Muñante, llevó a Universitario a un protagonismo continental que culminó con la histórica final de la Copa Libertadores 1972 frente al Independiente argentino —el primer y único peruano hasta hoy en alcanzar esa instancia.",
          "Más adelante, el bicampeonato 1998-1999-2000 con Ángel Cappa primero y Sergio Markarián después confirmó la condición de Universitario como el club con más títulos nacionales del Perú, marca que mantiene hasta la fecha.",
        ],
        sources: [
          wiki("https://es.wikipedia.org/wiki/Lolo_Fern%C3%A1ndez", "Lolo Fernández — Wikipedia"),
          wiki("https://es.wikipedia.org/wiki/Copa_Libertadores_1972", "Copa Libertadores 1972 — Wikipedia"),
        ],
      },
      {
        id: "monumental",
        title: "El Monumental: la catedral de Ate",
        paragraphs: [
          "El Estadio Monumental U fue inaugurado en el año 2000, en la antesala del centenario del club, con una capacidad superior a los 80.000 espectadores. Su tamaño lo convirtió desde el primer día en el estadio más grande del Perú y uno de los mayores de Sudamérica.",
          "Su construcción fue una odisea financiera y arquitectónica: el club acumuló deudas que tardarían años en saldarse, pero la ambición —una casa propia digna del proyecto institucional— se cumplió. Hoy es escenario de finales internacionales, conciertos masivos y, por supuesto, de los partidos más calientes del fútbol peruano.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Estadio_Monumental_(Lima)", "Estadio Monumental — Wikipedia")],
      },
      {
        id: "era-reciente",
        title: "Era reciente",
        paragraphs: [
          "Tras un período de turbulencia administrativa entre 2015 y 2019 que llegó a poner en riesgo la propia continuidad del club, Universitario inició una etapa de estabilización deportiva y financiera. La gestión más reciente apostó por traer entrenadores y refuerzos con credenciales internacionales.",
          "Bajo la dirección técnica del uruguayo Jorge Fossati, la U levantó el título de la temporada 2023 y celebró su centenario con un equipo competitivo y una hinchada que volvió a llenar el Monumental cada fin de semana. La gestión del trofeo del año del centenario quedó como uno de los hitos más recordados de la historia reciente del club.",
        ],
      },
      {
        id: "anecdotas",
        title: "Curiosidades de los cremas",
        paragraphs: [
          "El propio Lolo Fernández nunca cobró un sueldo en Universitario. Como hijo de una familia acomodada y profesional, jugaba al fútbol por puro amor a la camiseta, lo que le valió un cariño que trasciende generaciones.",
          "Antes del Monumental, la U fue durante décadas inquilina del Estadio Nacional, donde escribió la mayor parte de sus páginas gloriosas. Compartió esa sede con el clásico rival, lo que sumaba dramatismo a los enfrentamientos.",
          "La barra brava de Universitario, la 'Trinchera Norte', tiene una tradición visual potente: telones gigantes, papel picado y coreografías que se exportan a otros estadios del país. Sus colores —crema y granate— pintan cada partido en el Monumental.",
        ],
      },
    ],
  },

  "sporting-cristal": {
    sections: [
      {
        id: "origenes",
        title: "Una cervecería convertida en club",
        paragraphs: [
          "Sporting Cristal nació el 13 de diciembre de 1955 producto de una fusión inusual: la cervecería Backus & Johnston decidió unir al modesto Club Sportivo Cristal con el desaparecido Sporting Tabaco para formar un nuevo equipo de fútbol. La marca buscaba un brazo deportivo de alto perfil, y la operación —pionera del fútbol corporativo en el Perú— produjo desde el primer año un competidor de élite.",
          "Los colores celestes derivan de la marca: la cerveza Cristal se vendía en botellas con etiqueta celeste. La camiseta y el nombre quedaron desde entonces ligados al imaginario corporativo, pero la afición del Rímac —barrio donde se asentó originalmente el club— terminó adoptándolo como propio.",
          "A diferencia de Alianza y Universitario, Cristal nace ya en plena era del fútbol profesional. Su modelo de gestión —empresarial, planificado, con énfasis en divisiones menores— marcó una diferencia que conservaría a lo largo de su historia.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Club_Sporting_Cristal", "Club Sporting Cristal — Wikipedia")],
      },
      {
        id: "eras-doradas",
        title: "Eras doradas",
        paragraphs: [
          "Cristal vivió su primer pico con el tricampeonato 1994-1995-1996, un dominio sostenido que no se repetía en el Perú desde el bicampeonato aliancista del 77-78. El plantel —dirigido por Sergio Markarián y luego por Juan Carlos Oblitas— mezcló jugadores cervecera-formados con extranjeros de jerarquía.",
          "El año 1997 trajo una hazaña histórica: Sporting Cristal alcanzó la final de la Copa Libertadores frente al Cruzeiro brasileño, convirtiéndose en el segundo club peruano en disputar la final del torneo (tras Universitario en 1972). La derrota no apagó la épica de aquella campaña, que sigue siendo uno de los momentos más recordados del fútbol peruano internacional.",
          "Con casi una veintena de títulos nacionales, Cristal es uno de los tres grandes del Perú junto con Alianza y la U. Su capacidad de mantener una estructura competitiva durante décadas es atribuida, en buena parte, al respaldo empresarial de Backus.",
        ],
        sources: [
          wiki("https://es.wikipedia.org/wiki/Copa_Libertadores_1997", "Copa Libertadores 1997 — Wikipedia"),
        ],
      },
      {
        id: "casa",
        title: "Gallardo, el Rímac y el estilo cervecero",
        paragraphs: [
          "El Estadio Alberto Gallardo —antes conocido como Estadio San Martín de Porres— es la casa histórica de Cristal en el distrito del Rímac. De tamaño modesto, con aforo de poco más de 11.000 espectadores, ofrece una experiencia íntima y un sello distintivo: la hinchada celeste cantando muy cerca del campo.",
          "Cristal se hizo conocido por su 'estilo cervecero': fútbol de toque, paciencia con la pelota y un perfil técnico depurado, en contraste con la 'garra' que se asociaba a otros equipos. Esta identidad se mantuvo a través de distintas eras y entrenadores, sostenida por un fuerte trabajo de divisiones inferiores que dio al fútbol peruano nombres como Yotún, Cueto, Lobatón, Ávila y Cazulo, entre muchos otros.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Estadio_Alberto_Gallardo", "Estadio Alberto Gallardo — Wikipedia")],
      },
      {
        id: "anecdotas",
        title: "Anécdotas celestes",
        paragraphs: [
          "Cristal mantuvo durante décadas la regla no escrita de que su entrenador principal debía hablar español: nunca contrató a un técnico extranjero que no manejara fluidamente el idioma. La idea era preservar la fluidez del estilo de juego y la comunicación con los formados en casa.",
          "Antes de cada partido en Gallardo, la hinchada acostumbra a desplegar una bandera gigante con la frase 'orgullo del Rímac'. El estadio es uno de los pocos del Perú donde el visitante escucha el aliento local desde apenas unos metros de distancia.",
        ],
      },
    ],
  },

  "cienciano": {
    sections: [
      {
        id: "origenes",
        title: "Del Cusco al continente",
        paragraphs: [
          "El Club Sportivo Cienciano fue fundado en 1901 en el Cusco por un grupo de estudiantes del Colegio Nacional de Ciencias y Artes, de donde proviene el nombre. Durante gran parte del siglo XX fue un protagonista regional con presencia intermitente en la primera división peruana.",
          "El club se distinguió por una identidad marcadamente cusqueña: sus colores rojo y blanco, sus barras compuestas mayoritariamente por jóvenes del altiplano y su tradición de jugar a más de 3.300 metros sobre el nivel del mar son elementos que lo diferencian de cualquier otro equipo peruano.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Club_Sportivo_Cienciano", "Club Sportivo Cienciano — Wikipedia")],
      },
      {
        id: "gesta",
        title: "La gesta sudamericana 2003-2004",
        paragraphs: [
          "El 12 de diciembre de 2003, en una jornada que el fútbol peruano nunca olvidará, Cienciano derrotó 1-0 a River Plate en la final de la Copa Sudamericana disputada a partido único en Arequipa. Ese gol —marcado por Germán Carty en el segundo tiempo— convirtió a Cienciano en el primer y, hasta hoy, único club peruano en levantar un trofeo internacional oficial.",
          "La hazaña creció al año siguiente: en 2004 Cienciano ganó la Recopa Sudamericana al vencer a Boca Juniors, campeón de la Libertadores. La victoria sobre el gigante argentino, en un Cusco congelado y sin oxígeno, consolidó la leyenda del 'Papá de América'.",
          "Aquellas dos campañas son las cumbres del fútbol peruano internacional y mantienen al Cusco vivo en la memoria continental. Los nombres de Carlos Lobatón, Carlos Galván, Mario Leguizamón, Germán Carty y el técnico Freddy Ternero quedaron grabados como protagonistas inolvidables.",
        ],
        sources: [
          wiki("https://es.wikipedia.org/wiki/Copa_Sudamericana_2003", "Copa Sudamericana 2003 — Wikipedia"),
          wiki("https://es.wikipedia.org/wiki/Recopa_Sudamericana_2004", "Recopa Sudamericana 2004 — Wikipedia"),
        ],
      },
      {
        id: "altura",
        title: "Jugar a más de 3.300 metros",
        paragraphs: [
          "El Estadio Inca Garcilaso de la Vega, situado a 3.399 metros sobre el nivel del mar, es uno de los retos físicos más exigentes para cualquier visitante del fútbol sudamericano. Los rivales costeños suelen llegar con apenas tiempo para aclimatarse, lo que históricamente ha favorecido al cuadro local.",
          "La altura es un factor identitario: las hinchadas cusqueñas se enorgullecen de la épica de jugar 'por encima de las nubes' y el club ha defendido siempre el derecho de los equipos andinos a usarla como ventaja deportiva.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Estadio_Inca_Garcilaso_de_la_Vega", "Estadio Inca Garcilaso — Wikipedia")],
      },
    ],
  },

  "sport-boys": {
    sections: [
      {
        id: "origenes",
        title: "El club del Callao",
        paragraphs: [
          "Sport Boys Association nació el 28 de julio de 1927 en el Callao, primer puerto del Perú, fundado por un grupo de jóvenes deportistas vinculados al ambiente marítimo. Sus colores —rosa y negro— surgieron casi por accidente: una camiseta blanca que se destiñó en una lavandería terminó adoptando ese tono rosado característico que el club abrazó como identidad.",
          "El Callao, ciudad portuaria con cultura propia, abrazó al Boys como su representante deportivo. Décadas de hinchada chalaca le dieron al club una identidad fuertemente regional, distinta a la de los grandes capitalinos.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Sport_Boys", "Sport Boys — Wikipedia")],
      },
      {
        id: "campeonatos",
        title: "Tradición campeona",
        paragraphs: [
          "Sport Boys fue uno de los grandes del fútbol peruano clásico, con 6 campeonatos nacionales obtenidos entre los años 30 y los 80. Su equipo de los años 40, en particular, marcó una época con jugadores como Valeriano López, conocido como el 'Cañonero de Chumpitaz', uno de los grandes goleadores de la historia del Perú.",
          "Las décadas recientes han traído altibajos: el Boys ha alternado entre primera y segunda división, pero la fidelidad de la hinchada chalaca se mantiene intacta. El Estadio Miguel Grau, su casa histórica, sigue siendo un escenario emblemático del fútbol porteño.",
        ],
      },
      {
        id: "anecdotas",
        title: "Anécdotas misileras",
        paragraphs: [
          "El apodo 'Misilero' viene de la tradición portuaria del Callao y de la velocidad asociada a los buques. La hinchada lo abrazó con orgullo y se autodenomina la 'Barra Brava Chalaca'.",
          "El color rosa del Boys es tan inusual en el fútbol mundial que, durante décadas, los rivales lo usaron como herramienta de burla. La hinchada chalaca, lejos de tomarlo a mal, lo convirtió en bandera: 'rosado, pero macho' se volvió cántico, e incluso se exportó a clubes hermanos en otros países.",
        ],
      },
    ],
  },

  "fbc-melgar": {
    sections: [
      {
        id: "origenes",
        title: "El León del Sur",
        paragraphs: [
          "El Foot Ball Club Melgar fue fundado el 25 de marzo de 1915 en Arequipa, en homenaje al poeta y mártir patriota Mariano Melgar. Es uno de los clubes más antiguos del Perú aún en actividad y, por mucho tiempo, el principal representante del sur peruano en el fútbol profesional.",
          "Sus colores rojo y negro y su escudo con la cabeza del león son símbolos arraigados en la identidad arequipeña, una región que tradicionalmente cultiva una autonomía cultural frente a Lima.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Foot_Ball_Club_Melgar", "FBC Melgar — Wikipedia")],
      },
      {
        id: "campeonatos",
        title: "Campeonatos y momentos continentales",
        paragraphs: [
          "Melgar ganó el campeonato nacional por primera vez en 1981, una gesta que lo elevó a la categoría de potencia regional. Tras décadas de búsqueda repitió el título en 2015, con un equipo dirigido por Juan Reynoso y respaldado por una afición eufórica que llenó la Monumental UNSA durante toda la campaña.",
          "En el plano internacional, una de las páginas más recordadas es su semifinal de Copa Sudamericana 2022, en la que cayó ante Independiente del Valle tras una campaña que lo llevó cerca de la final continental. Esa actuación demostró que el fútbol sureño peruano puede competir en alto nivel internacional.",
        ],
      },
    ],
  },

  "cusco-fc": {
    sections: [
      {
        id: "origenes",
        title: "De Real Garcilaso a Cusco FC",
        paragraphs: [
          "El club fue fundado en 2009 como Real Atlético Garcilaso y vivió un ascenso meteórico: en pocos años pasó de la Copa Perú a la Primera División. Cambió su denominación a Cusco FC en una reestructuración posterior, conservando los colores y la sede en la ciudad imperial.",
          "Pese a su juventud institucional, alcanzó hitos importantes como la subcampeonato nacional en 2013 y participaciones en Copa Libertadores. Su aparición coincidió con un período de renovado interés por el fútbol cusqueño en el plano nacional.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Cusco_FC", "Cusco FC — Wikipedia")],
      },
    ],
  },

  "atletico-grau": {
    sections: [
      {
        id: "origenes",
        title: "El equipo del almirante",
        paragraphs: [
          "Atlético Grau fue fundado en 1919 en Piura, en homenaje al almirante Miguel Grau Seminario, héroe nacional peruano de la Guerra del Pacífico. La identidad piurana —regional, cálida y orgullosa— ha sido siempre central para el club.",
          "Tras décadas alternando entre primera y segunda, Atlético Grau consolidó su lugar en la Liga 1 con campañas competitivas y una afición fiel que llena los estadios del norte cada vez que el club juega de local.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Club_Atl%C3%A9tico_Grau", "Atlético Grau — Wikipedia")],
      },
    ],
  },

  "union-comercio": {
    sections: [
      {
        id: "origenes",
        title: "La banda verde de la selva",
        paragraphs: [
          "Unión Comercio fue fundado en 1979 en Nueva Cajamarca, departamento de San Martín. Es uno de los principales representantes del fútbol selvático peruano en la primera división, y su afición —concentrada en la región del Alto Mayo— defiende con pasión el lugar simbólico de la selva en el mapa futbolístico nacional.",
          "Sus colores verdes y blancos se asocian directamente al paisaje amazónico. Los partidos como local en San Martín tienen un componente físico singular: humedad, calor y la altitud relativamente baja que contrasta con los rivales costeños y andinos.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Club_Uni%C3%B3n_Comercio", "Unión Comercio — Wikipedia")],
      },
    ],
  },

  "adt": {
    sections: [
      {
        id: "origenes",
        title: "Pasión tarmeña",
        paragraphs: [
          "La Asociación Deportiva Tarma, conocida simplemente como ADT, fue fundada en 1929 en la ciudad andina de Tarma, en el departamento de Junín. La 'Perla de los Andes' encontró en este club su principal representante futbolístico y sumó al palmarés peruano una identidad serrana distintiva.",
          "ADT logró el ascenso a la Liga 1 tras décadas en la segunda categoría y se consolidó como un equipo competitivo en el escenario nacional, capaz de imponerse en su altura tarmeña incluso a los grandes del fútbol limeño.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Asociaci%C3%B3n_Deportiva_Tarma", "ADT Tarma — Wikipedia")],
      },
    ],
  },

  "comerciantes-unidos": {
    sections: [
      {
        id: "origenes",
        title: "Los Cumbe de Cutervo",
        paragraphs: [
          "Comerciantes Unidos fue fundado en 1986 en Cutervo, provincia cajamarquina del norte peruano. Su crecimiento estuvo ligado a la actividad comercial local, lo que dio nombre al club y un sustento económico para sus campañas iniciales.",
          "Tras campañas destacadas en Liga 2 y procesos administrativos sostenidos, el club ascendió a la primera división y se ganó un sitio entre los equipos consolidados del norte peruano. Su afición, conocida como 'Los Cumbe', representa la identidad cajamarquina en el balompié nacional.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Club_Deportivo_Comerciantes_Unidos", "Comerciantes Unidos — Wikipedia")],
      },
    ],
  },

  "juan-pablo-ii-college": {
    sections: [
      {
        id: "origenes",
        title: "Del colegio al profesionalismo",
        paragraphs: [
          "Juan Pablo II College fue fundado en 2014 con sede en Chongoyape, provincia de Chiclayo en el departamento de Lambayeque. Su origen está vinculado al colegio del mismo nombre y a un proyecto deportivo educativo que rápidamente se profesionalizó.",
          "Su ascenso a la Liga 1 fue una de las historias más sorprendentes del fútbol peruano reciente: en apenas una década pasó de las divisiones menores a competir entre la élite nacional. La gestión austera y la apuesta por canteranos locales son sellos de la institución.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Juan_Pablo_II_College", "Juan Pablo II College — Wikipedia")],
      },
    ],
  },

  "deportivo-garcilaso": {
    sections: [
      {
        id: "origenes",
        title: "Otro Cusco en la pelea",
        paragraphs: [
          "El Club Deportivo Garcilaso, fundado en 1942 en el Cusco, comparte ciudad y estadio con Cienciano y Cusco FC, lo que convierte al departamento del Cusco en uno de los más representados en la Liga 1 peruana actual.",
          "Tras décadas en categorías menores, Deportivo Garcilaso ganó la Liga 2 en 2022 y selló su ascenso al máximo torneo del fútbol peruano. Su llegada renovó la competitividad del fútbol cusqueño y multiplicó la oferta deportiva en la ciudad imperial.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Club_Deportivo_Garcilaso", "Deportivo Garcilaso — Wikipedia")],
      },
    ],
  },

  "los-chankas": {
    sections: [
      {
        id: "origenes",
        title: "Los hijos de Apurímac",
        paragraphs: [
          "El Club Cultural Hijos de Apurímac, conocido como Los Chankas, fue fundado en 2014 en el departamento de Apurímac, una de las regiones andinas más rurales del Perú. Su nombre rinde homenaje al antiguo pueblo chanka, predecesor de los incas, que habitó esa zona en tiempos prehispánicos.",
          "El club encarna una historia de fútbol regional emergente: con bajo presupuesto, infraestructura modesta y una afición creciente, escaló hasta la Liga 1 y se convirtió en el primer equipo apurimeño en competir en la máxima categoría nacional.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Cultural_Hijos_de_Apur%C3%ADmac", "Los Chankas — Wikipedia")],
      },
    ],
  },

  "alianza-atletico": {
    sections: [
      {
        id: "origenes",
        title: "Sullana churres",
        paragraphs: [
          "Alianza Atlético fue fundado en 1920 en Sullana, una de las ciudades más antiguas e importantes del norte peruano. Su apodo 'los churres' es una expresión piurana que designa a los niños y jóvenes locales, y refleja el arraigo barrial del club.",
          "Con más de un siglo de historia, Alianza Atlético es uno de los clubes más representativos del norte peruano. Sus pasos por la Liga 1 han sido protagonistas en distintas décadas y ha aportado jugadores que pasaron luego a la selección nacional.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Alianza_Atl%C3%A9tico_de_Sullana", "Alianza Atlético — Wikipedia")],
      },
    ],
  },

  "alianza-universidad": {
    sections: [
      {
        id: "origenes",
        title: "El club de Huánuco",
        paragraphs: [
          "Alianza Universidad fue fundado en 1942 y está vinculado institucionalmente a la Universidad de Huánuco. Su identidad mezcla el componente universitario con el orgullo regional huanuqueño.",
          "Compite en las primeras divisiones peruanas de forma intermitente desde hace varias décadas. Su Estadio Heraclio Tapia, ubicado en la propia ciudad de Huánuco, es uno de los recintos más coloridos de la sierra central peruana en días de fútbol profesional.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Alianza_Universidad", "Alianza Universidad — Wikipedia")],
      },
    ],
  },

  "utc-cajamarca": {
    sections: [
      {
        id: "origenes",
        title: "El Gavilán del Norte",
        paragraphs: [
          "La Universidad Técnica de Cajamarca, conocida deportivamente como UTC, fue fundada en 1964 con vínculo directo a la universidad homónima. Es uno de los referentes deportivos de la región norte-andina peruana.",
          "El apodo 'Gavilán del Norte' surgió de la barra cajamarquina y se convirtió con el tiempo en sinónimo del club. UTC disputa la Liga 1 de manera intermitente, con campañas destacadas en distintas temporadas.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Universidad_T%C3%A9cnica_de_Cajamarca", "UTC Cajamarca — Wikipedia")],
      },
    ],
  },

  "ayacucho-fc": {
    sections: [
      {
        id: "origenes",
        title: "De Inti Gas a Ayacucho FC",
        paragraphs: [
          "El club nació en 1969 bajo el nombre original de Sport Inti Gas, ligado a una empresa local de combustible. Con el tiempo fue renombrado como Ayacucho Fútbol Club, abrazando una identidad más amplia y regional.",
          "Ayacucho FC consolidó su lugar en la Liga 1 durante la década de 2010 con campañas continentales en Copa Sudamericana y Libertadores, llevando la representación del altiplano peruano al escenario internacional.",
        ],
        sources: [wiki("https://es.wikipedia.org/wiki/Ayacucho_F%C3%BAtbol_Club", "Ayacucho FC — Wikipedia")],
      },
    ],
  },
};
