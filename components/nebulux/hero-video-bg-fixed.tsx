"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

export default function HeroVideoBg() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reduce = useReducedMotion()
  const [videoError, setVideoError] = useState(false)

  // REPLACE THIS URL WITH YOUR ACTUAL HOSTED VIDEO URL
  // Examples:
  // - Cloudinary: "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/your-video.mp4"
  // - Your server: "https://yourdomain.com/videos/nebulux-video.mp4"
  // - Vercel/Netlify: "https://your-site.vercel.app/videos/nebulux-video.mp4"
  const videoUrl = "https://your-hosted-video-url-here.mp4"
  
  // Fallback to placeholder if video fails
  const fallbackImage = "/aurena-hero-video-placeholder.png"

  useEffect(() => {
    const v = videoRef.current
    if (!v || videoError) return

    if (reduce) {
      // Respect reduced-motion: keep the overlays, but stop the video.
      try {
        v.pause()
      } catch {}
      return
    }

    const tryPlay = async () => {
      if (!v || videoError) return
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
      } catch (error) {
        console.warn('Video autoplay failed:', error)
        // Don't set error state for autoplay failures, they're common
      }
    }

    const onCanPlay = () => void tryPlay()
    const onInteract = () => void tryPlay()
    const onVisibility = () => {
      if (!document.hidden) void tryPlay()
    }
    
    const onError = () => {
      console.error('Video failed to load:', videoUrl)
      setVideoError(true)
    }

    const onLoadStart = () => {
      setVideoError(false)
    }

    v.addEventListener("canplay", onCanPlay, { once: true })
    v.addEventListener("error", onError)
    v.addEventListener("loadstart", onLoadStart)
    
    // Fallbacks if autoplay was blocked
    window.addEventListener("pointerdown", onInteract, { once: true })
    window.addEventListener("keydown", onInteract, { once: true })
    document.addEventListener("visibilitychange", onVisibility)

    // initial attempt
    void tryPlay()

    return () => {
      v.removeEventListener("canplay", onCanPlay)
      v.removeEventListener("error", onError)
      v.removeEventListener("loadstart", onLoadStart)
      window.removeEventListener("pointerdown", onInteract)
      window.removeEventListener("keydown", onInteract)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [reduce, videoUrl, videoError])

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {!videoError ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-100 motion-reduce:hidden"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={fallbackImage}
          onError={() => setVideoError(true)}
        />
      ) : (
        // Fallback to static image if video fails
        <div 
          className="h-full w-full object-cover opacity-100 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}

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