"use client";

import { useEffect, useRef, useState } from "react";

/* Cursor custom estilo award-site: punto + anillo con retardo que se agranda
 * sobre elementos interactivos. Solo en dispositivos con puntero fino. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const ringInner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    let x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      raf = 0,
      seen = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        // evita que el anillo "viaje" desde la esquina en el primer movimiento
        rx = x;
        ry = y;
        seen = true;
      }
      if (dot.current)
        dot.current.style.transform = `translate(${x}px, ${y}px)`;
      const target = e.target as Element | null;
      const interactive = !!target?.closest?.(
        "a, button, [role='button'], input, textarea, canvas"
      );
      if (ringInner.current)
        ringInner.current.style.transform = `translate(-50%, -50%) scale(${
          interactive ? 2.2 : 1
        })`;
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current)
        ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        className="fixed top-0 left-0 z-[9500] pointer-events-none mix-blend-difference"
        aria-hidden
      >
        <div
          ref={ringInner}
          className="w-9 h-9 rounded-full border border-white/80 transition-transform duration-300 ease-out"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>
      <div
        ref={dot}
        className="fixed top-0 left-0 z-[9500] pointer-events-none mix-blend-difference"
        aria-hidden
      >
        <div
          className="w-1.5 h-1.5 rounded-full bg-white"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>
    </>
  );
}
