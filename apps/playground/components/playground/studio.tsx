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
import { MotionConfig } from "motion/react";
import {
  MOTIONWIND_RECIPES,
  mw,
  parseMotionClasses,
  type MotionwindRecipe,
} from "motionwind-react";
import { generateMotionCode } from "motionwind-react/tooling";
import { highlightCode } from "@/lib/highlight";

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
const PREVIEW_SKIN =
  "rounded-xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-[var(--color-accent-fg)]";
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
      className="mb-2 flex items-center justify-between font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)]"
    >
      <span>{children}</span>
      {value ? (
        <span className="text-[var(--color-accent)]">{value}</span>
      ) : null}
    </label>
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
    <div className="border-t border-[var(--color-border)] px-5 py-4">
      <div className="mb-3 flex items-center justify-between font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
        <span>Timeline</span>
        <span>{total}ms</span>
      </div>
      <div className="studio-timeline relative h-8 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div
          className="absolute inset-y-0 border-r border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/60"
          style={{ width: `${(delay / total) * 100}%` }}
        />
        <div
          key={replayKey}
          className="studio-playhead absolute inset-y-0 w-px bg-[var(--color-accent)] shadow-[0_0_12px_var(--acid-glow)]"
          style={{ animationDuration: `${Math.max(total, 240)}ms` }}
        />
        <div className="absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-[var(--color-accent)]/10 via-[var(--color-accent)]/60 to-[var(--color-accent)]/10" />
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
      className="group w-full cursor-pointer border-b border-[var(--color-border-subtle)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface)] aria-pressed:bg-[var(--color-accent)]/[0.06]"
    >
      <span className="mb-1 flex items-center justify-between text-xs font-semibold text-[var(--color-fg)]">
        {recipe.name}
        <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)] group-aria-pressed:text-[var(--color-accent)]">
          {recipe.category}
        </span>
      </span>
      <span className="block text-[11px] leading-relaxed text-[var(--color-fg-muted)]">
        {recipe.description}
      </span>
    </button>
  );
}

export function PlaygroundStudio() {
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
    <div className="mt-6">
      {/* Recipe selector + Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-dashed border-[var(--color-border)] rounded-lg px-4 py-3 mb-4">
        <div
          className="flex rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5"
          aria-label="Preview size"
        >
          {STAGES.map((size) => (
            <button
              key={size.id}
              type="button"
              aria-pressed={stage === size.id}
              onClick={() => setStage(size.id)}
              className="cursor-pointer rounded px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)] aria-pressed:bg-[var(--color-surface-elevated)] aria-pressed:text-[var(--color-fg)]"
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
            className="flex cursor-pointer items-center gap-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            <span
              className={`h-2 w-2 rounded-full ${reduceMotion ? "bg-amber-400" : "bg-[var(--color-accent)]"}`}
            />
            {reduceMotion ? "Reduced" : "Full motion"}
          </button>
          <button
            type="button"
            onClick={() => setReplayKey((key) => key + 1)}
            className="cursor-pointer rounded-md border border-[var(--color-border)] px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)] hover:text-[var(--color-accent)]"
          >
            Replay
          </button>
          <button
            type="button"
            onClick={() => copy("link")}
            className="cursor-pointer rounded-md border border-[var(--color-border)] px-3 py-1.5 text-[11px] text-[var(--color-fg-muted)] transition hover:border-[var(--color-border)] hover:text-[var(--color-fg)]"
          >
            {copied === "link" ? "Link copied" : "Share"}
          </button>
          <button
            type="button"
            onClick={() => copy("code")}
            className="cursor-pointer rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-accent-fg)] transition hover:bg-[var(--color-accent-hover)]"
          >
            {copied === "code" ? "Copied" : "Copy code"}
          </button>
        </div>
      </div>

      {/* Recipe list — horizontal scroll */}
      <div className="border border-dashed border-[var(--color-border)] rounded-lg overflow-hidden mb-4">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          Recipes
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 max-h-[240px] overflow-y-auto">
          {MOTIONWIND_RECIPES.map((recipe) => (
            <RecipeButton
              key={recipe.id}
              recipe={recipe}
              active={editor.classes.startsWith(recipe.classes)}
              onClick={() => applyRecipe(recipe)}
            />
          ))}
        </div>
      </div>

      {/* Live preview */}
      <div className="studio-checker flex min-h-[320px] items-center justify-center overflow-auto p-5 rounded-lg border border-dashed border-[var(--color-border)]">
        <div
          className="relative flex min-h-[260px] max-w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--color-surface-elevated)] shadow-[0_30px_90px_#0008] transition-[width] duration-300"
          style={{ width: stageWidth }}
        >
          <div className="absolute left-4 top-4 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.18em] text-[var(--color-code-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]/70" />
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

      {/* Controls + Code output */}
      <div className="grid border border-dashed border-[var(--color-border)] rounded-lg overflow-hidden mt-4 lg:grid-cols-2">
        <div className="border-b border-[var(--color-border)] p-4 lg:border-b-0 lg:border-r">
          <ControlLabel htmlFor="studio-classes">
            Motionwind classes
          </ControlLabel>
          <textarea
            id="studio-classes"
            aria-label="Motionwind classes"
            value={editor.classes}
            onChange={(event) => updateEditor({ classes: event.target.value })}
            spellCheck={false}
            rows={6}
            className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-accent)] outline-none transition focus:border-[var(--color-accent)]/30"
          />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <ControlLabel htmlFor="studio-element">Element</ControlLabel>
              <select
                id="studio-element"
                aria-label="Element"
                value={editor.tag}
                onChange={(event) => updateEditor({ tag: event.target.value })}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-xs outline-none focus:border-[var(--color-accent)]/30"
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
                onChange={(event) => updateEditor({ text: event.target.value })}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-xs outline-none focus:border-[var(--color-accent)]/30"
              />
            </div>
          </div>
          <div className="col-span-2 flex flex-wrap gap-1.5 pt-3">
            {parsed.diagnostics.map((diagnostic) => (
              <span
                key={`${diagnostic.code}-${diagnostic.token}`}
                className="rounded border border-amber-400/15 bg-amber-400/5 px-2 py-1 font-[family-name:var(--font-mono)] text-[9px] text-amber-300"
              >
                {diagnostic.message}
              </span>
            ))}
            {!recipeSupportsTarget ? (
              <span className="rounded border border-amber-400/15 bg-amber-400/5 px-2 py-1 font-[family-name:var(--font-mono)] text-[9px] text-amber-300">
                {activeRecipe!.name} is not reviewed for {editor.target}.
              </span>
            ) : null}
            {parsed.diagnostics.length === 0 && recipeSupportsTarget ? (
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-emerald-400">
                syntax valid
              </span>
            ) : null}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            <span>Production output</span>
            <span className="text-[var(--color-accent)]">{editor.target}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {TARGETS.map((target) => (
              <button
                key={target.id}
                type="button"
                aria-pressed={editor.target === target.id}
                onClick={() => updateEditor({ target: target.id })}
                className="cursor-pointer rounded-md border border-[var(--color-border)] px-2 py-2 text-[10px] text-[var(--color-fg-muted)] transition hover:text-[var(--color-fg)] hover:border-[var(--color-accent)]/30 aria-pressed:border-[var(--color-accent)]/20 aria-pressed:bg-[var(--color-accent)]/[0.06] aria-pressed:text-[var(--color-accent)]"
              >
                {target.label}
              </button>
            ))}
          </div>
          <pre className="max-h-[400px] overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-code-bg)] p-3 font-[family-name:var(--font-mono)] text-[10px] leading-relaxed">
            <code>{highlighted}</code>
          </pre>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {copied ? `${copied} copied` : ""}
      </span>
    </div>
  );
}
