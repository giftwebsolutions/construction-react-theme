"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { MapPin, Quote } from "lucide-react";
import type { Testimonial } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Rating } from "@/components/ui/Rating";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <Swiper
      modules={[Pagination, Autoplay, A11y]}
      slidesPerView="auto"
      spaceBetween={12}
      autoplay={{ delay: 6000, pauseOnMouseEnter: true, disableOnInteraction: false }}
      pagination={{ clickable: true, el: ".t-dots", bulletClass: "hero-dot !bg-neutral-300", bulletActiveClass: "hero-dot-active !bg-accent-500" }}
      breakpoints={{ 640: { spaceBetween: 16 }, 1024: { spaceBetween: 20 } }}
      className="!-mx-4 !px-4 lg:!mx-0 lg:!px-0"
    >
      {items.map((t) => (
        <SwiperSlide key={t.id} className="!h-auto !w-[88%] sm:!w-[calc((100%-16px)/2)] lg:!w-[calc((100%-40px)/3)]">
          <figure className="relative flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-card">
            <Quote className="absolute right-5 top-5 size-8 text-primary-100 dark:text-primary-700" aria-hidden />
            <Rating value={t.rating} />
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">“{t.quote}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              <Avatar name={t.name} initials={t.avatar} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t.role}
                  {t.company ? `, ${t.company}` : ""}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" aria-hidden /> {t.city}
                </p>
              </div>
            </figcaption>
          </figure>
        </SwiperSlide>
      ))}
      <div className="t-dots mt-6 flex justify-center gap-2" />
    </Swiper>
  );
}
