"use client"
import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 })
  const rounded = useTransform(spring, (v) => Math.floor(v).toLocaleString())
  useEffect(() => {
    spring.set(value)
  }, [value, spring])
  return <motion.span>{rounded}</motion.span>
}

export function LiveCounter() {
  const [assessed, setAssessed] = useState(12840)
  const [matched, setMatched] = useState(11021)

  useEffect(() => {
    const t = setInterval(() => {
      setAssessed((v) => v + Math.floor(Math.random() * 3))
      setMatched((v) => v + Math.floor(Math.random() * 2))
    }, 1500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
        <div className="text-sm text-white/70">People Assessed</div>
        <div className="mt-1 text-2xl font-semibold text-[#3B82F6]">
          <AnimatedNumber value={assessed} />
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
        <div className="text-sm text-white/70">Career Matches</div>
        <div className="mt-1 text-2xl font-semibold text-[#3B82F6]">
          <AnimatedNumber value={matched} />
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
        <div className="text-sm text-white/70">Avg Confidence</div>
        <div className="mt-1 text-2xl font-semibold text-[#3B82F6]">92%</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
        <div className="text-sm text-white/70">Active Sessions</div>
        <div className="mt-1 text-2xl font-semibold text-[#3B82F6]">214</div>
      </div>
    </div>
  )
}
