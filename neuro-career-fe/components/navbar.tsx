"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/assessment", label: "Assessment" },
  { href: "/analysis", label: "Analysis" },
  { href: "/simulation", label: "Simulation" },
  { href: "/results", label: "Results" },
  { href: "/learning", label: "Learning" },
  { href: "/profile", label: "Profile" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-2">
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg px-3 py-2"
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
              className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500/70 via-purple-500/60 to-pink-500/50 ring-1 ring-white/20"
              aria-hidden="true"
            >
              <Brain className="h-4 w-4 text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            </motion.span>
            <span className="text-sm font-medium">NeuroCareer</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm transition",
                    "hover:scale-[1.03] hover:text-white",
                    "before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-pink-500/0 before:via-purple-500/0 before:to-blue-500/0 before:opacity-0 before:transition",
                    "hover:before:from-pink-500/10 hover:before:via-purple-500/10 hover:before:to-blue-500/10 hover:before:opacity-100",
                    active && "text-white",
                  )}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>

          <button
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.nav>
      </div>

      {/* mobile drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-72 border-l border-white/10 bg-black/50 backdrop-blur-xl transition-transform md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium">Navigate</span>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-1 px-2">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn("rounded-md px-3 py-2 text-sm", "hover:bg-white/10", active && "bg-white/10")}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
