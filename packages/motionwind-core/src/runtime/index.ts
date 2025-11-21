// Export vanilla (no React dependency)
export * from "./vanilla";

// Re-export React hooks for convenience
// Note: React hooks are in a separate file to avoid forcing React dependency
export { usePrefersReducedMotion } from "./react";
