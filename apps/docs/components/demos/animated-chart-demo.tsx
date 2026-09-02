"use client";

import { useState } from "react";
import { motion } from "motion/react";

const chartData = [
  { label: "Mon", value: 65 },
  { label: "Tue", value: 40 },
  { label: "Wed", value: 85 },
  { label: "Thu", value: 55 },
  { label: "Fri", value: 95 },
];

export function AnimatedChartDemo() {
  const [key, setKey] = useState(0);
  const maxH = 80;
  const barW = 24;
  const gap = 12;
  const totalW = chartData.length * (barW + gap) - gap;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        key={key}
        width={totalW + 20}
        height="130"
        viewBox={`0 0 ${totalW + 20} 130`}
        className="text-[var(--color-accent)]"
      >
        <line
          x1="10"
          y1="105"
          x2={totalW + 10}
          y2="105"
          className="stroke-[var(--color-border)]"
          strokeWidth="1"
        />
        {chartData.map((d, i) => {
          const h = (d.value / 100) * maxH;
          const x = 10 + i * (barW + gap);
          return (
            <g key={d.label}>
              <motion.rect
                x={x}
                y={105 - h}
                width={barW}
                height={h}
                rx="4"
                fill="currentColor"
                fillOpacity={0.15 + (d.value / 100) * 0.6}
                initial={{ scaleY: 0, originY: "100%" }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{ transformOrigin: `${x + barW / 2}px 105px` }}
              />
              <motion.text
                x={x + barW / 2}
                y={105 - h - 6}
                textAnchor="middle"
                fill="currentColor"
                fontSize="8"
                fontWeight="700"
                fontFamily="monospace"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              >
                {d.value}
              </motion.text>
              <text
                x={x + barW / 2}
                y="120"
                textAnchor="middle"
                className="fill-[var(--color-fg-muted)]"
                fontSize="8"
                fontFamily="monospace"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <button onClick={() => setKey((k) => k + 1)} className="demo-btn">
        Replay
      </button>
    </div>
  );
}
