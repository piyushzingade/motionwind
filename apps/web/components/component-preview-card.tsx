import type { ReactNode } from "react";

type ComponentPreviewCardProps = {
  title: string;
  preview: ReactNode;
  animationDelay?: number;
};

/** Shared landing-page shell for every live component preview. */
export function ComponentPreviewCard({
  title,
  preview,
  animationDelay = 0,
}: ComponentPreviewCardProps) {
  return (
    <article className="group relative flex h-[308.5px] flex-col overflow-hidden rounded-xl border border-border bg-transparent p-1.5 text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/25">
      <div className="flex h-11 shrink-0 items-center px-3">
        <span className="truncate text-base font-medium text-fg-muted">
          {title}
        </span>
      </div>
      <div className="studio-checker flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-5">
        <div
          className="web-component-loop"
          style={{ animationDelay: `${animationDelay}ms` }}
        >
          {preview}
        </div>
      </div>
    </article>
  );
}
