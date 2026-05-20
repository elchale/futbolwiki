import { format as fmt, formatDistanceToNowStrict, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const safeDate = (d: Date | string): Date => (typeof d === "string" ? parseISO(d) : d);

export function formatMatchDate(d: Date | string): string {
  const date = safeDate(d);
  if (isToday(date)) return `Hoy, ${fmt(date, "HH:mm")}`;
  if (isTomorrow(date)) return `Mañana, ${fmt(date, "HH:mm")}`;
  if (isYesterday(date)) return `Ayer, ${fmt(date, "HH:mm")}`;
  return fmt(date, "EEE d 'de' MMM, HH:mm", { locale: es });
}

export function formatLongDate(d: Date | string): string {
  return fmt(safeDate(d), "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatShortDate(d: Date | string): string {
  return fmt(safeDate(d), "d MMM yyyy", { locale: es });
}

export function formatYear(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return fmt(safeDate(d), "yyyy");
}

export function formatRelative(d: Date | string): string {
  return formatDistanceToNowStrict(safeDate(d), { locale: es, addSuffix: true });
}

export function formatAge(birth: Date | string, death?: Date | string | null): string {
  const b = safeDate(birth);
  const ref = death ? safeDate(death) : new Date();
  const years = ref.getFullYear() - b.getFullYear();
  const m = ref.getMonth() - b.getMonth();
  return String(m < 0 || (m === 0 && ref.getDate() < b.getDate()) ? years - 1 : years);
}

export function formatScore(home: number | null | undefined, away: number | null | undefined): string {
  if (home == null || away == null) return "— : —";
  return `${home} : ${away}`;
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("es-PE").format(n);
}
