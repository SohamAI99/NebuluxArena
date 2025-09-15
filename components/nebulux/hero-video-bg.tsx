"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"

export default function HeroVideoBg() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    if (reduce) {
      // Respect reduced-motion: keep the overlays, but stop the video.
      try {
        v.pause()
      } catch {}
      return
    }

    const tryPlay = async () => {
      if (!v) return
      try {
        // Ensure muted + inline for iOS autoplay
        v.muted = true
        ;(v as HTMLVideoElement).playsInline = true
        if (v.readyState >= 2) {
          await v.play()
        } else {
          v.load()
          await v.play()
        }
      } catch {
        // Autoplay blocked: will attempt again on first interaction or visibilitychange
      }
    }

    const onCanPlay = () => void tryPlay()
    const onInteract = () => void tryPlay()
    const onVisibility = () => {
      if (!document.hidden) void tryPlay()
    }

    v.addEventListener("canplay", onCanPlay, { once: true })
    // Fallbacks if autoplay was blocked
    window.addEventListener("pointerdown", onInteract, { once: true })
    window.addEventListener("keydown", onInteract, { once: true })
    document.addEventListener("visibilitychange", onVisibility)

    // initial attempt
    void tryPlay()

    return () => {
      v.removeEventListener("canplay", onCanPlay)
      window.removeEventListener("pointerdown", onInteract)
      window.removeEventListener("keydown", onInteract)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [reduce])

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <video
        ref={videoRef}
        className="h-full w-full object-cover opacity-100 motion-reduce:hidden"
        src="/videos/NebuluxVideo.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/aurena-hero-video-placeholder.png"
      />

      {/* scanlines */}
      <div className="absolute inset-0 hero-scanlines opacity-25 mix-blend-overlay motion-reduce:hidden" />

      {/* drifting neon grid */}
      <div className="absolute inset-0 hero-neon-grid opacity-[0.12] motion-reduce:hidden" />

      {/* readability overlays (keep existing) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0b1220]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_60%)]" />
    </div>
  )
}
