import type { Rule } from "eslint";
import { analyzeClassName } from "motionwind-core";
import { staticClassName } from "../utils.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow animate-* classes that motionwind's parser does not recognize.",
    },
    schema: [],
    messages: {
      unknown:
        'Unknown motionwind class "{{token}}". It starts with "animate-" but matches no known pattern.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node: any) {
        if (node.name?.name !== "className") return;
        const cls = staticClassName(node.value);
        if (!cls || !cls.includes("animate-")) return;
        for (const token of analyzeClassName(cls).unknown) {
          context.report({
            node: node.value ?? node,
            messageId: "unknown",
            data: { token },
          });
        }
      },
    };
  },
};

export default rule;
