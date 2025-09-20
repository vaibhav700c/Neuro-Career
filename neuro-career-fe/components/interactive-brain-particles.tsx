"use client"

import { AdvancedBrainCanvas } from "./advanced-brain-canvas"

interface InteractiveBrainParticlesProps {
  height?: number
}

export function InteractiveBrainParticles({ height = 400 }: InteractiveBrainParticlesProps) {
  return (
    <div className="w-full h-full relative">
      <AdvancedBrainCanvas height={height} />
    </div>
  )
}