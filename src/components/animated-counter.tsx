"use client";
import { animate, KeyframeOptions, useInView, useIsomorphicLayoutEffect } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  from: number;
  to: number;
  animationOptions?: KeyframeOptions
}

export default function AnimatedCounter({ from, to, animationOptions }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {once: true})

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if(!inView) return;

    element.textContent = String(from);

    const controls = animate(from, to, {
      duration: 1.5,
      ease: "easeOut",
      ...animationOptions,
      onUpdate(value) {
        element.textContent = value.toFixed(2);
      }
    });

    return () => { controls.stop(); }

  }, [ref, from, to, inView])

  return <span ref={ref} />;
}