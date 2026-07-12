/**
 * Repo-level React Doctor config.
 *
 * Scan each workspace project independently so every app/package is scored on
 * its own and picks up its local `doctor.config`. Without an explicit list,
 * React Doctor also scans the monorepo root as a catch-all "project", which
 * re-reports every app/package file WITHOUT its per-project config — producing
 * duplicate, unscoped findings. Non-React packages are detected and skipped.
 */
module.exports = {
  $schema: "https://react.doctor/schema/config.json",
  projects: [
    "apps/web",
    "apps/docs",
    "apps/native",
    "packages/motionwind",
    "packages/motionwind-react-native",
    "packages/ui",
  ],
};
