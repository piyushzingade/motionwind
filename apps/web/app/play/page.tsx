"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import Link from "next/link";
import { MotionConfig } from "motion/react";
import {
  MOTIONWIND_RECIPES,
  mw,
  parseMotionClasses,
  type MotionwindRecipe,
} from "motionwind-react";
import { generateMotionCode } from "motionwind-react/tooling";
import { highlightCode } from "../../lib/highlight";
import { ThemeToggle } from "../../components/theme-toggle";

type Target = "react" | "vue" | "javascript" | "react-native";
type StageSize = "phone" | "tablet" | "desktop";

interface StudioState {
  classes: string;
  tag: string;
  text: string;
  target: Target;
}

const TAGS = ["div", "button", "span", "a", "section"] as const;
const TARGETS: { id: Target; label: string }[] = [
  { id: "react", label: "React" },
  { id: "vue", label: "Vue" },
  { id: "javascript", label: "JavaScript" },
  { id: "react-native", label: "Native" },
];
const STAGES: { id: StageSize; label: string; width: number }[] = [
  { id: "phone", label: "S", width: 340 },
  { id: "tablet", label: "M", width: 560 },
  { id: "desktop", label: "L", width: 900 },
];
const PREVIEW_SKIN = "rounded-xl bg-acid px-6 py-3 font-semibold text-black";
const INITIAL: StudioState = {
  classes: `${MOTIONWIND_RECIPES[0]!.classes} ${PREVIEW_SKIN}`,
  tag: "button",
  text: "Ship the interaction",
  target: "react",
};

function encodeState(state: StudioState): string {
  return new URLSearchParams(Object.entries(state)).toString();
}

function decodeState(hash: string): StudioState | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const classes = params.get("classes");
  if (!classes) return null;
  const target = params.get("target") as Target | null;
  return {
    classes,
    tag: params.get("tag") ?? "div",
    text: params.get("text") ?? "",
    target: TARGETS.some(({ id }) => id === target) ? target! : "react",
  };
}

function replaceClass(classes: string, matcher: RegExp, next: string): string {
  return [...classes.split(/\s+/).filter((token) => !matcher.test(token)), next]
    .filter(Boolean)
    .join(" ");
}

function numericToken(
  classes: string,
  prefix: string,
  fallback: number,
): number {
  const token = classes.split(/\s+/).find((value) => value.startsWith(prefix));
  const value = token ? Number(token.slice(prefix.length)) : NaN;
  return Number.isFinite(value) ? value : fallback;
}

function ControlLabel({
  htmlFor,
  children,
  value,
}: {
  htmlFor: string;
  children: ReactNode;
  value?: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted"
    >
      <span>{children}</span>
      {value ? <span className="text-acid">{value}</span> : null}
    </label>
  );
}

function RangeControl({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <ControlLabel htmlFor={id} value={`${value}${unit ?? ""}`}>
        {label}
      </ControlLabel>
      <input
        id={id}
        aria-label={label}
        className="studio-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function Timeline({
  duration,
  delay,
  replayKey,
}: {
  duration: number;
  delay: number;
  replayKey: number;
}) {
  const total = Math.max(duration + delay, 1);
  return (
    <div className="border-t border-border-subtle px-5 py-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-text-muted">
        <span>Timeline</span>
        <span>{total}ms</span>
      </div>
      <div className="studio-timeline relative h-8 overflow-hidden rounded-md border border-border-strong bg-surface-inset">
        <div
          className="absolute inset-y-0 border-r border-dashed border-border-strong bg-surface-inset/60"
          style={{ width: `${(delay / total) * 100}%` }}
        />
        <div
          key={replayKey}
          className="studio-playhead absolute inset-y-0 w-px bg-acid shadow-[0_0_12px_var(--acid-glow)]"
          style={{ animationDuration: `${Math.max(total, 240)}ms` }}
        />
        <div className="absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-acid/10 via-acid/60 to-acid/10" />
      </div>
    </div>
  );
}

function RecipeButton({
  recipe,
  active,
  onClick,
}: {
  recipe: MotionwindRecipe;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="group w-full cursor-pointer border-b border-border-subtle px-4 py-3 text-left transition-colors hover:bg-surface-inset/60 aria-pressed:bg-acid-soft"
    >
      <span className="mb-1 flex items-center justify-between text-xs font-semibold text-foreground">
        {recipe.name}
        <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted group-aria-pressed:text-acid">
          {recipe.category}
        </span>
      </span>
      <span className="block text-[11px] leading-relaxed text-text-muted">
        {recipe.description}
      </span>
    </button>
  );
}

export default function StudioPage() {
  const [editor, setEditor] = useState<StudioState>(INITIAL);
  const [stage, setStage] = useState<StageSize>("desktop");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const deferredClasses = useDeferredValue(editor.classes);

  const writeHash = useCallback((state: StudioState) => {
    window.history.replaceState(null, "", `#${encodeState(state)}`);
  }, []);
  const updateEditor = useCallback(
    (patch: Partial<StudioState>) => {
      setEditor((current) => {
        const next = { ...current, ...patch };
        writeHash(next);
        return next;
      });
    },
    [writeHash],
  );

  useEffect(() => {
    const decoded = decodeState(window.location.hash);
    if (decoded) setEditor(decoded);
    else writeHash(INITIAL);
  }, [writeHash]);

  const parsed = useMemo(
    () => parseMotionClasses(deferredClasses),
    [deferredClasses],
  );
  const generated = useMemo(
    () =>
      generateMotionCode(editor.tag, deferredClasses, {
        text: editor.text || "Content",
        target: editor.target,
      }),
    [deferredClasses, editor.tag, editor.target, editor.text],
  );
  const highlighted = useMemo(() => highlightCode(generated), [generated]);
  const duration = numericToken(editor.classes, "animate-duration-", 300);
  const delay = numericToken(editor.classes, "animate-delay-", 0);
  const stiffness = numericToken(editor.classes, "animate-stiffness-", 300);
  const damping = numericToken(editor.classes, "animate-damping-", 24);
  const stageWidth = STAGES.find(({ id }) => id === stage)!.width;
  const activeRecipe = MOTIONWIND_RECIPES.find((recipe) =>
    editor.classes.startsWith(recipe.classes),
  );
  const selectedAdapter =
    editor.target === "javascript" ? "vanilla" : editor.target;
  const recipeSupportsTarget =
    !activeRecipe ||
    activeRecipe.adapters.includes(
      selectedAdapter as "react" | "vue" | "vanilla" | "react-native",
    );

  const applyRecipe = useCallback(
    (recipe: MotionwindRecipe) => {
      updateEditor({
        classes: `${recipe.classes} ${PREVIEW_SKIN}`,
        text: recipe.name,
      });
      setReplayKey((key) => key + 1);
    },
    [updateEditor],
  );
  const copy = useCallback(
    async (kind: "link" | "code") => {
      await navigator.clipboard.writeText(
        kind === "link" ? window.location.href : generated,
      );
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1400);
    },
    [generated],
  );
  const Preview = (
    mw as unknown as Record<
      string,
      ComponentType<{ className?: string; children?: ReactNode }>
    >
  )[editor.tag]!;

  return (
    <main className="min-h-screen bg-surface text-foreground">
      <header className="sticky top-0 z-200 flex h-14 items-center justify-between border-b border-border-subtle bg-surface/80 px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-mono text-xs font-bold tracking-[-0.03em] text-acid hover:text-acid-dim transition-colors"
          >
            motionwind
          </Link>
          <span className="hidden h-4 w-px bg-border-strong sm:block" />
          <div>
            <h1 className="text-xs font-semibold">Motion Studio</h1>
            <p className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-text-muted sm:block">
              Classes in · production code out
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => copy("link")}
            className="cursor-pointer rounded-md border border-border-subtle px-3 py-1.5 text-[11px] text-text-dim transition hover:border-border-strong hover:text-foreground"
          >
            {copied === "link" ? "Link copied" : "Share"}
          </button>
          <button
            type="button"
            onClick={() => copy("code")}
            className="cursor-pointer rounded-md bg-acid px-3 py-1.5 text-[11px] font-bold text-black transition hover:bg-acid-dim"
          >
            {copied === "code" ? "Copied" : "Copy code"}
          </button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-3.5rem)] xl:grid-cols-[220px_minmax(0,1fr)_320px]">
        <aside className="border-b border-border-subtle bg-surface-overlay xl:border-b-0 xl:border-r">
          <div className="border-b border-border-subtle px-4 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
            Reviewed recipes
          </div>
          <div className="grid sm:grid-cols-2 xl:block">
            {MOTIONWIND_RECIPES.map((recipe) => (
              <RecipeButton
                key={recipe.id}
                recipe={recipe}
                active={editor.classes.startsWith(recipe.classes)}
                onClick={() => applyRecipe(recipe)}
              />
            ))}
          </div>
          <div className="m-4 rounded-lg border border-acid/10 bg-acid-soft p-3">
            <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-acid">
              Registry contract
            </div>
            <p className="text-[10px] leading-relaxed text-text-muted">
              Every recipe declares adapters, accessibility guidance, source,
              version, and maintainer.
            </p>
          </div>
        </aside>

        <section className="min-w-0 bg-background">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 md:px-5">
            <div
              className="flex rounded-md border border-border-subtle bg-surface-inset p-0.5"
              aria-label="Preview size"
            >
              {STAGES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  aria-pressed={stage === size.id}
                  onClick={() => setStage(size.id)}
                  className="cursor-pointer rounded px-2.5 py-1 font-mono text-[9px] text-text-muted aria-pressed:bg-surface-overlay aria-pressed:text-foreground"
                >
                  {size.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-pressed={reduceMotion}
                onClick={() => setReduceMotion((value) => !value)}
                className="flex cursor-pointer items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-text-muted hover:text-foreground"
              >
                <span
                  className={`h-2 w-2 rounded-full ${reduceMotion ? "bg-amber-400" : "bg-acid"}`}
                />
                {reduceMotion ? "Reduced" : "Full motion"}
              </button>
              <button
                type="button"
                onClick={() => setReplayKey((key) => key + 1)}
                className="cursor-pointer rounded-md border border-border-subtle px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-text-dim hover:text-acid"
              >
                ↻ Replay
              </button>
            </div>
          </div>

          <div className="studio-checker flex min-h-[430px] items-center justify-center overflow-auto p-5 md:p-10">
            <div
              className="relative flex min-h-[320px] max-w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-raised/90 shadow-[0_30px_90px_#0008] transition-[width] duration-300"
              style={{ width: stageWidth }}
            >
              <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] code-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-acid/70" />
                live viewport · {stageWidth}px
              </div>
              <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
                <Preview key={replayKey} className={editor.classes}>
                  {editor.text}
                </Preview>
              </MotionConfig>
            </div>
          </div>

          <Timeline duration={duration} delay={delay} replayKey={replayKey} />

          <div className="grid border-t border-border-subtle lg:grid-cols-2">
            <div className="border-b border-border-subtle p-4 lg:border-b-0 lg:border-r">
              <ControlLabel htmlFor="studio-classes">
                Motionwind classes
              </ControlLabel>
              <textarea
                id="studio-classes"
                aria-label="Motionwind classes"
                value={editor.classes}
                onChange={(event) =>
                  updateEditor({ classes: event.target.value })
                }
                spellCheck={false}
                rows={6}
                className="w-full resize-y rounded-lg border border-border-subtle bg-surface-inset p-3 font-mono text-[11px] leading-relaxed text-acid outline-none transition focus:border-acid/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              <div>
                <ControlLabel htmlFor="studio-element">Element</ControlLabel>
                <select
                  id="studio-element"
                  aria-label="Element"
                  value={editor.tag}
                  onChange={(event) =>
                    updateEditor({ tag: event.target.value })
                  }
                  className="w-full rounded-lg border border-border-subtle bg-surface-inset p-2 text-xs outline-none focus:border-acid/30"
                >
                  {TAGS.map((tag) => (
                    <option key={tag}>{tag}</option>
                  ))}
                </select>
              </div>
              <div>
                <ControlLabel htmlFor="studio-text">Content</ControlLabel>
                <input
                  id="studio-text"
                  aria-label="Content"
                  value={editor.text}
                  onChange={(event) =>
                    updateEditor({ text: event.target.value })
                  }
                  className="w-full rounded-lg border border-border-subtle bg-surface-inset p-2 text-xs outline-none focus:border-acid/30"
                />
              </div>
              <div className="col-span-2 flex flex-wrap gap-1.5 pt-1">
                {parsed.diagnostics.map((diagnostic) => (
                  <span
                    key={`${diagnostic.code}-${diagnostic.token}`}
                    className="rounded border border-amber-400/15 bg-amber-400/5 px-2 py-1 font-mono text-[9px] text-amber-300"
                  >
                    {diagnostic.message}
                  </span>
                ))}
                {!recipeSupportsTarget ? (
                  <span className="rounded border border-amber-400/15 bg-amber-400/5 px-2 py-1 font-mono text-[9px] text-amber-300">
                    {activeRecipe!.name} is not reviewed for {editor.target}.
                  </span>
                ) : null}
                {parsed.diagnostics.length === 0 && recipeSupportsTarget ? (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                    ✓ syntax valid
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <aside className="border-t border-border-subtle bg-surface-overlay xl:border-l xl:border-t-0">
          <div className="border-b border-border-subtle p-4">
            <div className="grid gap-5">
              <RangeControl
                id="duration"
                label="Duration"
                value={duration}
                min={80}
                max={1600}
                step={20}
                unit="ms"
                onChange={(value) =>
                  updateEditor({
                    classes: replaceClass(
                      editor.classes,
                      /^animate-duration-/,
                      `animate-duration-${value}`,
                    ),
                  })
                }
              />
              <RangeControl
                id="stiffness"
                label="Stiffness"
                value={stiffness}
                min={40}
                max={700}
                step={10}
                onChange={(value) =>
                  updateEditor({
                    classes: replaceClass(
                      editor.classes,
                      /^animate-stiffness-/,
                      `animate-stiffness-${value}`,
                    ),
                  })
                }
              />
              <RangeControl
                id="damping"
                label="Damping"
                value={damping}
                min={4}
                max={60}
                onChange={(value) =>
                  updateEditor({
                    classes: replaceClass(
                      editor.classes,
                      /^animate-damping-/,
                      `animate-damping-${value}`,
                    ),
                  })
                }
              />
            </div>
          </div>

          <div className="border-b border-border-subtle p-4">
            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
              Export target
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TARGETS.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  aria-pressed={editor.target === target.id}
                  onClick={() => updateEditor({ target: target.id })}
                  className="cursor-pointer rounded-md border border-border-subtle px-2 py-2 text-[10px] text-text-muted transition hover:text-foreground hover:border-acid/30 aria-pressed:border-acid/20 aria-pressed:bg-acid-soft aria-pressed:text-acid"
                >
                  {target.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
              <span>Production output</span>
              <span className="text-acid">{editor.target}</span>
            </div>
            <pre className="max-h-[430px] overflow-auto rounded-lg border border-border-subtle bg-surface-inset p-3 font-mono text-[10px] leading-relaxed">
              <code>{highlighted}</code>
            </pre>
          </div>
        </aside>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? `${copied} copied` : ""}
      </span>
    </main>
  );
}
