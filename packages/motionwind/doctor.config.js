/**
 * React Doctor config for the `motionwind` library.
 *
 * These three rules are disabled deliberately, because they misfire on a
 * published component library (the transform + the `mw` runtime proxy). Every
 * other rule — including `deslop/unused-dependency`, which just caught and let
 * us drop an unused `@babel/generator` — stays enabled.
 *
 * - `deslop/unused-export`: the exported keyword sets in `src/constants.ts`
 *   (TRANSITION_KEYWORDS, VIEWPORT_KEYWORDS, DRAG_KEYWORDS, LAYOUT_KEYWORDS) are
 *   public API consumed by the VS Code extension via a cross-package import.
 *   Per-package dead-code analysis can't see those consumers, so it reports
 *   library API as unused.
 *
 * - `react-doctor/use-lazy-motion`: motionwind ships motion components (the `mw`
 *   proxy). Adopting `LazyMotion` internally would force every consumer into a
 *   LazyMotion context and silently break animations for anyone who doesn't
 *   provide one — bundling strategy is the app's choice, not the library's.
 *
 * - `react-doctor/require-reduced-motion`: motionwind emits standard Motion
 *   components, so `prefers-reduced-motion` is honored through the consumer's
 *   `MotionConfig` / Motion's built-in support. Forcing it in the transform
 *   layer would override consumer intent.
 */
export default {
  $schema: "https://react.doctor/schema/config.json",
  rules: {
    "deslop/unused-export": "off",
    "react-doctor/use-lazy-motion": "off",
    "react-doctor/require-reduced-motion": "off",
  },
};
