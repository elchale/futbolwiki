/**
 * Spanish-aware slug helper. Removes diacritics, replaces ñ → n,
 * collapses non-alphanumerics into single hyphens.
 *
 *   slugify("Selección Peruana") → "seleccion-peruana"
 *   slugify("U. de Chile")       → "u-de-chile"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
