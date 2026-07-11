/**
 * Extract the static className string from a JSXAttribute value node.
 * Handles string literals and the static parts of template literals.
 * Returns null when there is no analyzable static string.
 */
export function staticClassName(value: any): string | null {
  if (!value) return null;
  if (value.type === "Literal" && typeof value.value === "string") {
    return value.value;
  }
  if (value.type === "JSXExpressionContainer") {
    const expr = value.expression;
    if (expr?.type === "Literal" && typeof expr.value === "string") {
      return expr.value;
    }
    if (expr?.type === "TemplateLiteral") {
      return expr.quasis
        .map((q: any) => q.value.cooked ?? q.value.raw ?? "")
        .join(" ");
    }
  }
  return null;
}

/** Whether the className value is a dynamic expression (not a plain string). */
export function isDynamicClassName(value: any): boolean {
  if (!value || value.type !== "JSXExpressionContainer") return false;
  const expr = value.expression;
  if (expr?.type === "Literal" && typeof expr.value === "string") return false;
  return expr?.type !== "JSXEmptyExpression";
}

/** Find the className attribute on a JSXOpeningElement, if present. */
export function getClassNameAttr(opening: any): any | null {
  for (const attr of opening.attributes ?? []) {
    if (attr.type === "JSXAttribute" && attr.name?.name === "className") {
      return attr;
    }
  }
  return null;
}

/** Resolve the tag name of a JSXOpeningElement (e.g. "div", "Card", "mw.div"). */
export function getTagName(opening: any): string {
  const name = opening.name;
  if (!name) return "";
  if (name.type === "JSXIdentifier") return name.name;
  if (name.type === "JSXMemberExpression") {
    return `${name.object?.name ?? ""}.${name.property?.name ?? ""}`;
  }
  return "";
}
