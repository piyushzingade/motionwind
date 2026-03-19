/**
 * Babel plugin for React Native.
 *
 * Transforms motionwind className strings into Reanimated-compatible
 * animated components at build time, working with Metro bundler.
 *
 * This is a lighter version of the web Babel plugin — it:
 * 1. Detects RN components with `animate-*` in className
 * 2. Replaces them with their Animated equivalents
 * 3. Injects useMotionwind hook calls
 *
 * Usage in babel.config.js:
 * ```js
 * module.exports = {
 *   plugins: ['motionwind-react-native/babel'],
 * };
 * ```
 */
export default function motionwindReactNativeBabelPlugin() {
  return {
    name: "motionwind-react-native",
    visitor: {
      // Placeholder — the runtime approach via mw.* proxy is the primary
      // integration path for React Native. Build-time transform can be
      // added in a future iteration for advanced optimization.
      Program() {
        // No-op for now. Users should use the runtime `mw.*` components.
      },
    },
  };
}
