// SSR-safe primitive
export function safeMatchMedia(query: string): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(query).matches;
}

// Simple intersection observer wrapper (non-react)
export function observeInView(el: Element, cb: (isIntersecting: boolean) => void): () => void {
    if (typeof IntersectionObserver === "undefined") {
        cb(true);
        return () => { };
    }
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => cb(e.isIntersecting));
    });
    obs.observe(el);
    return () => obs.disconnect();
}

// Check if user prefers reduced motion (non-React version)
export function prefersReducedMotion(): boolean {
    return safeMatchMedia("(prefers-reduced-motion: reduce)");
}
