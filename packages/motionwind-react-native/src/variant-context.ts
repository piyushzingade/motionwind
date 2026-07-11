import { createContext, useContext } from "react";

/**
 * Propagates the active variant state name from a parent `mw.*` element down to
 * descendant `mw.*` elements that declare matching `animate-variant-*` classes.
 * This gives React Native the parent→child variant orchestration that Motion
 * provides natively on the web.
 */
export interface VariantContextValue {
  /** The active variant name (drives the `animate` target on children). */
  active?: string;
  /** The initial variant name children should start from. */
  initial?: string;
}

export const MotionwindVariantContext = createContext<VariantContextValue>({});

export function useVariantContext(): VariantContextValue {
  return useContext(MotionwindVariantContext);
}
