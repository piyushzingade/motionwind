import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    vite: "src/vite.ts",
    adapter: "src/adapter.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["vue", "motion-v", "@vue/compiler-core"],
  cjsInterop: true,
});
