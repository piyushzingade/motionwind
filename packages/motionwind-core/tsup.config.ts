import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    parser: "src/parser.ts",
    config: "src/config.ts",
    registry: "src/registry.ts",
    adapter: "src/adapter.ts",
    recipes: "src/recipes.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  cjsInterop: true,
});
