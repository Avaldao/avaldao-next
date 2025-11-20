"use client";

import { useEffect, useRef } from "react";
import EmblaCarousel from "embla-carousel";

export default function Hero() {
  const emblaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emblaRef.current) return;

    const embla = EmblaCarousel(emblaRef.current, {
      loop: true,
      align: "start",
      duration: 20,
    });

    return () => embla.destroy();
  }, []);

  return (
    <section>
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
      <div className="container mx-auto px-8 flex flex-col justify-center items-start max-w-6xl text-left">

        <p className="font-heading text-4xl text-primary mb-4 font-bold leading-11">
          {title}
        </p>

        <p className="text-lg text-slate-700 mb-12 max-w-xl">
          {description}
        </p>

        <button className="bg-secondary text-white inline-block px-5 py-2 rounded-full font-medium text-lg select-none cursor-pointer text-heading">
          {btn}
        </button>

      </div>
    </div>
  );
}
