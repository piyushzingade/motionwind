import { expect, test } from "playwright/test";

test("landing page keeps four focused chapters and demos", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Motion, written where your styles live.",
    }),
  ).toBeVisible();
  await expect(page.locator("[data-landing-section]")).toHaveCount(4);
  await expect(page.locator("[data-showcase-card]")).toHaveCount(4);
  await expect(page.locator("[data-preview-visual][inert]")).toHaveCount(4);
  await expect(
    page.getByText("Four demos. One motion language."),
  ).toBeVisible();
});

test("TOC marker and tail share the measured nested path", async ({ page }) => {
  await page.goto("/docs/animations/keyframes");

  const spine = page.locator(".toc-svg path");
  await expect(spine).toBeVisible();
  await expect(spine).toHaveAttribute("d", /L 28 /);

  await page.locator(".toc-link", { hasText: "Loading spinner" }).click();
  await expect(page.locator(".toc-active")).toHaveText("Loading spinner");

  const distances = await Promise.all(
    [page.getByTestId("toc-tail"), page.getByTestId("toc-marker")].map(
      (locator) =>
        locator.evaluate((element) => getComputedStyle(element).offsetDistance),
    ),
  );
  expect(distances[0]).toBe(distances[1]);
});

test("reduced motion keeps showcase cards static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const cards = page.locator("[data-showcase-card]");
  await expect(cards).toHaveCount(4);
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS("transform", "none");
    await expect(card).toHaveCSS("opacity", "1");
  }
});
