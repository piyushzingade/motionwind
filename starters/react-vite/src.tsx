import { useState } from "react";
import { createRoot } from "react-dom/client";
import { MotionwindProvider } from "motionwind-react";
import config from "./motionwind.config";

function App() {
  const [shifted, setShifted] = useState(false);

  return (
    <main style={{ minHeight: 1800, padding: 32 }}>
      <button
        data-testid="motionwind-e2e"
        className="animate-hover:scale-105 animate-tap:scale-95 animate-focus:scale-102 animate-duration-80"
      >
        Motionwind + Vite
      </button>

      <div
        data-testid="motionwind-variant"
        className="animate-variant-hidden:opacity-0 animate-variant-visible:opacity-100 animate-from-hidden animate-to-visible animate-duration-80"
      >
        Variant
      </div>

      <button
        data-testid="motionwind-layout-toggle"
        onClick={() => setShifted((value) => !value)}
      >
        Toggle layout
      </button>
      <div
        data-testid="motionwind-layout"
        className="animate-layout-position animate-duration-400"
        style={{
          marginLeft: shifted ? 120 : 0,
          width: 24,
          height: 24,
          background: "black",
        }}
      />

      <div
        data-testid="motionwind-drag"
        className="animate-drag-x animate-drag-momentum-false animate-drag:scale-105"
        style={{ width: 40, height: 40, background: "royalblue" }}
      />

      <div
        data-testid="motionwind-scroll"
        className="animate-scroll:scaleX-[0,1] animate-scroll-container"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          height: 4,
          background: "tomato",
          transformOrigin: "left",
        }}
      />

      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        aria-label="Motionwind SVG fixture"
      >
        <path
          data-testid="motionwind-svg"
          d="M4 20 L36 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="animate-initial:path-length-0 animate-enter:path-length-1 animate-duration-80"
        />
      </svg>

      <div style={{ height: 1100 }} />
      <div
        data-testid="motionwind-inview"
        className="animate-initial:opacity-0 animate-inview:opacity-100 animate-once animate-amount-50 animate-duration-80"
      >
        In view
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <MotionwindProvider config={config}>
    <App />
  </MotionwindProvider>,
);
