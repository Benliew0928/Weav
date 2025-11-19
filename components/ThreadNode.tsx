'use client'

import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Thread } from '@/lib/sampleData'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface ThreadNodeProps {
  thread: Thread
  position: [number, number, number]
  onSelect: (threadId: string) => void
}

export function ThreadNode({ thread, position, onSelect }: ThreadNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Float animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.02
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(thread.id)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#A06CFF' : '#7F7FFF'}
          emissive={hovered ? '#A06CFF' : '#7F7FFF'}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      <Html
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={() => onSelect(thread.id)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <div
            className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-2xl transition-all ${
              hovered
                ? 'ring-4 ring-purple-500/50 shadow-lg shadow-purple-500/50'
                : 'ring-2 ring-purple-500/30'
            }`}
            style={{
              background: hovered
                ? 'linear-gradient(135deg, #7F7FFF, #A06CFF, #FF88C6)'
                : 'linear-gradient(135deg, rgba(127, 127, 255, 0.3), rgba(160, 108, 255, 0.3))',
            }}
          >
            {thread.icon}
          </div>
          <span
            className={`mt-2 text-xs font-medium text-white whitespace-nowrap transition-opacity ${
              hovered ? 'opacity-100' : 'opacity-70'
            }`}
          >
            {thread.title.length > 15
              ? thread.title.substring(0, 15) + '...'
              : thread.title}
          </span>
        </motion.div>
      </Html>
    </group>
  )
}

