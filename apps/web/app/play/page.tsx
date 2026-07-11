"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { mw } from "motionwind-react";
import { generateMotionCode } from "motionwind-react/tooling";
import { highlightCode } from "../../lib/highlight";

const TAGS = ["div", "button", "span", "a", "section", "img"] as const;

interface Preset {
  label: string;
  tag: string;
  text: string;
  classes: string;
}

const PRESETS: Preset[] = [
  {
    label: "Hover & tap",
    tag: "button",
    text: "Click me",
    classes:
      "animate-hover:scale-110 animate-tap:scale-90 animate-spring rounded-xl bg-acid px-6 py-3 text-black font-semibold",
  },
  {
    label: "Scroll reveal",
    tag: "div",
    text: "I fade up on view",
    classes:
      "animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500 rounded-xl bg-surface-overlay px-6 py-4 text-white",
  },
  {
    label: "Scroll-linked rotate",
    tag: "div",
    text: "Rotate with scroll",
    classes:
      "animate-scroll:rotate-[0,360] rounded-xl bg-acid px-6 py-4 text-black font-semibold",
  },
  {
    label: "Variants",
    tag: "div",
    text: "Named states",
    classes:
      "animate-variant-hidden:opacity-0 animate-variant-hidden:y-20 animate-variant-visible:opacity-100 animate-variant-visible:y-0 animate-from-hidden animate-to-visible animate-duration-500 rounded-xl bg-surface-overlay px-6 py-4 text-white",
  },
  {
    label: "Filters on hover",
    tag: "div",
    text: "Hover to grayscale",
    classes:
      "animate-hover:grayscale-100 animate-hover:blur-2 animate-duration-300 rounded-xl bg-acid px-6 py-4 text-black font-semibold",
  },
  {
    label: "Infinite spin",
    tag: "div",
    text: "↻",
    classes:
      "animate-enter:rotate-360 animate-repeat-infinite animate-duration-2000 animate-ease-linear grid h-16 w-16 place-items-center rounded-full bg-acid text-2xl text-black",
  },
];

function encodeState(state: { classes: string; tag: string; text: string }): string {
  const params = new URLSearchParams(state);
  return params.toString();
}

function decodeState(hash: string): Partial<Preset> | null {
  if (!hash) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const classes = params.get("classes");
  if (classes === null) return null;
  return {
    classes,
    tag: params.get("tag") ?? "div",
    text: params.get("text") ?? "",
  };
}

export default function PlaygroundPage() {
  const [classes, setClasses] = useState(PRESETS[0]!.classes);
  const [tag, setTag] = useState<string>(PRESETS[0]!.tag);
  const [text, setText] = useState(PRESETS[0]!.text);
  const [replayKey, setReplayKey] = useState(0);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  // Hydrate from the URL hash on first load.
  useEffect(() => {
    const decoded = decodeState(window.location.hash);
    if (decoded && decoded.classes !== undefined) {
      setClasses(decoded.classes);
      setTag(decoded.tag ?? "div");
      setText(decoded.text ?? "");
    }
  }, []);

  // Keep the URL hash in sync so the page is shareable.
  useEffect(() => {
    const hash = "#" + encodeState({ classes, tag, text });
    window.history.replaceState(null, "", hash);
  }, [classes, tag, text]);

  const generated = useMemo(
    () => generateMotionCode(tag, classes, { text: text || "Content" }),
    [tag, classes, text],
  );

  const applyPreset = useCallback((preset: Preset) => {
    setClasses(preset.classes);
    setTag(preset.tag);
    setText(preset.text);
    setReplayKey((k) => k + 1);
  }, []);

  const copy = useCallback(
    async (kind: "link" | "code") => {
      const value = kind === "link" ? window.location.href : generated;
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    },
    [generated],
  );

  const Preview = (
    mw as Record<
      string,
      ComponentType<{ className?: string; children?: ReactNode }>
    >
  )[tag]!;

  return (
    <main className="min-h-screen bg-surface text-white">
      <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
        <Link href="/" className="text-sm font-semibold text-acid">
          ← motionwind
        </Link>
        <h1 className="text-sm font-medium text-text-dim">Playground</h1>
        <div className="flex gap-2">
          <button
            onClick={() => copy("link")}
            className="rounded-md border border-border-subtle px-3 py-1.5 text-xs text-text-dim transition hover:text-white"
          >
            {copied === "link" ? "Copied!" : "Copy link"}
          </button>
          <button
            onClick={() => copy("code")}
            className="rounded-md bg-acid px-3 py-1.5 text-xs font-semibold text-black transition hover:opacity-90"
          >
            {copied === "code" ? "Copied!" : "Copy code"}
          </button>
        </div>
      </header>

      <div className="grid gap-px bg-border-subtle lg:grid-cols-[1fr_1.2fr_1fr]">
        {/* Controls */}
        <section className="bg-surface p-6">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted">
            Classes
          </label>
          <textarea
            value={classes}
            onChange={(e) => setClasses(e.target.value)}
            spellCheck={false}
            rows={8}
            className="w-full resize-y rounded-lg border border-border-subtle bg-surface-raised p-3 font-mono text-sm text-acid outline-none focus:border-acid/40"
          />

          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-muted">
                Element
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-raised p-2 text-sm outline-none focus:border-acid/40"
              >
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-muted">
                Text
              </label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-raised p-2 text-sm outline-none focus:border-acid/40"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
              Presets
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="rounded-full border border-border-subtle px-3 py-1.5 text-xs text-text-dim transition hover:border-acid/40 hover:text-white"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Live preview */}
        <section className="flex flex-col bg-surface">
          <div className="flex items-center justify-between px-6 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Preview
            </span>
            <button
              onClick={() => setReplayKey((k) => k + 1)}
              className="text-xs text-text-dim transition hover:text-acid"
            >
              ↻ Replay
            </button>
          </div>
          <div
            className="flex flex-1 items-center justify-center overflow-auto p-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              minHeight: "60vh",
            }}
          >
            <Preview key={replayKey} className={classes}>
              {text}
            </Preview>
          </div>
        </section>

        {/* Generated code */}
        <section className="bg-surface p-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
            Compiles to
          </div>
          <pre className="overflow-auto rounded-lg border border-border-subtle bg-surface-raised p-4 font-mono text-xs leading-relaxed">
            <code>{highlightCode(generated)}</code>
          </pre>
        </section>
      </div>
    </main>
  );
}
