import { animate, hover, press, inView, scroll } from "motion";
import { parseMotionClasses, type ParsedResult } from "motionwind-core";
import { toAnimateOptions, baseValues, subset } from "./map.js";

export interface MotionwindOptions {
  /** Where to scan for motion elements. Defaults to `document`. */
  root?: ParentNode;
  /** Selector for candidate elements. Defaults to `[class*="animate-"]`. */
  selector?: string;
  /** Honor `prefers-reduced-motion` (jump to final state, no motion). Default true. */
  respectReducedMotion?: boolean;
  /** Watch the DOM and wire elements added after init (SPA/HTMX). Default false. */
  observe?: boolean;
}

const anim = animate as any;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Wire a single element's gestures/enter/scroll animations. Returns cleanup. */
function wireElement(
  el: HTMLElement,
  parsed: ParsedResult,
  reduce: boolean,
): () => void {
  const opts = toAnimateOptions(parsed.transition);
  const base = baseValues(parsed);
  const cleanups: Array<() => void> = [];

  // Strip animate-* classes; keep the passthrough (Tailwind/util) classes. This
  // also makes re-scans idempotent — a wired element no longer matches the
  // `animate-*` selector.
  el.className = parsed.tailwindClasses;

  // Reduced motion: jump straight to the final resting/visible state with no
  // animation, and skip all interactive + scroll wiring.
  if (reduce) {
    const rest = {
      ...(parsed.gestures.animate ?? {}),
      ...(parsed.gestures.whileInView ?? {}),
    };
    if (Object.keys(rest).length > 0) anim(el, rest, { duration: 0 });
    return () => {};
  }

  // Initial state (applied instantly), then enter animation.
  if (parsed.gestures.initial) anim(el, parsed.gestures.initial, { duration: 0 });
  if (parsed.gestures.animate) anim(el, parsed.gestures.animate, opts);

  // Hover
  const whileHover = parsed.gestures.whileHover;
  if (whileHover) {
    cleanups.push(
      hover(el, () => {
        anim(el, whileHover, opts);
        return () => anim(el, subset(base, whileHover), opts);
      }),
    );
  }

  // Tap / press
  const whileTap = parsed.gestures.whileTap;
  if (whileTap) {
    cleanups.push(
      press(el, () => {
        anim(el, whileTap, opts);
        return () => anim(el, subset(base, whileTap), opts);
      }),
    );
  }

  // Focus
  const whileFocus = parsed.gestures.whileFocus;
  if (whileFocus) {
    const onFocus = () => anim(el, whileFocus, opts);
    const onBlur = () => anim(el, subset(base, whileFocus), opts);
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    cleanups.push(() => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    });
  }

  // In view
  const whileInView = parsed.gestures.whileInView;
  if (whileInView) {
    const viewportOpts: Record<string, unknown> = {};
    if (parsed.viewport.amount !== undefined) viewportOpts.amount = parsed.viewport.amount;
    if (parsed.viewport.margin !== undefined) viewportOpts.margin = parsed.viewport.margin;
    cleanups.push(
      inView(
        el,
        () => {
          anim(el, whileInView, opts);
          if (parsed.viewport.once) return;
          return () => anim(el, subset(base, whileInView), opts);
        },
        viewportOpts,
      ),
    );
  }

  // Scroll-linked: drive style values from scroll progress.
  if (Object.keys(parsed.scroll.values).length > 0) {
    // Motion's ScrollOptions.offset is a strict string union; our offset is
    // user-provided, so cast the options bag.
    const scrollOpts: any = parsed.scroll.container
      ? { axis: parsed.scroll.axis }
      : { target: el, axis: parsed.scroll.axis, offset: parsed.scroll.offset };
    const stop = scroll(anim(el, parsed.scroll.values, { ease: "linear" }), scrollOpts);
    if (typeof stop === "function") cleanups.push(stop);
  }

  return () => cleanups.forEach((fn) => fn());
}

/**
 * Scan the DOM for elements with `animate-*` classes and wire up their
 * animations using the vanilla Motion API. Returns a cleanup function.
 *
 * Supports: initial/enter, hover, tap, focus, in-view, and scroll-linked.
 * Honors `prefers-reduced-motion`, is idempotent across re-runs, and can watch
 * for dynamically-added elements via `{ observe: true }`.
 * (drag, layout, exit, and variant propagation are React/Vue-only.)
 *
 * @example
 * ```js
 * import { motionwind } from "motionwind-vanilla";
 * const stop = motionwind({ observe: true });
 * ```
 */
export function motionwind(options: MotionwindOptions = {}): () => void {
  const root = options.root ?? (typeof document !== "undefined" ? document : null);
  if (!root) return () => {};

  const selector = options.selector ?? '[class*="animate-"]';
  const reduce = (options.respectReducedMotion ?? true) && prefersReducedMotion();
  const cleanups: Array<() => void> = [];

  const wire = (el: HTMLElement) => {
    try {
      const parsed = parseMotionClasses(el.className);
      if (parsed.hasMotion) cleanups.push(wireElement(el, parsed, reduce));
    } catch (err) {
      // A single malformed element/class must never break the whole page.
      if (typeof console !== "undefined") {
        console.warn(
          "[motionwind-vanilla] failed to animate an element; skipping it.",
          el,
          err,
        );
      }
    }
  };

  root.querySelectorAll<HTMLElement>(selector).forEach(wire);

  if (options.observe && typeof MutationObserver !== "undefined") {
    const target =
      root instanceof Document ? (root.body ?? root.documentElement) : root;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(selector)) wire(node);
          node.querySelectorAll<HTMLElement>(selector).forEach(wire);
        });
      }
    });
    observer.observe(target as Node, { childList: true, subtree: true });
    cleanups.push(() => observer.disconnect());
  }

  return () => cleanups.forEach((fn) => fn());
}

export { parseMotionClasses } from "motionwind-core";
export type { ParsedResult } from "motionwind-core";
