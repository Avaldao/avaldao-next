"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import EmblaCarousel from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Hero() {
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
    <section className="relative">

      {/* Embla viewport */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">

          <div className="embla__slide flex-[0_0_100%]">
            <Slide
              title="Confiamos en vos"
              description="En dos clicks tenés la garantía que necesitás para tu crédito."
              bg="bg-[url('/images/slide-bg1.jpg')]"
              btn="Comenzar"
            />
          </div>

          <div className="embla__slide flex-[0_0_100%]">
            <Slide
              title="Garantías rápidas y seguras"
              description="AvalDAO utiliza la revolucionaria tecnología de blockchain para otorgar garantías crediticias de forma ágil, seguras y transparentes."
              bg="bg-[url('/images/slide-bg2.jpg')]"
              btn="Conocer más"
            />
          </div>

          <div className="embla__slide flex-[0_0_100%]">
            <Slide
              title="Sumate a la comunidad AvalDAO"
              description="Únete a un nuevo tipo de empresa, más abierta y transparente, donde el control lo tienen quienes la usan y contribuyen."
              bg="bg-[url('/images/slide-bg3.jpg')]"
              btn="Sumate"
            />
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
      >
        ‹
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
      >
        ›
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`
              w-3 h-3 rounded-full 
              transition
              ${i === selectedIndex ? "bg-slate-700" : "bg-gray-50"}
            `}
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
}

function Slide({ title, description, bg, btn }: SlideProps) {
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
      <div className="container mx-auto px-8 flex flex-col justify-center items-start max-w-sm md:max-w-6xl text-left">

        <p className="font-heading text-3xl md:text-4xl text-primary mb-4 font-bold leading-11 select-none">
          {title}
        </p>

        <p className="text-md md:text-lg text-slate-700 mb-12 max-w-xl select-none">
          {description}
        </p>

        <button className="
        bg-secondary text-white 
        inline-block 
        px-5 py-2 rounded-full 
        font-medium 
        text-md 
         cursor-pointer text-heading
            shadow-lg 
          shadow-secondary/30
          hover:shadow-xl 
          hover:shadow-secondary/50
          hover:bg-secondary/90
          transition-all 
          duration-300 
          select-none
          uppercase
          font-heading
          
          tracking-wide

        ">
          {btn}
        </button>
      </div>
    </div>
  );
}
