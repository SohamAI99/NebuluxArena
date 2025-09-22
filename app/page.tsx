"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { NeonButton } from "@/components/nebulux/neon-button"
import { GlassCard } from "@/components/nebulux/glass-card"
import { Countdown } from "@/components/nebulux/countdown"
// import { PartnersMarquee } from "@/components/nebulux/partners-marquee"
import { Preloader } from "@/components/nebulux/preloader"
import HeroVideoBg from "@/components/nebulux/hero-video-bg"
import { supabase } from '@/lib/supabase'

const nav = [
  { href: "#collabs", label: "Collabs" },
  { href: "#about", label: "About Us" },
  { href: "#contact", label: "Contact Us" },
]

const easeOutExpo = [0.16, 1, 0.3, 1] as const
const containerVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easeOutExpo, staggerChildren: 0.12 },
  },
}
const childVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: easeOutExpo } },
}
const headingVariants = childVariants
const subheadingVariants = childVariants
const flipVariants = {
  hidden: { opacity: 0, rotateX: -90, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easeOutExpo },
  },
}

export default function Page() {
  const [loaded, setLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 400], [0, -24])

  useEffect(() => {
    function onLoad() {
      setLoaded(true)
      // Delay content appearance for smooth transition
      setTimeout(() => {
        setShowContent(true)
      }, 1000) // 1s delay after preloader starts fading
    }
    if (document.readyState === "complete") {
      onLoad()
    } else {
      window.addEventListener("load", onLoad, { once: true })
    }
    return () => window.removeEventListener("load", onLoad)
  }, [])

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const href = (e.currentTarget.getAttribute("href") || "").replace("#", "")
    const el = document.getElementById(href)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${href}`)
    }
  }

  return (
    <div className="relative overflow-clip">
      <Preloader show={!loaded} />

      {/* Plain dark background */}
      <div aria-hidden className="fixed inset-0 z-0 bg-black" />

      {/* Header (darker glass, no shadow) */}
      <motion.header
        initial={false}
        animate={{ backdropFilter: scrolled ? "blur(14px)" : "blur(0px)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "sticky top-0 z-50 border-b border-white/10",
          "supports-[backdrop-filter]:bg-black/50 bg-black/70 backdrop-blur-xl",
          scrolled ? "py-6" : "py-8",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <a
            href="#hero"
            onClick={handleAnchor}
            className="font-jersey text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-balance text-white glow-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-white transition-all duration-300"
            aria-label="Nebulux home"
          >
            Nebulux
          </a>
          <nav aria-label="Primary">
            <ul className="flex items-center gap-6 md:gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={handleAnchor}
                    className="text-lg md:text-xl font-medium text-white/80 hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-3 py-2 hover:bg-white/5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.header>

      <main
        id="hero"
        className={cn(
          "relative z-10 transition-all duration-1000 ease-out",
          showContent 
            ? "opacity-100 translate-y-0 scale-100 blur-0" 
            : "opacity-0 translate-y-8 scale-95 blur-sm",
        )}
      >
        {/* Hero */}
        <section className="relative flex min-h-[88svh] items-center">
          <HeroVideoBg />
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 place-items-center gap-8 px-4 py-16 text-center">
            <motion.h1
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-10% 0px" }}
              variants={headingVariants}
              transition={{ duration: reduce ? 0 : 0.6, ease: easeOutExpo }}
              style={reduce ? undefined : { y: parallaxY }}
              className="font-jersey text-pretty text-6xl md:text-8xl lg:text-9xl font-semibold tracking-[-0.02em] text-white glow-white"
            >
              Nebulux
            </motion.h1>
            <motion.p
              variants={subheadingVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.5, delay: 0.05, ease: easeOutExpo }}
              className="text-lg md:text-xl text-white/80 text-sheen pixel-text"
            >
              Stay Tuned...
            </motion.p>

            <div className="mt-4">
              <Countdown />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <NeonButton
                className="group"
                variant="glass"
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById("about")
                  el?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <span>Explore more</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </NeonButton>
              <NeonButton
                className="group"
                variant="glass"
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById("contact")
                  el?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
              >
                Get updates
              </NeonButton>
            </div>
          </div>
        </section>

        {/* About */}
        <Section
          id="about"
          title="About Us"
          headingClassName="font-jersey text-center text-3xl md:text-4xl lg:text-5xl"
          className="pt-32 sm:pt-40 md:pt-48"
        >
          <div className="mx-auto max-w-3xl text-center space-y-5">
            <p className="text-pretty text-base md:text-lg text-white/80">
              Nebulux began with a belief that the strongest connections are forged through challenges, teamwork, and
              resilience. We&apos;re building something that rewards dedication and celebrates progress. Thanks for being
              early.
            </p>
          </div>
          <div className="mt-12 space-y-8">
            {[
              { title: "Craft", desc: "Precision as a habit." },
              { title: "Community", desc: "Progress together." },
              { title: "Progress", desc: "Momentum rewarded." },
            ].map((p, i) => (
              <div key={p.title} className={cn("w-full", i % 2 === 1 ? "md:flex md:justify-end" : "") }>
                <motion.div
                  variants={flipVariants}
                  initial="hidden"
                  whileInView="show"
                  exit="hidden"
                  viewport={{ once: false, amount: 0.35 }}
                  className="w-full max-w-md"
                >
                  <GlassCard className="group p-5 md:p-6 aspect-square max-w-md">
                    <div className="flex h-full flex-col items-center justify-center text-center gap-2">
                      <h3 className="font-jersey text-lg md:text-xl font-semibold text-white group-hover:glow-white">{p.title}</h3>
                      <p className="text-xs md:text-sm text-white/85 pixel-text">{p.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            ))}
          </div>
        </Section>

        {/* Collabs */}
        <Section id="collabs" title="Collabs" headingClassName="font-jersey">
          <div className="mt-12 space-y-8">
            {[
              { title: "Creators", desc: "Let's shape focused experiences together." },
              { title: "Studios", desc: "Co-develop high-performance initiatives." },
              { title: "Brands", desc: "Partner on meaningful milestones." },
              { title: "Institutions", desc: "Build durable frameworks for growth." },
              { title: "Enterprises", desc: "Scale with robust, reliable deployments." },
              { title: "Startups", desc: "Move fast with focused, high-impact builds." },
            ].map((c, idx) => (
              <div key={c.title} className={cn("w-full", idx % 2 === 1 ? "md:flex md:justify-end" : "") }>
                <motion.div
                  variants={flipVariants}
                  initial="hidden"
                  whileInView="show"
                  exit="hidden"
                  viewport={{ once: false, amount: 0.35 }}
                  className="w-full max-w-md"
                >
                  <CollabCard index={idx} title={c.title} desc={c.desc} />
                </motion.div>
              </div>
            ))}
          </div>
        </Section>

        {/* Partners removed */}

        {/* Contact */}
        <Section id="contact" title="Contact Us" headingClassName="font-jersey">
          <ContactForm />
        </Section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t">
        <div aria-hidden className="h-px w-full bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
        <div className="mx-auto max-w-6xl px-4 py-8 text-center">
          <nav aria-label="Footer" className="mb-3">
            <ul className="flex items-center justify-center gap-5 text-sm text-white/70">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={handleAnchor}
                    className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-1 py-1"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mb-3 text-sm text-white/60">
            <p>Mumbai-India</p>
            <p>
              <a 
                href="mailto:nebulux.team@gmail.com" 
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-1"
              >
                nebulux.team@gmail.com
              </a>
            </p>
          </div>
          <p className="text-xs text-white/80 glow-white/30">
            © {new Date().getFullYear()} Nebulux. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Section({
  id,
  title,
  headingClassName,
  className,
  children,
}: {
  id: string
  title: string
  headingClassName?: string
  className?: string
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()
  return (
    <section id={id} className={cn("relative z-10 mx-auto max-w-6xl px-4 py-16 sm:py-24", className)}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: reduce ? 0 : 0.6, ease: easeOutExpo }}
      >
        <motion.h2
          variants={childVariants}
          className={cn(
            "mb-6 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.01em] text-white text-center",
            "glow-white pixel-text",
            "animate-pulse",
            headingClassName,
          )}
          style={{
            textShadow: "0 0 20px rgba(255,193,7,0.6), 0 0 40px rgba(255,152,0,0.4), 0 0 60px rgba(255,193,7,0.2)",
            animation: "textGlow 3s ease-in-out infinite alternate",
          }}
        >
          {title}
        </motion.h2>
        <motion.div variants={childVariants}>{children}</motion.div>
      </motion.div>
    </section>
  )
}

function CollabCard({ title, desc }: { title: string; desc: string; index: number }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    
    e.currentTarget.style.setProperty('--tilt-x', `${Math.max(-8, Math.min(8, rotateX))}deg`)
    e.currentTarget.style.setProperty('--tilt-y', `${Math.max(-8, Math.min(8, rotateY))}deg`)
  }
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg')
    e.currentTarget.style.setProperty('--tilt-y', '0deg')
  }
  
  return (
    <div className="relative group card-3d tilt-3d" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <GlassCard className="group p-6 md:p-7 aspect-square max-w-lg">
        <div className="flex h-full flex-col items-center justify-center text-center gap-2">
          <h3 className="font-jersey text-lg md:text-xl font-semibold text-white group-hover:glow-white">{title}</h3>
          <p className="text-xs md:text-sm text-white/85 pixel-text">{desc}</p>
          <div className="mt-2.5">
            <a
              href="#contact"
              className="text-xs md:text-sm font-medium text-white/90 underline decoration-white/40 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-1"
            >
              Request a collab
            </a>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [form, setForm] = useState({ name: "", email: "", message: "", notify: true, company: "" })

  function validate() {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = "Please enter your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email."
    if (!form.message.trim()) e.message = "Please enter a message."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.company.trim().length > 0) {
      return
    }
    if (!validate()) return
    setLoading(true)
    
    try {
      // Save to Supabase
      const { error } = await (supabase as any)
        .from('Client Table')
        .insert({
          name: form.name,
          email: form.email,
          message: form.message,
          notify: form.notify
        })

      if (error) throw error
      
      setSuccess(true)
      setForm({ name: "", email: "", message: "", notify: true, company: "" })
    } catch (error: any) {
      console.error('Error saving contact form:', error)
      setErrors({ ...errors, message: `Failed to send message: ${error.message || 'Please try again.'}` })
    } finally {
      setLoading(false)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="relative">
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed bottom-4 right-4 z-50 transition-all",
          success ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        )}
      >
        <div className="rounded-lg border border-white/10 bg-black/70 px-4 py-3 shadow-[0_0_30px_-10px_rgba(0,255,128,0.5)] backdrop-blur-md wobble">
          <p className="text-sm">
            <span className="text-transparent bg-clip-text gradient-b font-medium">Thanks!</span> We’ll be in touch.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="mx-auto grid max-w-2xl gap-4">
        <label className="hidden" aria-hidden>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          />
        </label>

        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm text-white">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={cn(
              "rounded-lg border bg-black/40 px-3 py-2 outline-none backdrop-blur-md text-white placeholder-white/60",
              "focus-visible:ring-2 focus-visible:ring-white",
              errors.name ? "ring-2 ring-red-500/70" : "border-white/10",
            )}
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-red-400">
              {errors.name}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm text-white">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={cn(
              "rounded-lg border bg-black/40 px-3 py-2 outline-none backdrop-blur-md text-white placeholder-white/60",
              "focus-visible:ring-2 focus-visible:ring-white",
              errors.email ? "ring-2 ring-red-500/70" : "border-white/10",
            )}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-400">
              {errors.email}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm text-white">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Tell us how exited you are..."
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className={cn(
              "min-h-28 rounded-lg border bg-black/40 px-3 py-2 outline-none backdrop-blur-md text-white placeholder-white/60",
              "focus-visible:ring-2 focus-visible:ring-white",
              errors.message ? "ring-2 ring-red-500/70" : "border-white/10",
            )}
            required
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="text-xs text-red-400">
              {errors.message}
            </p>
          )}
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={form.notify}
            onChange={(e) => setForm((f) => ({ ...f, notify: e.target.checked }))}
            className="accent-white"
          />
          Notify me when we launch
        </label>
        <div className="pt-2">
          <NeonButton variant="glass" disabled={loading} className={cn(success && "animate-shadowPulse")}>
            <span className="relative inline-flex items-center gap-2">
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
                    aria-hidden
                  />
                  <span>Sending</span>
                </>
              ) : success ? (
                <>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Sent</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </span>
          </NeonButton>
        </div>
      </form>
    </div>
  )
}
