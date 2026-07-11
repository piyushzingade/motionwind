import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    // ESLint rule visitors operate on JSX AST nodes that ESLint's own types
    // don't model, so `any` node params are idiomatic here.
    files: ["src/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
