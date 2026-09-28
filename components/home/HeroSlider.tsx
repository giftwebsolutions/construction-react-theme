"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/types";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  return (
    <section aria-roledescription="carousel" aria-label="Featured offers" className="group/hero relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, A11y, Keyboard]}
        loop
        speed={600}
        autoplay={{ delay: 5500, pauseOnMouseEnter: true, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".hero-dots", bulletClass: "hero-dot", bulletActiveClass: "hero-dot-active" }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ slideRole: "group", slideLabelMessage: "Slide {{index}} of {{slidesLength}}" }}
        className="overflow-hidden lg:rounded-2xl"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={s.id}>
            <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[16/6]">
              <Image src={s.mobileImage} alt="" fill priority={i === 0} sizes="100vw" className="object-cover sm:hidden" />
              <Image src={s.image} alt="" fill priority={i === 0} sizes="(min-width:1280px) 1232px, 100vw" className="hidden object-cover sm:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/70 to-primary-900/10 sm:bg-gradient-to-r sm:from-primary-900/95 sm:via-primary-900/70 sm:to-transparent" />
              <div className="absolute inset-0 flex items-end pb-14 sm:items-center sm:pb-0">
                <div className="w-full px-5 sm:max-w-xl sm:px-10 lg:px-14">
                  <p className="inline-flex rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-900">{s.eyebrow}</p>
                  <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl lg:text-5xl">{s.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-primary-100 sm:text-base">{s.subtitle}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={s.cta.href} className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent-500 px-6 text-sm font-bold text-neutral-900 transition hover:bg-accent-400">
                      {s.cta.label} <ArrowRight className="size-4" aria-hidden />
                    </Link>
                    {s.secondaryCta && (
                      <Link href={s.secondaryCta.href} className="inline-flex h-12 items-center rounded-lg border border-white/40 px-6 text-sm font-semibold text-white transition hover:bg-white/10">
                        {s.secondaryCta.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-dots absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2" />
      <button type="button" aria-label="Previous slide" className="hero-prev absolute left-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition group-hover/hero:opacity-100 hover:bg-white/30 focus-visible:opacity-100 lg:flex">
        <ChevronLeft className="size-6" aria-hidden />
      </button>
      <button type="button" aria-label="Next slide" className="hero-next absolute right-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition group-hover/hero:opacity-100 hover:bg-white/30 focus-visible:opacity-100 lg:flex">
        <ChevronRight className="size-6" aria-hidden />
      </button>
    </section>
  );
}
