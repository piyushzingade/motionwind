// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"api.mdx": () => import("../content/docs/api.mdx?collection=docs"), "framework-setup.mdx": () => import("../content/docs/framework-setup.mdx?collection=docs"), "getting-started.mdx": () => import("../content/docs/getting-started.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "installation.mdx": () => import("../content/docs/installation.mdx?collection=docs"), "syntax.mdx": () => import("../content/docs/syntax.mdx?collection=docs"), "animations/advanced-effects.mdx": () => import("../content/docs/animations/advanced-effects.mdx?collection=docs"), "animations/basic-properties.mdx": () => import("../content/docs/animations/basic-properties.mdx?collection=docs"), "animations/drag.mdx": () => import("../content/docs/animations/drag.mdx?collection=docs"), "animations/enter-exit.mdx": () => import("../content/docs/animations/enter-exit.mdx?collection=docs"), "animations/gestures.mdx": () => import("../content/docs/animations/gestures.mdx?collection=docs"), "animations/keyframes.mdx": () => import("../content/docs/animations/keyframes.mdx?collection=docs"), "animations/layout.mdx": () => import("../content/docs/animations/layout.mdx?collection=docs"), "animations/physics.mdx": () => import("../content/docs/animations/physics.mdx?collection=docs"), "animations/scroll.mdx": () => import("../content/docs/animations/scroll.mdx?collection=docs"), "animations/svg.mdx": () => import("../content/docs/animations/svg.mdx?collection=docs"), "animations/transforms.mdx": () => import("../content/docs/animations/transforms.mdx?collection=docs"), "animations/variants.mdx": () => import("../content/docs/animations/variants.mdx?collection=docs"), }),
};
export default browserCollections;