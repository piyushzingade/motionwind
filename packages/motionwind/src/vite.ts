import { transformSync } from "@babel/core";
import motionwindBabelPlugin from "./babel.js";

interface VitePlugin {
  name: string;
  enforce?: "pre" | "post";
  transform?: (
    code: string,
    id: string,
  ) => { code: string; map: unknown } | null;
}

/**
 * Vite plugin that runs the motionwind Babel transform
 * on JSX/TSX files.
 */
export function motionwind(): VitePlugin {
  return {
    name: "motionwind",
    enforce: "pre",
    transform(code: string, id: string) {
      // Only process JSX/TSX files
      if (!/\.[jt]sx$/.test(id)) return null;

      // Quick check: skip files that don't contain animate-
      if (!code.includes("animate-")) return null;

      const isTsx = /\.tsx$/.test(id);

      const result = transformSync(code, {
        plugins: [motionwindBabelPlugin, "@babel/plugin-syntax-jsx"],
        parserOpts: isTsx
          ? { plugins: ["typescript", "jsx"] }
          : undefined,
        filename: id,
        configFile: false,
        babelrc: false,
        sourceMaps: true,
      });

      if (!result || !result.code) return null;

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}

export default motionwind;
