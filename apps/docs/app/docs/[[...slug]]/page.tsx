import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Demo } from "@/components/demo";
import { RNPreview, AnimBox } from "@/components/rn-preview";
import { MWDiv, MWButton, MWSpan, MWInput } from "@/components/mdx-content";
import { DocsPageHeader } from "@/components/docs-page-header";
import { TableOfContents } from "@/components/toc";
import {
  ExpandableCardDemo,
  ShuffleListDemo,
  SharedLayoutTabsDemo,
  GridToggleDemo,
  DragReorderDemo,
} from "@/components/demos/layout-demos";
import {
  StaggeredGridDemo,
  MultiStateDemo,
  CollapsibleSidebarDemo,
  NotificationStackDemo,
  OrchestratedFormDemo,
} from "@/components/demos/variant-demos";
import {
  LogoDrawDemo,
  CircularProgressDemo,
  AnimatedCheckboxDemo,
  PulseRingsDemo,
  AnimatedChartDemo,
} from "@/components/demos/svg-demos";

// Motionwind runtime overrides for HTML elements used in Demo blocks.
// The mw.* components parse animate-* classes into Motion props at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxComponents: any = {
  ...defaultMdxComponents,
  Demo,
  RNPreview,
  AnimBox,
  div: MWDiv,
  button: MWButton,
  span: MWSpan,
  input: MWInput,
  ExpandableCardDemo,
  ShuffleListDemo,
  SharedLayoutTabsDemo,
  GridToggleDemo,
  DragReorderDemo,
  StaggeredGridDemo,
  MultiStateDemo,
  CollapsibleSidebarDemo,
  NotificationStackDemo,
  OrchestratedFormDemo,
  LogoDrawDemo,
  CircularProgressDemo,
  AnimatedCheckboxDemo,
  PulseRingsDemo,
  AnimatedChartDemo,
};

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <div className="docs-layout-inner">
      <article className="docs-page min-w-0">
        <DocsPageHeader
          title={page.data.title}
          description={page.data.description}
        />
        <div className="docs-prose">
          <MDX components={mdxComponents} />
        </div>
      </article>
      <aside className="toc-sidebar">
        <TableOfContents items={page.data.toc} />
      </aside>
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const url = `https://www.motionwind.xyz${page.url}`;
  const ogImageUrl = `https://www.motionwind.xyz/api/og?title=${encodeURIComponent(page.data.title)}${page.data.description ? `&description=${encodeURIComponent(page.data.description)}` : ""}`;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${page.data.title} | Motionwind`,
      description: page.data.description,
      url,
      type: "article",
      siteName: "Motionwind",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${page.data.title} — Motionwind Documentation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.data.title} | Motionwind`,
      description: page.data.description,
      images: [ogImageUrl],
    },
  };
}
