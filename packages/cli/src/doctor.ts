import fs from "node:fs";
import path from "node:path";
import { FRAMEWORK_PACKAGES, inspectProject, planSetup } from "./project.js";

export interface DoctorCheck {
  name: string;
  ok: boolean;
  message: string;
}

export function inspectMotionwindProject(cwd = process.cwd()): DoctorCheck[] {
  const project = inspectProject(cwd);
  const installed = new Set([
    ...Object.keys(project.packageJson.dependencies ?? {}),
    ...Object.keys(project.packageJson.devDependencies ?? {}),
  ]);
  const checks: DoctorCheck[] = [
    {
      name: "package.json",
      ok: fs.existsSync(path.join(cwd, "package.json")),
      message: "A package.json is required at the project root.",
    },
    ...FRAMEWORK_PACKAGES[project.framework].map((name) => ({
      name: `dependency:${name}`,
      ok: installed.has(name),
      message: installed.has(name)
        ? `${name} is installed.`
        : `Install ${name}.`,
    })),
  ];

  for (const file of planSetup(project)) {
    checks.push({
      name: `config:${path.basename(file.path)}`,
      ok:
        file.status !== "manual" &&
        (file.status === "configured" || fs.existsSync(file.path)),
      message: file.message,
    });
  }
  return checks;
}

export function runDoctor(): void {
  const checks = inspectMotionwindProject();
  console.log("\nmotionwind doctor\n");
  for (const check of checks)
    console.log(`${check.ok ? "✓" : "✗"} ${check.message}`);
  const failures = checks.filter((check) => !check.ok);
  console.log(
    failures.length
      ? `\n${failures.length} issue(s) need attention.\n`
      : "\nEverything looks healthy.\n",
  );
  if (failures.length) process.exitCode = 1;
}
