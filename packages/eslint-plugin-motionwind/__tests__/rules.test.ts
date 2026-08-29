import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import noUnknownClasses from "../src/rules/no-unknown-classes.js";
import noDuplicateGestureProps from "../src/rules/no-duplicate-gesture-props.js";
import preferMwForDynamic from "../src/rules/prefer-mw-for-dynamic.js";
import exitRequiresPresence from "../src/rules/exit-requires-presence.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser as never,
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-unknown-classes", noUnknownClasses, {
  valid: [
    `const a = <div className="px-4 animate-hover:scale-110" />;`,
    `const a = <div className="animate-scroll:y-[0,-200] animate-scroll-container" />;`,
    `const a = <div className="animate-variant-hidden:opacity-0 animate-to-hidden" />;`,
    `const a = <div className="animate-spin" />;`,
  ],
  invalid: [
    {
      code: `const a = <div className="px-4 animate-nope-1" />;`,
      output: `const a = <div className="px-4" />;`,
      errors: [{ messageId: "unknown" }],
    },
  ],
});

ruleTester.run("no-duplicate-gesture-props", noDuplicateGestureProps, {
  valid: [
    `const a = <div className="animate-hover:scale-110 animate-tap:scale-90" />;`,
    `const a = <div className="animate-hover:blur-10 animate-hover:brightness-50" />;`,
  ],
  invalid: [
    {
      code: `const a = <div className="animate-hover:scale-110 animate-hover:scale-90" />;`,
      errors: [{ messageId: "duplicate" }],
    },
  ],
});

ruleTester.run("prefer-mw-for-dynamic", preferMwForDynamic, {
  valid: [
    `const a = <div className="animate-hover:scale-110" />;`,
    "const a = <mw.div className={`animate-hover:scale-110 ${x}`} />;",
    "const a = <Card className={`animate-hover:scale-110 ${x}`} />;",
  ],
  invalid: [
    {
      code: "const a = <div className={`animate-hover:scale-110 ${x}`} />;",
      errors: [{ messageId: "preferMw" }],
    },
  ],
});

ruleTester.run("exit-requires-presence", exitRequiresPresence, {
  valid: [
    `import { AnimatePresence } from "motion/react";\nconst a = <div className="animate-exit:opacity-0" />;`,
    `const a = <div className="animate-hover:scale-110" />;`,
  ],
  invalid: [
    {
      code: `const a = <div className="animate-exit:opacity-0" />;`,
      errors: [{ messageId: "needsPresence" }],
    },
  ],
});
