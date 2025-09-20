import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { PageTransition } from "@/components/page-transition"
import { FloatingCTA } from "@/components/floating-cta"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "AI Career Assessment",
  description: "AI-powered career guidance with voice interaction",
  generator: "neuro-career-app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} dark antialiased`}>
      <body className="bg-[#0D0D0D] text-[#E0E0E0] font-sans">
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Navbar />
            <div className="pt-16">
              <PageTransition>{children}</PageTransition>
            </div>
            <FloatingCTA />
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
