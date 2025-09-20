"use client"
import dynamic from "next/dynamic"
import { NeonCard } from "@/components/neon-card"
import { SectionHeader } from "@/components/section-header"
import { Badge } from "@/components/ui/badge"

const EEGChart = dynamic(() => import("@/components/eeg-chart").then((m) => m.EEGChart), { ssr: false })

export default function DashboardPage() {
  return (
    <main className="dark mx-auto max-w-6xl px-4 py-10 md:py-16">
      <SectionHeader title="Dashboard" subtitle="Real-time EEG and session metrics." />
      <div className="grid gap-6 md:grid-cols-3">
        <NeonCard className="p-4 md:col-span-2">
          <div className="mb-2 text-sm text-white/70">Live EEG Waves</div>
          <EEGChart />
        </NeonCard>
        <NeonCard className="p-4">
          <div className="text-sm text-white/70">Focus</div>
          <div className="mt-1 text-3xl font-semibold text-[#3B82F6]">87</div>
          <div className="mt-4 text-sm text-white/70">Stress</div>
          <div className="text-3xl font-semibold text-[#EC4899]">34</div>
          <div className="mt-4 text-sm text-white/70">Engagement</div>
          <div className="text-3xl font-semibold text-[#3B82F6]">92</div>
        </NeonCard>
      </div>

      <div className="mt-10">
        <SectionHeader title="Session History" />
        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <NeonCard key={i} className="flex items-center justify-between p-4">
              <div className="text-sm">
                Session #{i} • 24m • PM role trial
                <div className="text-xs text-white/60">Focus 86 • Stress 30 • Eng 91</div>
              </div>
              <Badge variant="secondary" className="bg-white/10">
                Export
              </Badge>
            </NeonCard>
          ))}
        </div>
      </div>
    </main>
  )
}
