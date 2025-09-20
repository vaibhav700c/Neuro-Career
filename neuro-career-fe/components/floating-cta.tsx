"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <div
          className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-blue-500/40 blur-lg"
          aria-hidden="true"
        />
        <Link
          href="/assessment"
          className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-lg hover:bg-white/15"
        >
          <Sparkles className="h-4 w-4" />
          Start Your Assessment
        </Link>
      </motion.div>
    </div>
  )
}
