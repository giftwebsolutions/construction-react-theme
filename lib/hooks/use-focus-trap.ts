"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap Tab focus inside `ref` while active, close on Escape,
 * and restore focus to the previously focused element on deactivate.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape?: () => void) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () => Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const initial = root.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? root;
    initial.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) {
        e.preventDefault();
        return;
      }
      const first = els[0]!;
      const last = els[els.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("keydown", onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [ref, active, onEscape]);
}
