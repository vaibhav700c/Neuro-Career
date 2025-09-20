"use client"

import { useEffect, useRef } from "react"

interface Connection {
  particleA: number
  particleB: number
  baseDistance: number
  pulse: number
  pulseSpeed: number
}

export function ParticleField() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let time = 0

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      size: 0.8 + Math.random() * 1.2,
      opacity: 0.2 + Math.random() * 0.6,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.5 + Math.random() * 1.5,
    }))

    // Neural network connections with dynamic pulsing
    const connections: Connection[] = []
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 0.08 && connections.length < 120) {
          connections.push({
            particleA: i,
            particleB: j,
            baseDistance: distance,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.8 + Math.random() * 1.2,
          })
        }
      }
    }

    function resize() {
      if (!canvas || !ctx) return
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function draw() {
      if (!canvas || !ctx) return
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)
      time += 0.008

      // Update particle positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        
        // Smooth boundary bouncing
        if (p.x <= 0 || p.x >= 1) {
          p.vx *= -0.95
          p.x = Math.max(0, Math.min(1, p.x))
        }
        if (p.y <= 0 || p.y >= 1) {
          p.vy *= -0.95
          p.y = Math.max(0, Math.min(1, p.y))
        }
        
        // Add slight gravitational pull towards center
        const centerX = 0.5
        const centerY = 0.5
        const dx = centerX - p.x
        const dy = centerY - p.y
        p.vx += dx * 0.000005
        p.vy += dy * 0.000005
        
        // Apply damping
        p.vx *= 0.9995
        p.vy *= 0.9995
      }

      // Draw connections with neural network pulsing
      connections.forEach(conn => {
        const a = particles[conn.particleA]
        const b = particles[conn.particleB]
        
        const dx = a.x - b.x
        const dy = a.y - b.y
        const currentDistance = Math.sqrt(dx * dx + dy * dy)
        
        if (currentDistance < 0.12) {
          const ax = a.x * width
          const ay = a.y * height
          const bx = b.x * width
          const by = b.y * height
          
          // Pulsing effect for neural activity
          const pulse = Math.sin(time * conn.pulseSpeed + conn.pulse) * 0.5 + 0.5
          const alpha = (1 - currentDistance / 0.12) * 0.6 * pulse
          
          // Create gradient for neural pathway effect
          const gradient = ctx.createLinearGradient(ax, ay, bx, by)
          gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`) // blue-500
          gradient.addColorStop(0.5, `rgba(147, 197, 253, ${alpha * 1.5})`) // blue-300
          gradient.addColorStop(1, `rgba(59, 130, 246, ${alpha})`) // blue-500
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 0.5 + pulse * 0.8
          ctx.lineCap = 'round'
          
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(bx, by)
          ctx.stroke()
          
          // Add occasional "signal" traveling along the connection
          if (pulse > 0.9) {
            const signalPos = (time * 2 + conn.pulse) % 1
            const signalX = ax + (bx - ax) * signalPos
            const signalY = ay + (by - ay) * signalPos
            
            ctx.fillStyle = `rgba(147, 197, 253, ${alpha * 2})`
            ctx.beginPath()
            ctx.arc(signalX, signalY, 1.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      // Draw particles with enhanced effects
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const px = p.x * width
        const py = p.y * height
        
        // Pulsing effect
        const pulse = Math.sin(time * p.pulseSpeed + p.pulse) * 0.3 + 0.7
        const size = p.size * pulse
        const opacity = p.opacity * pulse
        
        // Outer glow
        const glowGradient = ctx.createRadialGradient(px, py, 0, px, py, size * 3)
        glowGradient.addColorStop(0, `rgba(147, 197, 253, ${opacity * 0.8})`)
        glowGradient.addColorStop(0.5, `rgba(147, 197, 253, ${opacity * 0.3})`)
        glowGradient.addColorStop(1, `rgba(147, 197, 253, 0)`)
        
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(px, py, size * 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Core particle
        const coreGradient = ctx.createRadialGradient(px, py, 0, px, py, size)
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
        coreGradient.addColorStop(0.6, `rgba(147, 197, 253, ${opacity * 0.8})`)
        coreGradient.addColorStop(1, `rgba(59, 130, 246, ${opacity * 0.4})`)
        
        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    const obs = new ResizeObserver(resize)
    obs.observe(canvas)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <canvas ref={ref} className="h-full w-full" aria-hidden="true" />
    </div>
  )
}
