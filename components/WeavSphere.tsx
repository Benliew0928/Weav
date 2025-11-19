'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { ThreadNode } from './ThreadNode'
import { generateFibonacciSphere } from '@/lib/sphere'
import { Thread } from '@/data/sampleThreads'

interface WeavSphereProps {
  threads: Thread[]
  onNodeSelect: (threadId: string) => void
}

function SphereContent({ threads, onNodeSelect }: WeavSphereProps) {
  const controlsRef = useRef<any>(null)
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setWebglSupported(false)
    }
  }, [])

  // Generate sphere points
  const spherePoints = generateFibonacciSphere(threads.length, 3)

  if (!webglSupported) {
    return null
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={6}
        maxDistance={15}
        minPolarAngle={Math.PI / 3} // 60 degrees
        maxPolarAngle={(2 * Math.PI) / 3} // 120 degrees
        enableDamping
        dampingFactor={0.05}
      />
      {threads.map((thread, index) => {
        const point = spherePoints[index]
        if (!point) return null
        return (
          <ThreadNode
            key={thread.id}
            thread={thread}
            position={[point.x, point.y, point.z]}
            onSelect={onNodeSelect}
          />
        )
      })}
    </>
  )
}

export function WeavSphere({ threads, onNodeSelect }: WeavSphereProps) {
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setWebglSupported(false)
    }
  }, [])

  if (!webglSupported) {
    // 2D Fallback
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 max-w-7xl mx-auto">
          {threads.map((thread, index) => (
            <div
              key={thread.id}
              onClick={() => onNodeSelect(thread.id)}
              className="p-6 rounded-card glass border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            >
              <div className="text-4xl mb-2">{thread.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {thread.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {thread.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SphereContent threads={threads} onNodeSelect={onNodeSelect} />
        </Suspense>
      </Canvas>
    </div>
  )
}

