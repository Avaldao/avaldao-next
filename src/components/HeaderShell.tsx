"use client";

import { useEffect, useRef, useState } from "react";

// Por debajo de este scroll el header siempre se muestra.
const SHOW_ALWAYS_BELOW = 80;
// Diferencia mínima de scroll para cambiar de estado, así no parpadea con movimientos chicos.
const DELTA = 6;

/**
 * Contenedor `fixed` del header. En mobile (< lg) se oculta al scrollear hacia abajo y
 * reaparece al scrollear hacia arriba. En desktop se queda siempre visible.
 */
export default function HeaderShell({ className, children }: { className: string; children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const diff = y - lastY.current;
      if (Math.abs(diff) < DELTA) return;
      lastY.current = y;

      // Nunca ocultar con el menú hamburguesa abierto: el panel es hijo del header.
      const menuOpen = !!document.getElementById("mobile-menu");
      setHidden(diff > 0 && y > SHOW_ALWAYS_BELOW && !menuOpen);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      // Si algo del header recibe foco (teclado), se muestra.
      onFocusCapture={() => setHidden(false)}
      className={`${className} ${hidden ? "-translate-y-full lg:translate-y-0" : "translate-y-0"}`}
    >
      {children}
    </header>
  );
}
