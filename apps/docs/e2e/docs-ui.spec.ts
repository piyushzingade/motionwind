import { expect, test } from "playwright/test";

test("landing camera showcases non-interactive Motionwind demos", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Motion as utility classes." }),
  ).toBeVisible();
  await expect(page.locator("[data-stage-card]")).toHaveCount(16);
  await expect(
    page.locator('[data-stage-card][data-active="true"]'),
  ).toHaveCount(1);

  const stage = page.getByTestId("motion-stage");
  await expect(stage).toHaveAttribute("aria-hidden", "true");
  await expect(stage).toHaveAttribute("inert", "");
  await expect(stage).toHaveCSS("pointer-events", "none");

  const canvas = page.getByTestId("motion-stage-canvas");
  const initialTransform = await canvas.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.waitForTimeout(5200);
  await expect
    .poll(() =>
      canvas.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(initialTransform);
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

test("reduced motion keeps the landing camera static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const canvas = page.getByTestId("motion-stage-canvas");
  const initialTransform = await canvas.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.waitForTimeout(5200);
  await expect(canvas).toHaveCSS("transform", initialTransform);
});
