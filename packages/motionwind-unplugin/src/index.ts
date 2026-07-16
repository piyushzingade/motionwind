import { transformSync } from "@babel/core";
import { createUnplugin } from "unplugin";
import motionwindBabelPlugin from "motionwind-react/babel";
import type { MotionwindConfig } from "motionwind-core";

export interface MotionwindUnpluginOptions {
  config?: MotionwindConfig;
  include?: RegExp;
}

export const motionwindUnplugin = createUnplugin<
  MotionwindUnpluginOptions | undefined
>((options = {}) => ({
  name: "motionwind",
  enforce: "pre",
  transformInclude(id) {
    return (options.include ?? /\.[jt]sx$/).test(id);
  },
  transform(code, id) {
    if (!code.includes("animate-")) return null;
    const result = transformSync(code, {
      plugins: [
        [motionwindBabelPlugin, options.config ?? {}],
        "@babel/plugin-syntax-jsx",
      ],
      parserOpts: id.endsWith(".tsx")
        ? { plugins: ["typescript", "jsx"] }
        : undefined,
      filename: id,
      configFile: false,
      babelrc: false,
      sourceMaps: true,
    });
    return result?.code ? { code: result.code, map: result.map } : null;
  },
}));

export const vite = motionwindUnplugin.vite;
export const rollup = motionwindUnplugin.rollup;
export const webpack = motionwindUnplugin.webpack;
export const rspack = motionwindUnplugin.rspack;
export const esbuild = motionwindUnplugin.esbuild;

export default motionwindUnplugin;
