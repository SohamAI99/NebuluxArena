"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Preloader({ show }: { show: boolean }) {
  const reduce = useReducedMotion()
  const [render, setRender] = useState(show)
  const [fading, setFading] = useState(false)
  const [transforming, setTransforming] = useState(false)

  useEffect(() => {
    if (show) {
      setRender(true)
      setFading(false)
      setTransforming(false)
    } else {
      // Start the transformation effect
      setTransforming(true)
      setTimeout(() => {
        setFading(true)
      }, 400) // Start fading after transformation
      
      const t = setTimeout(() => {
        setRender(false)
      }, 1200) // Extended duration for smooth transition
      return () => clearTimeout(t)
    }
  }, [show])

  if (!render) return null

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center",
        "bg-[linear-gradient(180deg,#000000_0%,#0b1220_100%)]",
        "transition-all duration-1000 ease-out",
        fading ? "opacity-0 pointer-events-none scale-110 blur-sm" : "opacity-100 scale-100 blur-0",
        transforming && !reduce ? "animate-preloader-exit" : ""
      )}
    >
      {/* Optional vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 65% at 50% 30%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Animated Nebulux Text */}
      <div 
        aria-hidden 
        className={cn(
          "relative text-center transition-all duration-500 ease-out",
          transforming ? "scale-75 translate-y-4 opacity-80" : "scale-100 translate-y-0 opacity-100"
        )}
      >
        <h1 
          className={cn(
            "font-jersey text-6xl md:text-8xl lg:text-9xl font-semibold tracking-[-0.02em] text-white",
            "glow-white transition-all duration-700 ease-out",
            !reduce && "animate-bounce",
            transforming ? "blur-sm" : "blur-0"
          )}
          style={{
            textShadow: transforming 
              ? "0 0 60px rgba(255,255,255,0.4), 0 0 100px rgba(255,255,255,0.2), 0 0 140px rgba(255,255,255,0.1)"
              : "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4), 0 0 90px rgba(255,255,255,0.2)",
            animation: reduce 
              ? "pulse 2s ease-in-out infinite" 
              : transforming 
                ? "nebuluxGlowExit 0.8s ease-out forwards"
                : "nebuluxGlow 2s ease-in-out infinite, bounce 1s ease-in-out infinite"
          }}
        >
          Nebulux
        </h1>
        <div className="mt-4 flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 bg-white/80 rounded-full transition-all duration-300",
                transforming ? "animate-pulse opacity-50 scale-75" : "animate-pulse opacity-80 scale-100"
              )}
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: transforming ? "0.8s" : "1.5s"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
