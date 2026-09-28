"use client";

import { useId, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, FreeMode, Keyboard, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductCardData } from "@/lib/data/card";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils/cn";

const MODULES = [Navigation, FreeMode, A11y, Keyboard];
const FREE_MODE = { enabled: true, sticky: false };
const KEYBOARD = { enabled: true, onlyInViewport: true };
const BREAKPOINTS = { 640: { spaceBetween: 16 }, 1024: { spaceBetween: 16, freeMode: false, slidesPerGroup: 2 } };

/**
 * Horizontal product slider (Swiper). On phones cards peek (1.6–2.2 per view) with
 * free-mode swipe; on desktop it snaps with arrow buttons.
 */
export function ProductCarousel({ cards, label, className }: { cards: ProductCardData[]; label: string; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  // Stable param objects: new literals each render make swiper/react re-apply them (flicker).
  const navigation = useMemo(() => ({ prevEl: `#prev-${id}`, nextEl: `#next-${id}`, disabledClass: "swiper-nav-disabled" }), [id]);
  const a11y = useMemo(() => ({ containerMessage: label, prevSlideMessage: "Previous products", nextSlideMessage: "Next products" }), [label]);
  if (!cards.length) return null;
  return (
    <div className={cn("group/carousel relative", className)}>
      <Swiper
        modules={MODULES}
        navigation={navigation}
        freeMode={FREE_MODE}
        keyboard={KEYBOARD}
        a11y={a11y}
        slidesPerView="auto"
        spaceBetween={12}
        breakpoints={BREAKPOINTS}
        className="!-mx-4 !px-4 !pb-2 lg:!mx-0 lg:!px-0"
      >
        {cards.map((c) => (
          <SwiperSlide key={c.product.id} className="!h-auto !w-[62%] min-[420px]:!w-[46%] sm:!w-[36%] md:!w-[30%] lg:!w-[calc((100%-48px)/4)] xl:!w-[calc((100%-64px)/5)]">
            <ProductCard data={c} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button id={`prev-${id}`} type="button" aria-label="Previous" className="absolute -left-5 top-[35%] z-10 hidden size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-card-hover transition hover:bg-primary-800 hover:text-white lg:flex [&.swiper-nav-disabled]:opacity-0">
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button id={`next-${id}`} type="button" aria-label="Next" className="absolute -right-5 top-[35%] z-10 hidden size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-card-hover transition hover:bg-primary-800 hover:text-white lg:flex [&.swiper-nav-disabled]:opacity-0">
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
