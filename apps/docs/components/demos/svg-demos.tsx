"use client";

import { useState } from "react";
import { motion } from "motion/react";

/* ── 1. Logo Icon Drawing ── */
export function LogoDrawDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        key={key}
        width="180"
        height="180"
        viewBox="0 0 100 100"
        fill="none"
        className="text-[#c8ff2e]"
      >
        {/* Outer hexagon */}
        <motion.path
          d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Inner diamond */}
        <motion.path
          d="M50 25 L70 50 L50 75 L30 50 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
        />
        {/* Center dot */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.6, type: "spring", stiffness: 400 }}
        />
        {/* Cross lines */}
        <motion.line
          x1="50" y1="25" x2="50" y2="5"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 1.8 }}
        />
        <motion.line
          x1="50" y1="75" x2="50" y2="95"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 2.0 }}
        />
      </svg>
      <button
        onClick={() => setKey((k) => k + 1)}
        className="px-4 py-1.5 rounded-lg bg-[#1a1a2e] border border-[#c8ff2e]/15 text-[#c8ff2e] text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
      >
        Replay
      </button>
    </div>
  );
}

/* ── 2. Circular Progress ── */
export function CircularProgressDemo() {
  const [progress, setProgress] = useState(72);
  const r = 40;
  const circumference = 2 * Math.PI * r;

  const cycle = () => {
    const values = [25, 50, 72, 88, 100];
    const next = values[(values.indexOf(progress) + 1) % values.length] ?? 72;
    setProgress(next);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
          {/* Track */}
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke="rgba(200,255,46,0.08)"
            strokeWidth="6"
          />
          {/* Progress */}
          <motion.circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke="#c8ff2e"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={progress}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[#c8ff2e] font-mono font-bold text-lg"
          >
            {progress}%
          </motion.span>
        </div>
      </div>
      <button
        onClick={cycle}
        className="px-4 py-1.5 rounded-lg bg-[#1a1a2e] border border-[#c8ff2e]/15 text-[#c8ff2e] text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
      >
        Change
      </button>
    </div>
  );
}

/* ── 3. Animated Checkbox ── */
export function AnimatedCheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-6">
      {[false, true].map((_, i) => {
        const isOn = i === 0 ? checked : !checked;
        return (
          <button
            key={i}
            onClick={() => setChecked(!checked)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className="w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors"
              style={{
                borderColor: isOn ? "#c8ff2e" : "rgba(200,255,46,0.15)",
                backgroundColor: isOn ? "rgba(200,255,46,0.1)" : "transparent",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <motion.path
                  d="M5 13l4 4L19 7"
                  stroke="#c8ff2e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{
                    pathLength: isOn ? 1 : 0,
                    opacity: isOn ? 1 : 0,
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              </svg>
            </div>
            <span
              className="text-xs font-medium transition-colors"
              style={{ color: isOn ? "#c8ff2e" : "#5a5a6a" }}
            >
              {i === 0 ? "Design" : "Develop"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── 4. Pulse Rings ── */
export function PulseRingsDemo() {
  const [key, setKey] = useState(0);
  const rings = [0, 1, 2, 3];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg key={key} width="160" height="160" viewBox="0 0 160 160">
        {rings.map((i) => (
          <motion.circle
            key={i}
            cx="80"
            cy="80"
            r={20 + i * 16}
            fill="none"
            stroke="#c8ff2e"
            strokeWidth="1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{ transformOrigin: "80px 80px" }}
          />
        ))}
        {/* Center filled circle */}
        <motion.circle
          cx="80"
          cy="80"
          r="8"
          fill="#c8ff2e"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <button
        onClick={() => setKey((k) => k + 1)}
        className="px-4 py-1.5 rounded-lg bg-[#1a1a2e] border border-[#c8ff2e]/15 text-[#c8ff2e] text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
      >
        Restart
      </button>
    </div>
  );
}

/* ── 5. Animated Bar Chart ── */
const chartData = [
  { label: "Mon", value: 65, color: "#c8ff2e" },
  { label: "Tue", value: 40, color: "#c8ff2e" },
  { label: "Wed", value: 85, color: "#c8ff2e" },
  { label: "Thu", value: 55, color: "#c8ff2e" },
  { label: "Fri", value: 95, color: "#c8ff2e" },
];

export function AnimatedChartDemo() {
  const [key, setKey] = useState(0);
  const maxH = 80;
  const barW = 24;
  const gap = 12;
  const totalW = chartData.length * (barW + gap) - gap;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg key={key} width={totalW + 20} height="130" viewBox={`0 0 ${totalW + 20} 130`}>
        {/* Baseline */}
        <line x1="10" y1="105" x2={totalW + 10} y2="105" stroke="rgba(200,255,46,0.1)" strokeWidth="1" />

        {chartData.map((d, i) => {
          const h = (d.value / 100) * maxH;
          const x = 10 + i * (barW + gap);
          return (
            <g key={d.label}>
              {/* Bar */}
              <motion.rect
                x={x}
                y={105 - h}
                width={barW}
                height={h}
                rx="4"
                fill={d.color}
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
              {/* Value label */}
              <motion.text
                x={x + barW / 2}
                y={105 - h - 6}
                textAnchor="middle"
                fill="#c8ff2e"
                fontSize="8"
                fontWeight="700"
                fontFamily="monospace"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              >
                {d.value}
              </motion.text>
              {/* Day label */}
              <text
                x={x + barW / 2}
                y="120"
                textAnchor="middle"
                fill="#5a5a6a"
                fontSize="8"
                fontFamily="monospace"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <button
        onClick={() => setKey((k) => k + 1)}
        className="px-4 py-1.5 rounded-lg bg-[#1a1a2e] border border-[#c8ff2e]/15 text-[#c8ff2e] text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
      >
        Replay
      </button>
    </div>
  );
}
