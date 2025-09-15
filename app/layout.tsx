import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Jersey_15 } from "next/font/google"
import CustomCursor from "@/components/nebulux/custom-cursor"

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})
const jersey = Jersey_15({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersey",
  display: "swap",
  fallback: ["monospace"],
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: "Nebulux — Stay Tuned",
  description: "Something new is almost here.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Nebulux — Stay Tuned",
    description: "Something new is almost here.",
    url: "https://example.com",
    siteName: "Nebulux",
    images: ["/opengraph-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nebulux — Stay Tuned",
    description: "Something new is almost here.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      {
        url: "https://broken-lavender-9yes9vtktg.edgeone.app/LogoBGRemover.png",
        type: "image/png",
      },
    ],
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${display.variable} ${GeistMono.variable} ${jersey.variable} antialiased`}
    >
      <body className="font-sans min-h-dvh bg-gradient-to-b from-black to-white dark:bg-gradient-to-b dark:from-black dark:to-background text-white dark:text-foreground">
        <CustomCursor />
        <a
          href="#hero"
          className="sr-only focus:not-sr-only fixed left-3 top-3 z-[1000] rounded-md bg-black/80 px-3 py-2 text-sm text-white outline-none ring-2 ring-white backdrop-blur-md"
        >
          Skip to content
        </a>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
