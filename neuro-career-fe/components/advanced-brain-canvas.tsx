"use client"

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh'

interface AdvancedBrainCanvasProps {
  className?: string
  height?: number
}

// Shader code for the brain vertices
const vertexShader = `
uniform vec3 uPointer;
uniform vec3 uColor;
uniform float uRotation;
uniform float uSize;
uniform float uHover;

varying vec3 vColor;

#define PI 3.14159265359

mat2 rotate(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  // First, calculate mvPosition to get the distance between the instance and the
  // projected point uPointer.
  vec4 mvPosition = vec4(position, 1.0);
  mvPosition = instanceMatrix * mvPosition;

  // Distance between the point projected from the mouse and each instance
  float d = distance(uPointer, mvPosition.xyz);

  // Define the color depending on the above value
  float c = smoothstep(0.45, 0.1, d);

  float scale = uSize + c*7.*uHover;
  vec3 pos = position;
  pos *= scale;
  pos.xz *= rotate(PI*c*uRotation + PI*uRotation*0.43);
  pos.xy *= rotate(PI*c*uRotation + PI*uRotation*0.71);

  // Re-define mvPosition with the scaled and rotated position.
  mvPosition = instanceMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * mvPosition;

  vColor = uColor;
}
`

const fragmentShader = `
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`

export function AdvancedBrainCanvas({ className = "", height = 400 }: AdvancedBrainCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const instancedMeshRef = useRef<any>(null)
  const brainModelRef = useRef<THREE.Mesh | null>(null)
  const animationIdRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const raycasterRef = useRef<THREE.Raycaster | null>(null)
  const pointRef = useRef(new THREE.Vector3())
  const hoverUniformRef = useRef(0)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Single aesthetic brain color - neural blue-purple
  const brainColor = new THREE.Color(0x6366f1) // Indigo-500 for a neural/tech aesthetic

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 100)
    camera.position.set(0, 0, 1.0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: window.devicePixelRatio === 1
    })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster()
    raycasterRef.current = raycaster

    // Load the brain model
    const loadBrainModel = async () => {
      const loadingManager = new THREE.LoadingManager()
      const gltfLoader = new GLTFLoader(loadingManager)

      try {
        const gltf = await new Promise<any>((resolve, reject) => {
          gltfLoader.load('/brain.glb', resolve, undefined, reject)
        })

        // The brain model is not added to the scene because it's not necessary
        // for the raycaster to work.
        const brainModel = gltf.scene.children[0]
        brainModelRef.current = brainModel

        // Create the InstancedMesh with slightly larger particles
        const geometry = new THREE.BoxGeometry(0.003, 0.003, 0.003, 1, 1, 1)
        
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          wireframe: true,
          uniforms: {
            uPointer: { value: new THREE.Vector3() },
            uColor: { value: new THREE.Color() },
            uRotation: { value: 0 },
            uSize: { value: 0 },
            uHover: { value: 0 }
          }
        })

        const instancedMesh = new InstancedUniformsMesh(
          geometry, 
          material, 
          brainModel.geometry.attributes.position.count
        )
        instancedMeshRef.current = instancedMesh

        // Add the InstancedMesh to the scene
        scene.add(instancedMesh)

        // Dummy Object3D that will contain the matrix of each instance
        const dummy = new THREE.Object3D()

        // Get the X, Y and Z values of each vertex of the geometry and use them to
        // set the position of each instance.
        const positions = brainModel.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
          dummy.position.set(
            positions[i + 0],
            positions[i + 1],
            positions[i + 2]
          )

          dummy.updateMatrix()
          instancedMesh.setMatrixAt(i / 3, dummy.matrix)

          instancedMesh.setUniformAt('uRotation', i / 3, THREE.MathUtils.randFloat(-1, 1))
          instancedMesh.setUniformAt('uSize', i / 3, THREE.MathUtils.randFloat(0.3, 2.0))

          // Create gradient color matching website theme (blue to pink neon)
          const yPosition = positions[i + 1]
          const normalizedY = Math.max(0, Math.min(1, (yPosition + 0.5) / 1.0)) // Normalize Y position between 0 and 1
          
          // Create gradient from blue (#3B82F6) to pink (#EC4899) matching website theme
          const gradientColor = new THREE.Color()
          
          // Blue: rgb(59, 130, 246) -> Pink: rgb(236, 72, 153)
          const r = 59 + (normalizedY * (236 - 59))   // 59 to 236
          const g = 130 + (normalizedY * (72 - 130))   // 130 to 72
          const b = 246 + (normalizedY * (153 - 246))  // 246 to 153
          
          gradientColor.setRGB(r / 255, g / 255, b / 255)
          
          instancedMesh.setUniformAt('uColor', i / 3, gradientColor)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load brain model:', error)
        setIsLoading(false)
      }
    }

    // Mouse interaction handlers
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height * 2 - 1)

      mouseRef.current = { x, y }

      // Smooth camera movement based on mouse
      const targetX = x * 0.15
      const targetY = y * 0.1
      
      camera.position.x += (targetX - camera.position.x) * 0.05
      camera.position.y += (targetY - camera.position.y) * 0.05

      if (raycaster && brainModelRef.current && instancedMeshRef.current) {
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

        // Check if the ray intersects with the brain model
        const intersects = raycaster.intersectObject(brainModelRef.current)

        if (intersects.length === 0) {
          // Mouse leave - reduce hover effect
          hoverUniformRef.current = Math.max(0, hoverUniformRef.current - 0.05)
        } else {
          // Mouse enter - increase hover effect
          hoverUniformRef.current = Math.min(1, hoverUniformRef.current + 0.05)

          // Update the pointer position for shader effects
          if (intersects[0]?.point) {
            pointRef.current.copy(intersects[0].point)
            
            // Update all instances with the new pointer position
            for (let i = 0; i < instancedMeshRef.current.count; i++) {
              instancedMeshRef.current.setUniformAt('uPointer', i, pointRef.current)
              instancedMeshRef.current.setUniformAt('uHover', i, hoverUniformRef.current)
            }
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      if (cameraRef.current) {
        cameraRef.current.lookAt(0, 0, 0)
        const isMobile = window.innerWidth < 767
        cameraRef.current.position.z = isMobile ? 2.0 : 1.0
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    // Handle resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return
      const rect = container.getBoundingClientRect()
      camera.aspect = rect.width / rect.height
      camera.updateProjectionMatrix()
      renderer.setSize(rect.width, rect.height)
    }

    // Initialize
    loadBrainModel()
    animate()

    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      container.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer?.dispose()
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose()
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        }
      })
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div className={`w-full bg-black rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-blue-400 animate-pulse">Loading brain visualization...</div>
      </div>
    )
  }

  return (
    <div className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <div 
        ref={containerRef} 
        className="w-full h-full"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
          <div className="text-blue-400 animate-pulse">Loading 3D brain model...</div>
        </div>
      )}
    </div>
  )
}