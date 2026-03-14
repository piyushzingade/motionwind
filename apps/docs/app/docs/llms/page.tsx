import { DocsPageHeader } from "@/components/docs-page-header";
import { CopyLlmsButton } from "@/components/copy-llms-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM Documentation",
  description:
    "Copy the complete motionwind documentation in a single file, optimized for pasting into any LLM.",
};

export default function LlmsPage() {
  return (
    <div className="docs-layout-inner">
      <article className="docs-page min-w-0">
        <DocsPageHeader
          title="LLM Documentation"
          description="Copy the complete motionwind documentation in a single file, optimized for pasting into any LLM."
        />
        <div className="docs-prose">
          <p>
            The <code>llms.txt</code> file contains the entire motionwind
            documentation — syntax, all properties, transition config, common
            patterns, and troubleshooting — in a single markdown file. Paste it
            into ChatGPT, Claude, or any LLM so it can write motionwind code
            for you.
          </p>

          <CopyLlmsButton />

          <h2>What&apos;s included</h2>
          <ul>
            <li>Installation & framework setup (Next.js, Vite, Babel)</li>
            <li>Complete syntax reference with all gesture prefixes</li>
            <li>Every animatable property with value types</li>
            <li>Transition, viewport, drag & layout configuration</li>
            <li>
              Dynamic classNames with <code>mw.*</code> components
            </li>
            <li>14 common patterns (buttons, scroll reveal, stagger, SVG…)</li>
            <li>Troubleshooting guide</li>
          </ul>

          <h2>How to use</h2>
          <ol>
            <li>
              Click <strong>Copy to clipboard</strong> above.
            </li>
            <li>Paste it into your LLM conversation as context.</li>
            <li>
              Ask it to build components using motionwind classes — it will
              know the full syntax.
            </li>
          </ol>
        </div>
      </article>
    </div>
  );
}
