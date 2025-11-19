'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { RingNode } from './RingNode'
import { Thread } from '@/data/sampleThreads'
import { generateRingPoints, calculateRingRadius, calculateCameraZ } from '@/lib/ring'
import { useWeavStore } from '@/store/useWeavStore'
import { clamp } from '@/lib/utils'
import { updateFPS, getAverageFPS, isPerformanceAcceptable } from '@/lib/perf'

interface RingSceneProps {
  threads: Thread[]
  onNodeSelect: (threadId: string) => void
}

export function RingScene({ threads, onNodeSelect }: RingSceneProps) {
  const { camera, size, gl } = useThree()
  const {
    ringRotation,
    verticalRotation,
    angularVelocity,
    cameraZ,
    defaultCameraZ,
    setZoom,
    setDefaultCameraZ,
    rotateRing,
    setVerticalRotation,
    setAngularVelocity,
    setUse2DFallback,
  } = useWeavStore()

  const [isDragging, setIsDragging] = useState(false)
  const [lastPointer, setLastPointer] = useState<{ x: number; y: number } | null>(null)
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  // Initialize camera position
  useEffect(() => {
    const ringRadius = calculateRingRadius(size.width, size.height)
    const initialZ = calculateCameraZ(ringRadius, 50, 24)
    setDefaultCameraZ(initialZ)
    setZoom(initialZ)
  }, [size.width, size.height, setDefaultCameraZ, setZoom])

  // Generate ring points
  const ringPoints = generateRingPoints(threads.length, 5, 0.3)

  // Handle pointer events
  const handlePointerDown = (event: any) => {
    setIsDragging(true)
    setLastPointer({ x: event.clientX, y: event.clientY })
    setAngularVelocity(0)
  }

  const handlePointerMove = (event: any) => {
    if (!isDragging || !lastPointer) return

    const deltaX = event.clientX - lastPointer.x
    const deltaY = event.clientY - lastPointer.y

    // Rotate ring
    rotateRing(deltaX * 0.0035)

    // Vertical rotation (clamped)
    const currentVertical = verticalRotation + deltaY * 0.002
    setVerticalRotation(currentVertical)

    setLastPointer({ x: event.clientX, y: event.clientY })
  }

  const handlePointerUp = (event: any) => {
    if (isDragging && lastPointer) {
      const deltaX = event.clientX - lastPointer.x
      const velocity = deltaX * 0.0035
      
      // Fling inertia
      if (Math.abs(velocity) > 0.01) {
        setAngularVelocity(velocity)
      }

      // Raycast for node selection
      mouse.current.x = (event.clientX / size.width) * 2 - 1
      mouse.current.y = -(event.clientY / size.height) * 2 + 1
      raycaster.current.setFromCamera(mouse.current, camera)

      // Check for node hits (simplified - would need actual mesh refs)
      // For now, we'll handle clicks in RingNode component
    }

    setIsDragging(false)
    setLastPointer(null)
  }

  // Handle wheel zoom
  const handleWheel = (event: any) => {
    event.preventDefault()
    const zoomDelta = event.deltaY * 0.01
    const newZ = clamp(
      cameraZ + zoomDelta,
      defaultCameraZ * 0.8,
      defaultCameraZ * 1.6
    )
    setZoom(newZ)
  }

  // Apply inertia
  useFrame(() => {
    if (Math.abs(angularVelocity) > 0.001) {
      rotateRing(angularVelocity)
      setAngularVelocity(angularVelocity * 0.92)
    }

    // Update camera position and rotation
    const x = Math.sin(verticalRotation) * cameraZ
    const y = Math.cos(verticalRotation) * cameraZ * 0.3
    const z = Math.cos(verticalRotation) * cameraZ
    
    camera.position.set(
      Math.sin(ringRotation) * z,
      y,
      Math.cos(ringRotation) * z
    )
    camera.lookAt(0, 0, 0)

    // Update FPS
    updateFPS()

    // Check performance
    if (getAverageFPS() < 40 && getAverageFPS() > 0) {
      setUse2DFallback(true)
    }
  })

  // Attach event listeners
  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [isDragging, lastPointer, gl.domElement])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={50} near={0.1} far={1000} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} />

      {/* Ring nodes */}
      {threads.map((thread, index) => {
        const point = ringPoints[index]
        if (!point) return null
        return (
          <RingNode
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

