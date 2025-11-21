# MotionWind - Turborepo Monorepo

A modern Turborepo monorepo for building animation utilities that bridge Tailwind CSS and animation libraries.

## What's inside?

This Turborepo includes the following packages and apps:

### Apps

- **`web`**: Next.js app running on port 3000 - main web application
- **`docs`**: Next.js app running on port 3001 - documentation site
- **`example`**: Bun-based example application with hot reload

### Packages

- **`core`**: Core utilities and shared functionality
- **`motionwind-css`**: CSS utilities for animations
- **`typescript-config`**: Shared TypeScript configurations used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Package Manager

This project uses [Bun](https://bun.sh/) (`v1.3.1`) as the package manager for fast installations and builds.

### Utilities

This Turborepo has the following tools already set up:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Bun](https://bun.sh/) for fast package management and runtime

## Getting Started

### Prerequisites

- Node.js >= 18
- Bun >= 1.3.1 (install via `curl -fsSL https://bun.sh/install | bash`)

### Installation

```bash
# Install dependencies
bun install
```

### Development

To develop all apps and packages:

```bash
# With global `turbo` installed (recommended)
turbo dev

# Without global `turbo`
bun run dev
```

This will start:
- `web` app on [http://localhost:3000](http://localhost:3000)
- `docs` app on [http://localhost:3001](http://localhost:3001)
- `example` app with hot reload

#### Develop Specific Apps

You can develop a specific package using [filters](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```bash
# Develop only the web app
turbo dev --filter=web

# Develop only the docs app
turbo dev --filter=docs

# Develop only the example app
turbo dev --filter=example
```

## Build

To build all apps and packages:

```bash
# With global `turbo` installed (recommended)
turbo build

# Without global `turbo`
bun run build
```

### Build Specific Apps

```bash
# Build only the web app
turbo build --filter=web

# Build only the docs app
turbo build --filter=docs

# Build only the example app
turbo build --filter=example
```

## Other Commands

### Type Checking

```bash
bun run check-types
```

### Linting

```bash
bun run lint
```

### Formatting

```bash
bun run format
```

## Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching:

1. Create a Vercel account at [vercel.com/signup](https://vercel.com/signup?utm_source=turborepo-examples)

2. Authenticate the Turborepo CLI:
```bash
turbo login
```

3. Link your Turborepo to Remote Cache:
```bash
turbo link
```

This will authenticate with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview) and enable remote caching.

## Project Structure

```
motionwind/
├── apps/
│   ├── web/          # Main Next.js app (port 3000)
│   ├── docs/         # Documentation Next.js app (port 3001)
│   └── example/      # Bun example app
├── packages/
│   ├── core/         # Core utilities
│   ├── motionwind-css/   # CSS animation utilities
│   └── typescript-config/ # Shared TS configs
├── package.json      # Root package configuration
└── turbo.json        # Turborepo configuration
```

## Useful Links

### Turborepo
- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

### Technologies
- [Bun Documentation](https://bun.sh/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
