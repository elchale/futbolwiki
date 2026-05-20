import { test, expect } from "@playwright/test";

test.describe("smoke — happy paths", () => {
  test("home renders hero + upcoming matches section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/enciclopedia/i);
    await expect(page.getByText("Próximos partidos")).toBeVisible();
  });

  test("partidos list page renders", async ({ page }) => {
    await page.goto("/partidos");
    await expect(page.getByRole("heading", { name: "Partidos" })).toBeVisible();
  });

  test("equipo detail page renders with founded year", async ({ page }) => {
    await page.goto("/equipos/alianza-lima");
    await expect(page.getByRole("heading", { name: /Club Alianza Lima/ })).toBeVisible();
    await expect(page.getByText("1901")).toBeVisible();
  });

  test("plantilla shows squad", async ({ page }) => {
    await page.goto("/equipos/alianza-lima/plantilla");
    await expect(page.getByText(/Paolo Guerrero/i)).toBeVisible();
  });

  test("jugador detail page renders", async ({ page }) => {
    await page.goto("/jugadores/paolo-guerrero");
    await expect(page.getByRole("heading", { name: /Paolo Guerrero/ })).toBeVisible();
  });

  test("liga detail page renders standings table", async ({ page }) => {
    await page.goto("/ligas/liga-1-peru");
    await expect(page.getByRole("heading", { name: /Liga 1/ })).toBeVisible();
  });

  test("world cup 2022 edition renders Argentina as champion", async ({ page }) => {
    await page.goto("/torneos/copa-mundial-fifa/ediciones/2022");
    await expect(page.getByText("Argentina")).toBeVisible();
  });

  test("selección peruana shows Blanquirroja", async ({ page }) => {
    await page.goto("/selecciones/seleccion-peruana");
    await expect(page.getByText("La Blanquirroja")).toBeVisible();
  });

  test("search finds Alianza Lima", async ({ page }) => {
    await page.goto("/buscar?q=alianza");
    await expect(page.getByText(/Resultados para "alianza"/i)).toBeVisible();
    await expect(page.getByText("Alianza Lima")).toBeVisible();
  });

  test("sobre page renders", async ({ page }) => {
    await page.goto("/sobre");
    await expect(page.getByRole("heading", { name: /Sobre el proyecto/ })).toBeVisible();
  });
});

test.describe("smoke — 404 paths", () => {
  test("non-existent team returns 404", async ({ page }) => {
    const response = await page.goto("/equipos/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("non-existent player returns 404", async ({ page }) => {
    const response = await page.goto("/jugadores/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});

test.describe("layout smoke at multiple viewports", () => {
  for (const width of [375, 768, 1280, 1536] as const) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
    });
  }
});

test.describe("dark mode", () => {
  test("toggling theme switches body background tokens", async ({ page }) => {
    await page.goto("/");
    // initial render — light by default
    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    // toggle to dark via the dropdown
    await page.getByRole("button", { name: /Cambiar tema/i }).click();
    await page.getByRole("menuitem", { name: /Modo oscuro/i }).click();
    await page.waitForTimeout(150);
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(darkBg).not.toBe(lightBg);
  });
});
