import { expect, test } from "playwright/test";

test("recipe selection keeps the workspace and URL in sync", async ({
  page,
}) => {
  await page.goto("/playground");

  await page.getByRole("button", { name: "Dialog entrance" }).click();

  await expect(page.locator("#studio-classes")).toHaveValue(
    /animate-duration-240/,
  );
  await expect(
    page.getByTestId("preview-viewport").getByRole("heading", {
      name: "Dialog entrance",
    }),
  ).toBeVisible();
  await expect(page.locator("#duration")).toHaveValue("240");
  await expect(page).toHaveURL(/text=Dialog\+entrance/);
  await expect(page.getByTestId("generated-code")).toContainText(
    "Dialog entrance",
  );
});

test("search and category filters combine and recover from no results", async ({
  page,
}) => {
  await page.goto("/playground");

  await page.getByRole("searchbox", { name: "Search recipes" }).fill("tooltip");
  await expect(page.getByText("1 of 30 recipes")).toBeVisible();
  await expect(page.getByRole("button", { name: "Tooltip pop" })).toBeVisible();

  await page.getByRole("button", { name: "Loading", exact: true }).click();
  await expect(page.getByText("No recipes found")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText("30 of 30 recipes")).toBeVisible();
});

test("timeline and shareable preferences use exact state", async ({ page }) => {
  await page.goto("/playground");

  await page.locator("#delay").fill("400");
  await expect(page.getByTestId("timeline")).toContainText("700ms");

  await page.getByRole("button", { name: /phone preview/ }).click();
  await page.getByRole("button", { name: "Full motion" }).click();
  await expect(page.getByTestId("timeline-playhead")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await expect(page).toHaveURL(/stage=phone&motion=reduced/);

  await page.reload();
  await expect(
    page.getByRole("button", { name: /phone preview/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Reduced" })).toBeVisible();
});

test("recipes render dedicated preview scenes, not a bare button", async ({
  page,
}) => {
  await page.goto("/playground");
  const viewport = page.getByTestId("preview-viewport");

  await page.getByRole("button", { name: "Progress bar" }).click();
  await expect(
    viewport.getByRole("progressbar", { name: "Progress bar" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "SVG line loader" }).click();
  await expect(viewport.locator("svg path").first()).toBeVisible();
  await expect(viewport.getByText("SVG line loader").first()).toBeVisible();

  await page.getByRole("button", { name: "Stepper" }).click();
  await expect(viewport.getByText("Build")).toBeVisible();
  await expect(viewport.getByText("Ship")).toBeVisible();

  await page.getByRole("button", { name: "Skeleton pulse" }).click();
  await expect(viewport.getByLabel("Loading content")).toHaveAttribute(
    "aria-busy",
    "true",
  );
});

test("mobile drawer and feedback dialog manage focus and validation", async ({
  page,
  request,
}) => {
  const invalidResponse = await request.post("/api/feedback", {
    data: { type: "Invalid", message: "Hello" },
  });
  expect(invalidResponse.status()).toBe(400);
  const missingConfigurationResponse = await request.post("/api/feedback", {
    data: { type: "Question", message: "Can I use this in Vue?" },
  });
  expect(missingConfigurationResponse.status()).toBe(503);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/playground");
  await page.getByRole("button", { name: "Toggle recipe sidebar" }).click();
  await expect(
    page.getByRole("dialog", { name: "Animation recipes" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Animation recipes" }),
  ).toBeHidden();

  await page.getByRole("button", { name: "Toggle recipe sidebar" }).click();
  const feedbackTrigger = page.getByRole("button", { name: "Send feedback" });
  await feedbackTrigger.click();
  const feedbackDialog = page.getByRole("dialog", { name: "Send feedback" });
  await expect(feedbackDialog).toBeVisible();
  await expect(feedbackDialog.getByLabel("Message")).toBeFocused();
  await expect(
    feedbackDialog.getByRole("button", { name: "Send feedback" }),
  ).toBeDisabled();
  await feedbackDialog
    .getByLabel("Message")
    .fill("The timeline is very clear.");
  await expect(
    feedbackDialog.getByRole("button", { name: "Send feedback" }),
  ).toBeEnabled();
  await page.keyboard.press("Escape");
  await expect(feedbackDialog).toBeHidden();
});
