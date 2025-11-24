'use client'

import { useRef, useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { Thread } from '@/data/sampleThreads'
import { triggerHaptic } from '@/lib/perf'
import { useWeavStore } from '@/store/useWeavStore'

interface RingNodeProps {
  thread: Thread
  position: [number, number, number]
  onSelect: (threadId: string) => void
  isSelected?: boolean
  isFocusLocked?: boolean
  transitionPhase?: 'idle' | 'focusing' | 'detaching' | 'expanding' | 'expanded' | 'collapsing'
  isDragging?: boolean
}

export function RingNode({
  thread,
  position,
  onSelect,
  isSelected,
  isFocusLocked = false,
  transitionPhase = 'idle',
  isDragging = false,
}: RingNodeProps) {
  const { theme } = useWeavStore()
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [scale, setScale] = useState(1)

  // Floating animation - more organic movement in 3D space
  // Pause floating when this node is being detached
  useFrame((state) => {
    if (meshRef.current) {
      const isDetaching = isSelected && (transitionPhase === 'detaching' || transitionPhase === 'expanding')

      if (!isDetaching) {
        const time = state.clock.elapsedTime
        const floatX = Math.sin(time * 0.8 + position[0]) * 0.03
        const floatY = Math.sin(time * 1.2 + position[1]) * 0.03
        const floatZ = Math.cos(time * 1.0 + position[2]) * 0.03

        meshRef.current.position.x = position[0] + floatX
        meshRef.current.position.y = position[1] + floatY
        meshRef.current.position.z = position[2] + floatZ
      }
    }
  })

  // Calculate depth-based blur and opacity for focus lock
  const { camera } = useThree()
  const [depthFactor, setDepthFactor] = useState(1)

  useFrame(() => {
    if (isFocusLocked && !isSelected) {
      // Calculate distance from camera to node
      const nodeWorldPos = new THREE.Vector3(position[0], position[1], position[2])
      const cameraPos = camera.position
      const distance = nodeWorldPos.distanceTo(cameraPos)
      const maxDistance = 15
      // Far nodes get more blur (0 = far, 1 = near)
      const factor = Math.max(0, 1 - (distance / maxDistance))
      setDepthFactor(factor)
    } else {
      setDepthFactor(1)
    }
  })

  // Hover scale animation
  useEffect(() => {
    if (hovered) {
      setScale(1.12)
    } else if (isSelected) {
      setScale(1.14)
    } else {
      setScale(1)
    }
  }, [hovered, isSelected])

  const handleClick = () => {
    triggerHaptic([20])
    onSelect(thread.id)
  }

  return (
    <group position={position}>
      {/* Larger invisible mesh for easier clicking */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          // Only set hover if not dragging
          if (!e.nativeEvent.buttons) {
            setHovered(true)
          }
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          // Only handle click if not dragging
          if (!e.nativeEvent.buttons && !isDragging) {
            e.stopPropagation()
            handleClick()
          }
        }}
        visible={false}
      >
        <sphereGeometry args={[1.2, 16, 16]} />
      </mesh>

      {/* HTML overlay for crisp rendering - scales with distance */}
      <Html
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'auto',
          transform: 'translate(-50%, -50%)',
        }}
        zIndexRange={[100, 0]}
        occlude={false}
        transform
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer select-none"
          animate={{
            scale,
            opacity: isFocusLocked && !isSelected ? 0.3 + depthFactor * 0.4 : 1,
            filter: isFocusLocked && !isSelected ? `blur(${(1 - depthFactor) * 8}px)` : 'blur(0px)',
          }}
          transition={{
            duration: hovered ? 0.14 : 0.08,
            ease: hovered ? [0.22, 1, 0.36, 1] : 'easeOut',
          }}
          onPointerEnter={(e) => {
            // Only set hover if not dragging (no buttons pressed)
            if (!(e.nativeEvent as PointerEvent).buttons) {
              setHovered(true)
            }
          }}
          onPointerLeave={() => setHovered(false)}
          onClick={(e) => {
            // Only handle click if not dragging (no buttons pressed)
            const pointerEvent = e.nativeEvent as PointerEvent
            if (!pointerEvent.buttons && !isDragging) {
              e.stopPropagation()
              handleClick()
            }
          }}
          onPointerDown={(e) => {
            // Don't stop propagation - let canvas handle drag
            // Only stop if it's a clear click (no movement)
          }}
          data-node="true"
          role="button"
          tabIndex={0}
          aria-label={`Thread: ${thread.title}. Tags: ${thread.tags.join(', ')}. ${thread.unread ? 'Unread' : 'Read'}.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
          }}
        >
          {/* Node circle with enhanced glow - theme-aware */}
          <div
            className={`relative w-18 h-18 rounded-full flex items-center justify-center text-3xl transition-all overflow-hidden ${hovered || isSelected
              ? theme === 'dark'
                ? 'ring-4 ring-primary-mid/60 shadow-2xl shadow-primary-mid/50'
                : 'ring-4 ring-primary-mid/80 shadow-2xl shadow-primary-mid/60'
              : theme === 'dark'
                ? 'ring-2 ring-primary-start/40'
                : 'ring-2 ring-primary-start/60'
              } ${thread.unread ? 'animate-unread-pulse' : ''}`}
            style={{
              background: thread.image
                ? 'transparent'
                : hovered || isSelected
                  ? 'linear-gradient(135deg, #7F7FFF, #A06CFF, #FF88C6)'
                  : theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(127, 127, 255, 0.4), rgba(160, 108, 255, 0.4))'
                    : 'linear-gradient(135deg, rgba(127, 127, 255, 0.7), rgba(160, 108, 255, 0.7))',
              backdropFilter: 'blur(12px)',
              boxShadow: hovered || isSelected
                ? theme === 'dark'
                  ? '0 0 30px rgba(160, 108, 255, 0.6), 0 0 60px rgba(127, 127, 255, 0.3)'
                  : '0 0 30px rgba(160, 108, 255, 0.8), 0 0 60px rgba(127, 127, 255, 0.5)'
                : theme === 'dark'
                  ? '0 0 15px rgba(127, 127, 255, 0.2)'
                  : '0 0 20px rgba(127, 127, 255, 0.4)',
            }}
          >
            {thread.image ? (
              <img
                src={thread.image}
                alt={thread.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{thread.icon}</span>
            )}
          </div>

          {/* Label with better visibility - theme-aware */}
          <div
            className={`mt-2 text-small font-semibold text-center max-w-[90px] transition-all ${theme === 'dark' ? 'text-white' : 'text-gray-800'
              } ${hovered || isSelected ? 'opacity-100 scale-105' : 'opacity-80'}`}
            style={{
              textShadow: theme === 'dark'
                ? '0 2px 12px rgba(0, 0, 0, 0.8), 0 0 8px rgba(127, 127, 255, 0.3)'
                : '0 2px 12px rgba(255, 255, 255, 0.8), 0 0 8px rgba(127, 127, 255, 0.4)',
            }}
          >
            <div className="line-clamp-2">{thread.title}</div>
          </div>
        </motion.div>
      </Html>
    </group>
  )
}

