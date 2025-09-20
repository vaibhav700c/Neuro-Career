"use client"

import { useEffect, useRef, useMemo } from "react"

interface Particle {
  x: number
  y: number
  z: number
  targetX: number
  targetY: number
  targetZ: number
  originalX: number
  originalY: number
  originalZ: number
  vx: number
  vy: number
  vz: number
  size: number
  opacity: number
  pulseFactor: number
  connectionStrength: number
  transitionProgress: number
}

interface BrainConnection {
  particleA: number
  particleB: number
  strength: number
  pulse: number
}

"use client"

import { BrainModelCanvas } from "./brain-model-canvas"

interface InteractiveBrainParticlesProps {
  height?: number
}

export function InteractiveBrainParticles({ height = 400 }: InteractiveBrainParticlesProps) {
  return (
    <div className="w-full h-full relative">
      <BrainModelCanvas height={height} />
    </div>
  )
}

  // Generate anatomically accurate 3D brain positions
  const brainPositions = useMemo(() => {
    const positions: { x: number; y: number; z: number }[] = []
    const particleCount = 1800 // Increased for better brain definition
    
    // Create realistic human brain shape using anatomical modeling
    const generateRealisticBrain = () => {
      const brainPoints = []
      
      for (let i = 0; i < particleCount; i++) {
        let x, y, z, isValidPosition = false
        let attempts = 0
        
        while (!isValidPosition && attempts < 150) {
          // Use parametric brain modeling for accuracy
          const u = Math.random() * 2 * Math.PI // Longitude
          const v = Math.random() * Math.PI // Latitude  
          const r = Math.pow(Math.random(), 0.3) // Radial bias toward surface
          
          // Base brain shape - elongated ellipsoid
          let baseX = r * Math.sin(v) * Math.cos(u)
          let baseY = r * Math.cos(v)
          let baseZ = r * Math.sin(v) * Math.sin(u)
          
          // Apply realistic brain proportions
          x = baseX * 1.2 // Width (left-right)
          y = baseY * 1.0 // Height (top-bottom)
          z = baseZ * 1.5 // Length (front-back)
          
          // === ANATOMICAL BRAIN SHAPING ===
          
          // 1. Create realistic brain curvature
          const brainCurvature = Math.sqrt(x*x + y*y + z*z)
          if (brainCurvature > 1.0) {
            // Scale down to brain boundary
            const scale = 1.0 / brainCurvature
            x *= scale * 0.95
            y *= scale * 0.95
            z *= scale * 0.95
          }
          
          // 2. Frontal lobe prominence (human brain characteristic)
          if (z > 0.3) {
            const frontalBoost = 1.0 + 0.4 * Math.exp(-Math.pow(z - 0.7, 2) / 0.15)
            x *= frontalBoost
            y = Math.max(y, -0.7) // Lift frontal area
            
            // Frontal lobe roundness
            if (z > 0.6) {
              const roundness = 1.0 - Math.abs(x) * 0.3
              y *= roundness
            }
          }
          
          // 3. Occipital lobe (back of brain) - more pointed
          if (z < -0.4) {
            const occipitalTaper = 1.0 - 0.3 * Math.exp(-Math.pow(z + 0.7, 2) / 0.1)
            x *= occipitalTaper
            y *= occipitalTaper
            
            // Create occipital bulge
            if (z < -0.5) {
              y += 0.1 * Math.exp(-Math.pow(z + 0.6, 2) / 0.05)
            }
          }
          
          // 4. Temporal lobes (side bulges) - critical for brain recognition
          const leftTemporalDist = Math.sqrt(Math.pow(x + 0.7, 2) + Math.pow(y, 2) + Math.pow(z - 0.1, 2))
          const rightTemporalDist = Math.sqrt(Math.pow(x - 0.7, 2) + Math.pow(y, 2) + Math.pow(z - 0.1, 2))
          
          if (leftTemporalDist < 0.4 && y > -0.5 && y < 0.3) {
            x -= 0.2 // Extend left temporal
            y -= 0.1 // Lower temporal position
          }
          if (rightTemporalDist < 0.4 && y > -0.5 && y < 0.3) {
            x += 0.2 // Extend right temporal
            y -= 0.1 // Lower temporal position
          }
          
          // 5. Cerebellum (distinctive back-bottom structure)
          const cerebellumCenter = { x: 0, y: -0.6, z: -0.8 }
          const cerebellumDist = Math.sqrt(
            Math.pow(x - cerebellumCenter.x, 2) + 
            Math.pow(y - cerebellumCenter.y, 2) + 
            Math.pow(z - cerebellumCenter.z, 2)
          )
          
          if (cerebellumDist < 0.35 && y < -0.3 && z < -0.4) {
            // Create cerebellum bulge
            const cerebellumFactor = (0.35 - cerebellumDist) / 0.35
            y -= cerebellumFactor * 0.2
            z -= cerebellumFactor * 0.1
            
            // Cerebellum is smaller in width
            x *= 0.8
          }
          
          // 6. Brain stem (narrow connection)
          if (Math.abs(x) < 0.15 && y < -0.4 && Math.abs(z) < 0.2) {
            x *= 0.6 // Narrow stem
            z *= 0.5
            y = Math.min(y, -0.4) // Keep stem low
          }
          
          // 7. Longitudinal fissure (brain hemisphere separation)
          if (Math.abs(x) < 0.08 && y > -0.2 && Math.abs(z) < 0.6) {
            // Create gap between hemispheres
            x = x > 0 ? 0.08 : -0.08
            y += 0.05 // Slight elevation at fissure
          }
          
          // 8. Brain surface texture (cortical folding)
          if (r > 0.8) { // Only outer surface
            const foldDetail = 
              Math.sin(x * 20 + y * 15) * 0.02 +
              Math.sin(y * 25 + z * 18) * 0.015 +
              Math.sin(z * 22 + x * 17) * 0.01
            
            x += foldDetail
            y += foldDetail * 0.8
            z += foldDetail * 0.6
          }
          
          // 9. Brain asymmetry (left brain slightly different from right)
          if (x > 0.1) {
            x *= 1.03 // Right hemisphere slightly larger
            y *= 0.98
          } else if (x < -0.1) {
            x *= 0.97 // Left hemisphere slightly smaller
            y *= 1.02
          }
          
          // 10. Final brain boundary validation
          const brainBounds = 
            Math.pow(x / 1.3, 2) + 
            Math.pow(y / 1.1, 2) + 
            Math.pow(z / 1.6, 2)
          
          // Additional anatomical constraints
          const isInCerebrum = brainBounds <= 1.0 && y > -0.8
          const isInCerebellum = cerebellumDist < 0.35 && y < -0.3 && z < -0.4
          const isInBrainStem = Math.abs(x) < 0.15 && y < -0.4 && Math.abs(z) < 0.2
          
          if (isInCerebrum || isInCerebellum || isInBrainStem) {
            isValidPosition = true
          }
          
          attempts++
        }
        
        if (isValidPosition) {
          brainPoints.push({ x, y, z })
        }
      }
      
      return brainPoints
    }
    
    return generateRealisticBrain()
  }, [])

  // Initialize particles with neural network distribution
  const particles = useMemo((): Particle[] => {
    const particleCount = brainPositions.length
    if (particleCount === 0) return []
    
    return Array.from({ length: particleCount }, (_, i) => {
      // Distribute particles across entire viewport like dispersed neural network
      const angle = (i / particleCount) * Math.PI * 8 // Multiple spiral arms
      const radius = 2 + Math.random() * 3 // Wide dispersal
      const height = (Math.random() - 0.5) * 4 // Full height range
      
      const randomX = Math.cos(angle) * radius + (Math.random() - 0.5) * 2
      const randomY = Math.sin(angle) * radius + (Math.random() - 0.5) * 2
      const randomZ = height + (Math.random() - 0.5) * 2
      
      const brainPos = brainPositions[i]
      
      return {
        x: randomX,
        y: randomY,
        z: randomZ,
        targetX: brainPos?.x || 0,
        targetY: brainPos?.y || 0,
        targetZ: brainPos?.z || 0,
        originalX: randomX,
        originalY: randomY,
        originalZ: randomZ,
        vx: (Math.random() - 0.5) * 0.0008, // Slower for professional feel
        vy: (Math.random() - 0.5) * 0.0008,
        vz: (Math.random() - 0.5) * 0.0008,
        size: 0.8 + Math.random() * 1.2, // More consistent sizing
        opacity: 0.7 + Math.random() * 0.3, // High opacity for clarity
        pulseFactor: Math.random(),
        connectionStrength: Math.random(),
        transitionProgress: 0
      }
    })
  }, [brainPositions])

  // Generate neural network connections with intelligent distribution
  const connections = useMemo((): BrainConnection[] => {
    const conns: BrainConnection[] = []
    const maxConnections = 3000 // Increased for rich neural network
    
    // Create connections based on initial positions (neural network state)
    for (let i = 0; i < particles.length && conns.length < maxConnections; i++) {
      const maxConnectionsPerParticle = 8 // Limit for performance
      let connectionsForThisParticle = 0
      
      for (let j = i + 1; j < particles.length && conns.length < maxConnections && connectionsForThisParticle < maxConnectionsPerParticle; j++) {
        // Calculate distance in original dispersed state
        const dx = particles[i].originalX - particles[j].originalX
        const dy = particles[i].originalY - particles[j].originalY
        const dz = particles[i].originalZ - particles[j].originalZ
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        // Connect nearby neurons in dispersed state
        if (distance < 0.8) { // Longer range for neural network feel
          conns.push({
            particleA: i,
            particleB: j,
            strength: (1 - distance / 0.8) * (0.6 + Math.random() * 0.4),
            pulse: Math.random() * Math.PI * 2
          })
          connectionsForThisParticle++
        }
      }
    }
    
    // Add some long-range connections for brain formation
    for (let i = 0; i < particles.length && conns.length < maxConnections; i += 20) {
      for (let j = i + 50; j < particles.length && conns.length < maxConnections; j += 30) {
        // Brain-state connections
        const brainPosI = brainPositions[i]
        const brainPosJ = brainPositions[j]
        
        if (brainPosI && brainPosJ && 
            typeof brainPosI.x === 'number' && typeof brainPosI.y === 'number' && typeof brainPosI.z === 'number' &&
            typeof brainPosJ.x === 'number' && typeof brainPosJ.y === 'number' && typeof brainPosJ.z === 'number') {
          const dx = brainPosI.x - brainPosJ.x
          const dy = brainPosI.y - brainPosJ.y  
          const dz = brainPosI.z - brainPosJ.z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          if (distance < 0.3) {
            conns.push({
              particleA: i,
              particleB: j,
              strength: (1 - distance / 0.3) * 0.3, // Weaker for brain connections
              pulse: Math.random() * Math.PI * 2
            })
          }
        }
      }
    }
    
    return conns
  }, [particles, brainPositions])

  const morphToBrain = () => {
    // Auto transition - no user control needed
  }

  const morphToFloating = () => {
    // Auto transition - no user control needed
  }

  const resetPositions = () => {
    // Auto transition - no user control needed
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize start time for automatic transition
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // Limit DPR for better performance
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      
      // Enable crisp rendering
      ctx.imageSmoothingEnabled = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) / rect.width
      mouseRef.current.y = (e.clientY - rect.top) / rect.height
      
      // Temporarily override auto-rotation with mouse control
      rotationRef.current.targetX = (mouseRef.current.y - 0.5) * 0.5 + 0.3 // Keep side bias
      rotationRef.current.targetY = (mouseRef.current.x - 0.5) * 0.5
      
      // Temporarily disable auto-rotation
      rotationRef.current.autoRotationEnabled = false
    }

    const handleMouseEnter = () => {
      mouseRef.current.isOver = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.isOver = false
      
      // Resume auto-rotation after mouse leaves
      const brainFormationComplete = particles.every(p => p.transitionProgress >= 1)
      if (brainFormationComplete) {
        rotationRef.current.autoRotationEnabled = true
        rotationRef.current.targetX = 0.3 // Return to side view
      } else {
        rotationRef.current.targetX = 0.3
        rotationRef.current.targetY = 0
      }
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      
      timeRef.current += 0.016
      
      // Calculate transition progress with professional timing
      const elapsedTime = (Date.now() - (startTimeRef.current || 0)) / 1000
      const transitionStartTime = 3 // Allow time to appreciate neural network
      const transitionDuration = 5 // Slower, more professional transition
      
      let globalTransitionProgress = 0
      if (elapsedTime > transitionStartTime) {
        globalTransitionProgress = Math.min((elapsedTime - transitionStartTime) / transitionDuration, 1)
        globalTransitionProgress = easeInOutCubic(globalTransitionProgress) // Smooth easing
      }
      
      // Enhanced rotation with auto-rotation after brain formation
      const brainFormationComplete = particles.every(p => p.transitionProgress >= 1)
      
      if (brainFormationComplete && !rotationRef.current.autoRotationEnabled) {
        rotationRef.current.autoRotationEnabled = true
        rotationRef.current.targetX = 0.3 // Side view angle
      }
      
      // Apply automatic rotation when brain is formed
      if (rotationRef.current.autoRotationEnabled) {
        rotationRef.current.targetY += rotationRef.current.rotationSpeed
        // Keep side view angle for brain profile
        rotationRef.current.targetX = 0.3 + Math.sin(timeRef.current * 0.5) * 0.1
      }
      
      // Smooth rotation interpolation
      rotationRef.current.x += (rotationRef.current.targetX - rotationRef.current.x) * 0.02
      rotationRef.current.y += (rotationRef.current.targetY - rotationRef.current.y) * 0.02
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const scale = Math.min(rect.width, rect.height) * 0.22 // Slightly larger for better brain visibility
      
      // Update particle positions with professional neural network behavior
      particles.forEach((particle, i) => {
        // Update individual transition progress with wave-like formation
        const delay = (i / particles.length) * 0.5 // Sequential formation
        const adjustedProgress = Math.max(0, globalTransitionProgress - delay)
        particle.transitionProgress = Math.min(adjustedProgress * 1.5, 1)
        
        if (particle.transitionProgress === 0) {
          // Neural network floating behavior - gentle drift
          particle.x += particle.vx * 0.5 // Slower movement for professional feel
          particle.y += particle.vy * 0.5
          particle.z += particle.vz * 0.5
          
          // Gentle boundary constraints (larger space)
          if (particle.x > 4 || particle.x < -4) particle.vx *= -0.8
          if (particle.y > 4 || particle.y < -4) particle.vy *= -0.8
          if (particle.z > 4 || particle.z < -4) particle.vz *= -0.8
          
          // Add slight attraction to center during neural state
          const centerForce = 0.00002
          particle.vx += -particle.x * centerForce
          particle.vy += -particle.y * centerForce
          particle.vz += -particle.z * centerForce
          
        } else {
          // Intelligent convergence to anatomical brain structure
          const progress = particle.transitionProgress
          const easeProgress = easeInOutQuart(progress) // More dramatic easing
          
          // Enhanced pathfinding for realistic brain formation
          const midPointX = particle.originalX * 0.2 + particle.targetX * 0.8
          const midPointY = particle.originalY * 0.2 + particle.targetY * 0.8 + Math.sin(progress * Math.PI) * 0.3
          const midPointZ = particle.originalZ * 0.2 + particle.targetZ * 0.8
          
          if (progress < 0.7) {
            // Phase 1: Converge toward brain regions (70% of transition)
            const phase1Progress = easeProgress / 0.7
            particle.x = lerp(particle.originalX, midPointX, phase1Progress)
            particle.y = lerp(particle.originalY, midPointY, phase1Progress)
            particle.z = lerp(particle.originalZ, midPointZ, phase1Progress)
          } else {
            // Phase 2: Precise anatomical positioning (30% of transition)
            const finalProgress = (easeProgress - 0.7) / 0.3
            const finalEase = easeInOutCubic(finalProgress)
            
            particle.x = lerp(midPointX, particle.targetX, finalEase)
            particle.y = lerp(midPointY, particle.targetY, finalEase)
            particle.z = lerp(midPointZ, particle.targetZ, finalEase)
            
            // Add micro-movements for organic brain texture
            if (finalProgress > 0.8) {
              const microTime = timeRef.current * 3
              particle.x += Math.sin(microTime + particle.targetX * 50) * 0.008 * (1 - finalProgress)
              particle.y += Math.cos(microTime + particle.targetY * 50) * 0.006 * (1 - finalProgress)
              particle.z += Math.sin(microTime + particle.targetZ * 50) * 0.004 * (1 - finalProgress)
            }
          }
        }
      })
      
      // Draw neural network connections with professional styling
      connections.forEach(conn => {
        const particleA = particles[conn.particleA]
        const particleB = particles[conn.particleB]
        
        // Apply rotation
        const rotX = rotationRef.current.x
        const rotY = rotationRef.current.y
        
        // Rotate particle A
        let x1 = particleA.x
        let y1 = particleA.y * Math.cos(rotX) - particleA.z * Math.sin(rotX)
        let z1 = particleA.y * Math.sin(rotX) + particleA.z * Math.cos(rotX)
        let tempX = x1
        x1 = x1 * Math.cos(rotY) + z1 * Math.sin(rotY)
        z1 = -tempX * Math.sin(rotY) + z1 * Math.cos(rotY)
        
        // Rotate particle B
        let x2 = particleB.x
        let y2 = particleB.y * Math.cos(rotX) - particleB.z * Math.sin(rotX)
        let z2 = particleB.y * Math.sin(rotX) + particleB.z * Math.cos(rotX)
        tempX = x2
        x2 = x2 * Math.cos(rotY) + z2 * Math.sin(rotY)
        z2 = -tempX * Math.sin(rotY) + z2 * Math.cos(rotY)
        
        const screenX1 = centerX + x1 * scale
        const screenY1 = centerY + y1 * scale
        const screenX2 = centerX + x2 * scale
        const screenY2 = centerY + y2 * scale
        
        // Professional neural connection styling
        const avgProgress = (particleA.transitionProgress + particleB.transitionProgress) / 2
        const pulse = Math.sin(timeRef.current * 1.2 + conn.pulse) * 0.3 + 0.7
        
        // Connection strength based on formation state
        let alpha = conn.strength * 0.6 * pulse
        
        if (avgProgress < 0.1) {
          // Neural network state - bright connections
          alpha *= 1.0
        } else if (avgProgress < 0.9) {
          // Transition state - fading connections
          alpha *= (1 - avgProgress) * 1.5
        } else {
          // Brain state - subtle internal connections
          alpha *= 0.3
        }
        
        // Create sophisticated gradient
        const distance = Math.sqrt(Math.pow(screenX2 - screenX1, 2) + Math.pow(screenY2 - screenY1, 2))
        if (distance > 5) { // Only draw if connection is visible
          const gradient = ctx.createLinearGradient(screenX1, screenY1, screenX2, screenY2)
          gradient.addColorStop(0, `rgba(100, 200, 255, ${alpha})`)
          gradient.addColorStop(0.5, `rgba(150, 220, 255, ${alpha * 1.3})`)
          gradient.addColorStop(1, `rgba(100, 200, 255, ${alpha})`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 0.5 + pulse * 0.3
          ctx.lineCap = 'round'
          ctx.globalAlpha = Math.min(alpha, 0.8)
          ctx.beginPath()
          ctx.moveTo(screenX1, screenY1)
          ctx.lineTo(screenX2, screenY2)
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      })
      
      // Draw particles
      particles.forEach((particle, i) => {
        // Apply rotation
        const rotX = rotationRef.current.x
        const rotY = rotationRef.current.y
        
        let x = particle.x
        let y = particle.y * Math.cos(rotX) - particle.z * Math.sin(rotX)
        let z = particle.y * Math.sin(rotX) + particle.z * Math.cos(rotX)
        let tempX = x
        x = x * Math.cos(rotY) + z * Math.sin(rotY)
        z = -tempX * Math.sin(rotY) + z * Math.cos(rotY)
        
        const screenX = centerX + x * scale
        const screenY = centerY + y * scale
        
        // Professional particle rendering with state-based styling
        const depth = (z + 4) / 8 // Normalize depth for larger space
        const baseSize = particle.size * (0.7 + depth * 0.3)
        const alpha = particle.opacity * (0.5 + depth * 0.5)
        
        // Professional pulsing - more subtle
        const pulse = Math.sin(timeRef.current * 1.5 + particle.pulseFactor * Math.PI * 2) * 0.1 + 0.9
        
        // State-based appearance
        let size = baseSize
        let intensity = 0.8
        let hue = 200
        
        if (particle.transitionProgress === 0) {
          // Neural network state - bright, active neurons
          intensity = 1.0
          hue = 200 + (particle.connectionStrength * 30) // Blue to cyan
          size *= 1.1 // Slightly larger in network state
        } else if (particle.transitionProgress < 1) {
          // Transition state - dynamic appearance
          intensity = 0.9 + particle.transitionProgress * 0.1
          hue = 200 + (particle.transitionProgress * 40) // Blue to purple transition
          size *= (1.1 - particle.transitionProgress * 0.2) // Shrink during transition
        } else {
          // Brain state - organized, focused neurons
          intensity = 1.2
          hue = 240 + (particle.connectionStrength * 20) // Purple to pink
          size *= 0.9 // Smaller, denser in brain state
        }
        
        const sat = 75 + (pulse * 15)
        const light = 60 + (depth * 25) + (intensity * 15)
        const particleAlpha = alpha * pulse * intensity
        
        // Multi-layer particle rendering for professional look
        
        // Outer glow (very subtle)
        if (particle.transitionProgress > 0 || particle.connectionStrength > 0.7) {
          ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${particleAlpha * 0.1})`
          ctx.beginPath()
          ctx.arc(Math.round(screenX), Math.round(screenY), size * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Main particle body
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${particleAlpha})`
        ctx.beginPath()
        ctx.arc(Math.round(screenX), Math.round(screenY), size, 0, Math.PI * 2)
        ctx.fill()
        
        // Inner core for definition
        ctx.fillStyle = `hsla(${hue + 10}, ${Math.min(sat + 20, 100)}%, ${Math.min(light + 25, 95)}%, ${particleAlpha * 0.9})`
        ctx.beginPath()
        ctx.arc(Math.round(screenX), Math.round(screenY), size * 0.6, 0, Math.PI * 2)
        ctx.fill()
        
        // Bright center point for neural activity
        if (particle.transitionProgress === 0 || particle.transitionProgress === 1) {
          ctx.fillStyle = `rgba(255, 255, 255, ${particleAlpha * 0.6})`
          ctx.beginPath()
          ctx.arc(Math.round(screenX), Math.round(screenY), size * 0.2, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    // Helper functions for smooth transitions
    function lerp(start: number, end: number, progress: number): number {
      return start + (end - start) * progress
    }

    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    
    function easeInOutQuart(t: number): number {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', resizeCanvas)
    
    resizeCanvas()
    animate()
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particles, connections, brainPositions])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        style={{ height }}
        className="w-full bg-gradient-to-br from-gray-900/50 to-blue-900/30 rounded-lg cursor-pointer transition-all duration-300"
      />
    </div>
  )
}