import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    parser: "src/parser.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  treeshake: true,
  cjsInterop: true,
});
