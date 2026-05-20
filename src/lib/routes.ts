/**
 * Centralized route helpers. All slugs Spanish, kebab-case.
 * Pages and components must use these — never hardcode paths.
 */

export const ROUTES = {
  home: "/",
  partidos: "/partidos",
  partido: (id: string) => `/partidos/${id}` as const,
  equipos: "/equipos",
  equipo: (slug: string) => `/equipos/${slug}` as const,
  equipoHistoria: (slug: string) => `/equipos/${slug}/historia` as const,
  equipoPlantilla: (slug: string) => `/equipos/${slug}/plantilla` as const,
  equipoExJugadores: (slug: string) => `/equipos/${slug}/ex-jugadores` as const,
  equipoTemporada: (slug: string, year: string) =>
    `/equipos/${slug}/temporadas/${year}` as const,
  jugadores: "/jugadores",
  jugador: (slug: string) => `/jugadores/${slug}` as const,
  entrenador: (slug: string) => `/entrenadores/${slug}` as const,
  ligas: "/ligas",
  liga: (slug: string) => `/ligas/${slug}` as const,
  ligaTemporada: (slug: string, year: string) =>
    `/ligas/${slug}/temporadas/${year}` as const,
  torneos: "/torneos",
  torneo: (slug: string) => `/torneos/${slug}` as const,
  torneoEdicion: (slug: string, year: string) =>
    `/torneos/${slug}/ediciones/${year}` as const,
  selecciones: "/selecciones",
  seleccion: (slug: string) => `/selecciones/${slug}` as const,
  buscar: "/buscar",
  buscarQuery: (q: string) => `/buscar?q=${encodeURIComponent(q)}` as const,
  sobre: "/sobre",
} as const;
