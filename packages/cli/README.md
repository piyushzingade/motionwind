# create-motionwind v2

Initialize, diagnose, migrate, and extend Motionwind projects.

```bash
npx create-motionwind@2 init --dry-run
npx create-motionwind@2 init
npx create-motionwind@2 doctor
npx create-motionwind@2 migrate src --write
npx create-motionwind@2 add button-press
```

`init` detects Next.js, React/Vite, Vue/Nuxt, vanilla JavaScript, React Native,
or Expo and npm, pnpm, Yarn, or Bun. It installs the matching v2 adapter and
peers, creates `motionwind.config.ts`, and preserves existing integration files
it cannot edit safely. `--dry-run` performs no writes and no installation.

`doctor` checks framework, package manager, dependencies, configuration, and
build integration. `migrate` converts supported Motion props into utility
classes. `add` installs a reviewed preset into CLI-managed configuration or
prints a safe manual snippet for user-managed configuration.

MIT

