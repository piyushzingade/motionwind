import type { ESLint, Linter, Rule } from "eslint";
import noUnknownClasses from "./rules/no-unknown-classes.js";
import noDuplicateGestureProps from "./rules/no-duplicate-gesture-props.js";
import preferMwForDynamic from "./rules/prefer-mw-for-dynamic.js";
import exitRequiresPresence from "./rules/exit-requires-presence.js";

const rules: Record<string, Rule.RuleModule> = {
  "no-unknown-classes": noUnknownClasses,
  "no-duplicate-gesture-props": noDuplicateGestureProps,
  "prefer-mw-for-dynamic": preferMwForDynamic,
  "exit-requires-presence": exitRequiresPresence,
};

const plugin: ESLint.Plugin & {
  configs: Record<string, Linter.Config>;
} = {
  meta: { name: "eslint-plugin-motionwind", version: "2.0.0" },
  rules,
  configs: {},
};

// Flat config preset: `...motionwind.configs.recommended`
plugin.configs.recommended = {
  plugins: { motionwind: plugin as ESLint.Plugin },
  rules: {
    "motionwind/no-unknown-classes": "warn",
    "motionwind/no-duplicate-gesture-props": "warn",
    "motionwind/prefer-mw-for-dynamic": "warn",
    "motionwind/exit-requires-presence": "warn",
  },
};

export default plugin;
