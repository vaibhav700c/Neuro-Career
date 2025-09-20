"use client"

import { useEffect, useRef, useMemo } from "react"

interface BrainVertex {
  x: number
  y: number
  z: number
  size: number
  rotation: number
  color: { r: number; g: number; b: number }
  activity: number
  pulsePhase: number
  distanceFromPointer: number
}

interface BrainModelCanvasProps {
  height?: number
}

export function BrainModelCanvas({ height = 400 }: BrainModelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5, isOver: false })
  const pointerRef = useRef({ x: 0, y: 0, z: 0 })
  
  const rotationRef = useRef({ 
    x: 0.2, // Start with slight side view
    y: 0, 
    targetX: 0.2, 
    targetY: 0,
    autoSpeed: 0.002 // Slow auto-rotation
  })

  // Website theme colors adapted for brain visualization
  const brainColors = [
    { r: 0, g: 150, b: 255 },    // Blue (primary)
    { r: 150, g: 100, b: 255 },  // Purple  
    { r: 255, g: 100, b: 150 },  // Pink
    { r: 100, g: 255, b: 200 },  // Cyan/Green
    { r: 255, g: 200, b: 100 },  // Orange/Yellow
  ]

  // Generate brain geometry based on anatomical structure (mimicking the GLB model approach)
  const brainVertices = useMemo(() => {
    const vertices: BrainVertex[] = []
    const vertexCount = 2000 // Similar density to a 3D brain model
    
    // Create anatomically accurate brain shape using vertex positioning
    // This mimics how the GLB model vertices would be distributed
    
    for (let i = 0; i < vertexCount; i++) {
      let x = 0, y = 0, z = 0, isValid = false
      let attempts = 0
      
      while (!isValid && attempts < 100) {
        // Generate positions using spherical coordinates (like 3D model vertices)
        const phi = Math.random() * Math.PI * 2
        const theta = Math.random() * Math.PI
        const r = Math.pow(Math.random(), 0.4) // Bias toward surface like real brain mesh
        
        // Convert to brain-shaped coordinates
        x = r * Math.sin(theta) * Math.cos(phi) * 1.2 // Width
        y = r * Math.cos(theta) * 1.0 // Height
        z = r * Math.sin(theta) * Math.sin(phi) * 1.4 // Depth
        
        // Apply brain-specific vertex distribution patterns
        
        // 1. Cerebral cortex (main brain mass) - most vertices here
        const cortexFactor = Math.exp((-r + 0.8) ** 2 / 0.1) * 2
        
        // 2. Frontal lobe density
        if (z > 0.3) {
          const frontalDensity = 1.0 + 0.3 * Math.exp(-((z - 0.7) ** 2) / 0.2)
          x *= frontalDensity
          if (Math.random() < 0.8) isValid = true // Higher vertex density in frontal
        }
        
        // 3. Temporal lobes (side structures)
        const temporalLeft = Math.sqrt((x + 0.7) ** 2 + y ** 2 + (z - 0.1) ** 2)
        const temporalRight = Math.sqrt((x - 0.7) ** 2 + y ** 2 + (z - 0.1) ** 2)
        
        if (temporalLeft < 0.4 || temporalRight < 0.4) {
          if (Math.random() < 0.7) isValid = true // Good vertex density
        }
        
        // 4. Occipital lobe (back)
        if (z < -0.4) {
          const occipitalTaper = 1.0 - 0.2 * Math.exp(-((z + 0.7) ** 2) / 0.1)
          x *= occipitalTaper
          y *= occipitalTaper
          if (Math.random() < 0.6) isValid = true
        }
        
        // 5. Cerebellum (back-bottom)
        const cerebellumDist = Math.sqrt(x ** 2 + (y + 0.6) ** 2 + (z + 0.7) ** 2)
        if (cerebellumDist < 0.4 && y < -0.2) {
          x *= 0.8 // Narrow cerebellum
          if (Math.random() < 0.9) isValid = true // Dense vertex structure
        }
        
        // 6. Brain stem (center-bottom) - fewer vertices
        if (Math.abs(x) < 0.2 && y < -0.4 && Math.abs(z) < 0.3) {
          x *= 0.6
          z *= 0.7
          if (Math.random() < 0.3) isValid = true // Sparse vertices like real brain stem
        }
        
        // 7. General brain boundary check
        const brainBoundary = 
          (x ** 2) / (1.3 ** 2) + 
          (y ** 2) / (1.1 ** 2) + 
          (z ** 2) / (1.5 ** 2)
        
        if (brainBoundary <= 1.0 && !isValid) {
          if (Math.random() < 0.5) isValid = true
        }
        
        attempts++
      }
      
      if (isValid) {
        const colorIndex = Math.floor(Math.random() * brainColors.length)
        
        vertices.push({
          x,
          y, 
          z,
          size: 0.3 + Math.random() * 2.7, // Size variation like GLB model
          rotation: (Math.random() - 0.5) * 2, // Random rotation like shader
          color: brainColors[colorIndex],
          activity: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2,
          distanceFromPointer: 1000
        })
      }
    }
    
    return vertices
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      ctx.imageSmoothingEnabled = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) / rect.width
      mouseRef.current.y = (e.clientY - rect.top) / rect.height
      
      // Convert mouse to 3D space (like the raycaster intersection)
      const x = (mouseRef.current.x - 0.5) * 2
      const y = (mouseRef.current.y - 0.5) * -2
      pointerRef.current = { x, y, z: 0 }
      
      // Interactive rotation (like the original implementation)
      rotationRef.current.targetX = (mouseRef.current.y - 0.5) * 0.3 + 0.2
      rotationRef.current.targetY = (mouseRef.current.x - 0.5) * 0.3
    }

    const handleMouseEnter = () => {
      mouseRef.current.isOver = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.isOver = false
      rotationRef.current.targetX = 0.2
      rotationRef.current.targetY = 0
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      
      timeRef.current += 0.016
      
      // Auto-rotation when not interacting (like original)
      if (!mouseRef.current.isOver) {
        rotationRef.current.targetY += rotationRef.current.autoSpeed
      }
      
      // Smooth rotation interpolation
      rotationRef.current.x += (rotationRef.current.targetX - rotationRef.current.x) * 0.05
      rotationRef.current.y += (rotationRef.current.targetY - rotationRef.current.y) * 0.05
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const scale = Math.min(rect.width, rect.height) * 0.25
      
      // Transform vertices (like the vertex shader transformation)
      const transformedVertices = brainVertices.map(vertex => {
        // Apply rotation (modelViewMatrix equivalent)
        const rotX = rotationRef.current.x
        const rotY = rotationRef.current.y
        
        let x = vertex.x
        let y = vertex.y
        let z = vertex.z
        
        // Rotate around X axis
        let y1 = y * Math.cos(rotX) - z * Math.sin(rotX)
        let z1 = y * Math.sin(rotX) + z * Math.cos(rotX)
        
        // Rotate around Y axis
        let x1 = x * Math.cos(rotY) + z1 * Math.sin(rotY)
        z1 = -x * Math.sin(rotY) + z1 * Math.cos(rotY)
        
        // Calculate distance from pointer (like the shader)
        const distance = Math.sqrt(
          (pointerRef.current.x - x1) ** 2 +
          (pointerRef.current.y - y1) ** 2 +
          (pointerRef.current.z - z1) ** 2
        )
        
        // Smooth distance effect (like smoothstep in shader)
        const c = Math.max(0, Math.min(1, (0.45 - distance) / (0.45 - 0.1)))
        
        // Scale based on distance and activity (like shader scaling)
        const hoverEffect = mouseRef.current.isOver ? 1 : 0
        const finalSize = vertex.size + c * 8 * hoverEffect
        
        // Activity-based pulsing
        const pulse = Math.sin(timeRef.current * 2 + vertex.pulsePhase) * 0.3 + 0.7
        
        return {
          ...vertex,
          screenX: centerX + x1 * scale,
          screenY: centerY + y1 * scale,
          depth: z1,
          distance: c,
          size: finalSize * pulse,
          activity: vertex.activity * pulse
        }
      })
      
      // Sort by depth for proper rendering
      transformedVertices.sort((a, b) => a.depth - b.depth)
      
      // Render vertices (like fragment shader output)
      transformedVertices.forEach(vertex => {
        if (vertex.depth > -2) { // Only render visible vertices
          const alpha = Math.max(0.2, 0.9 + vertex.depth * 0.3) * vertex.activity
          const size = Math.max(0.5, vertex.size)
          
          // Color intensity based on distance from pointer (like shader vColor)
          const intensity = 0.7 + vertex.distance * 0.3
          const r = Math.floor(vertex.color.r * intensity)
          const g = Math.floor(vertex.color.g * intensity)  
          const b = Math.floor(vertex.color.b * intensity)
          
          // Render cube-like shapes (mimicking the BoxGeometry instances)
          const halfSize = size * 0.5
          
          // Outer glow effect
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.2})`
          ctx.fillRect(
            vertex.screenX - halfSize * 1.5,
            vertex.screenY - halfSize * 1.5,
            size * 3,
            size * 3
          )
          
          // Main vertex cube
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          ctx.fillRect(
            vertex.screenX - halfSize,
            vertex.screenY - halfSize,
            size,
            size
          )
          
          // Bright core (wireframe effect)
          const coreSize = size * 0.3
          ctx.fillStyle = `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, ${alpha * 0.8})`
          ctx.fillRect(
            vertex.screenX - coreSize * 0.5,
            vertex.screenY - coreSize * 0.5,
            coreSize,
            coreSize
          )
        }
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', resizeCanvas)
    
    resizeCanvas()
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [brainVertices])

  return (
    <div className="relative w-full" style={{ height }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer rounded-lg"
        style={{ background: 'transparent' }}
      />
      <div className="absolute bottom-4 left-4 text-xs text-white/60">
        Interactive 3D Brain Model - Move mouse to explore neural activity
      </div>
    </div>
  )
}