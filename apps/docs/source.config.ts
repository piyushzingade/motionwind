import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
  metaSchema,
  type DocsCollection,
} from "fumadocs-mdx/config";

export const docs: DocsCollection<
  typeof frontmatterSchema,
  typeof metaSchema
> = defineDocs({
  dir: "content/docs",
});

export default defineConfig({
  mdxOptions: {
    // MDX options if needed
  },
});
