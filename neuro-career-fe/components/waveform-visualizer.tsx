"use client"
import { useEffect, useRef, useState } from "react"

interface WaveformVisualizerProps {
  isActive?: boolean
  frequency?: number
  amplitude?: number
  showFrequencyBands?: boolean
}

export function WaveformVisualizer({ 
  isActive = true, 
  frequency = 1.0, 
  amplitude = 1.0,
  showFrequencyBands = true 
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [currentFreq, setCurrentFreq] = useState(10.5) // Hz
  const [currentAmp, setCurrentAmp] = useState(45.2) // μV

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    const resize = () => {
      canvas.width = canvas.clientWidth * devicePixelRatio
      canvas.height = 160 * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    
    const lines = 128 // More lines for higher resolution
    let t = 0

    const draw = () => {
      if (!ctx) return
      
      // Clear with slight fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio)
      
      const width = canvas.width / devicePixelRatio
      const height = canvas.height / devicePixelRatio
      const centerY = height / 2

      if (isActive) {
        // Main neural waveform with multiple frequency components
        for (let i = 0; i < lines; i++) {
          const x = (i / (lines - 1)) * width
          const normalizedX = (i / lines) * 8 // 8 cycles across width
          
          // Complex waveform combining multiple frequencies (realistic EEG)
          const alpha = Math.sin((normalizedX + t) * 2 * Math.PI * 10) * 0.3 // Alpha waves ~10Hz
          const beta = Math.sin((normalizedX + t) * 2 * Math.PI * 20) * 0.15 // Beta waves ~20Hz
          const gamma = Math.sin((normalizedX + t) * 2 * Math.PI * 40) * 0.08 // Gamma waves ~40Hz
          const noise = (Math.random() - 0.5) * 0.05 // Small amount of noise
          
          const combinedWave = (alpha + beta + gamma + noise) * amplitude
          const h = Math.abs(combinedWave) * (height * 0.35)
          
          // Draw the waveform line
          ctx.beginPath()
          const y1 = centerY - h
          const y2 = centerY + h
          ctx.moveTo(x, y1)
          ctx.lineTo(x, y2)
          
          // Color based on frequency content
          if (Math.abs(alpha) > Math.abs(beta) && Math.abs(alpha) > Math.abs(gamma)) {
            ctx.strokeStyle = `rgba(59,130,246,${0.6 + Math.abs(combinedWave) * 0.4})` // Blue for alpha
          } else if (Math.abs(beta) > Math.abs(gamma)) {
            ctx.strokeStyle = `rgba(236,72,153,${0.6 + Math.abs(combinedWave) * 0.4})` // Pink for beta
          } else {
            ctx.strokeStyle = `rgba(168,85,247,${0.5 + Math.abs(combinedWave) * 0.3})` // Purple for gamma
          }
          
          ctx.lineWidth = 1.5
          ctx.stroke()
        }

        // Draw frequency bands overlay if enabled
        if (showFrequencyBands) {
          ctx.strokeStyle = 'rgba(255,255,255,0.1)'
          ctx.lineWidth = 0.5
          ctx.setLineDash([2, 2])
          
          // Draw reference lines
          for (let i = 1; i < 4; i++) {
            const y = (height / 4) * i
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(width, y)
            ctx.stroke()
          }
          ctx.setLineDash([])
        }

        // Update frequency and amplitude readings
        setCurrentFreq(8 + Math.sin(t * 0.5) * 4 + Math.random() * 2)
        setCurrentAmp(30 + Math.cos(t * 0.3) * 15 + Math.random() * 8)
      } else {
        // Flatline when inactive
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, centerY)
        ctx.lineTo(width, centerY)
        ctx.stroke()
      }

      t += 0.02 * frequency // Adjustable speed
      raf = requestAnimationFrame(draw)
    }
    
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [isActive, frequency, amplitude, showFrequencyBands])

  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        className="w-full rounded-lg border border-white/10 bg-black/20" 
        style={{ height: '160px' }}
        role="img" 
        aria-label="Neural activity waveform visualization" 
      />
      <div className="mt-3 flex justify-between text-xs text-white/60">
        <div className="flex gap-4">
          <span>Freq: {currentFreq.toFixed(1)} Hz</span>
          <span>Amp: {currentAmp.toFixed(1)} μV</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span>{isActive ? 'Recording' : 'Stopped'}</span>
        </div>
      </div>
    </div>
  )
}
