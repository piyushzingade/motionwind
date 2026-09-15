"use client";

import { mw, type MotionwindRecipe } from "motionwind-react";

export function ButtonPressMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <mw.button
      className={`${recipe.classes} cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-fg`}
    >
      Press me
    </mw.button>
  );
}

export function MagneticButtonMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <mw.button
      className={`${recipe.classes} cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-fg`}
    >
      Magnetic
    </mw.button>
  );
}

export function PageRevealMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <mw.div
      className={`${recipe.classes} w-36 rounded-xl border border-border bg-surface-elevated p-3`}
    >
      <div className="h-2.5 w-20 rounded-full bg-fg/20" />
      <div className="mt-2 h-2 w-28 rounded-full bg-border" />
    </mw.div>
  );
}

export function AccordionRevealMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <div className="w-36 rounded-xl border border-border bg-surface-elevated">
      <div className="border-b border-border-subtle px-3 py-2 text-[10px] font-semibold">
        Runtime
      </div>
      <mw.div
        className={`${recipe.classes} px-3 py-2 text-[10px] leading-relaxed text-fg-muted`}
      >
        Emits Motion props.
      </mw.div>
    </div>
  );
}

export function SortableItemMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <ul className="grid w-36 gap-1.5">
      {["Compile", "Generate", "Ship"].map((item, index) => (
        <mw.li
          key={item}
          className={`${index === 1 ? recipe.classes : ""} cursor-grab rounded-lg border border-border bg-surface-elevated px-3 py-2 text-[10px] text-fg`}
        >
          {item}
        </mw.li>
      ))}
    </ul>
  );
}

export function DragReorderMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <ul className="grid w-36 gap-1.5">
      {["Step 1", "Step 2", "Step 3"].map((item, index) => (
        <mw.li
          key={item}
          className={`${index === 1 ? recipe.classes : ""} cursor-grab rounded-lg border border-border bg-surface-elevated px-3 py-2 text-[10px] text-fg`}
        >
          {item}
        </mw.li>
      ))}
    </ul>
  );
}

export function FlipCardMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <div className="perspective-[600px]">
      <mw.div
        className={`${recipe.classes} flex h-24 w-32 items-center justify-center rounded-xl border border-border bg-surface-elevated text-[10px] font-semibold text-fg`}
        style={{ transformStyle: "preserve-3d" }}
      >
        Hover
      </mw.div>
    </div>
  );
}

export function CardHoverMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <mw.article
      className={`${recipe.classes} w-36 cursor-pointer rounded-xl border border-border bg-surface-elevated p-3`}
    >
      <div className="h-2.5 w-16 rounded-full bg-fg/20" />
      <div className="mt-2 h-2 w-24 rounded-full bg-border" />
    </mw.article>
  );
}

export function DrawerMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <div className="relative h-28 w-36 overflow-hidden rounded-lg border border-border bg-surface">
      <mw.div
        className={`${recipe.classes} absolute inset-y-0 right-0 w-20 border-l border-border bg-surface-elevated p-2`}
      >
        <div className="h-2 w-12 rounded-full bg-fg/20" />
      </mw.div>
    </div>
  );
}

export function TooltipPopMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <div className="relative flex h-24 items-end justify-center">
      <span className="cursor-pointer rounded-lg bg-accent px-3 py-1.5 text-[10px] font-semibold text-accent-fg">
        Target
      </span>
      <mw.div
        className={`${recipe.classes} absolute bottom-10 rounded-md border border-border bg-surface-elevated px-2 py-1 text-[10px] text-fg`}
      >
        Tooltip
      </mw.div>
    </div>
  );
}

export function ParallaxScrollMini({ recipe }: { recipe: MotionwindRecipe }) {
  return (
    <div className="relative h-28 w-36 overflow-hidden rounded-xl border border-border bg-surface">
      <mw.div
        className={`${recipe.classes} absolute left-1/2 top-4 h-12 w-12 -translate-x-1/2 rounded-xl bg-accent/25`}
      />
      <div className="absolute inset-x-3 bottom-3 rounded-lg bg-surface-elevated p-2 text-[10px] text-fg">
        Follows scroll
      </div>
    </div>
  );
}
