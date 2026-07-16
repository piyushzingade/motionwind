import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    babel: "src/babel.ts",
    next: "src/next.ts",
    vite: "src/vite.ts",
    parser: "src/parser.ts",
    tooling: "src/tooling.ts",
    adapter: "src/adapter.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  clean: true,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "motion",
    "next",
    "vite",
    "webpack",
    "babel-loader",
  ],
  treeshake: true,
  // Ensure CJS default exports work: require("motionwind/next") returns the function directly
  cjsInterop: true,
});
