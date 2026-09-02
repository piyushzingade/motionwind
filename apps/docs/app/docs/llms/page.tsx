import { DocsPageHeader } from "@/components/docs-page-header";
import { CopyLlmsButton } from "@/components/copy-llms-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM Reference — Machine-Readable Motionwind Documentation",
  description:
    "Copy the versioned Motionwind v2 framework and capability reference for LLMs. Includes package map, grammar, configuration, adapter capabilities, and compatibility boundaries.",
  alternates: {
    canonical: "https://www.motionwind.xyz/docs/llms",
  },
  openGraph: {
    title: "LLM Reference — Machine-Readable Motionwind Documentation",
    description:
      "Copy the versioned Motionwind v2 framework and capability reference for LLMs.",
    url: "https://www.motionwind.xyz/docs/llms",
    type: "article",
    siteName: "Motionwind",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Reference — Machine-Readable Motionwind Documentation",
    description:
      "Copy the versioned Motionwind v2 framework and capability reference for LLMs.",
  },
};

export default function LlmsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Motionwind v2 LLM Reference",
    description:
      "Machine-readable reference for Motionwind v2, including package map, grammar, configuration, adapter capabilities, and compatibility boundaries.",
    url: "https://www.motionwind.xyz/docs/llms",
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
    },
    inLanguage: "en",
    keywords: [
      "motionwind",
      "llm",
      "ai",
      "machine readable",
      "documentation",
      "animation",
    ],
  };

  return (
    <div className="docs-layout-inner">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="docs-page min-w-0">
        <DocsPageHeader
          title="Motionwind v2 LLM Reference"
          description="Copy the versioned framework and capability contract for an LLM."
        />
        <div className="docs-prose">
          <p>
            The <code>llms.txt</code> file gives an agent the v2 package map,
            shared grammar, configuration model, framework setup, and exact
            adapter capability boundaries. It tells generators when to use a
            direct Motion or native API instead of inventing unsupported
            behavior.
          </p>

          <CopyLlmsButton />

          <h2>What&apos;s included</h2>
          <ul>
            <li>Versioned installs for every official package</li>
            <li>React, Vue, vanilla, Nuxt, and React Native setup</li>
            <li>Shared grammar, configuration, presets, and runtime APIs</li>
            <li>Stable, beta, and direct-API capability boundaries</li>
            <li>
              Dynamic classNames with <code>mw.*</code> components
            </li>
            <li>React Native diagnostics and safe native fallbacks</li>
            <li>Shared registry and MCP guidance</li>
          </ul>

          <h2>How to use</h2>
          <ol>
            <li>
              Click <strong>Copy to clipboard</strong> above.
            </li>
            <li>Paste it into your LLM conversation as context.</li>
            <li>
              Ask it to build components using motionwind classes — it will know
              which syntax is valid for the selected adapter.
            </li>
          </ol>

          <h2>Why this exists</h2>
          <p>
            LLMs often generate invalid or outdated animation code. The
            machine-readable reference ensures AI assistants have accurate,
            versioned information about Motionwind&apos;s syntax, capabilities,
            and limitations. This reduces hallucinated APIs and unsupported
            feature suggestions.
          </p>
        </div>
      </article>
    </div>
  );
}
