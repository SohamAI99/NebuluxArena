"use client"

import { useReducedMotion } from "framer-motion"

export function NeonGrid() {
  const reduce = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Neon grid (very subtle) */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.12) 0 1px, transparent 1px 40px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0 1px, transparent 1px 40px)",
          maskImage: "radial-gradient(65% 65% at 50% 35%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(65% 65% at 50% 35%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)",
          animation: reduce ? "none" : "gridDrift 12s ease-in-out infinite",
        }}
      />

      {/* Drifting gradient fog A (monochrome) */}
      <div
        className="absolute -left-1/4 top-[5%] h-[60vmax] w-[60vmax] blur-3xl opacity-[0.10]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.35), rgba(255,255,255,0.12) 55%, transparent 70%)",
          animation: reduce ? "none" : "fogFloat 18s ease-in-out infinite",
        }}
      />
      {/* Drifting gradient fog B (monochrome) */}
      <div
        className="absolute -right-1/4 bottom-[-10%] h-[70vmax] w-[70vmax] blur-3xl opacity-[0.10]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.30), rgba(255,255,255,0.10) 55%, transparent 70%)",
          animation: reduce ? "none" : "fogFloat 22s ease-in-out infinite",
          animationDelay: reduce ? "0s" : "2s",
        }}
      />
    </div>
  )
}
