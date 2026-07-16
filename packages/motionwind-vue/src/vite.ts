import { NodeTypes, ElementTypes } from "@vue/compiler-core";
import { parseMotionClasses, type MotionwindConfig } from "motionwind-core";

/**
 * A Vue template `nodeTransform` (compile-time). It rewrites any native element
 * with a static `class` containing `animate-*` into the `<Motionwind>` runtime
 * component, so you can write plain elements — just like the React Babel plugin:
 *
 * ```vue
 * <button class="animate-hover:scale-110 animate-tap:scale-90">Click</button>
 * ```
 *
 * Wire it up in `vite.config.ts` and register the component once:
 *
 * ```ts
 * import vue from "@vitejs/plugin-vue";
 * import { motionwindTransform } from "motionwind-vue/vite";
 * export default defineConfig({
 *   plugins: [vue({ template: { compilerOptions: { nodeTransforms: [motionwindTransform] } } })],
 * });
 * ```
 * ```ts
 * // main.ts
 * import { MotionwindPlugin } from "motionwind-vue";
 * createApp(App).use(MotionwindPlugin).mount("#app");
 * ```
 *
 * Only static `class` attributes are transformed (like the React build step).
 * For dynamic `:class`, use `<Motionwind>` or `mw.*` directly.
 */
function transformNode(node: any, config?: MotionwindConfig): void {
  if (
    node.type !== NodeTypes.ELEMENT ||
    node.tagType !== ElementTypes.ELEMENT
  ) {
    return;
  }

  const classProp = node.props?.find(
    (p: any) =>
      p.type === NodeTypes.ATTRIBUTE &&
      p.name === "class" &&
      typeof p.value?.content === "string" &&
      p.value.content.includes("animate-"),
  );
  if (!classProp) return;
  if (!parseMotionClasses(classProp.value.content, config).hasMotion) return;

  const originalTag: string = node.tag;
  node.tag = "Motionwind";
  node.tagType = ElementTypes.COMPONENT;

  // Add `as="<originalTag>"` so the runtime renders the right element.
  node.props.push({
    type: NodeTypes.ATTRIBUTE,
    name: "as",
    value: { type: NodeTypes.TEXT, content: originalTag, loc: node.loc },
    loc: node.loc,
    nameLoc: node.loc,
  });
}

export function createMotionwindTransform(config: MotionwindConfig = {}) {
  return (node: any) => transformNode(node, config);
}

export function motionwindTransform(node: any): void {
  transformNode(node);
}
