"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function usePortalTarget(): HTMLElement | null {
  return useSyncExternalStore(
    emptySubscribe,
    () => document.body,
    () => null,
  );
}
