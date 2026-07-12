/**
 * React Doctor config for the marketing site.
 *
 * `no-giant-component` is disabled deliberately: the landing page
 * (`app/page.tsx`) is an intentionally single-file marketing composition read
 * top-to-bottom as one narrative. The rule is a subjective maintainability
 * heuristic (tagged `test-noise` upstream); fragmenting the page into arbitrary
 * sub-components would add indirection without improving clarity. Every other
 * rule — including all accessibility and correctness rules — stays enabled.
 */
export default {
  $schema: "https://react.doctor/schema/config.json",
  rules: {
    "react-doctor/no-giant-component": "off",
  },
};
