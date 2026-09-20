import type { ReactNode } from "react";

type ComponentPreviewCardProps = {
  title: string;
  preview: ReactNode;
};

/** Shared landing-page shell for every live component preview. */
export function ComponentPreviewCard({
  title,
  preview,
}: ComponentPreviewCardProps) {
  return (
    <article className="relative flex h-[308.5px] flex-col overflow-hidden rounded-xl border border-border bg-transparent p-1.5 text-left">
      <div className="flex h-11 shrink-0 items-center px-3">
        <span className="truncate text-base font-medium text-fg-muted">
          {title}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-5">
        {preview}
      </div>
    </article>
  );
}
