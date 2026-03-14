import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { "client/extension": "src/client/extension.ts" },
    format: ["cjs"],
    outDir: "dist",
    clean: true,
    external: ["vscode"],
    sourcemap: true,
  },
  {
    entry: { "server/server": "src/server/server.ts" },
    format: ["cjs"],
    outDir: "dist",
    clean: false,
    noExternal: [/.*/],
    sourcemap: true,
  },
]);
