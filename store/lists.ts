"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { browserStorage } from "./storage";

export const COMPARE_LIMIT = 4;
export const RECENT_LIMIT = 12;

interface IdListState {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => boolean; // returns new membership
  remove: (id: string) => void;
  clear: () => void;
}

export const useWishlist = create<IdListState>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      toggle: (id) => {
        const on = !get().ids.includes(id);
        set((s) => ({ ids: on ? [id, ...s.ids] : s.ids.filter((x) => x !== id) }));
        return on;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "bm-wishlist", storage: browserStorage, version: 1 },
  ),
);

interface CompareState extends IdListState {
  isFull: () => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      isFull: () => get().ids.length >= COMPARE_LIMIT,
      toggle: (id) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) });
          return false;
        }
        if (ids.length >= COMPARE_LIMIT) return false;
        set({ ids: [...ids, id] });
        return true;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "bm-compare", storage: browserStorage, version: 1 },
  ),
);

interface RecentState {
  ids: string[];
  push: (id: string) => void;
  clear: () => void;
}

export const useRecentlyViewed = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, RECENT_LIMIT) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "bm-recent", storage: browserStorage, version: 1 },
  ),
);

interface SearchHistoryState {
  terms: string[];
  add: (term: string) => void;
  remove: (term: string) => void;
  clear: () => void;
}

export const useSearchHistory = create<SearchHistoryState>()(
  persist(
    (set) => ({
      terms: [],
      add: (term) => {
        const t = term.trim();
        if (!t) return;
        set((s) => ({ terms: [t, ...s.terms.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 8) }));
      },
      remove: (term) => set((s) => ({ terms: s.terms.filter((x) => x !== term) })),
      clear: () => set({ terms: [] }),
    }),
    { name: "bm-search-history", storage: browserStorage, version: 1 },
  ),
);
