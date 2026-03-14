"use client";

import { useEffect, useRef, useState } from "react";

export function Typewriter({
  text,
  charDelay = 65,
  startDelay = 200,
}: {
  text: string;
  charDelay?: number;
  startDelay?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setCount(text.length);
      setStarted(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          obs.disconnect();
          setTimeout(() => setStarted(true), startDelay);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [text.length, startDelay]);

  useEffect(() => {
    if (!started || count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), charDelay);
    return () => clearTimeout(t);
  }, [started, count, text.length, charDelay]);

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
