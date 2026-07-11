import { defineConfig } from "vitest/config";

export default defineConfig({
  // `__DEV__` is a React Native global injected by Metro. Define it for tests
  // so the parser's dev-only warnings compile without a ReferenceError.
  define: {
    __DEV__: "false",
  },
  test: {
    environment: "node",
    globals: true,
    include: ["__tests__/**/*.test.{ts,tsx}"],
  },
});
