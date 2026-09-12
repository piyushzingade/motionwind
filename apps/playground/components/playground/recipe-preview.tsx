"use client";

import {
  ArrowsClockwiseIcon,
  BarcodeIcon,
  BellIcon,
  BrowserIcon,
  CardsThreeIcon,
  ChartLineIcon,
  ChatCircleDotsIcon,
  ChatTeardropIcon,
  CircleDashedIcon,
  CopyIcon,
  CursorClickIcon,
  DotsSixVerticalIcon,
  EyeIcon,
  FilmStripIcon,
  GaugeIcon,
  HandIcon,
  LinkIcon,
  LineSegmentIcon,
  ListDashesIcon,
  MagnetIcon,
  MinusIcon,
  NewspaperIcon,
  NumberCircleOneIcon,
  PathIcon,
  RowsIcon,
  ShapesIcon,
  SidebarIcon,
  SparkleIcon,
  SpinnerGapIcon,
  StackIcon,
  StepsIcon,
  TrashIcon,
  WaveformIcon,
  XIcon,
} from "@phosphor-icons/react";
import { mw } from "motionwind-react";
import type { MotionwindRecipe } from "motionwind-react";
import { PREVIEW_SKIN } from "@/lib/types";

const SKIN_TOKENS = new Set(PREVIEW_SKIN.split(" "));

/** Recipe classes minus the default accent button skin scenes replace. */
function motionClasses(classes: string): string {
  return classes
    .split(/\s+/)
    .filter((token) => token && !SKIN_TOKENS.has(token))
    .join(" ");
}

interface SceneProps {
  mc: string;
  text: string;
}

function SceneShell({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3 p-6">
      <div className="flex min-h-[180px] w-full items-center justify-center">
        {children}
      </div>
      <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-[var(--color-code-muted)]">
        {label}
      </p>
    </div>
  );
}

const MENU_ITEMS = [
  { icon: CopyIcon, label: "Copy classes" },
  { icon: LinkIcon, label: "Open in playground" },
  { icon: TrashIcon, label: "Delete draft" },
];

function ButtonPressScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Hover · tap · spring">
      <mw.button
        className={`${mc} cursor-pointer rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-fg)]`}
      >
        {text}
      </mw.button>
    </SceneShell>
  );
}

function MagneticButtonScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Hover · subtle spring">
      <mw.button
        className={`${mc} inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-3 text-sm font-semibold text-[var(--color-fg)]`}
      >
        <MagnetIcon size={15} className="text-[var(--color-accent)]" />
        {text}
      </mw.button>
    </SceneShell>
  );
}

function CardHoverScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Hover · lift + spring">
      <mw.article
        className={`${mc} w-full max-w-[280px] cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-[0_18px_55px_var(--color-shadow)]`}
      >
        <div className="text-sm font-semibold text-[var(--color-fg)]">
          {text}
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-fg-muted)]">
          Lift, scale, and spring response in a single class list.
        </p>
      </mw.article>
    </SceneShell>
  );
}

function FlipCardScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Hover · 3-D flip">
      <div className="[perspective:900px]">
        <mw.div
          className={`${mc} relative h-36 w-56 cursor-pointer [transform-style:preserve-3d]`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] [backface-visibility:hidden]">
            <CardsThreeIcon size={22} className="text-[var(--color-accent)]" />
            <span className="text-sm font-semibold text-[var(--color-fg)]">
              {text}
            </span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-[var(--color-accent)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-sm font-semibold text-[var(--color-accent-fg)]">
              Back face
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-accent-fg)]/80">
              rotate-y-180
            </span>
          </div>
        </mw.div>
      </div>
    </SceneShell>
  );
}

function RippleScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Tap · radial burst">
      <div className="relative flex h-28 w-56 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <mw.span
          className={`${mc} pointer-events-none absolute h-10 w-10 rounded-full border-2 border-[var(--color-accent)]`}
          aria-hidden="true"
        />
        <span className="relative text-xs font-medium text-[var(--color-fg-muted)]">
          {text}
        </span>
      </div>
    </SceneShell>
  );
}

function DragRow({
  mc,
  label,
  hero,
}: {
  mc: string;
  label: string;
  hero?: boolean;
}) {
  const content = (
    <>
      <DotsSixVerticalIcon
        size={14}
        className="shrink-0 text-[var(--color-code-muted)]"
      />
      <span className="truncate text-xs font-medium">{label}</span>
    </>
  );
  const skin =
    "flex w-full max-w-[260px] items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-[var(--color-fg)]";
  return hero ? (
    <mw.div className={`${mc} ${skin} cursor-grab active:cursor-grabbing`}>
      {content}
    </mw.div>
  ) : (
    <div className={`${skin} opacity-60`}>{content}</div>
  );
}

function SortableScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Drag vertically · snap back">
      <div className="flex w-full flex-col items-center gap-2">
        <DragRow mc={mc} label="Intro block" />
        <DragRow mc={mc} label={text} hero />
        <DragRow mc={mc} label="Outro block" />
      </div>
    </SceneShell>
  );
}

function DialogScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Enter · fade + lift">
      <mw.div
        role="dialog"
        aria-label={text}
        className={`${mc} w-full max-w-[300px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-[0_18px_55px_var(--color-shadow)]`}
      >
        <h3 className="text-sm font-semibold text-[var(--color-fg)]">{text}</h3>
        <div className="mt-3 space-y-2" aria-hidden="true">
          <div className="h-2.5 w-full rounded-full bg-[var(--color-border)]" />
          <div className="h-2.5 w-4/5 rounded-full bg-[var(--color-border)]" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <span className="rounded-md px-3 py-1.5 text-xs font-medium text-[var(--color-fg-muted)]">
            Cancel
          </span>
          <span className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--color-accent-fg)]">
            Confirm
          </span>
        </div>
      </mw.div>
    </SceneShell>
  );
}

function MenuScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Enter · scale + fade">
      <mw.div
        role="menu"
        aria-label={text}
        className={`${mc} w-60 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1.5 shadow-[0_18px_55px_var(--color-shadow)]`}
      >
        {MENU_ITEMS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            role="menuitem"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[var(--color-fg)]"
          >
            <Icon size={14} className="text-[var(--color-fg-muted)]" />
            {label}
          </div>
        ))}
      </mw.div>
    </SceneShell>
  );
}

function ToastScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Enter · slide from edge">
      <mw.div
        role="status"
        className={`${mc} flex w-full max-w-[320px] items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-3 shadow-[0_18px_55px_var(--color-shadow)]`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/[0.12]">
          <BellIcon
            size={14}
            weight="fill"
            className="text-[var(--color-accent)]"
          />
        </span>
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-[var(--color-fg)]">
          {text}
        </span>
        <XIcon size={13} className="shrink-0 text-[var(--color-fg-muted)]" />
      </mw.div>
    </SceneShell>
  );
}

function TooltipScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Enter · pop on hover target">
      <div className="relative flex h-32 items-end justify-center">
        <span className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-xs font-medium text-[var(--color-fg)]">
          Hover target
        </span>
        <mw.div
          role="tooltip"
          className={`${mc} absolute bottom-16 whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-xs text-[var(--color-fg)] shadow-[0_18px_55px_var(--color-shadow)]`}
        >
          {text}
        </mw.div>
      </div>
    </SceneShell>
  );
}

function PopoverScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Enter · drop + fade">
      <div className="flex flex-col items-center gap-0">
        <span className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-[var(--color-accent-fg)]">
          Trigger
        </span>
        <mw.div
          className={`${mc} mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 shadow-[0_18px_55px_var(--color-shadow)]`}
        >
          <p className="text-xs font-semibold text-[var(--color-fg)]">{text}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-fg-muted)]">
            Anchored content that drops in and returns focus on close.
          </p>
        </mw.div>
      </div>
    </SceneShell>
  );
}

function DrawerScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Enter · slide from edge">
      <div className="relative h-56 w-full max-w-md overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div
          className="absolute inset-y-0 left-0 flex w-24 flex-col gap-2 p-3"
          aria-hidden="true"
        >
          <div className="h-6 w-6 rounded-full bg-[var(--color-border)]" />
          <div className="h-2 w-full rounded-full bg-[var(--color-border)]" />
          <div className="h-2 w-4/5 rounded-full bg-[var(--color-border)]" />
        </div>
        <mw.aside
          className={`${mc} absolute inset-y-0 right-0 w-60 border-l border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4`}
        >
          <div className="text-sm font-semibold text-[var(--color-fg)]">
            {text}
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--color-fg-muted)]">
            Slides in and exits with the same class language.
          </p>
        </mw.aside>
      </div>
    </SceneShell>
  );
}

function TickerTape({
  mc,
  items,
  icon,
}: {
  mc: string;
  items: string[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-3">
      <mw.div
        className={`${mc} flex w-max items-center gap-8 whitespace-nowrap px-4`}
      >
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-fg-muted)]"
          >
            {icon}
            {item}
          </span>
        ))}
      </mw.div>
    </div>
  );
}

function TickerScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Loop · edge to edge">
      <TickerTape
        mc={mc}
        items={[text, "Deploy succeeded", "Invite accepted", text]}
      />
    </SceneShell>
  );
}

function MarqueeScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Loop · infinite strip">
      <TickerTape
        mc={mc}
        items={[text, "Spring physics", "Zero runtime", text, "Build time"]}
        icon={
          <SparkleIcon
            size={12}
            weight="fill"
            className="text-[var(--color-accent)]"
          />
        }
      />
    </SceneShell>
  );
}

function StackedRows({
  mc,
  rows,
}: {
  mc: string;
  rows: { icon: React.ReactNode; title: string; body: string }[];
}) {
  return (
    <div className="flex w-full max-w-[300px] flex-col gap-2">
      {rows.map((row) => (
        <mw.div
          key={row.title}
          className={`${mc} flex items-start gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3`}
        >
          {row.icon}
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[var(--color-fg)]">
              {row.title}
            </p>
            <p className="truncate text-[11px] text-[var(--color-fg-muted)]">
              {row.body}
            </p>
          </div>
        </mw.div>
      ))}
    </div>
  );
}

function NotificationScene({ mc, text }: SceneProps) {
  const icon = (
    <BellIcon
      size={14}
      weight="fill"
      className="mt-0.5 shrink-0 text-[var(--color-accent)]"
    />
  );
  return (
    <SceneShell label="Enter · staggered stack">
      <StackedRows
        mc={mc}
        rows={[
          { icon, title: text, body: "Just now · review requested" },
          { icon, title: "Deploy succeeded", body: "2m ago · production" },
          { icon, title: "Invite accepted", body: "9m ago · workspace" },
        ]}
      />
    </SceneShell>
  );
}

function ListStaggerScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Enter · staggered rows">
      <mw.ul className="flex w-full max-w-[280px] flex-col gap-1.5">
        {[text, "Second item", "Third item", "Fourth item"].map((label) => (
          <mw.li
            key={label}
            className={`${mc} flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-xs text-[var(--color-fg)]`}
          >
            <RowsIcon size={14} className="text-[var(--color-fg-muted)]" />
            {label}
          </mw.li>
        ))}
      </mw.ul>
    </SceneShell>
  );
}

const STEPS = ["Design", "Build", "Ship"];

function StepperScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Enter · sequential steps">
      <div className="flex w-full max-w-[340px] items-start justify-between gap-1">
        {STEPS.map((step, index) => (
          <mw.div
            key={step}
            className={`${mc} flex flex-1 flex-col items-center gap-1.5`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--color-accent-fg)]">
              {index + 1}
            </span>
            <span className="text-[11px] font-medium text-[var(--color-fg)]">
              {index === 0 ? text : step}
            </span>
          </mw.div>
        ))}
      </div>
    </SceneShell>
  );
}

function AccordionScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Layout · size-aware reveal">
      <div className="w-full max-w-[300px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--color-fg)]">
          <MinusIcon size={14} className="text-[var(--color-accent)]" />
          {text}
        </div>
        <mw.div
          className={`${mc} border-t border-[var(--color-border-subtle)] px-4 py-3`}
        >
          <p className="text-xs leading-relaxed text-[var(--color-fg-muted)]">
            Expandable content that grows with layout animation.
          </p>
        </mw.div>
      </div>
    </SceneShell>
  );
}

const TABS = ["Overview", "Code", "Preview"];

function TabIndicatorScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Layout · shared indicator">
      <div
        role="tablist"
        aria-label={text}
        className="flex gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1"
      >
        {TABS.map((tab, index) => (
          <div key={tab} className="relative px-4 py-2">
            <span
              role="tab"
              aria-selected={index === 1}
              className={`relative z-10 text-xs font-medium ${index === 1 ? "text-[var(--color-accent-fg)]" : "text-[var(--color-fg-muted)]"}`}
            >
              {tab}
            </span>
            {index === 1 ? (
              <mw.span
                className={`${mc} absolute inset-0 rounded-lg bg-[var(--color-accent)]`}
                aria-hidden="true"
              />
            ) : null}
          </div>
        ))}
      </div>
    </SceneShell>
  );
}

function LoadingOrbitScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Loop · continuous rotation">
      <div
        role="status"
        aria-label={text}
        className="flex flex-col items-center gap-3"
      >
        <mw.div
          className={`${mc} h-11 w-11 rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-accent)]`}
          aria-hidden="true"
        />
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
          <SpinnerGapIcon size={13} className="animate-spin" />
          {text}
        </span>
      </div>
    </SceneShell>
  );
}

function SvgLineLoaderScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Loop · path draw">
      <div
        role="status"
        aria-label={text}
        className="flex w-full max-w-[280px] flex-col items-center gap-2"
      >
        <svg
          viewBox="0 0 200 64"
          fill="none"
          className="w-full"
          aria-hidden="true"
        >
          <mw.path
            className={mc}
            d="M8 40 C 55 8, 90 58, 130 30 S 175 20, 192 34"
            stroke="var(--color-accent)"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </svg>
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-fg-muted)]">
          <PathIcon size={12} className="text-[var(--color-accent)]" />
          {text}
        </span>
      </div>
    </SceneShell>
  );
}

function ScrollProgressScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Scroll · scaleX 0 → 1">
      <div className="w-full max-w-[300px]">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
          <mw.div
            className={`${mc} h-full w-full origin-left rounded-full bg-[var(--color-accent)]`}
          />
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-fg-muted)]">
          <ChartLineIcon size={12} className="text-[var(--color-accent)]" />
          {text} · scroll the page to drive it
        </p>
      </div>
    </SceneShell>
  );
}

function SkeletonScene({ mc }: SceneProps) {
  return (
    <SceneShell label="Loop · placeholder pulse">
      <div
        className="w-full max-w-[260px] space-y-2.5"
        aria-busy="true"
        aria-label="Loading content"
      >
        <mw.div className={`${mc} h-4 rounded-full bg-[var(--color-border)]`} />
        <mw.div
          className={`${mc} h-4 w-4/5 rounded-full bg-[var(--color-border)]`}
        />
        <mw.div className={`${mc} h-20 rounded-xl bg-[var(--color-border)]`} />
      </div>
    </SceneShell>
  );
}

function ShimmerScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Loop · gradient sweep">
      <div className="relative w-full max-w-[280px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <div className="flex items-center gap-2">
          <SparkleIcon
            size={14}
            weight="fill"
            className="text-[var(--color-accent)]"
          />
          <span className="text-xs font-semibold text-[var(--color-fg)]">
            {text}
          </span>
        </div>
        <div className="mt-3 space-y-2" aria-hidden="true">
          <div className="h-2.5 w-full rounded-full bg-[var(--color-border)]" />
          <div className="h-2.5 w-3/5 rounded-full bg-[var(--color-border)]" />
        </div>
        <mw.div
          className={`${mc} pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10`}
          aria-hidden="true"
        />
      </div>
    </SceneShell>
  );
}

function ProgressBarScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="InView · width fill">
      <div className="w-full max-w-[300px]">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1.5 font-medium text-[var(--color-fg)]">
            <GaugeIcon size={13} className="text-[var(--color-accent)]" />
            {text}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[var(--color-fg-muted)]">
            100%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={text}
          className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
        >
          <mw.div
            className={`${mc} h-full rounded-full bg-[var(--color-accent)]`}
          />
        </div>
      </div>
    </SceneShell>
  );
}

function NumberCounterScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="InView · fade + rise">
      <div className="flex flex-col items-center gap-1">
        <mw.div
          className={`${mc} text-5xl font-bold tabular-nums tracking-tight text-[var(--color-fg)]`}
        >
          128
        </mw.div>
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
          <NumberCircleOneIcon
            size={13}
            className="text-[var(--color-accent)]"
          />
          {text}
        </span>
      </div>
    </SceneShell>
  );
}

function PageRevealScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="InView · section reveal">
      <mw.article
        className={`${mc} w-full max-w-[300px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5`}
      >
        <p className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          <EyeIcon size={12} />
          Section
        </p>
        <h3 className="mt-2 text-lg font-bold tracking-tight text-[var(--color-fg)]">
          {text}
        </h3>
        <div className="mt-3 space-y-2" aria-hidden="true">
          <div className="h-2.5 w-full rounded-full bg-[var(--color-border)]" />
          <div className="h-2.5 w-2/3 rounded-full bg-[var(--color-border)]" />
        </div>
      </mw.article>
    </SceneShell>
  );
}

function ParallaxScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Scroll · depth layer">
      <div className="relative h-52 w-full max-w-md overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div
          className="absolute -left-8 top-6 h-28 w-28 rounded-full bg-[var(--color-accent)]/[0.14]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-6 bottom-4 h-20 w-20 rounded-full bg-[var(--color-accent)]/[0.1]"
          aria-hidden="true"
        />
        <mw.div
          className={`${mc} absolute left-1/2 top-14 w-56 -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3.5 shadow-[0_18px_55px_var(--color-shadow)]`}
        >
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-fg)]">
            <WaveformIcon size={14} className="text-[var(--color-accent)]" />
            {text}
          </p>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-fg-muted)]">
            Layer follows scroll progress
          </p>
        </mw.div>
      </div>
    </SceneShell>
  );
}

function BlobMorphScene({ mc, text }: SceneProps) {
  return (
    <SceneShell label="Loop · organic morph">
      <div className="flex flex-col items-center gap-3">
        <mw.div
          className={`${mc} h-32 w-32 bg-[var(--color-accent)]/[0.28]`}
          role="img"
          aria-label={`${text} (decorative)`}
        />
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-fg-muted)]">
          <ShapesIcon size={12} className="text-[var(--color-accent)]" />
          {text} · aria-hidden in production
        </span>
      </div>
    </SceneShell>
  );
}

const SCENES: Record<string, (props: SceneProps) => React.ReactNode> = {
  "button-press": ButtonPressScene,
  "magnetic-button": MagneticButtonScene,
  "card-hover": CardHoverScene,
  "flip-card": FlipCardScene,
  ripple: RippleScene,
  "sortable-item": SortableScene,
  "drag-reorder": SortableScene,
  "dialog-enter": DialogScene,
  "menu-pop": MenuScene,
  "toast-enter": ToastScene,
  "tooltip-pop": TooltipScene,
  "popover-reveal": PopoverScene,
  drawer: DrawerScene,
  ticker: TickerScene,
  marquee: MarqueeScene,
  "notification-stack": NotificationScene,
  "list-stagger": ListStaggerScene,
  stepper: StepperScene,
  "accordion-reveal": AccordionScene,
  "tab-indicator": TabIndicatorScene,
  "loading-orbit": LoadingOrbitScene,
  "svg-line-loader": SvgLineLoaderScene,
  "scroll-progress": ScrollProgressScene,
  "skeleton-pulse": SkeletonScene,
  "shimmer-load": ShimmerScene,
  "progress-bar": ProgressBarScene,
  "number-counter": NumberCounterScene,
  "page-reveal": PageRevealScene,
  "parallax-scroll": ParallaxScene,
  "blob-morph": BlobMorphScene,
};

export const RECIPE_SCENE_ICONS: Record<string, typeof CursorClickIcon> = {
  "button-press": CursorClickIcon,
  "magnetic-button": MagnetIcon,
  "card-hover": CardsThreeIcon,
  "flip-card": ArrowsClockwiseIcon,
  ripple: CircleDashedIcon,
  "sortable-item": RowsIcon,
  "drag-reorder": HandIcon,
  "dialog-enter": BrowserIcon,
  "menu-pop": ListDashesIcon,
  "toast-enter": BellIcon,
  "tooltip-pop": ChatTeardropIcon,
  "popover-reveal": ChatCircleDotsIcon,
  drawer: SidebarIcon,
  ticker: NewspaperIcon,
  marquee: FilmStripIcon,
  "notification-stack": StackIcon,
  "list-stagger": RowsIcon,
  stepper: StepsIcon,
  "accordion-reveal": MinusIcon,
  "tab-indicator": LineSegmentIcon,
  "loading-orbit": SpinnerGapIcon,
  "svg-line-loader": PathIcon,
  "scroll-progress": ChartLineIcon,
  "skeleton-pulse": BarcodeIcon,
  "shimmer-load": SparkleIcon,
  "progress-bar": GaugeIcon,
  "number-counter": NumberCircleOneIcon,
  "page-reveal": EyeIcon,
  "parallax-scroll": WaveformIcon,
  "blob-morph": ShapesIcon,
};

export function RecipePreview({
  recipe,
  classes,
  text,
}: {
  recipe: MotionwindRecipe;
  classes: string;
  text: string;
}) {
  const Scene = SCENES[recipe.id];
  const mc = motionClasses(classes);
  if (!Scene) return null;
  return <Scene mc={mc} text={text || recipe.name} />;
}
