import fs from "fs";
import path from "path";
import {
  detectProjectType,
  detectPackageManager,
  type ProjectType,
} from "../utils/detect-project.js";
import { installDeps } from "../utils/install.js";
import { logger } from "../utils/logger.js";

function getNextJsConfig(): string {
  return `import withMotionwind from "motionwind/next";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withMotionwind(nextConfig);
`;
}

function getViteConfig(): string {
  return `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { motionwind } from "motionwind/vite";

export default defineConfig({
  plugins: [motionwind(), react()],
});
`;
}

function getBabelrc(): string {
  return JSON.stringify(
    {
      plugins: ["motionwind/babel"],
    },
    null,
    2,
  );
}

function printGettingStarted(projectType: ProjectType): void {
  logger.title("Getting started with motionwind");

  logger.info("Write Motion animations as Tailwind-like classes:");
  logger.blank();
  logger.dim(
    '  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg animate-hover:scale-110 animate-tap:scale-90 animate-spring">',
  );
  logger.dim("    Click Me!");
  logger.dim("  </button>");
  logger.blank();
  logger.info("The Babel plugin transforms this at build time into:");
  logger.blank();
  logger.dim('  <motion.button className="px-6 py-3 bg-indigo-600 text-white rounded-lg"');
  logger.dim('    whileHover={{ scale: 1.1 }}');
  logger.dim('    whileTap={{ scale: 0.9 }}');
  logger.dim('    transition={{ type: "spring" }}');
  logger.dim("  >");
  logger.dim("    Click Me!");
  logger.dim("  </motion.button>");
  logger.blank();

  if (projectType === "nextjs") {
    logger.info(
      "Your next.config.js has been updated with the motionwind wrapper.",
    );
  } else if (projectType === "vite") {
    logger.info(
      "Your vite.config.ts has been updated with the motionwind plugin.",
    );
  } else if (projectType === "cra") {
    logger.info("A .babelrc has been created with the motionwind plugin.");
  }

  logger.blank();
  logger.success("You're all set! Start your dev server and try it out.");
}

export function init(cwd: string): void {
  logger.title("motionwind init");

  // Detect project
  const projectType = detectProjectType(cwd);
  const packageManager = detectPackageManager(cwd);

  logger.step(`Detected project: ${projectType}`);
  logger.step(`Detected package manager: ${packageManager}`);

  if (projectType === "unknown") {
    logger.warn(
      "Could not detect project type. Please set up motionwind manually.",
    );
    logger.info("See: https://github.com/piyush/motionwind#manual-setup");
    return;
  }

  // Install dependencies
  logger.step("Installing dependencies...");
  const deps = ["motionwind", "motion"];
  installDeps(packageManager, deps, cwd);
  logger.success("Dependencies installed.");

  // Configure based on project type
  logger.step("Configuring project...");

  switch (projectType) {
    case "nextjs": {
      const configPath = path.join(cwd, "next.config.js");
      if (fs.existsSync(configPath)) {
        const existing = fs.readFileSync(configPath, "utf-8");
        if (existing.includes("motionwind")) {
          logger.info("next.config.js already configured.");
          break;
        }
      }
      fs.writeFileSync(configPath, getNextJsConfig());
      logger.success("Updated next.config.js");
      break;
    }

    case "vite": {
      const configPath = path.join(cwd, "vite.config.ts");
      if (fs.existsSync(configPath)) {
        const existing = fs.readFileSync(configPath, "utf-8");
        if (existing.includes("motionwind")) {
          logger.info("vite.config.ts already configured.");
          break;
        }
      }
      fs.writeFileSync(configPath, getViteConfig());
      logger.success("Updated vite.config.ts");
      break;
    }

    case "cra": {
      const babelrcPath = path.join(cwd, ".babelrc");
      if (fs.existsSync(babelrcPath)) {
        const existing = fs.readFileSync(babelrcPath, "utf-8");
        if (existing.includes("motionwind")) {
          logger.info(".babelrc already configured.");
          break;
        }
      }
      fs.writeFileSync(babelrcPath, getBabelrc());
      logger.success("Created .babelrc");
      break;
    }
  }

  printGettingStarted(projectType);
}
