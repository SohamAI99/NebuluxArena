"use client"

import { useEffect, useMemo, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Preloader({ show }: { show: boolean }) {
  const reduce = useReducedMotion()

  const [render, setRender] = useState(show)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (show) {
      setRender(true)
      setFading(false)
    } else {
      setFading(true)
      const t = setTimeout(() => {
        setRender(false)
      }, 800) // match required 0.8s
      return () => clearTimeout(t)
    }
  }, [show])

  // prevent reflows: cache transforms using CSS var sizing
  const sizeVar = useMemo(() => ({ ["--s" as string]: "clamp(72px, 22vw, 168px)" }), [])

  if (!render) return null

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center",
        "bg-[linear-gradient(180deg,#000000_0%,#0b1220_100%)]",
        "transition-opacity duration-800",
        fading ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
      {/* optional vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 65% at 50% 30%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <div aria-hidden className="relative" style={{ perspective: reduce ? "0px" : "900px" }}>
        <div
          className={cn(
            "relative mx-auto",
            "will-change-transform",
            !reduce && "animate-[cubeRotate_2.8s_linear_infinite]",
          )}
          style={{
            ...sizeVar,
            width: "var(--s)",
            height: "var(--s)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Faces with white borders + glow */}
          <Face transform="translateZ(calc(var(--s)/2))" />
          <Face transform="rotateY(180deg) translateZ(calc(var(--s)/2))" />
          <Face transform="rotateY(90deg) translateZ(calc(var(--s)/2))" />
          <Face transform="rotateY(-90deg) translateZ(calc(var(--s)/2))" />
          <Face transform="rotateX(90deg) translateZ(calc(var(--s)/2))" />
          <Face transform="rotateX(-90deg) translateZ(calc(var(--s)/2))" />
        </div>
      </div>
    </div>
  )
}

function Face({ transform }: { transform: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        transform,
        border: "2px solid rgba(255,255,255,0.9)",
        background: "transparent",
        boxShadow: "0 0 18px rgba(255,255,255,0.55), inset 0 0 12px rgba(255,255,255,0.28)",
        // subtle outer diffusion for the whole face
        filter: "drop-shadow(0 0 10px rgba(255,255,255,0.35))",
      }}
    />
  )
}
