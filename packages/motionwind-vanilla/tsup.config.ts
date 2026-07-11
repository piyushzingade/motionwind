import { defineConfig } from "tsup";

export default defineConfig([
  // npm build — Motion stays an external peer dependency.
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    external: ["motion"],
    cjsInterop: true,
  },
  // CDN build — bundle Motion + core into a single self-contained IIFE.
  {
    entry: { motionwind: "src/cdn.ts" },
    format: ["iife"],
    globalName: "motionwind",
    minify: true,
    outDir: "dist/cdn",
    noExternal: ["motion", "motionwind-core"],
    // Raw-browser bundle: replace process.env.NODE_ENV so neither our parser's
    // dev warnings nor Motion reference the (undefined) `process` global.
    define: { "process.env.NODE_ENV": '"production"' },
  },
]);
