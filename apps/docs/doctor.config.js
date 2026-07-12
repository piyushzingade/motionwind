/**
 * React Doctor config for the documentation site.
 *
 * The three rules below are disabled deliberately, with the reasoning inline:
 *
 * - `no-giant-component`: the TOC (an SVG progress-path renderer) and the
 *   feedback dialog (a single self-contained form) are cohesive,
 *   single-purpose components. Splitting them further would add indirection
 *   without improving clarity. (This rule is tagged `test-noise` upstream.)
 *
 * - `no-layout-property-animation`: the collapsible sidebar animates its
 *   `width` from 260 → 0 to *reclaim* horizontal layout space as it collapses.
 *   A `transform` can't reclaim layout space (it would only scale/translate the
 *   element while leaving its box in place), so the rule's suggested fix does
 *   not apply to this space-reclaiming collapse.
 *
 * - `dangerous-html-sink`: the only `dangerouslySetInnerHTML` in the app is the
 *   JSON-LD structured-data `<script>` in `app/layout.tsx`, whose content is a
 *   static object literal serialized with `JSON.stringify` — no user input.
 *   Injecting JSON-LD requires raw text, so the sink is unavoidable and safe.
 */
export default {
  $schema: "https://react.doctor/schema/config.json",
  rules: {
    "react-doctor/no-giant-component": "off",
    "react-doctor/no-layout-property-animation": "off",
    "react-doctor/dangerous-html-sink": "off",
  },
};
