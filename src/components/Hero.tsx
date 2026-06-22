"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import EmblaCarousel from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import { Language, translations } from "@/translations";

interface HeroProps {
  language: Language;
}

export default function Hero({ language }: HeroProps) {
  const t = (key: string) => translations[key]?.[language] ?? key;

  const emblaRef = useRef<HTMLDivElement>(null);
  const [embla, setEmbla] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);


  // Initialize Embla
  useEffect(() => {
    if (!emblaRef.current) return;

    const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });

    const instance = EmblaCarousel(emblaRef.current, {
      loop: true,
      align: "start",
    }, [autoplay]);

    setEmbla(instance);
    setScrollSnaps(instance.scrollSnapList());
    setSelectedIndex(instance.selectedScrollSnap());

    instance.on("select", () => {
      setSelectedIndex(instance.selectedScrollSnap());
    });

    return () => instance.destroy();
  }, []);

  // Arrow handlers
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const scrollTo = useCallback((i: number) => embla && embla.scrollTo(i), [embla]);

  return (
    <section
      className="relative"
      aria-label="Carrusel principal"
      aria-roledescription="carousel"
    >
      {/* Accesibilidad: anunciar slide activo */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Slide ${selectedIndex + 1} de ${scrollSnaps.length}`}
      </div>

      {/* Embla viewport */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">

          <div className="embla__slide flex-[0_0_100%]">
            <Slide
              title={t("slide1.title")}
              description={t("slide1.description")}
              bg="bg-[url('/images/slide-bg1.jpg')]"
              btn={t("slide1.btn")}
              headingLevel="h1"
            />
          </div>

          <div className="embla__slide flex-[0_0_100%]">
            <Slide
              title={t("slide2.title")}
              description={t("slide2.description")}
              bg="bg-[url('/images/slide-bg2.jpg')]"
              btn={t("slide2.btn")}
              headingLevel="h2"
            />
          </div>

          <div className="embla__slide flex-[0_0_100%]">
            <Slide
              title={t("slide3.title")}
              description={t("slide3.description")}
              bg="bg-[url('/images/slide-bg3.jpg')]"
              btn={t("slide3.btn")}
              headingLevel="h2"
            />
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="group absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white backdrop-blur-md transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-600/90 hover:shadow-lg hover:shadow-violet-500/50 sm:left-4 sm:h-12 sm:w-12 sm:text-3xl"
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        onClick={scrollNext}
        className="group absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white backdrop-blur-md transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-600/90 hover:shadow-lg hover:shadow-violet-500/50 sm:right-4 sm:h-12 sm:w-12 sm:text-3xl"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 sm:bottom-6 sm:gap-3">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`
              h-2 rounded-full transition-all duration-300
              ${i === selectedIndex
                ? "w-8 bg-linear-to-r from-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/50"
                : "w-2 bg-white/60 hover:bg-white/80"}
            `}
            aria-label={`Ir al slide ${i + 1}`}
            aria-current={i === selectedIndex ? "true" : undefined}
          />
        ))}
      </div>

    </section>
  );
}

interface SlideProps {
  title: string;
  description: string;
  bg: string;
  btn: string;
  headingLevel: "h1" | "h2";
}

function Slide({ title, description, bg, btn, headingLevel }: SlideProps) {
  const HeadingTag = headingLevel;

  return (
    <div
      className={`
        flex
        py-20
        min-h-[75vh]
        bg-cover bg-no-repeat bg-center
        ${bg}
      `}
    >
      <div className="
          container mx-auto
          px-15
          md:px-8
          flex flex-col justify-center items-start
          max-w-lg
          md:max-w-2xl
          lg:max-w-4xl lg:pb-[15%] xl:pb-[5%]
          xl:max-w-6xl
          text-left">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-start"
        >
          <HeadingTag className="font-heading text-3xl md:text-4xl text-primary mb-4 font-bold leading-11 select-none">
            {title}
          </HeadingTag>

          <p className="text-md md:text-lg text-slate-700 mb-12 max-w-xl select-none">
            {description}
          </p>

          <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-violet-600/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-600/60 hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:px-8 sm:py-3.5 sm:text-base">
            <span className="relative z-10">{btn}</span>
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-violet-700 to-fuchsia-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
