"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "codepen" | "glass"
}

export function NeonButton({ className, variant = "primary", children, ...props }: Props) {
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15
    
    e.currentTarget.style.setProperty('--tilt-x', `${Math.max(-6, Math.min(6, rotateX))}deg`)
    e.currentTarget.style.setProperty('--tilt-y', `${Math.max(-6, Math.min(6, rotateY))}deg`)
  }
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg')
    e.currentTarget.style.setProperty('--tilt-y', '0deg')
  }
  if (variant === "glass") {
    return (
      <button
        className={cn(
          "group relative inline-flex items-center justify-center rounded-xl px-12 py-6 text-2xl font-semibold text-white",
          "bg-white/[0.06] backdrop-blur-xl border border-white/15",
          "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] card-3d tilt-3d",
          className,
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {/* spotlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(220px 220px at var(--m-x,50%) var(--m-y,50%), rgba(255,165,0,0.25) 0%, rgba(255,140,0,0.12) 50%, rgba(0,0,0,0) 70%)",
          }}
        />
        {/* track cursor for spotlight */}
        <span
          aria-hidden
          className="absolute inset-0"
          onMouseMove={(e) => {
            const rect = (e.currentTarget as HTMLSpanElement).getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            const parent = (e.currentTarget as HTMLSpanElement).parentElement as HTMLElement
            if (parent) {
              parent.style.setProperty("--m-x", `${x}%`)
              parent.style.setProperty("--m-y", `${y}%`)
            }
          }}
        />
      </button>
    )
  }
  if (variant === "codepen") {
    return (
      <button
        className={cn(
          "group relative inline-flex items-center justify-center rounded-full px-14 py-6 text-2xl font-semibold text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-white",
          "transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]",
          "is-disabled:opacity-60 is-disabled:cursor-not-allowed card-3d tilt-3d",
          className,
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* animated conic gradient border */}
        <span
          aria-hidden
          className="absolute -inset-[2px] rounded-full opacity-90"
          style={{
            background:
              "conic-gradient(from 0deg, #00f5ff, #7c3aed, #ff00e6, #00f5ff)",
            filter: "saturate(1.2)",
            animation: "spin 2.8s linear infinite",
          }}
        />
        {/* soft outer glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-full blur-xl opacity-40"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(0,245,255,0.8), rgba(124,58,237,0.8), rgba(255,0,230,0.8), rgba(0,245,255,0.8))",
          }}
        />
        {/* inner solid background */}
        <span className="absolute inset-[2px] rounded-full bg-black/80 backdrop-blur-md" />
        {/* glossy sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-linear"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 18%, rgba(255,255,255,0) 36%)",
          }}
        />
        {/* label */}
        <span className="relative z-10 tracking-tight">{children}</span>
      </button>
    )
  }

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center rounded-lg px-12 py-6 text-2xl font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-white",
        "pixel-btn transition-transform duration-300 ease-out hover:scale-[1.015] active:scale-[0.99]",
        variant === "primary"
          ? "border border-white/40 hover:border-white/80 text-white"
          : "border border-white/30 hover:border-white/70 text-white/90",
        "is-disabled:opacity-60 is-disabled:cursor-not-allowed card-3d tilt-3d",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className="relative z-10 pixel-text">{children}</span>
      <span aria-hidden className="absolute inset-[2px] rounded-md bg-black/40 backdrop-blur-md" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-50"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1200 ease-linear"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 15%, rgba(255,255,255,0) 30%)",
        }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-lg pixel-flicker" />
    </button>
  )
}
