"use client"
import { motion } from "framer-motion"

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <motion.h2
        className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          className="mt-2 max-w-2xl text-sm text-white/70"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          viewport={{ once: true }}
        >
          {subtitle}
        </motion.p>
      ) : null}
      <motion.div
        className="mt-3 h-[2px] w-16 rounded bg-gradient-to-r from-[#3B82F6] to-[#EC4899]"
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        viewport={{ once: true }}
      />
    </div>
  )
}
