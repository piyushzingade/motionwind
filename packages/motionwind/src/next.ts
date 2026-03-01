import { createRequire } from "node:module";
import path from "path";

const _require = createRequire(import.meta.url);

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
  [key: string]: unknown;
}

/**
 * Wraps a Next.js config to add the motionwind Babel transform
 * as a webpack pre-processing step (runs before SWC).
 */
export function withMotionwind(nextConfig: NextConfig = {}): NextConfig {
  const originalWebpack = nextConfig.webpack;

  return {
    ...nextConfig,
    webpack(config: WebpackConfig, context: { isServer: boolean }) {
      // Add babel-loader as a pre-processing rule for JSX/TSX files
      const rule: WebpackRule = {
        test: /\.(tsx|jsx)$/,
        enforce: "pre",
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                path.resolve(
                  // Resolve to the built babel plugin
                  _require.resolve("motionwind/babel"),
                ),
              ],
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
