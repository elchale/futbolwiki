import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("lowercases and replaces spaces", () => {
    expect(slugify("Alianza Lima")).toBe("alianza-lima");
  });
  it("strips diacritics including ñ", () => {
    expect(slugify("Selección Peruana")).toBe("seleccion-peruana");
    expect(slugify("FBC Melgar")).toBe("fbc-melgar");
  });
  it("collapses non-alphanumerics into single hyphens", () => {
    expect(slugify("U. de Chile (1927)")).toBe("u-de-chile-1927");
  });
  it("trims hyphens at edges", () => {
    expect(slugify("  -- Test -- ")).toBe("test");
  });
  it("handles empty strings", () => {
    expect(slugify("")).toBe("");
  });
});
