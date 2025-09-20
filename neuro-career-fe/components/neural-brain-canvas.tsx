"use client"

import type React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import { useMemo, useRef, useState, useEffect } from "react"
import { OrbitControls } from "@react-three/drei"
import dynamic from "next/dynamic"
import ErrorBoundary from "./error-boundary"

function NeuronField() {
  const group = useRef<THREE.Group>(null)
  const { points, lines } = useMemo(() => {
    // generate points inside a sphere (brain-ish blob)
    const count = 600
    const radius = 1
    const pts: number[] = []
    for (let i = 0; i < count; i++) {
      // spherical coordinates jittered
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = radius * (0.7 + Math.random() * 0.3)
      const x = r * Math.sin(phi) * Math.cos(theta) * (1 + (Math.random() - 0.5) * 0.1)
      const y = r * Math.cos(phi) * (1 + (Math.random() - 0.5) * 0.1)
      const z = r * Math.sin(phi) * Math.sin(theta) * (1 + (Math.random() - 0.5) * 0.1)
      pts.push(x, y, z)
    }
    // simple connection lines between near neighbors (limit for perf)
    const positions = new Float32Array(pts)
    const maxLines = 1200
    const threshold = 0.18
    const lineArray: number[] = []
    for (let i = 0; i < count && lineArray.length < maxLines * 6; i++) {
      const ax = positions[i * 3 + 0]
      const ay = positions[i * 3 + 1]
      const az = positions[i * 3 + 2]
      for (let j = i + 1; j < count; j++) {
        const bx = positions[j * 3 + 0]
        const by = positions[j * 3 + 1]
        const bz = positions[j * 3 + 2]
        const dx = ax - bx
        const dy = ay - by
        const dz = az - bz
        const d = Math.hypot(dx, dy, dz)
        if (d < threshold) {
          lineArray.push(ax, ay, az, bx, by, bz)
          if (lineArray.length >= maxLines * 6) break
        }
      }
    }
    return {
      points: new Float32Array(pts),
      lines: new Float32Array(lineArray),
    }
  }, [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = t * 0.07
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#8ab4ff" transparent opacity={0.95} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.25} />
      </lineSegments>
    </group>
  )
}

export function NeuralBrainCanvas({ height = 420 }: { height?: number }) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // tilt on hover
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rotRef = useRef<{ rx: number; ry: number }>({ rx: 0, ry: 0 })

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    rotRef.current.ry = (x - 0.5) * 0.3
    rotRef.current.rx = (y - 0.5) * -0.3
  }

  // Fallback for when Three.js isn't available or fails to load
  if (!isClient) {
    return (
      <div
        className="relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Loading visualization...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => (rotRef.current = { rx: 0, ry: 0 })}
      className="relative"
      style={{ height }}
    >
      <ErrorBoundary
        fallback={({ resetError }) => (
          <div
            className="relative bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-lg flex items-center justify-center"
            style={{ height }}
          >
            <div className="text-center text-gray-400">
              <p className="mb-2">Failed to load 3D visualization</p>
              <button
                onClick={resetError}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      >
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
          {/* soft neon lighting */}
          <ambientLight intensity={0.25} />
          <pointLight position={[2, 2, 2]} intensity={0.9} color="#60a5fa" />
          <pointLight position={[-2, -1, -2]} intensity={0.7} color="#a78bfa" />

          {/* brain neuron field */}
          <group rotation-x={rotRef.current.rx} rotation-y={rotRef.current.ry}>
            <NeuronField />
          </group>

          {/* slow camera control without user input */}
          <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}

// Create a dynamically imported version to prevent SSR issues
const DynamicNeuralBrainCanvas = dynamic(
  () => Promise.resolve(NeuralBrainCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg flex items-center justify-center"
        style={{ height: 420 }}
      >
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Loading visualization...</p>
        </div>
      </div>
    )
  }
)

export default DynamicNeuralBrainCanvas
