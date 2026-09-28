"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Pagination, Zoom } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Expand, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLockBody } from "@/lib/hooks/use-lock-body";
import { useHydrated } from "@/lib/hooks/use-hydrated";

/*
 * Swiper params are module-level constants: passing new object literals on every
 * render makes swiper/react re-apply them, which re-initialises pagination and
 * causes visible flicker on mobile.
 */
const MAIN_MODULES = [Pagination, A11y, Keyboard];
const MAIN_PAGINATION = { clickable: true, el: ".g-dots", bulletClass: "hero-dot !bg-neutral-300", bulletActiveClass: "hero-dot-active" };
const KEYBOARD = { enabled: true, onlyInViewport: true };
const MAIN_A11Y = { slideLabelMessage: "Image {{index}} of {{slidesLength}}" };
const LB_MODULES = [Zoom, Pagination, Keyboard, A11y];
const LB_ZOOM = { maxRatio: 3 };
const LB_PAGINATION = { type: "fraction" as const };

export function Gallery({ images, alt, badges }: { images: string[]; alt: string; badges?: React.ReactNode }) {
  const [main, setMain] = useState<SwiperType | null>(null);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    // min-w-0 + w-full: a grid item defaults to min-width:auto, letting Swiper's track widen the column (overflow + resize flicker loop)
    <div className="w-full min-w-0 lg:sticky lg:top-36">
      <div data-gallery-main className="relative overflow-hidden rounded-xl border border-border bg-surface">
        {badges && <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5">{badges}</div>}
        <Swiper className="w-full" modules={MAIN_MODULES} pagination={MAIN_PAGINATION} keyboard={KEYBOARD} a11y={MAIN_A11Y} onSwiper={setMain} onSlideChange={(s) => setIndex(s.activeIndex)}>
          {images.map((src, i) => (
            <SwiperSlide key={src + i}>
              <ZoomImage src={src} alt={i === 0 ? alt : `${alt} — view ${i + 1}`} priority={i === 0} onOpen={() => setLightbox(true)} label={`Open image ${i + 1} fullscreen`} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button type="button" onClick={() => setLightbox(true)} className="absolute bottom-3 right-3 z-10 flex size-10 items-center justify-center rounded-full bg-surface/90 text-foreground shadow ring-1 ring-border" aria-label="View fullscreen">
          <Expand className="size-4.5" aria-hidden />
        </button>
        <div className="g-dots absolute inset-x-0 bottom-4 z-10 flex justify-center gap-1.5 lg:hidden" />
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto" role="group" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => main?.slideTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={cn("relative size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-surface-muted sm:size-20", i === index ? "border-accent-500" : "border-transparent hover:border-border")}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && <Lightbox images={images} alt={alt} start={index} onClose={() => setLightbox(false)} />}
    </div>
  );
}

/** Hover zoom for mouse users only; touch devices get swipe + fullscreen pinch zoom instead. */
function ZoomImage({ src, alt, priority, onOpen, label }: { src: string; alt: string; priority: boolean; onOpen: () => void; label: string }) {
  const imgWrap = useRef<HTMLSpanElement>(null);
  const setZoom = (x: number | null, y = 0) => {
    const el = imgWrap.current;
    if (!el) return;
    el.style.transformOrigin = x === null ? "" : `${x}% ${y}%`;
    el.style.transform = x === null ? "" : "scale(2)";
  };
  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) return;
        const r = e.currentTarget.getBoundingClientRect();
        setZoom(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
      }}
      onPointerLeave={() => setZoom(null)}
      className="relative block aspect-square w-full overflow-hidden [@media(hover:hover)]:cursor-zoom-in"
      aria-label={label}
    >
      <span ref={imgWrap} className="absolute inset-0 block transition-transform duration-150 ease-out">
        <Image src={src} alt={alt} fill priority={priority} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
      </span>
    </button>
  );
}

function Lightbox({ images, alt, start, onClose }: { images: string[]; alt: string; start: number; onClose: () => void }) {
  const hydrated = useHydrated();
  useLockBody(true);
  if (!hydrated) return null;
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${alt} images`} className="fixed inset-0 z-[80] flex animate-fade-in flex-col bg-neutral-950" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="flex h-14 shrink-0 items-center justify-between px-4 text-white">
        <p className="truncate text-sm">{alt}</p>
        <button type="button" autoFocus onClick={onClose} className="flex size-11 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close fullscreen">
          <X className="size-6" aria-hidden />
        </button>
      </div>
      <Swiper modules={LB_MODULES} initialSlide={start} zoom={LB_ZOOM} keyboard={KEYBOARD} pagination={LB_PAGINATION} className="h-full w-full [--swiper-pagination-fraction-color:#fff] [&_.swiper-pagination]:text-white">
        {images.map((src, i) => (
          <SwiperSlide key={src + i}>
            <div className="swiper-zoom-container">
              <Image src={src} alt={`${alt} — ${i + 1}`} width={1200} height={1200} className="h-auto max-h-[80vh] w-auto max-w-full object-contain" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <p className="pb-4 text-center text-xs text-neutral-400">Pinch or double-tap to zoom · swipe to browse</p>
    </div>,
    document.body,
  );
}
