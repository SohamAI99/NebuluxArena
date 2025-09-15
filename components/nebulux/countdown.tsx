"use client"

import { useEffect, useState } from "react"

const MS_IN_DAY = 24 * 60 * 60 * 1000

export function Countdown() {
  const [target] = useState<number>(() => {
    if (typeof window === "undefined") return Date.now() + 30 * MS_IN_DAY
    const existing = localStorage.getItem("nebulux_first_visit")
    if (existing) return Number(existing) + 30 * MS_IN_DAY
    const now = Date.now()
    localStorage.setItem("nebulux_first_visit", String(now))
    return now + 30 * MS_IN_DAY
  })
  const [now, setNow] = useState<number>(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = Math.max(0, target - now)
  const days = Math.floor(diff / MS_IN_DAY)
  const hours = Math.floor((diff % MS_IN_DAY) / (60 * 60 * 1000))
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((diff % (60 * 1000)) / 1000)

  return (
    <div
      aria-live="polite"
      className={`inline-flex items-center gap-3 rounded-xl border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-md ${diff === 0 ? "opacity-60" : ""}`}
    >
      {diff > 0 ? (
        <div className="flex items-center gap-4 text-sm md:text-base">
          <Unit label="DD" value={days} />
          <Sep />
          <Unit label="HR" value={hours} />
          <Sep />
          <Unit label="MIN" value={minutes} />
          <Sep />
          <Unit label="SEC" value={seconds} />
        </div>
      ) : (
        <p className="text-sm md:text-base text-white/90">Almost there.</p>
      )}
    </div>
  )
}

function Unit({ label, value }: { label: string; value: number }) {
  const [prev, setPrev] = useState(value)
  useEffect(() => {
    if (value !== prev) setPrev(value)
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  const s = String(value).padStart(2, "0")
  const p = String(prev).padStart(2, "0")
  return (
    <div className="min-w-20 text-center">
      {" "}
      {/* was min-w-16 */}
      <div className="inline-flex gap-1">
        <FadeDigit cur={s[0]} prev={p[0]} />
        <FadeDigit cur={s[1]} prev={p[1]} />
      </div>
      <div className="mt-1 text-[11px] md:text-sm tracking-wider text-white/70">{label}</div>
    </div>
  )
}

function FadeDigit({ cur, prev }: { cur: string; prev: string }) {
  const [anim, setAnim] = useState(false)
  useEffect(() => {
    if (cur !== prev) {
      setAnim(true)
      const t = setTimeout(() => setAnim(false), 320)
      return () => clearTimeout(t)
    } else {
      setAnim(false)
    }
  }, [cur, prev])

  return (
    <span className="relative inline-block h-12 w-9 md:h-16 md:w-12">
      {/* previous */}
      <span className="absolute inset-0 grid place-items-center rounded-md bg-black/60 text-white border border-white/15 shadow-[inset_0_-2px_0_rgba(255,255,255,0.06)] opacity-60">
        <span className="font-jersey tracking-wider text-3xl md:text-4xl leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">
          {prev}
        </span>
      </span>
      {/* current fades in */}
      <span
        className={`absolute inset-0 grid place-items-center rounded-md bg-black/60 text-white border border-white/25 shadow-[inset_0_-2px_0_rgba(255,255,255,0.12)] transition-opacity duration-300 ${
          anim ? "opacity-100" : "opacity-100"
        }`}
      >
        <span className="font-jersey tracking-wider text-3xl md:text-4xl leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]">
          {cur}
        </span>
      </span>
    </span>
  )
}

function Sep() {
  return <div className="text-white/40">—</div>
}
