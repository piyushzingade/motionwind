import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    parser: "src/parser.ts",
    babel: "src/babel.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  clean: true,
  external: [
    "react",
    "react-native",
    "react-native-reanimated",
    "nativewind",
  ],
  treeshake: true,
  cjsInterop: true,
});
