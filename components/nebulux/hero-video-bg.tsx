"use client"

import React from "react"
import { useReducedMotion } from "framer-motion"

export default function HeroVideoBg() {
  const reduce = useReducedMotion()

  // Vimeo video embed URL
  const vimeoEmbedUrl = "https://player.vimeo.com/video/1118987600?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1"
  
  // No useEffect needed for iframe approach

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 w-screen h-screen overflow-hidden" aria-hidden="true">
      {!reduce ? (
        <iframe
          className="absolute inset-0 w-full h-full opacity-100"
          src={vimeoEmbedUrl}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Nebulux Hero Video"
          style={{
            pointerEvents: 'none',
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            transform: 'scale(1.1)',
            transformOrigin: 'center center'
          }}
        />
      ) : (
        // Static background for reduced motion users
        <div 
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-100"
          style={{ backgroundImage: 'url(/aurena-hero-video-placeholder.png)' }}
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
