import type { PluginObj, NodePath } from "@babel/core";
import * as t from "@babel/types";
import { parseMotionClasses } from "./parser.js";
import type { AnimatableValues, TransitionConfig } from "./types.js";

/**
 * Convert a plain JS value to a Babel AST node.
 */
function valueToAst(
  value: string | number | boolean,
): t.Expression {
  if (typeof value === "string") return t.stringLiteral(value);
  if (typeof value === "boolean") return t.booleanLiteral(value);
  if (value === Infinity) return t.identifier("Infinity");
  return t.numericLiteral(value);
}

/**
 * Convert a Record<string, value> to a Babel ObjectExpression.
 */
function objectToAst(
  obj: Record<string, string | number | boolean>,
): t.ObjectExpression {
  const properties = Object.entries(obj).map(([key, value]) =>
    t.objectProperty(t.identifier(key), valueToAst(value)),
  );
  return t.objectExpression(properties);
}

/**
 * Build transition object AST from TransitionConfig.
 */
function transitionToAst(config: TransitionConfig): t.ObjectExpression {
  const properties: t.ObjectProperty[] = [];
  if (config.type !== undefined) {
    properties.push(
      t.objectProperty(t.identifier("type"), t.stringLiteral(config.type)),
    );
  }
  if (config.duration !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("duration"),
        t.numericLiteral(config.duration),
      ),
    );
  }
  if (config.delay !== undefined) {
    properties.push(
      t.objectProperty(t.identifier("delay"), t.numericLiteral(config.delay)),
    );
  }
  if (config.ease !== undefined) {
    properties.push(
      t.objectProperty(t.identifier("ease"), t.stringLiteral(config.ease)),
    );
  }
  if (config.stiffness !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("stiffness"),
        t.numericLiteral(config.stiffness),
      ),
    );
  }
  if (config.damping !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("damping"),
        t.numericLiteral(config.damping),
      ),
    );
  }
  if (config.bounce !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("bounce"),
        t.numericLiteral(config.bounce),
      ),
    );
  }
  if (config.mass !== undefined) {
    properties.push(
      t.objectProperty(t.identifier("mass"), t.numericLiteral(config.mass)),
    );
  }
  if (config.repeat !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("repeat"),
        config.repeat === Infinity
          ? t.identifier("Infinity")
          : t.numericLiteral(config.repeat),
      ),
    );
  }
  return t.objectExpression(properties);
}

export default function motionwindBabelPlugin(): PluginObj {
  return {
    name: "motionwind",
    visitor: {
      Program: {
        exit(programPath: NodePath<t.Program>) {
          const state = (programPath.node as t.Program & { _motionwindNeedsImport?: boolean })
            ._motionwindNeedsImport;
          if (!state) return;

          // Add "use client" directive if not present
          const body = programPath.node.body;
          const directives = programPath.node.directives || [];
          const hasUseClient = directives.some(
            (d) => d.value.value === "use client",
          );
          if (!hasUseClient) {
            programPath.node.directives = [
              t.directive(t.directiveLiteral("use client")),
              ...directives,
            ];
          }

          // Add import { motion } from "motion/react" if not present
          const hasMotionImport = body.some(
            (node) =>
              t.isImportDeclaration(node) &&
              node.source.value === "motion/react" &&
              node.specifiers.some(
                (s) =>
                  t.isImportSpecifier(s) &&
                  t.isIdentifier(s.imported) &&
                  s.imported.name === "motion",
              ),
          );
          if (!hasMotionImport) {
            const importDecl = t.importDeclaration(
              [
                t.importSpecifier(
                  t.identifier("motion"),
                  t.identifier("motion"),
                ),
              ],
              t.stringLiteral("motion/react"),
            );
            // Insert after any existing directives / imports
            let insertIdx = 0;
            for (let i = 0; i < body.length; i++) {
              if (t.isImportDeclaration(body[i])) {
                insertIdx = i + 1;
              } else {
                break;
              }
            }
            body.splice(insertIdx, 0, importDecl);
          }
        },
      },

      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
        const node = path.node;

        // Only handle simple tag names (not member expressions like Component.X)
        if (!t.isJSXIdentifier(node.name)) return;
        const tagName = node.name.name;

        // Skip if already a motion.* element or a component (uppercase)
        if (tagName.startsWith("motion.") || /^[A-Z]/.test(tagName)) return;

        // Find className attribute with static string value
        const classNameAttr = node.attributes.find(
          (attr): attr is t.JSXAttribute =>
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            attr.name.name === "className" &&
            attr.value !== null &&
            t.isStringLiteral(attr.value),
        );

        if (!classNameAttr || !t.isStringLiteral(classNameAttr.value)) return;

        const classNameValue = classNameAttr.value.value;

        // Quick check: does it contain animate-* that we'd parse?
        if (!classNameValue.includes("animate-")) return;

        const parsed = parseMotionClasses(classNameValue);
        if (!parsed.hasMotion) return;

        // Mark program as needing motion import
        const program = path.findParent((p) => p.isProgram());
        if (program) {
          (program.node as t.Program & { _motionwindNeedsImport?: boolean })
            ._motionwindNeedsImport = true;
        }

        // Replace <tag> with <motion.tag>
        node.name = t.jsxMemberExpression(
          t.jsxIdentifier("motion"),
          t.jsxIdentifier(tagName),
        );

        // Also replace closing element
        const parent = path.parent;
        if (
          t.isJSXElement(parent) &&
          parent.closingElement &&
          t.isJSXIdentifier(parent.closingElement.name)
        ) {
          parent.closingElement.name = t.jsxMemberExpression(
            t.jsxIdentifier("motion"),
            t.jsxIdentifier(tagName),
          );
        }

        // Update className to only Tailwind classes
        if (parsed.tailwindClasses) {
          classNameAttr.value = t.stringLiteral(parsed.tailwindClasses);
        } else {
          // Remove className attr entirely if no Tailwind classes remain
          const idx = node.attributes.indexOf(classNameAttr);
          if (idx !== -1) node.attributes.splice(idx, 1);
        }

        // Add gesture props
        for (const [gestureKey, values] of Object.entries(parsed.gestures)) {
          const objAst = objectToAst(values as AnimatableValues);
          node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier(gestureKey),
              t.jsxExpressionContainer(objAst),
            ),
          );
        }

        // Add transition prop
        if (Object.keys(parsed.transition).length > 0) {
          node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier("transition"),
              t.jsxExpressionContainer(transitionToAst(parsed.transition)),
            ),
          );
        }

        // Add viewport prop
        if (Object.keys(parsed.viewport).length > 0) {
          const props: t.ObjectProperty[] = [];
          if (parsed.viewport.once !== undefined) {
            props.push(
              t.objectProperty(
                t.identifier("once"),
                t.booleanLiteral(parsed.viewport.once),
              ),
            );
          }
          if (parsed.viewport.amount !== undefined) {
            props.push(
              t.objectProperty(
                t.identifier("amount"),
                t.stringLiteral(parsed.viewport.amount),
              ),
            );
          }
          if (parsed.viewport.margin !== undefined) {
            props.push(
              t.objectProperty(
                t.identifier("margin"),
                t.stringLiteral(parsed.viewport.margin),
              ),
            );
          }
          node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier("viewport"),
              t.jsxExpressionContainer(t.objectExpression(props)),
            ),
          );
        }

        // Add drag props
        if (parsed.dragConfig.drag !== undefined) {
          if (parsed.dragConfig.drag === true) {
            node.attributes.push(
              t.jsxAttribute(t.jsxIdentifier("drag"), null),
            );
          } else {
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier("drag"),
                t.stringLiteral(parsed.dragConfig.drag as string),
              ),
            );
          }
        }
        if (parsed.dragConfig.dragElastic !== undefined) {
          node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier("dragElastic"),
              t.jsxExpressionContainer(
                t.numericLiteral(parsed.dragConfig.dragElastic),
              ),
            ),
          );
        }
      },
    },
  };
}

// Also export as named export for CJS compatibility
export { motionwindBabelPlugin };
