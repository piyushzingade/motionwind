import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts", vite: "src/vite.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["vue", "motion-v", "@vue/compiler-core"],
  cjsInterop: true,
});
