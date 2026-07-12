import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the hydration render, then `true` once mounted
 * on the client — without a mount-only `useEffect` and without a hydration
 * flicker. This is the `useSyncExternalStore` pattern React Doctor recommends
 * over `const [mounted, setMounted] = useState(false)` + `useEffect`.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
