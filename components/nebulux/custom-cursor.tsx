"use client"

import React from "react"

export default function CustomCursor() {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const isCoarsePointer =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches

  const cursorRef = React.useRef<HTMLDivElement | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const targetRef = React.useRef({ x: 0, y: 0, down: false, visible: false })
  const posRef = React.useRef({ x: 0, y: 0 })

  React.useEffect(() => {
    if (prefersReducedMotion || isCoarsePointer) return
    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
      targetRef.current.visible = true
    }
    const onEnter = () => {
      targetRef.current.visible = true
    }
    const onLeave = () => {
      targetRef.current.visible = false
    }
    const onDown = () => {
      targetRef.current.down = true
    }
    const onUp = () => {
      targetRef.current.down = false
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseenter", onEnter)
    window.addEventListener("mouseleave", onLeave)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)

    const prevCursor = document.body.style.cursor
    document.body.style.cursor = "none"

    const tick = () => {
      const el = cursorRef.current
      if (!el) return
      const t = targetRef.current
      const p = posRef.current
      // ease
      p.x += (t.x - p.x) * 0.2
      p.y += (t.y - p.y) * 0.2
      const scale = t.down ? 0.85 : 1
      const opacity = t.visible ? 1 : 0
      el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${scale})`
      el.style.opacity = String(opacity)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseenter", onEnter)
      window.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.body.style.cursor = prevCursor
    }
  }, [prefersReducedMotion, isCoarsePointer])

  if (prefersReducedMotion || isCoarsePointer) return null

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[10000] size-5 rounded-full opacity-0 transition-opacity duration-200"
      style={{
        boxShadow: "0 0 0 1px rgba(255,255,255,0.5), 0 0 18px rgba(255,255,255,0.45)",
        background:
          "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 70%)",
        mixBlendMode: "screen",
        willChange: "transform, opacity",
      }}
    />
  )
}
