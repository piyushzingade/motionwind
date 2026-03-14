import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

export interface WebpackRule {
  test?: RegExp;
  use?: Array<{
    loader: string;
    options?: Record<string, unknown>;
  }>;
  enforce?: "pre" | "post";
}

export interface WebpackConfig {
  module?: {
    rules?: WebpackRule[];
  };
}

export interface NextConfig {
  webpack?: (
    config: WebpackConfig,
    context: { isServer: boolean },
  ) => WebpackConfig;
  turbopack?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Wraps a Next.js config to add the motionwind Babel transform
 * as a webpack pre-processing step (runs before SWC).
 */
export function withMotionwind(nextConfig: NextConfig = {}): NextConfig {
  const originalWebpack = nextConfig.webpack;

  // Resolve the babel plugin path relative to this file (both live in dist/)
  // so it works regardless of the published package name.
  const babelPluginPath = fileURLToPath(
    new URL("./babel.cjs", import.meta.url),
  );

  if (!existsSync(babelPluginPath)) {
    throw new Error(
      `[motionwind] babel.cjs not found at ${babelPluginPath}. ` +
        `This usually means the package was not installed correctly. ` +
        `Try removing node_modules and reinstalling.`,
    );
  }

  let turbopackWarned = false;

  return {
    ...nextConfig,
    // Provide a turbopack config to suppress the Next.js 15+ warning about
    // having a webpack config without a turbopack config. The actual Babel
    // transform only runs under webpack; use `next dev --webpack` for now.
    turbopack: nextConfig.turbopack ?? {},
    webpack(config: WebpackConfig, context: { isServer: boolean }) {
      // Warn once if Turbopack is detected (webpack callback still fires for server builds)
      if (!turbopackWarned && process.env.TURBOPACK === "1") {
        turbopackWarned = true;
        console.warn(
          "[motionwind] Turbopack does not support Babel transforms. " +
            "motionwind classes will NOT be compiled. " +
            "Use `next dev --webpack` or `next build` instead.",
        );
      }
      // Add babel-loader as a pre-processing rule for JSX/TSX files
      const rule: WebpackRule = {
        test: /\.(tsx|jsx)$/,
        enforce: "pre",
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [babelPluginPath],
              // Enable TypeScript + JSX parsing without extra packages
              parserOpts: {
                plugins: ["typescript", "jsx"],
              },
              // Don't look for .babelrc files
              configFile: false,
              babelrc: false,
            },
          },
        ],
      };

      if (!config.module) config.module = {};
      if (!config.module.rules) config.module.rules = [];
      config.module.rules.push(rule);

      if (originalWebpack) {
        return originalWebpack(config, context);
      }
      return config;
    },
  };
}

export default withMotionwind;
