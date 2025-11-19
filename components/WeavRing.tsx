'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { SphereScene } from './SphereScene'
import { Thread } from '@/data/sampleThreads'
import { isWebGLSupported } from '@/lib/perf'
import { useWeavStore } from '@/store/useWeavStore'
import { WeavRing2D } from './WeavRing2D'

interface WeavRingProps {
  threads: Thread[]
  onNodeSelect: (threadId: string, position: { x: number; y: number; z: number }) => void
}

export function WeavRing({ threads, onNodeSelect }: WeavRingProps) {
  const { use2DFallback, setUse2DFallback, theme } = useWeavStore()
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    const supported = isWebGLSupported()
    setWebglSupported(supported)
    if (!supported) {
      setUse2DFallback(true)
    }
  }, [setUse2DFallback])

  if (use2DFallback || !webglSupported) {
    // WeavRing2D expects onNodeSelect: (threadId: string) => void
    // but WeavRing receives onNodeSelect: (threadId: string, position: { x: number; y: number; z: number }) => void
    const handle2DNodeSelect = (threadId: string) => {
      // Call the 3D version with a default position (not used in 2D mode)
      onNodeSelect(threadId, { x: 0, y: 0, z: 0 })
    }
    return <WeavRing2D threads={threads} onNodeSelect={handle2DNodeSelect} />
  }
  
  return (
    <div 
      className="w-full h-full relative overflow-hidden m-0 p-0"
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#0a0a0f',
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          maxWidth: '100%',
          maxHeight: '100%',
          overflow: 'hidden'
        }}
        camera={{ fov: 50, near: 0.1, far: 1000 }}
      >
        <Suspense fallback={null}>
          <SphereScene threads={threads} onNodeSelect={onNodeSelect} />
        </Suspense>
      </Canvas>
    </div>
  )
}

