import type { Rule } from "eslint";
import { staticClassName } from "../utils.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Warn when animate-exit:* is used without importing AnimatePresence — exit animations require it.",
    },
    schema: [],
    messages: {
      needsPresence:
        "animate-exit:* only runs when the element is wrapped in <AnimatePresence>, but no AnimatePresence import was found in this file.",
    },
  },
  create(context) {
    let hasPresenceImport = false;
    const exitNodes: any[] = [];

    return {
      ImportDeclaration(node: any) {
        for (const spec of node.specifiers ?? []) {
          if (
            spec.type === "ImportSpecifier" &&
            spec.imported?.name === "AnimatePresence"
          ) {
            hasPresenceImport = true;
          }
        }
      },
      JSXAttribute(node: any) {
        if (node.name?.name !== "className") return;
        const cls = staticClassName(node.value);
        if (cls && cls.includes("animate-exit:")) {
          exitNodes.push(node.value ?? node);
        }
      },
      "Program:exit"() {
        if (hasPresenceImport) return;
        for (const n of exitNodes) {
          context.report({ node: n, messageId: "needsPresence" });
        }
      },
    };
  },
};

export default rule;
