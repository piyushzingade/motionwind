import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    vite: "src/vite.ts",
    rollup: "src/rollup.ts",
    webpack: "src/webpack.ts",
    rspack: "src/rspack.ts",
    esbuild: "src/esbuild.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["unplugin", "@babel/core", "motionwind-react/babel"],
  cjsInterop: true,
});
