# Motionwind recipe registry

The registry is intentionally GitHub-backed: no accounts, private API, or custom backend are required. Each recipe is a reviewed JSON manifest under `recipes/` and becomes available to Motionwind Studio and `create-motionwind add` after release.

## Submit a recipe

1. Copy an existing manifest and choose a unique kebab-case `id`.
2. Include accessibility guidance, supported adapters, compatibility, source, maintainer, and bundle impact.
3. Run `bun run registry:check`.
4. Open a pull request with a preview or test fixture.

Registry changes require compatibility and security review through CODEOWNERS. Recipes must use public Motionwind syntax and must not execute install hooks or arbitrary code.
