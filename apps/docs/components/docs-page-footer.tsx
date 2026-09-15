import Link from "next/link";
import { source } from "@/lib/source";
import {
  RN_SIDEBAR,
  WEB_SIDEBAR,
  type SidebarConfig,
} from "./sidebar/sidebar-items";
import { DocsRating } from "./docs-rating";

type FooterPage = {
  title: string;
  url: string;
  description?: string;
};

const FRAMEWORK_PAGES: FooterPage[] = [
  { title: "Overview", url: "/docs/frameworks" },
  { title: "React", url: "/docs/frameworks/react" },
  { title: "React Native", url: "/docs/frameworks/react-native" },
  { title: "Vue", url: "/docs/frameworks/vue" },
  { title: "Vanilla", url: "/docs/frameworks/vanilla" },
];

export function DocsPageFooter({
  currentUrl,
  title,
}: {
  currentUrl: string;
  title: string;
}) {
  const items = getNavigationItems(currentUrl);
  const index = items.findIndex((item) => item.url === currentUrl);
  const previous = index > 0 ? (items[index - 1] ?? null) : null;
  const next =
    index >= 0 && index < items.length - 1 ? (items[index + 1] ?? null) : null;

  if (!previous && !next) {
    return (
      <footer className="docs-page-footer">
        <DocsRating title={title} url={currentUrl} />
      </footer>
    );
  }

  return (
    <footer className="docs-page-footer">
      <DocsRating title={title} url={currentUrl} />
      <nav className="docs-pagination" aria-label="Docs pagination">
        <div className="docs-pagination-arrow" aria-hidden="true">
          <ChevronIcon direction="left" />
        </div>
        <PaginationCard page={previous} direction="previous" />
        <PaginationCard page={next} direction="next" />
        <div className="docs-pagination-arrow" aria-hidden="true">
          <ChevronIcon direction="right" />
        </div>
      </nav>
    </footer>
  );
}

function PaginationCard({
  page,
  direction,
}: {
  page: FooterPage | null;
  direction: "previous" | "next";
}) {
  if (!page) {
    return <div className="docs-pagination-card docs-pagination-card-empty" />;
  }

  return (
    <Link
      href={page.url}
      className="docs-pagination-card"
      data-direction={direction}
    >
      <span className="docs-pagination-label">
        {direction === "previous" ? "Previous" : "Next"}
      </span>
      <span className="docs-pagination-title">{page.title}</span>
      {page.description ? (
        <span className="docs-pagination-description">{page.description}</span>
      ) : null}
    </Link>
  );
}

function getNavigationItems(currentUrl: string): FooterPage[] {
  const isReactNativeDocs =
    currentUrl === "/docs/react-native" ||
    currentUrl.startsWith("/docs/react-native/");
  const config = isReactNativeDocs ? RN_SIDEBAR : WEB_SIDEBAR;
  const baseItems = flattenConfig(config);
  const items = isReactNativeDocs
    ? baseItems
    : [...baseItems, ...FRAMEWORK_PAGES];

  return items.map((item) => {
    const page = source.getPage(slugFromUrl(item.url));
    return {
      ...item,
      title: page?.data.title ?? item.title,
      description: page?.data.description ?? item.description,
    };
  });
}

function flattenConfig(config: SidebarConfig): FooterPage[] {
  return [
    ...config.gettingStarted.flatMap((group) => group.items),
    ...config.animations.flatMap((group) => group.items),
    ...config.reference.flatMap((group) => group.items),
  ];
}

function slugFromUrl(url: string): string[] | undefined {
  const path = url.replace(/^\/docs\/?/, "");
  return path ? path.split("/") : undefined;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={direction === "left" ? undefined : "rotate-180"}
    >
      <path
        d="M15 5 8 12l7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
