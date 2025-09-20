"use client"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function NeonCard({
  className,
  children,
  hover = true,
}: {
  className?: string
  children: ReactNode
  hover?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:opacity-60",
        "before:shadow-[0_0_40px_2px_rgba(59,130,246,0.15),0_0_80px_8px_rgba(236,72,153,0.08)]",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
