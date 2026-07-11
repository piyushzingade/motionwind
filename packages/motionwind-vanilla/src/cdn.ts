import { motionwind } from "./index.js";

// CDN entry: auto-initialize on load and expose `window.motionwind`.
if (typeof document !== "undefined") {
  const run = () => motionwind();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
}

export { motionwind };
export default motionwind;
