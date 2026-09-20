import type { ReactNode } from "react";

type ComponentPreviewCardProps = {
  title: string;
  preview: ReactNode;
<<<<<<< HEAD
=======
  animationDelay?: number;
>>>>>>> origin/codex/playground-ui-reliability
};

/** Shared landing-page shell for every live component preview. */
export function ComponentPreviewCard({
  title,
  preview,
<<<<<<< HEAD
}: ComponentPreviewCardProps) {
  return (
    <article className="relative flex h-[308.5px] flex-col overflow-hidden rounded-xl border border-border bg-transparent p-1.5 text-left">
=======
  animationDelay = 0,
}: ComponentPreviewCardProps) {
  return (
    <article className="group relative flex h-[308.5px] flex-col overflow-hidden rounded-xl border border-border bg-transparent p-1.5 text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/25">
>>>>>>> origin/codex/playground-ui-reliability
      <div className="flex h-11 shrink-0 items-center px-3">
        <span className="truncate text-base font-medium text-fg-muted">
          {title}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-5">
<<<<<<< HEAD
        {preview}
=======
        <div
          className="web-component-loop"
          style={{ animationDelay: `${animationDelay}ms` }}
        >
          {preview}
        </div>
>>>>>>> origin/codex/playground-ui-reliability
      </div>
    </article>
  );
}
