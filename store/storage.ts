import { createJSONStorage } from "zustand/middleware";

/** localStorage that no-ops during SSR. */
export const browserStorage = createJSONStorage(() =>
  typeof window === "undefined"
    ? { getItem: () => null, setItem: () => undefined, removeItem: () => undefined }
    : window.localStorage,
);
