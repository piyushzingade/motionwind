import type { Rule } from "eslint";
import { analyzeClassName } from "motionwind-react/tooling";
import { staticClassName } from "../utils.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow setting the same property more than once within a gesture or variant.",
    },
    schema: [],
    messages: {
      duplicate:
        'Property "{{prop}}" is set more than once in "{{gesture}}". The last value wins.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node: any) {
        if (node.name?.name !== "className") return;
        const cls = staticClassName(node.value);
        if (!cls || !cls.includes("animate-")) return;
        for (const dup of analyzeClassName(cls).duplicates) {
          context.report({
            node: node.value ?? node,
            messageId: "duplicate",
            data: { prop: dup.prop, gesture: dup.gesture },
          });
        }
      },
    };
  },
};

export default rule;
