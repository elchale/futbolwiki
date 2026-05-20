import { describe, expect, it } from "vitest";
import { formatScore, formatNumber, formatYear } from "@/lib/format";

describe("format.formatScore", () => {
  it("renders both scores", () => {
    expect(formatScore(2, 1)).toBe("2 : 1");
  });
  it("renders dashes when null", () => {
    expect(formatScore(null, null)).toBe("— : —");
    expect(formatScore(undefined, undefined)).toBe("— : —");
  });
});

describe("format.formatNumber", () => {
  it("formats with locale separator", () => {
    expect(formatNumber(50000).replace(/ |\s/g, "")).toBe("50,000");
  });
  it("returns dash for null/undefined", () => {
    expect(formatNumber(null)).toBe("—");
    expect(formatNumber(undefined)).toBe("—");
  });
});

describe("format.formatYear", () => {
  it("extracts year from Date", () => {
    expect(formatYear(new Date("2022-12-18T00:00:00Z"))).toBe("2022");
  });
  it("returns dash for null", () => {
    expect(formatYear(null)).toBe("—");
  });
});
