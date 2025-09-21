import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { StructuredData } from "@/components/structured-data"
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
  title: {
    default: "Neuro Career - AI-Powered Career Assessment",
    template: "%s | Neuro Career"
  },
  description: "Discover your ideal career path with our advanced AI-powered assessment. Get personalized career guidance with voice interaction, real-time analysis, and expert recommendations.",
  keywords: [
    "AI career assessment",
    "career guidance",
    "voice interaction",
    "career counseling",
    "job matching",
    "career path",
    "professional development",
    "AI counselor",
    "career discovery",
    "personalized assessment"
  ],
  authors: [{ name: "Neuro Career Team" }],
  creator: "Neuro Career",
  publisher: "Neuro Career",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://neuro-career-844x.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neuro-career-844x.vercel.app",
    title: "Neuro Career - AI-Powered Career Assessment",
    description: "Discover your ideal career path with our advanced AI-powered assessment. Get personalized career guidance with voice interaction and expert recommendations.",
    siteName: "Neuro Career",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Neuro Career - AI-Powered Career Assessment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neuro Career - AI-Powered Career Assessment",
    description: "Discover your ideal career path with our advanced AI-powered assessment. Get personalized career guidance with voice interaction.",
    images: ["/og-image.png"],
    creator: "@neurocareer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#0D0D0D",
    "color-scheme": "dark",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} dark antialiased`}>
      <head>
        <StructuredData />
      </head>
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
