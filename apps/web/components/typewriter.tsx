"use client";

import { useEffect, useRef, useState } from "react";

export function Typewriter({
  text,
  charDelay = 65,
  startDelay = 200,
  loop = false,
  loopDelay = 1100,
}: {
  text: string;
  charDelay?: number;
  startDelay?: number;
  loop?: boolean;
  loopDelay?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setCount(text.length);
      setStarted(true);
      return;
    }

    let startTimer: number | undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          obs.disconnect();
          startTimer = window.setTimeout(() => setStarted(true), startDelay);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (startTimer !== undefined) window.clearTimeout(startTimer);
    };
  }, [text.length, startDelay]);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(
      () => setCount((current) => (current >= text.length ? (loop ? 0 : current) : current + 1)),
      count >= text.length ? loopDelay : charDelay,
    );
    return () => clearTimeout(t);
  }, [started, count, text.length, charDelay, loop, loopDelay]);

  const done = count >= text.length;

  return (
    <span ref={ref} className="typewriter-wrap">
      <span>{text.slice(0, count)}</span>
      <span
        className={`typewriter-cursor${done ? " typewriter-cursor-blink" : ""}`}
        aria-hidden="true"
      />
    </span>
  );
}
