"use client"

import React from "react"

export default function CursorTrail() {
  // Disable on reduced motion or coarse pointers (mobile/tablets)
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const isCoarsePointer =
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const dprRef = React.useRef<number>(1)

  // Trail points for a smooth, lightweight effect
  const trailRef = React.useRef(Array.from({ length: 16 }, () => ({ x: 0, y: 0, a: 0 })))
  const targetRef = React.useRef({ x: 0, y: 0, hasPos: false })

  // Smooth resize handler
  const resize = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { innerWidth: w, innerHeight: h, devicePixelRatio } = window
    const dpr = Math.min(2, devicePixelRatio || 1)
    dprRef.current = dpr
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = w + "px"
    canvas.style.height = h + "px"
  }, [])

  // Mouse/touch tracking
  React.useEffect(() => {
    if (prefersReducedMotion || isCoarsePointer) return

    const handleMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
      targetRef.current.hasPos = true
    }

    const handleTouch = (e: TouchEvent) => {
      if (!e.touches?.[0]) return
      targetRef.current.x = e.touches[0].clientX
      targetRef.current.y = e.touches[0].clientY
      targetRef.current.hasPos = true
    }

    window.addEventListener("mousemove", handleMove, { passive: true })
    window.addEventListener("touchmove", handleTouch, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleTouch)
    }
  }, [prefersReducedMotion, isCoarsePointer])

  // Animation loop
  React.useEffect(() => {
    if (prefersReducedMotion || isCoarsePointer) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    resize()
    window.addEventListener("resize", resize)

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const draw = () => {
      const dpr = dprRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const target = targetRef.current
      const trail = trailRef.current

      if (target.hasPos) {
        // The first point eases toward the cursor
        const head = trail[0]
        head.x = lerp(head.x || target.x, target.x, 0.25)
        head.y = lerp(head.y || target.y, target.y, 0.25)
        head.a = 1

        // Subsequent points ease toward the previous one for a smooth ribbon
        for (let i = 1; i < trail.length; i++) {
          const prev = trail[i - 1]
          const p = trail[i]
          p.x = lerp(p.x || prev.x, prev.x, 0.35)
          p.y = lerp(p.y || prev.y, prev.y, 0.35)
          p.a = Math.max(0, lerp(p.a, prev.a * 0.92, 0.5))
        }
      } else {
        // If no position yet, keep alpha fading
        for (let i = 0; i < trail.length; i++) {
          trail[i].a *= 0.9
        }
      }

      // White glow style
      ctx.save()
      ctx.globalCompositeOperation = "lighter"
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i]
        const alpha = p.a
        if (alpha <= 0.02) continue
        const baseSize = 8 // px
        const size = (baseSize * (trail.length - i)) / trail.length // taper
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${0.08 + alpha * 0.18})`
        ctx.shadowColor = "rgba(255,255,255,0.9)"
        ctx.shadowBlur = 18 * dpr
        ctx.arc(p.x * dpr, p.y * dpr, size * dpr, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      const ctx2 = canvas.getContext("2d")
      if (ctx2) ctx2.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [prefersReducedMotion, isCoarsePointer, resize])

  if (prefersReducedMotion || isCoarsePointer) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  )
}
