// @ts-nocheck
import * as __fd_glob_19 from "../content/docs/animations/variants.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/animations/transforms.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/animations/svg.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/animations/scroll.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/animations/physics.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/animations/layout.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/animations/keyframes.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/animations/gestures.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/animations/enter-exit.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/animations/drag.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/animations/basic-properties.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/animations/advanced-effects.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/syntax.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/installation.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/getting-started.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/framework-setup.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/api.mdx?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/animations/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "animations/meta.json": __fd_glob_1, }, {"api.mdx": __fd_glob_2, "framework-setup.mdx": __fd_glob_3, "getting-started.mdx": __fd_glob_4, "index.mdx": __fd_glob_5, "installation.mdx": __fd_glob_6, "syntax.mdx": __fd_glob_7, "animations/advanced-effects.mdx": __fd_glob_8, "animations/basic-properties.mdx": __fd_glob_9, "animations/drag.mdx": __fd_glob_10, "animations/enter-exit.mdx": __fd_glob_11, "animations/gestures.mdx": __fd_glob_12, "animations/keyframes.mdx": __fd_glob_13, "animations/layout.mdx": __fd_glob_14, "animations/physics.mdx": __fd_glob_15, "animations/scroll.mdx": __fd_glob_16, "animations/svg.mdx": __fd_glob_17, "animations/transforms.mdx": __fd_glob_18, "animations/variants.mdx": __fd_glob_19, });