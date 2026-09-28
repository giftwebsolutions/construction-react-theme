"use client";

import { create } from "zustand";

export type ToastTone = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: { label: string; href?: string; onClick?: () => void };
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id" | "duration" | "tone"> & { tone?: ToastTone; duration?: number }) => number;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (t) => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts.slice(-3), { tone: "success", duration: 3500, ...t, id }] }));
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

/** Imperative helper: toast({ title: "Added to cart" }) */
export const toast = (t: Parameters<ToastState["push"]>[0]) => useToastStore.getState().push(t);
