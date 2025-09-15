import type React from "react"
import { cn } from "@/lib/utils"
import { useRef } from "react"

export function GlassCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const isPointerInside = useRef(false)
  const refElement = useRef<HTMLDivElement>(null)
  const state = useRef({
    glare: {
      x: 50,
      y: 50,
    },
    background: {
      x: 50,
      y: 50,
    },
    rotate: {
      x: 0,
      y: 0,
    },
  })

  const containerStyle = {
    "--m-x": "50%",
    "--m-y": "50%",
    "--duration": "300ms",
    "--opacity": "0",
    "--radius": "8px",
    "--easing": "ease",
    "--transition": "var(--duration) var(--easing)",
  } as React.CSSProperties

  const shadowStyle: React.CSSProperties = {
    background:
      "radial-gradient(220px 220px at var(--m-x) var(--m-y), rgba(255,165,0,0.35) 0%, rgba(255,140,0,0.18) 45%, rgba(0,0,0,0) 70%)",
    filter: "blur(16px)",
  } as React.CSSProperties

  const updateStyles = () => {
    if (refElement.current) {
      const { background, rotate, glare } = state.current
      refElement.current?.style.setProperty("--m-x", `${glare.x}%`)
      refElement.current?.style.setProperty("--m-y", `${glare.y}%`)
      refElement.current?.style.setProperty("--r-x", `${rotate.x}deg`)
      refElement.current?.style.setProperty("--r-y", `${rotate.y}deg`)
      refElement.current?.style.setProperty("--bg-x", `${background.x}%`)
      refElement.current?.style.setProperty("--bg-y", `${background.y}%`)
    }
  }

  return (
    <div
      style={containerStyle}
      className="relative isolate [contain:layout_style] transition-transform duration-[var(--duration)] ease-[var(--easing)] will-change-transform"
      ref={refElement}
      onPointerMove={(event) => {
        const rotateFactor = 0.2
        const rect = event.currentTarget.getBoundingClientRect()
        const position = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        }
        const percentage = {
          x: (100 / rect.width) * position.x,
          y: (100 / rect.height) * position.y,
        }
        const delta = {
          x: percentage.x - 50,
          y: percentage.y - 50,
        }

        const { background, rotate, glare } = state.current
        background.x = 50 + percentage.x / 4 - 12.5
        background.y = 50 + percentage.y / 3 - 16.67
        rotate.x = -(delta.x / 3.5)
        rotate.y = delta.y / 2
        rotate.x *= rotateFactor
        rotate.y *= rotateFactor
        glare.x = percentage.x
        glare.y = percentage.y

        updateStyles()
      }}
      onPointerEnter={() => {
        isPointerInside.current = true
        if (refElement.current) {
          setTimeout(() => {
            if (isPointerInside.current) {
              refElement.current?.style.setProperty("--duration", "0s")
            }
          }, 300)
        }
      }}
      onPointerLeave={() => {
        isPointerInside.current = false
        if (refElement.current) {
          refElement.current.style.removeProperty("--duration")
          refElement.current?.style.setProperty("--r-x", `0deg`)
          refElement.current?.style.setProperty("--r-y", `0deg`)
        }
      }}
    >
      <div
        className={cn(
          "relative grid rounded-[var(--radius)] border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden",
          // glass morphism glow on hover (applies to all cards uniformly)
          "transition-all duration-300 hover:bg-white/[0.1] hover:border-white/20 hover:shadow-[0_12px_40px_-10px_rgba(255,255,255,0.25)]",
          className,
        )}
      >
        <div className="relative z-10">{children}</div>
        {/* spotlight overlay that follows cursor; shared by all cards (About + Collabs) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(180px 180px at var(--m-x,50%) var(--m-y,50%), rgba(255,165,0,0.25) 0%, rgba(255,140,0,0.12) 45%, rgba(0,0,0,0) 70%)",
          }}
        />
      </div>
      {/* shadow spotlight only */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[calc(var(--radius)+12px)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={shadowStyle}
      />
    </div>
  )
}
