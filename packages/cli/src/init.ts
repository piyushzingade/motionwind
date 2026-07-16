import path from "node:path";
import {
  applySetup,
  inspectProject,
  installPackages,
  planSetup,
  type Framework,
} from "./project.js";

const FRAMEWORKS = new Set<Framework>([
  "next",
  "react",
  "vue",
  "vanilla",
  "react-native",
]);

export function runInit(args: string[]): void {
  const dryRun = args.includes("--dry-run");
  const frameworkArg = args
    .find((arg) => arg.startsWith("--framework="))
    ?.split("=")[1];
  if (frameworkArg && !FRAMEWORKS.has(frameworkArg as Framework)) {
    throw new Error(
      `Unknown framework "${frameworkArg}". Use next, react, vue, vanilla, or react-native.`,
    );
  }

  const project = inspectProject(
    process.cwd(),
    frameworkArg as Framework | undefined,
  );
  const files = planSetup(project);

  console.log(`\nmotionwind init${dryRun ? " · dry run" : ""}\n`);
  console.log(`Framework: ${project.framework}`);
  console.log(`Package manager: ${project.packageManager}\n`);
  console.log(`→ ${installPackages(project, dryRun)}`);
  for (const file of files) {
    const symbol =
      file.status === "configured" ? "✓" : file.status === "manual" ? "!" : "+";
    console.log(
      `${symbol} ${path.relative(project.cwd, file.path)} — ${file.message}`,
    );
  }
  applySetup(files, dryRun);

  console.log(
    dryRun
      ? "\nNo files or dependencies were changed.\n"
      : "\nMotionwind is installed. Run create-motionwind doctor to verify the setup.\n",
  );
}
