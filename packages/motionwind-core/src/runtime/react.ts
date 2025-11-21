import { useEffect, useState } from "react";

// React hook version for prefers-reduced-motion
export function usePrefersReducedMotion(): boolean {
    const defaultValue =
        typeof window === "undefined"
            ? true
            : window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const [reduced, setReduced] = useState<boolean>(defaultValue);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = () => setReduced(mq.matches);

        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return reduced;
}
