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

export interface TurbopackLoaderItem {
  loader: string;
  options?: Record<string, unknown>;
}

export interface TurbopackRuleConfig {
  loaders: TurbopackLoaderItem[];
  as?: string;
}

export interface NextConfig {
  webpack?: (
    config: WebpackConfig,
    context: { isServer: boolean },
  ) => WebpackConfig;
  turbopack?: {
    rules?: Record<string, TurbopackRuleConfig>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Wraps a Next.js config to add the motionwind Babel transform.
 * Works with both webpack and Turbopack (Next.js 15+).
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

  const babelLoaderOptions = {
    plugins: [babelPluginPath],
    parserOpts: {
      plugins: ["typescript", "jsx"],
    },
    configFile: false,
    babelrc: false,
  };

  // Merge Turbopack rules: add babel-loader for .tsx and .jsx files
  const existingTurbopack = nextConfig.turbopack ?? {};
  const existingRules = existingTurbopack.rules ?? {};

  const turbopackRules: Record<string, TurbopackRuleConfig> = {
    ...existingRules,
    "*.tsx": {
      loaders: [{ loader: "babel-loader", options: babelLoaderOptions }],
      as: "*.tsx",
      ...(existingRules["*.tsx"] ?? {}),
    },
    "*.jsx": {
      loaders: [{ loader: "babel-loader", options: babelLoaderOptions }],
      as: "*.jsx",
      ...(existingRules["*.jsx"] ?? {}),
    },
  };

  return {
    ...nextConfig,
    turbopack: {
      ...existingTurbopack,
      rules: turbopackRules,
    },
    webpack(config: WebpackConfig, context: { isServer: boolean }) {
      // Add babel-loader as a pre-processing rule for JSX/TSX files
      const rule: WebpackRule = {
        test: /\.(tsx|jsx)$/,
        enforce: "pre",
        use: [
          {
            loader: "babel-loader",
            options: babelLoaderOptions,
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
