"use client"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useMemo } from "react"

function Spinner() {
  const color = "#3B82F6"
  useMemo(() => ({}), [])
  return (
    <mesh rotation={[0.5, 0.2, 0]}>
      <torusKnotGeometry args={[0.8, 0.24, 200, 32]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}

export function VRPreview() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5">
      <Canvas camera={{ position: [2.4, 1.8, 2.4] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 2]} intensity={1} />
        <Spinner />
        <OrbitControls enablePan={false} />
      </Canvas>
      <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/80">
        FPS: 90 • Focus: 87 • Latency: 18ms
      </div>
    </div>
  )
}
