import type { Rule } from "eslint";
import { analyzeClassName } from "motionwind-core";
import { staticClassName } from "../utils.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    fixable: "code",
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
        const { unknown } = analyzeClassName(cls);
        if (unknown.length === 0) return;

        const unknownSet = new Set(unknown);
        const fixed = cls
          .split(/\s+/)
          .filter((t: string) => t && !unknownSet.has(t))
          .join(" ");

        const valueNode = node.value ?? node;

        for (const token of unknown) {
          context.report({
            node: valueNode,
            messageId: "unknown",
            data: { token },
            fix(fixer) {
              // Plain string literal: className="..."
              if (
                valueNode.type === "Literal" &&
                typeof valueNode.value === "string"
              ) {
                const q = (valueNode.raw as string)?.[0] ?? '"';
                return fixer.replaceText(valueNode, `${q}${fixed}${q}`);
              }
              // JSX expression container wrapping a string literal: className={"..."}
              if (
                valueNode.type === "JSXExpressionContainer" &&
                valueNode.expression?.type === "Literal" &&
                typeof valueNode.expression.value === "string"
              ) {
                const litNode = valueNode.expression;
                const q = (litNode.raw as string)?.[0] ?? '"';
                return fixer.replaceText(litNode, `${q}${fixed}${q}`);
              }
              return null;
            },
          });
        }
      },
    };
  },
};

export default rule;
