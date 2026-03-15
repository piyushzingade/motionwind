import type { PluginObj, NodePath } from "@babel/core";
import * as t from "@babel/types";
import { parseMotionClasses } from "./parser.js";
import type { AnimatableValues, TransitionConfig } from "./types.js";

/**
 * Convert a plain JS value to a Babel AST node.
 * Supports strings, numbers, booleans, and number arrays (keyframes).
 */
function valueToAst(
  value: string | number | boolean | (string | number)[],
): t.Expression {
  if (Array.isArray(value)) {
    return t.arrayExpression(
      value.map((v) =>
        typeof v === "string" ? t.stringLiteral(v) : t.numericLiteral(v),
      ),
    );
  }
  if (typeof value === "string") return t.stringLiteral(value);
  if (typeof value === "boolean") return t.booleanLiteral(value);
  if (value === Infinity) return t.identifier("Infinity");
  return t.numericLiteral(value);
}

/**
 * Convert an AnimatableValues record to a Babel ObjectExpression.
 * Handles string, number, and number[] (keyframe) values.
 */
function objectToAst(
  obj: AnimatableValues,
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
    if (Array.isArray(config.ease)) {
      properties.push(
        t.objectProperty(
          t.identifier("ease"),
          t.arrayExpression(config.ease.map((v) => t.numericLiteral(v))),
        ),
      );
    } else {
      properties.push(
        t.objectProperty(t.identifier("ease"), t.stringLiteral(config.ease)),
      );
    }
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
  if (config.repeatType !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("repeatType"),
        t.stringLiteral(config.repeatType),
      ),
    );
  }
  if (config.repeatDelay !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("repeatDelay"),
        t.numericLiteral(config.repeatDelay),
      ),
    );
  }
  if (config.staggerChildren !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("staggerChildren"),
        t.numericLiteral(config.staggerChildren),
      ),
    );
  }
  if (config.delayChildren !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("delayChildren"),
        t.numericLiteral(config.delayChildren),
      ),
    );
  }
  if (config.staggerDirection !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("staggerDirection"),
        t.numericLiteral(config.staggerDirection),
      ),
    );
  }
  if (config.when !== undefined) {
    if (config.when === false) {
      properties.push(
        t.objectProperty(t.identifier("when"), t.booleanLiteral(false)),
      );
    } else {
      properties.push(
        t.objectProperty(t.identifier("when"), t.stringLiteral(config.when)),
      );
    }
  }
  if (config.restSpeed !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("restSpeed"),
        t.numericLiteral(config.restSpeed),
      ),
    );
  }
  if (config.restDelta !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("restDelta"),
        t.numericLiteral(config.restDelta),
      ),
    );
  }
  if (config.times !== undefined) {
    properties.push(
      t.objectProperty(
        t.identifier("times"),
        t.arrayExpression(config.times.map((v) => t.numericLiteral(v))),
      ),
    );
  }
  return t.objectExpression(properties);
}

/**
 * Extract static class tokens from a template literal.
 * Returns the static animate-* classes and a rebuilt dynamic expression
 * for the remaining non-animate parts.
 */
function extractFromTemplateLiteral(
  tmpl: t.TemplateLiteral,
): { staticClasses: string; dynamicExpression: t.Expression } {
  // Collect all static text parts from the template quasis
  const staticTokens: string[] = [];
  const nonAnimateTokens: string[] = [];

  for (const quasi of tmpl.quasis) {
    const raw = quasi.value.raw || quasi.value.cooked || "";
    const tokens = raw.split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      if (token.startsWith("animate-")) {
        staticTokens.push(token);
      } else {
        nonAnimateTokens.push(token);
      }
    }
  }

  // Rebuild the template literal without animate-* tokens in the static parts
  const newQuasis: t.TemplateElement[] = [];
  for (let i = 0; i < tmpl.quasis.length; i++) {
    const quasi = tmpl.quasis[i]!;
    const raw = quasi.value.raw || quasi.value.cooked || "";
    // Remove animate-* tokens from the static text
    const cleaned = raw
      .split(/(\s+)/)
      .filter((part) => {
        const trimmed = part.trim();
        return !trimmed.startsWith("animate-") || trimmed === "";
      })
      .join("");
    // Normalize whitespace
    const normalized = cleaned.replace(/\s{2,}/g, " ");
    newQuasis.push(
      t.templateElement(
        { raw: normalized, cooked: normalized },
        i === tmpl.quasis.length - 1,
      ),
    );
  }

  const dynamicExpression = t.templateLiteral(newQuasis, [...tmpl.expressions] as t.Expression[]);

  return {
    staticClasses: staticTokens.join(" "),
    dynamicExpression,
  };
}

/**
 * Emit a build-time warning visible in the terminal during compilation.
 */
function emitBuildWarning(path: NodePath, message: string): void {
  const loc = path.node.loc;
  const file = (path.hub as { file?: { opts?: { filename?: string } } })?.file?.opts?.filename ?? "unknown";
  const line = loc?.start.line ?? "?";
  const col = loc?.start.column ?? "?";
  console.warn(
    `\x1b[33m[motionwind]\x1b[0m ${file}:${line}:${col} — ${message}`,
  );
}

/**
 * Add all parsed motion props (gestures, transition, viewport, drag, layout)
 * to a JSX element node.
 */
function addMotionProps(
  node: t.JSXOpeningElement,
  parsed: ReturnType<typeof parseMotionClasses>,
): void {
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
          typeof parsed.viewport.amount === "number"
            ? t.numericLiteral(parsed.viewport.amount)
            : t.stringLiteral(parsed.viewport.amount),
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
  if (parsed.dragConfig.dragSnapToOrigin === true) {
    node.attributes.push(
      t.jsxAttribute(t.jsxIdentifier("dragSnapToOrigin"), null),
    );
  }
  if (parsed.dragConfig.dragMomentum === false) {
    node.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier("dragMomentum"),
        t.jsxExpressionContainer(t.booleanLiteral(false)),
      ),
    );
  }
  if (parsed.dragConfig.dragDirectionLock === true) {
    node.attributes.push(
      t.jsxAttribute(t.jsxIdentifier("dragDirectionLock"), null),
    );
  }
  if (parsed.dragConfig.dragConstraints !== undefined) {
    const constraintProps = Object.entries(parsed.dragConfig.dragConstraints).map(
      ([key, value]) =>
        t.objectProperty(t.identifier(key), t.numericLiteral(value as number)),
    );
    node.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier("dragConstraints"),
        t.jsxExpressionContainer(t.objectExpression(constraintProps)),
      ),
    );
  }

  // Add layout props
  if (parsed.layoutConfig.layout !== undefined) {
    if (parsed.layoutConfig.layout === true) {
      node.attributes.push(
        t.jsxAttribute(t.jsxIdentifier("layout"), null),
      );
    } else {
      node.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("layout"),
          t.stringLiteral(parsed.layoutConfig.layout as string),
        ),
      );
    }
  }
  if (parsed.layoutConfig.layoutId !== undefined) {
    node.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier("layoutId"),
        t.stringLiteral(parsed.layoutConfig.layoutId),
      ),
    );
  }
  if (parsed.layoutConfig.layoutScroll === true) {
    node.attributes.push(
      t.jsxAttribute(t.jsxIdentifier("layoutScroll"), null),
    );
  }
  if (parsed.layoutConfig.layoutRoot === true) {
    node.attributes.push(
      t.jsxAttribute(t.jsxIdentifier("layoutRoot"), null),
    );
  }
}

export default function motionwindBabelPlugin(): PluginObj {
  return {
    name: "motionwind",
    visitor: {
      Program: {
        exit(programPath: NodePath<t.Program>) {
          const programNode = programPath.node as t.Program & {
            _motionwindNeedsImport?: boolean;
            _motionwindNeedsCreate?: boolean;
          };
          if (!programNode._motionwindNeedsImport) return;

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
            // Insert after the last import declaration in the file
            let insertIdx = 0;
            for (let i = 0; i < body.length; i++) {
              if (t.isImportDeclaration(body[i])) {
                insertIdx = i + 1;
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

        // Skip if already a motion.* element
        if (tagName.startsWith("motion.")) return;

        const isComponent = /^[A-Z]/.test(tagName);

        // Find className attribute — supports both static strings and template literals
        const classNameAttr = node.attributes.find(
          (attr): attr is t.JSXAttribute =>
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            attr.name.name === "className" &&
            attr.value !== null,
        );

        if (!classNameAttr) return;

        let classNameValue: string | null = null;
        let isDynamic = false;
        let templateRemainder: t.Expression | null = null;

        if (t.isStringLiteral(classNameAttr.value)) {
          classNameValue = classNameAttr.value.value;
        } else if (
          t.isJSXExpressionContainer(classNameAttr.value) &&
          t.isTemplateLiteral(classNameAttr.value.expression)
        ) {
          // Extract static parts from template literal
          const tmpl = classNameAttr.value.expression;
          const { staticClasses, dynamicExpression } = extractFromTemplateLiteral(tmpl);
          classNameValue = staticClasses;
          isDynamic = true;
          templateRemainder = dynamicExpression;
        } else if (
          t.isJSXExpressionContainer(classNameAttr.value) &&
          !t.isJSXEmptyExpression(classNameAttr.value.expression)
        ) {
          // Fully dynamic className — check if source contains animate- and warn
          const srcCode = path.getSource?.() ?? "";
          if (srcCode.includes("animate-")) {
            emitBuildWarning(
              path,
              `className uses a dynamic expression that may contain animate-* classes. ` +
                `These won't be compiled. Use template literals or the <mw.${tagName}> runtime component instead.`,
            );
          }
          return;
        } else {
          return;
        }

        // Quick check: does it contain animate-* that we'd parse?
        if (!classNameValue || !classNameValue.includes("animate-")) {
          return;
        }

        const parsed = parseMotionClasses(classNameValue);
        if (!parsed.hasMotion) return;

        // Mark program as needing motion import
        const program = path.findParent((p) => p.isProgram());
        if (program) {
          const programNode = program.node as t.Program & {
            _motionwindNeedsImport?: boolean;
            _motionwindNeedsCreate?: boolean;
          };
          programNode._motionwindNeedsImport = true;
          if (isComponent) {
            programNode._motionwindNeedsCreate = true;
          }
        }

        if (isComponent) {
          // For custom components: wrap with motion.create()
          // <Card className="..."> → <_mw_Card className="...">
          // and add: const _mw_Card = motion.create(Card);
          const wrappedName = `_mw_${tagName}`;
          node.name = t.jsxIdentifier(wrappedName);

          // Also replace closing element
          const parent = path.parent;
          if (
            t.isJSXElement(parent) &&
            parent.closingElement &&
            t.isJSXIdentifier(parent.closingElement.name)
          ) {
            parent.closingElement.name = t.jsxIdentifier(wrappedName);
          }

          // Add the motion.create() declaration before the component's function
          const programBody = path.findParent((p) => p.isProgram());
          if (programBody) {
            const pNode = programBody.node as t.Program & { _motionwindCreatedComponents?: Set<string> };
            if (!pNode._motionwindCreatedComponents) {
              pNode._motionwindCreatedComponents = new Set();
            }
            if (!pNode._motionwindCreatedComponents.has(tagName)) {
              pNode._motionwindCreatedComponents.add(tagName);
              // Insert: const _mw_Card = motion.create(Card);
              const decl = t.variableDeclaration("const", [
                t.variableDeclarator(
                  t.identifier(wrappedName),
                  t.callExpression(
                    t.memberExpression(t.identifier("motion"), t.identifier("create")),
                    [t.identifier(tagName)],
                  ),
                ),
              ]);
              // Find the right insertion point — after all imports
              const body = (programBody.node as t.Program).body;
              let insertIdx = 0;
              for (let i = 0; i < body.length; i++) {
                if (t.isImportDeclaration(body[i])) {
                  insertIdx = i + 1;
                }
              }
              body.splice(insertIdx, 0, decl);
            }
          }
        } else {
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
        }

        // Update className — handle both static and template literal cases
        if (isDynamic && templateRemainder) {
          // Rebuild className: combine remaining tailwind classes with dynamic parts
          if (parsed.tailwindClasses) {
            classNameAttr.value = t.jsxExpressionContainer(
              t.templateLiteral(
                [
                  t.templateElement({ raw: parsed.tailwindClasses + " ", cooked: parsed.tailwindClasses + " " }),
                  t.templateElement({ raw: "", cooked: "" }, true),
                ],
                [templateRemainder],
              ),
            );
          } else {
            classNameAttr.value = t.jsxExpressionContainer(templateRemainder);
          }
        } else {
          // Static className
          if (parsed.tailwindClasses) {
            classNameAttr.value = t.stringLiteral(parsed.tailwindClasses);
          } else {
            // Remove className attr entirely if no Tailwind classes remain
            const idx = node.attributes.indexOf(classNameAttr);
            if (idx !== -1) node.attributes.splice(idx, 1);
          }
        }

        // Add gesture props
        addMotionProps(node, parsed);
      },
    },
  };
}

// Also export as named export for CJS compatibility
export { motionwindBabelPlugin };
