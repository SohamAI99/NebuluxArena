"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { Partner } from "@/types/partner" // Assuming Partner type is defined in a separate file

type PartnerProps = {
  partners?: Partner[]
  top?: Partner[]
  bottom?: Partner[]
}

const logoMap: Record<string, string> = {
  SoftBank: "https://upload.wikimedia.org/wikipedia/commons/7/76/SoftBank_logo.svg",
  "JP Morgan": "https://upload.wikimedia.org/wikipedia/commons/0/0e/JPMorgan_Chase.svg",
  Unity: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg",
  X: "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg",
  Tensor: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
  Vireon: "",
  Meta: "https://upload.wikimedia.org/wikipedia/commons/0/05/Meta_Platforms_Inc._logo.svg",
  Lenovo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Lenovo_logo_2015.svg",
}

export function PartnersMarquee({ partners, top, bottom }: PartnerProps) {
  const list: Partner[] = partners ?? [...(top || []), ...(bottom || [])]
  const track = [...list, ...list] // duplicate for seamless loop

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md">
      {/* edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/80 to-transparent"
      />
      <div aria-label="Our partners" className="py-8">
        <ul className="flex gap-10 px-8 will-change-transform marquee-fast motion-reduce:animate-none">
          {track.map((p, i) => (
            <li key={`${p.name}-${i}`} aria-hidden={i >= list.length} className="shrink-0">
              <div className="flex h-full min-w-[240px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-10 py-10 backdrop-blur-md">
                <LogoItem p={p} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function LogoItem({ p }: { p: Partner }) {
  const src = logoMap[p.name] || ""
  const [imgOk, setImgOk] = useState(true)
  const bigName = p.name === "SoftBank" || p.name === "JP Morgan" || p.name === "Vireon" || p.name === "Lenovo"
  useEffect(() => {
    setImgOk(!!src)
  }, [src])
  return (
    <div className="relative group/logo">
      {imgOk ? (
        <img
          src={src || "/placeholder.svg?height=120&width=300&query=partner-logo"}
          alt={`${p.name} logo`}
          className="h-24 w-auto md:h-28 lg:h-32 opacity-80 transition-all group-hover:opacity-100 group-hover:scale-[1.08]"
          style={{ filter: "invert(1) brightness(1.2)" }}
          onError={() => setImgOk(false)}
        />
      ) : (
        <span className={cn("text-white/80 px-2", bigName ? "text-2xl md:text-3xl" : "text-lg md:text-xl")}>
          {p.name}
        </span>
      )}
      {/* visible caption for emphasis on selected names */}
      <p
        className={cn(
          "mt-3 text-center text-white/70",
          bigName ? "text-sm md:text-base font-semibold" : "text-xs md:text-sm",
        )}
      >
        {p.name}
      </p>
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-[140%] z-10 -translate-x-1/2 whitespace-pre rounded-md border border-white/10 bg-black/80 px-3 py-2 text-xs text-white/80 opacity-0 shadow-lg backdrop-blur-md transition-all group-hover:opacity-100"
      >
        {p.desc}
      </div>
    </div>
  )
}
