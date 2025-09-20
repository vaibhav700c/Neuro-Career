"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"

function NeuralNet() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < 1500; i++) {
      const u = Math.acos(2 * Math.random() - 1) - Math.PI / 2
      const v = 2 * Math.PI * Math.random()
      const r = 1.0 + (Math.random() - 0.5) * 0.12
      const x = r * Math.cos(u) * Math.cos(v) * 1.0
      const y = r * Math.sin(u) * 0.75
      const z = r * Math.cos(u) * Math.sin(v) * 1.0
      pts.push(new THREE.Vector3(x, y, z))
    }
    return pts
  }, [])

  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.02,
        color: new THREE.Color("#3B82F6"),
        transparent: true,
        opacity: 0.9,
      }),
    [],
  )

  const meshRef = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (meshRef.current) meshRef.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  return <points ref={meshRef} geometry={geom} material={mat} />
}

function Glow() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      // @ts-expect-error Three types
      ref.current.material.opacity = 0.12 + Math.sin(clock.elapsedTime * 1.5) * 0.06
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshBasicMaterial color="#EC4899" transparent opacity={0.15} />
    </mesh>
  )
}

export function BrainCanvas({ height = 420 }: { height?: number }) {
  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <Canvas style={{ height }} camera={{ position: [0, 0, 3.2], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#00000000"]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#3B82F6" />
        <NeuralNet />
        <Glow />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
