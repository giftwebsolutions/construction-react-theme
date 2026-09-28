"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after client hydration — use before reading persisted (localStorage) stores. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
