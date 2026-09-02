import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Demo } from "@/components/demo";
import { Playground } from "@/components/playground";
import { RNPreview, AnimBox } from "@/components/rn-preview";
import { MWDiv, MWButton, MWSpan, MWInput } from "@/components/mdx-content";
import { CopyLlmsButton } from "@/components/copy-llms-button";
import { FrameworkGrid } from "@/components/framework-grid";
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
  Playground,
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
  CopyLlmsButton,
  FrameworkGrid,
};

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const url = `https://www.motionwind.xyz${page.url}`;
  const section = sectionForSlug(params.slug);

  // Structured data: a TechArticle for the page + a breadcrumb trail + SoftwareSourceCode.
  // These power rich results and help search engines and AI systems understand the docs hierarchy.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: page.data.title,
        description: page.data.description,
        url,
        inLanguage: "en",
        articleSection: section,
        author: {
          "@type": "Person",
          name: "Piyush",
          url: "https://github.com/piyushzingade",
        },
        publisher: {
          "@type": "Person",
          name: "Piyush",
          url: "https://github.com/piyushzingade",
        },
        isPartOf: {
          "@type": "WebSite",
          name: "Motionwind",
          url: "https://www.motionwind.xyz",
        },
        about: {
          "@type": "SoftwareApplication",
          name: "Motionwind",
          applicationCategory: "DeveloperApplication",
          url: "https://www.motionwind.xyz",
        },
        keywords: [
          "motionwind",
          section.toLowerCase(),
          "animation",
          "motion",
          "tailwind",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.motionwind.xyz",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Docs",
            item: "https://www.motionwind.xyz/docs",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: page.data.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <div className="docs-layout-inner">
      <script
        type="application/ld+json"
        // Escape "<" so a title/description containing "</script>" can't break
        // out of the tag (the standard safe way to embed JSON-LD).
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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

const BASE_KEYWORDS = ["motionwind", "motion", "tailwind", "animation"];

/** A short section label used for the OG eyebrow, keywords, and breadcrumbs. */
function sectionForSlug(slug: string[] | undefined): string {
  const path = (slug ?? []).join("/");
  if (path === "frameworks/react") return "React";
  if (path === "frameworks/vue") return "Vue";
  if (path === "frameworks/vanilla") return "Vanilla JS";
  if (path.startsWith("frameworks")) return "Frameworks";
  if (path.startsWith("react-native")) return "React Native";
  if (path.startsWith("animations")) return "Animations";
  if (path.startsWith("tooling")) return "Tooling";
  return "Docs";
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const url = `https://www.motionwind.xyz${page.url}`;
  const section = sectionForSlug(params.slug);
  const ogImageUrl = `https://www.motionwind.xyz/api/og?title=${encodeURIComponent(page.data.title)}${page.data.description ? `&description=${encodeURIComponent(page.data.description)}` : ""}&eyebrow=${encodeURIComponent(section)}`;

  const keywords = Array.from(
    new Set([
      ...BASE_KEYWORDS,
      `motionwind ${section.toLowerCase()}`,
      page.data.title.toLowerCase(),
      section.toLowerCase(),
      "animation library",
      "ui animation",
      "frontend animation",
    ]),
  );

  return {
    title: page.data.title,
    description: page.data.description,
    keywords,
    authors: [{ name: "Piyush", url: "https://github.com/piyushzingade" }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${page.data.title} | Motionwind Docs`,
      description: page.data.description,
      url,
      type: "article",
      siteName: "Motionwind",
      authors: ["Piyush"],
      publishedTime: undefined,
      modifiedTime: new Date().toISOString(),
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
      title: `${page.data.title} | Motionwind Docs`,
      description: page.data.description,
      images: [ogImageUrl],
      creator: "@piyushzingade",
    },
  };
}
