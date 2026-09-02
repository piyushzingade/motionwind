# Contributing to Motionwind

Motionwind welcomes code, documentation, recipes, adapters, diagnostics, and
design feedback. Start with an issue or Discussion when a change introduces new
syntax or a public API.

All spaces follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). We expect every
participant to make interactions respectful, constructive, and harassment-free.

## Good first contributions

Find bounded, triaged starter tasks by filtering issues for the
[`good first issue` label](https://github.com/piyushzingade/motionwind/labels/good%20first%20issue).
Each task links a clear, owner-independent acceptance test so you can verify
your work without private infrastructure. Say that you are picking one up on the
issue before you start, and keep the change scoped to that task.

## Local setup

```bash
bun install
bun run build
bun run test
bun run lint
bun run check-types
```

Published-package changes require `bunx changeset`. Keep the framework-agnostic
core dependency-free, update the golden syntax tests, and document adapter
support explicitly. Never silently discard unsupported behavior.

## Pull requests

- Keep one behavior change per PR.
- Include tests and docs for user-visible behavior.
- Preserve direct Motion APIs as the escape hatch for imperative or uncommon cases.
- Validate keyboard access and `prefers-reduced-motion` where interaction changes.
- Do not add an official adapter without a named maintainer and compatibility fixtures.

See [GOVERNANCE.md](GOVERNANCE.md) for the contributor ladder and
[SUPPORT.md](SUPPORT.md) for platform tiers.
