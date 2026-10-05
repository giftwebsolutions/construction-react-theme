"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { browserStorage } from "./storage";
import { DEFAULT_AREA_ID, areaLabel, lookupArea } from "@/lib/data/locations";

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
      areaId: DEFAULT_AREA_ID,
      label: areaLabel(lookupArea(DEFAULT_AREA_ID)!),
      setLocation: (areaId) => {
        const area = lookupArea(areaId);
        if (area) set({ areaId: area.id, label: areaLabel(area) });
      },
    }),
    {
      name: "bm-location-ae",
      storage: browserStorage,
      version: 1,
      merge: (persisted, current) => {
        const saved = persisted as Partial<LocationState> | undefined;
        const area = lookupArea(saved?.areaId ?? "") ?? lookupArea(DEFAULT_AREA_ID)!;
        return { ...current, areaId: area.id, label: areaLabel(area) };
      },
    },
  ),
);
