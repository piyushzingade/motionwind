import { DocsPageHeader } from "@/components/docs-page-header";
import { CopyLlmsButton } from "@/components/copy-llms-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motionwind v2 LLM Reference",
  description:
    "Copy the versioned Motionwind v2 framework and capability reference for an LLM.",
};

export default function LlmsPage() {
  return (
    <div className="docs-layout-inner">
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
        </div>
      </article>
    </div>
  );
}
