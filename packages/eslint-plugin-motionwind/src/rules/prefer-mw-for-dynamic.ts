import type { Rule } from "eslint";
import {
  getClassNameAttr,
  getTagName,
  isDynamicClassName,
  staticClassName,
} from "../utils.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Use the mw.* runtime for dynamic classNames that contain animate-* classes (the Babel plugin can only transform static strings).",
    },
    schema: [],
    messages: {
      preferMw:
        "animate-* classes in a dynamic className on <{{tag}}> won't be compiled by the Babel plugin. Use <mw.{{tag}}> instead.",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node: any) {
        const attr = getClassNameAttr(node);
        if (!attr || !isDynamicClassName(attr.value)) return;
        const cls = staticClassName(attr.value);
        if (!cls || !cls.includes("animate-")) return;
        const tag = getTagName(node);
        // Only host elements — components and mw.*/motion.* are already fine.
        if (!/^[a-z]/.test(tag)) return;
        if (tag.startsWith("mw.") || tag.startsWith("motion.")) return;
        context.report({ node: attr, messageId: "preferMw", data: { tag } });
      },
    };
  },
};

export default rule;
