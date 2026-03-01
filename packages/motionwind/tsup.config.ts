import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    babel: "src/babel.ts",
    next: "src/next.ts",
    vite: "src/vite.ts",
    parser: "src/parser.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  clean: true,
  external: ["react", "react-dom", "motion", "next", "vite", "webpack"],
  treeshake: true,
});
