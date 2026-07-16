import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";

const starter = process.argv[2];
const browserCheck = process.argv.includes("--browser");
const root = path.resolve(import.meta.dir, "..");
const supported = new Set([
  "next",
  "react-vite",
  "vue-vite",
  "nuxt",
  "vanilla",
  "expo",
]);
type BrowserScenario =
  | "variant"
  | "layout"
  | "drag"
  | "inview"
  | "scroll"
  | "svg";
const compatibilityMatrix = JSON.parse(
  fs.readFileSync(
    path.join(root, "fixtures", "compatibility-matrix.json"),
    "utf8",
  ),
) as {
  frameworks: Record<string, { browserScenarios: readonly BrowserScenario[] }>;
};
const browserScenarios = Object.fromEntries(
  Object.entries(compatibilityMatrix.frameworks).map(([framework, entry]) => [
    framework,
    entry.browserScenarios,
  ]),
) as Record<string, readonly BrowserScenario[]>;
if (!starter || !supported.has(starter)) {
  throw new Error(`Choose a starter: ${[...supported].join(", ")}`);
}

const packageDirectories: Record<string, string> = {
  "motionwind-core": "motionwind-core",
  "motionwind-react": "motionwind",
  "motionwind-vue": "motionwind-vue",
  "motionwind-vanilla": "motionwind-vanilla",
  "motionwind-react-native": "motionwind-react-native",
};
const temporary = fs.mkdtempSync(
  path.join(os.tmpdir(), `motionwind-${starter}-`),
);
const application = path.join(temporary, "app");
const artifacts = path.join(temporary, "artifacts");

async function waitForServer(url: string): Promise<void> {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The preview process is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`${starter}: preview did not become ready`);
}

async function verifyInBrowser(): Promise<void> {
  const port = 4300 + (process.pid % 1000);
  const url = `http://127.0.0.1:${port}`;
  let preview: ChildProcess | undefined;
  let staticServer: ReturnType<typeof Bun.serve> | undefined;

  if (["react-vite", "vue-vite", "vanilla", "expo"].includes(starter!)) {
    const directory = path.join(application, "dist");
    staticServer = Bun.serve({
      hostname: "127.0.0.1",
      port,
      async fetch(request) {
        const pathname = decodeURIComponent(new URL(request.url).pathname);
        let file = path.resolve(directory, `.${pathname}`);
        if (
          !file.startsWith(directory) ||
          !fs.existsSync(file) ||
          fs.statSync(file).isDirectory()
        ) {
          file = path.join(directory, "index.html");
        }
        return new Response(Bun.file(file));
      },
    });
  } else {
    const args =
      starter === "next"
        ? ["run", "start", "--", "-H", "127.0.0.1", "-p", String(port)]
        : ["run", "preview"];
    preview = spawn("npm", args, {
      cwd: application,
      env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
      stdio: "inherit",
    });
  }

  try {
    await waitForServer(url);
    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext({
        reducedMotion: "no-preference",
      });
      const page = await context.newPage();
      const runtimeErrors: string[] = [];
      page.on("pageerror", (error) => runtimeErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") runtimeErrors.push(message.text());
      });

      await page.goto(url, { waitUntil: "networkidle" });
      const control = page.locator('[data-testid="motionwind-e2e"]');
      await control.waitFor({ state: "visible" });
      const semantics = await control.evaluate((element) => ({
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute("role"),
      }));
      if (semantics.tag !== "button" && semantics.role !== "button") {
        throw new Error(
          `${starter}: interaction fixture lost button semantics`,
        );
      }

      const scenarios = browserScenarios[starter!] ?? [];
      for (const scenario of scenarios) {
        const fixture = page.locator(`[data-testid="motionwind-${scenario}"]`);
        if ((await fixture.count()) !== 1) {
          throw new Error(
            `${starter}: missing required ${scenario} browser fixture`,
          );
        }
      }

      const waitForScale = async (expected: number, interaction: string) => {
        try {
          await page.waitForFunction(
            (targetScale) => {
              const element = document.querySelector(
                '[data-testid="motionwind-e2e"]',
              );
              if (!element) return false;
              const transform = getComputedStyle(element).transform;
              const scale =
                transform === "none" ? 1 : new DOMMatrixReadOnly(transform).a;
              return Math.abs(scale - targetScale) < 0.015;
            },
            expected,
            { timeout: 3000 },
          );
        } catch {
          throw new Error(
            `${starter}: ${interaction} did not reach scale ${expected}`,
          );
        }
      };

      await control.focus();
      await waitForScale(1.02, "keyboard focus");
      await control.evaluate((element) => (element as HTMLElement).blur());
      await page.mouse.move(0, 0);
      await waitForScale(1, "focus reset");
      await control.hover();
      await waitForScale(1.05, "hover");
      const box = await control.boundingBox();
      if (!box || box.width <= 0 || box.height <= 0) {
        throw new Error(`${starter}: interaction fixture has no rendered box`);
      }
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await waitForScale(0.95, "press");
      await page.mouse.up();
      await control.press("Enter");

      if (scenarios.includes("variant")) {
        await page.waitForFunction(() => {
          const element = document.querySelector(
            '[data-testid="motionwind-variant"]',
          );
          return element && Number(getComputedStyle(element).opacity) > 0.95;
        });
      }

      if (scenarios.includes("layout")) {
        await page.locator('[data-testid="motionwind-layout-toggle"]').click();
        await page.waitForFunction(() => {
          const element = document.querySelector(
            '[data-testid="motionwind-layout"]',
          );
          return element && getComputedStyle(element).transform !== "none";
        });
      }

      if (scenarios.includes("drag")) {
        const drag = page.locator('[data-testid="motionwind-drag"]');
        const dragBox = await drag.boundingBox();
        if (!dragBox)
          throw new Error(`${starter}: drag fixture is not visible`);
        await page.mouse.move(
          dragBox.x + dragBox.width / 2,
          dragBox.y + dragBox.height / 2,
        );
        await page.mouse.down();
        await page.mouse.move(
          dragBox.x + dragBox.width / 2 + 72,
          dragBox.y + dragBox.height / 2,
          { steps: 6 },
        );
        await page.waitForFunction(() => {
          const element = document.querySelector(
            '[data-testid="motionwind-drag"]',
          );
          return element && getComputedStyle(element).transform !== "none";
        });
        await page.mouse.up();
      }

      if (scenarios.includes("svg")) {
        await page.waitForFunction(() => {
          const element = document.querySelector(
            '[data-testid="motionwind-svg"]',
          ) as SVGPathElement | null;
          if (!element) return false;
          const dash =
            element.style.strokeDasharray ||
            getComputedStyle(element).strokeDasharray;
          return Boolean(dash && dash !== "none");
        });
      }

      let scrollScaleBefore: number | undefined;
      if (scenarios.includes("scroll")) {
        scrollScaleBefore = await page
          .locator('[data-testid="motionwind-scroll"]')
          .evaluate((element) => {
            const transform = getComputedStyle(element).transform;
            return transform === "none"
              ? 1
              : new DOMMatrixReadOnly(transform).a;
          });
      }

      if (scenarios.includes("inview")) {
        const inView = page.locator('[data-testid="motionwind-inview"]');
        const initialOpacity = await inView.evaluate((element) =>
          Number(getComputedStyle(element).opacity),
        );
        if (initialOpacity > 0.1) {
          throw new Error(
            `${starter}: in-view fixture entered before reaching the viewport`,
          );
        }
        await inView.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => {
          const element = document.querySelector(
            '[data-testid="motionwind-inview"]',
          );
          return element && Number(getComputedStyle(element).opacity) > 0.95;
        });
      }

      if (scenarios.includes("scroll")) {
        await page.waitForTimeout(100);
        const scrollScaleAfter = await page
          .locator('[data-testid="motionwind-scroll"]')
          .evaluate((element) => {
            const transform = getComputedStyle(element).transform;
            return transform === "none"
              ? 1
              : new DOMMatrixReadOnly(transform).a;
          });
        if (
          scrollScaleBefore === undefined ||
          Math.abs(scrollScaleAfter - scrollScaleBefore) < 0.1
        ) {
          throw new Error(`${starter}: scroll progress did not update`);
        }
      }

      if (runtimeErrors.length > 0) {
        throw new Error(
          `${starter}: browser or hydration errors:\n${runtimeErrors.join("\n")}`,
        );
      }
      await context.close();

      const reducedContext = await browser.newContext({
        reducedMotion: "reduce",
      });
      const reducedPage = await reducedContext.newPage();
      const reducedErrors: string[] = [];
      reducedPage.on("pageerror", (error) => reducedErrors.push(error.message));
      await reducedPage.goto(url, { waitUntil: "networkidle" });
      const reducedControl = reducedPage.locator(
        '[data-testid="motionwind-e2e"]',
      );
      await reducedControl.focus();
      await reducedControl.hover();
      await reducedPage.waitForTimeout(180);
      const reducedScale = await reducedControl.evaluate((element) => {
        const transform = getComputedStyle(element).transform;
        if (transform === "none") return 1;
        return new DOMMatrixReadOnly(transform).a;
      });
      if (Math.abs(reducedScale - 1) > 0.01) {
        throw new Error(
          `${starter}: reduced motion still applied scale ${reducedScale}`,
        );
      }
      if (reducedErrors.length > 0) {
        throw new Error(
          `${starter}: reduced-motion browser errors:\n${reducedErrors.join("\n")}`,
        );
      }
      await reducedContext.close();
    } finally {
      await browser.close();
    }
  } finally {
    preview?.kill("SIGTERM");
    staticServer?.stop(true);
  }
}

try {
  fs.mkdirSync(artifacts);
  fs.cpSync(path.join(root, "starters", starter), application, {
    recursive: true,
  });
  const manifestPath = path.join(application, "package.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  for (const section of ["dependencies", "devDependencies"] as const) {
    for (const name of Object.keys(manifest[section] ?? {})) {
      const directory = packageDirectories[name];
      if (!directory) continue;
      const output = execFileSync(
        "npm",
        ["pack", "--json", "--pack-destination", artifacts],
        { cwd: path.join(root, "packages", directory), encoding: "utf8" },
      );
      const [{ filename }] = JSON.parse(output) as [{ filename: string }];
      manifest[section][name] = `file:${path.join(artifacts, filename)}`;
    }
  }
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  execFileSync("npm", ["install", "--legacy-peer-deps"], {
    cwd: application,
    stdio: "inherit",
  });
  execFileSync("npm", ["audit", "--audit-level=high"], {
    cwd: application,
    stdio: "inherit",
  });
  if (starter !== "expo") {
    execFileSync("npm", ["run", "build"], {
      cwd: application,
      stdio: "inherit",
    });
  } else if (browserCheck) {
    execFileSync(
      "npx",
      ["expo", "export", "--platform", "web", "--output-dir", "dist"],
      {
        cwd: application,
        stdio: "inherit",
      },
    );
  }
  if (browserCheck) await verifyInBrowser();
  console.log(`✓ ${starter} installed from packed Motionwind v2 artifacts`);
} finally {
  if (process.env.MOTIONWIND_KEEP_TEMP) {
    console.log(`Kept starter fixture at ${temporary}`);
  } else {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
