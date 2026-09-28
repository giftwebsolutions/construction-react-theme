"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { browserStorage } from "./storage";

interface UIState {
  listingPending: boolean;
  setListingPending: (v: boolean) => void;
  miniCartOpen: boolean;
  mobileNavOpen: boolean;
  setMiniCart: (open: boolean) => void;
  setMobileNav: (open: boolean) => void;
}

export const useUI = create<UIState>()((set) => ({
  listingPending: false,
  setListingPending: (v) => set({ listingPending: v }),
  miniCartOpen: false,
  mobileNavOpen: false,
  setMiniCart: (open) => set({ miniCartOpen: open }),
  setMobileNav: (open) => set({ mobileNavOpen: open }),
}));

interface LocationState {
  areaId: string;
  label: string;
  setLocation: (areaId: string, label: string) => void;
}

export const useDeliveryLocation = create<LocationState>()(
  persist(
    (set) => ({
      areaId: "al-quoz",
      label: "Al Quoz, Dubai",
      setLocation: (areaId, label) => set({ areaId, label }),
    }),
    { name: "bm-location-ae", storage: browserStorage, version: 1 },
  ),
);
