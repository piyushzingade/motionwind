"use client";

import { animate, cubicBezier, motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatedCheckboxDemo } from "@/components/demos/animated-checkbox-demo";
import { AnimatedChartDemo } from "@/components/demos/animated-chart-demo";
import { CircularProgressDemo } from "@/components/demos/circular-progress-demo";
import { CollapsibleSidebarDemo } from "@/components/demos/collapsible-sidebar-demo";
import {
  GridToggleDemo,
  SharedLayoutTabsDemo,
  ShuffleListDemo,
} from "@/components/demos/layout-demos";
import { LogoDrawDemo } from "@/components/demos/logo-draw-demo";
import { MultiStateDemo } from "@/components/demos/multi-state-demo";
import { MorphBlobDemo } from "@/components/demos/morph-blob-demo";
import { NotificationStackDemo } from "@/components/demos/notification-stack-demo";
import { OrbitDotsDemo } from "@/components/demos/orbit-dots-demo";
import { OrchestratedFormDemo } from "@/components/demos/orchestrated-form-demo";
import { PulseRingsDemo } from "@/components/demos/pulse-rings-demo";
import { StaggeredGridDemo } from "@/components/demos/staggered-grid-demo";
import { WaveformDemo } from "@/components/demos/waveform-demo";

type StageCard = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  preview: ReactNode;
};
const CANVAS_WIDTH = 1940;
const CANVAS_HEIGHT = 2000;
const W = 410;
const H = 350;
const CARDS: StageCard[] = [
  {
    id: "checkbox",
    label: "Checkbox",
    x: 30,
    y: 30,
    width: W,
    height: H,
    preview: <AnimatedCheckboxDemo />,
  },
  {
    id: "notifications",
    label: "Notifications",
    x: 510,
    y: 30,
    width: W,
    height: H,
    preview: <NotificationStackDemo />,
  },
  {
    id: "sidebar",
    label: "Sidebar",
    x: 990,
    y: 30,
    width: W,
    height: H,
    preview: <CollapsibleSidebarDemo />,
  },
  {
    id: "stagger",
    label: "Feature grid",
    x: 1470,
    y: 30,
    width: W,
    height: H,
    preview: <StaggeredGridDemo />,
  },
  {
    id: "states",
    label: "Multi state",
    x: 30,
    y: 550,
    width: W,
    height: H,
    preview: <MultiStateDemo />,
  },
  {
    id: "form",
    label: "Form",
    x: 510,
    y: 550,
    width: W,
    height: H,
    preview: <OrchestratedFormDemo />,
  },
  {
    id: "tabs",
    label: "Tabs",
    x: 990,
    y: 550,
    width: W,
    height: H,
    preview: <SharedLayoutTabsDemo />,
  },
  {
    id: "grid",
    label: "Grid",
    x: 1470,
    y: 550,
    width: W,
    height: H,
    preview: <GridToggleDemo />,
  },
  {
    id: "shuffle",
    label: "Shuffle list",
    x: 30,
    y: 1070,
    width: W,
    height: H,
    preview: <ShuffleListDemo />,
  },
  {
    id: "progress",
    label: "Progress ring",
    x: 510,
    y: 1070,
    width: W,
    height: H,
    preview: <CircularProgressDemo />,
  },
  {
    id: "logo",
    label: "Logo draw",
    x: 990,
    y: 1070,
    width: W,
    height: H,
    preview: <LogoDrawDemo />,
  },
  {
    id: "chart",
    label: "Chart",
    x: 1470,
    y: 1070,
    width: W,
    height: H,
    preview: <AnimatedChartDemo />,
  },
  {
    id: "pulse",
    label: "Pulse rings",
    x: 30,
    y: 1590,
    width: W,
    height: H,
    preview: <PulseRingsDemo />,
  },
  {
    id: "waveform",
    label: "Waveform",
    x: 510,
    y: 1590,
    width: W,
    height: H,
    preview: <WaveformDemo />,
  },
  {
    id: "orbit",
    label: "Orbit",
    x: 990,
    y: 1590,
    width: W,
    height: H,
    preview: <OrbitDotsDemo />,
  },
  {
    id: "blob",
    label: "Blob",
    x: 1470,
    y: 1590,
    width: W,
    height: H,
    preview: <MorphBlobDemo />,
  },
];
const FOCUS_INTERVAL_MS = 4600;
const START_INDEX = 5;
const MIN_HOP_DISTANCE = 850;
const PAN_EASE = cubicBezier(0.65, 0, 0.35, 1);
const clamp = (min: number, value: number, max: number) =>
  Math.min(max, Math.max(min, value));

const hopDistance = (a: number, b: number) => {
  const from = CARDS[a]!;
  const to = CARDS[b]!;
  return Math.hypot(
    from.x + from.width / 2 - to.x - to.width / 2,
    from.y + from.height / 2 - to.y - to.height / 2,
  );
};

const flightDurationFor = (distance: number) =>
  clamp(1.35, 0.95 + distance / 1050, 2.7);
const flightZoomOutFor = (distance: number) =>
  clamp(0.68, 0.86 - distance * 0.00006, 0.86);

function shuffled(length: number): number[] {
  const order = Array.from({ length }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex]!, order[index]!];
  }
  return order;
}

function PreviewCard({
  card,
  active,
  focusDelay,
  reducedMotion,
}: {
  card: StageCard;
  active: boolean;
  focusDelay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.article
      className="absolute flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-transparent p-1.5"
      style={{
        left: card.x,
        top: card.y,
        width: card.width,
        height: card.height,
        zIndex: active ? 10 : 1,
      }}
      initial={false}
      animate={{
        opacity: reducedMotion || active ? 1 : 0.3,
        scale: !reducedMotion && active ? 1.06 : 1,
      }}
      transition={{
        opacity: {
          duration: 0.9,
          ease: "easeInOut",
          delay: active ? focusDelay : 0,
        },
        scale: {
          type: "spring",
          stiffness: 170,
          damping: 26,
          delay: active ? focusDelay : 0,
        },
      }}
      data-stage-card={card.id}
      data-active={active}
    >
      <div className="flex h-9 shrink-0 items-center px-2">
        <span className="truncate text-xs font-medium text-[var(--color-fg-muted)]">
          {card.label}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
        {card.preview}
      </div>
    </motion.article>
  );
}

export function MotionStage({ className = "" }: { className?: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const queueRef = useRef<number[]>([]);
  const lastPickRef = useRef(START_INDEX);
  const shownRef = useRef(START_INDEX);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState(START_INDEX);
  const [previousIndex, setPreviousIndex] = useState(START_INDEX);
  const [engaged, setEngaged] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const measure = () =>
      setViewport({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      if (queueRef.current.length === 0) {
        queueRef.current = shuffled(CARDS.length);
      }
      const current = lastPickRef.current;
      let pickAt = queueRef.current.findIndex(
        (index) => hopDistance(index, current) >= MIN_HOP_DISTANCE,
      );
      if (pickAt === -1) {
        pickAt = queueRef.current.reduce(
          (best, index, queueIndex, queue) =>
            hopDistance(index, current) > hopDistance(queue[best]!, current)
              ? queueIndex
              : best,
          0,
        );
      }
      const next = queueRef.current.splice(pickAt, 1)[0] ?? START_INDEX;
      setPreviousIndex(current);
      lastPickRef.current = next;
      setEngaged(true);
      setActiveIndex(next);
    }, FOCUS_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const measured = viewport.width > 0 && viewport.height > 0;
  const scale = measured
    ? clamp(0.56, Math.min(viewport.width / 920, viewport.height / 780), 0.86)
    : 0.7;
  const activeCard = CARDS[activeIndex] ?? CARDS[START_INDEX]!;
  const previousCard = CARDS[previousIndex] ?? activeCard;
  const estimatedDistance = Math.hypot(
    (activeCard.x +
      activeCard.width / 2 -
      previousCard.x -
      previousCard.width / 2) *
      scale,
    (activeCard.y +
      activeCard.height / 2 -
      previousCard.y -
      previousCard.height / 2) *
      scale,
  );
  const focusDelay =
    !reducedMotion && engaged ? flightDurationFor(estimatedDistance) * 0.65 : 0;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !measured) return;
    const setCamera = (x: number, y: number, zoom: number) => {
      canvas.style.transform = `translate(${viewport.width / 2 - x * zoom}px, ${viewport.height / 2 - y * zoom}px) scale(${zoom})`;
    };
    const targetX = activeCard.x + activeCard.width / 2;
    const targetY = activeCard.y + activeCard.height / 2;
    animationRef.current?.stop();
    if (!engaged || reducedMotion || shownRef.current === activeIndex) {
      setCamera(targetX, targetY, scale);
      shownRef.current = activeIndex;
      return;
    }
    const computed = getComputedStyle(canvas).transform;
    const matrix = computed !== "none" ? new DOMMatrix(computed) : null;
    const fromScale = matrix?.a || scale;
    const fromX = matrix
      ? (viewport.width / 2 - matrix.e) / fromScale
      : targetX;
    const fromY = matrix
      ? (viewport.height / 2 - matrix.f) / fromScale
      : targetY;
    const distance = Math.hypot(
      (targetX - fromX) * scale,
      (targetY - fromY) * scale,
    );
    const duration = flightDurationFor(distance);
    const zoomDepth = scale * (1 - flightZoomOutFor(distance));
    animationRef.current = animate(0, 1, {
      duration,
      ease: "linear",
      onUpdate: (progress) => {
        const pan = PAN_EASE(progress);
        const zoomOut = Math.sin(Math.PI * progress) ** 2;
        setCamera(
          fromX + (targetX - fromX) * pan,
          fromY + (targetY - fromY) * pan,
          fromScale + (scale - fromScale) * pan - zoomDepth * zoomOut,
        );
      },
    });
    shownRef.current = activeIndex;
    return () => animationRef.current?.stop();
  }, [
    activeCard,
    activeIndex,
    engaged,
    measured,
    reducedMotion,
    scale,
    viewport.height,
    viewport.width,
  ]);

  return (
    <div
      ref={viewportRef}
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
      inert={true}
      data-testid="motion-stage"
    >
      {measured ? (
        <div
          ref={canvasRef}
          data-testid="motion-stage-canvas"
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        >
          {CARDS.map((card, index) => (
            <PreviewCard
              key={card.id}
              card={card}
              active={index === activeIndex}
              focusDelay={focusDelay}
              reducedMotion={Boolean(reducedMotion)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
