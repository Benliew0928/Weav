'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWeavStore } from '@/store/useWeavStore'

interface StarfieldBackgroundProps {
  count?: number
}

export function StarfieldBackground({ count = 2000 }: StarfieldBackgroundProps) {
  const { theme } = useWeavStore()
  const meshRef = useRef<THREE.Points>(null)
  
  // Generate random star positions in a sphere
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const radius = 500 // Large radius for background stars
    
    for (let i = 0; i < count; i++) {
      // Generate points on a sphere using spherical coordinates
      const theta = Math.random() * Math.PI * 2 // Azimuth angle
      const phi = Math.acos(2 * Math.random() - 1) // Polar angle
      const r = radius + (Math.random() - 0.5) * 100 // Slight variation in distance
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    
    return positions
  }, [count])
  
  // Generate sizes for stars (some bigger, some smaller)
  const sizes = useMemo(() => {
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Most stars are small, some are medium, few are large
      const rand = Math.random()
      if (rand < 0.7) {
        sizes[i] = 0.5 + Math.random() * 0.5 // Small stars: 0.5-1.0
      } else if (rand < 0.95) {
        sizes[i] = 1.0 + Math.random() * 1.0 // Medium stars: 1.0-2.0
      } else {
        sizes[i] = 2.0 + Math.random() * 2.0 // Large stars: 2.0-4.0
      }
    }
    return sizes
  }, [count])
  
  // Generate colors based on theme
  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3)
    
    if (theme === 'dark') {
      // White stars with slight variations for dark mode
      for (let i = 0; i < count; i++) {
        const brightness = 0.8 + Math.random() * 0.2 // 0.8-1.0
        colors[i * 3] = brightness // R
        colors[i * 3 + 1] = brightness // G
        colors[i * 3 + 2] = brightness // B
      }
    } else {
      // Maximum vibrant blue stars for light mode - very blue and visible
      for (let i = 0; i < count; i++) {
        const rand = Math.random()
        if (rand < 0.5) {
          // Pure vibrant blue: minimal red, maximum blue
          const brightness = 1.0 // Full brightness
          colors[i * 3] = 0.1 * brightness // R - minimal red
          colors[i * 3 + 1] = 0.5 * brightness // G - moderate green
          colors[i * 3 + 2] = 1.0 * brightness // B - full blue
        } else if (rand < 0.8) {
          // Deep pure blue: #0066FF (0, 102, 255) - very blue
          const brightness = 1.0
          colors[i * 3] = 0.0 * brightness // R - no red
          colors[i * 3 + 1] = 0.4 * brightness // G (102/255)
          colors[i * 3 + 2] = 1.0 * brightness // B - full blue
        } else {
          // Bright cyan-blue: #00BFFF (0, 191, 255) - vibrant blue
          const brightness = 1.0
          colors[i * 3] = 0.0 * brightness // R - no red
          colors[i * 3 + 1] = 0.75 * brightness // G (191/255)
          colors[i * 3 + 2] = 1.0 * brightness // B - full blue
        }
      }
    }
    
    return colors
  }, [count, theme])
  
  // Slow rotation for immersive effect
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.01 // Very slow rotation
    }
  })
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={theme === 'dark' ? 2 : 3.5}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={theme === 'dark' ? 0.9 : 1.0}
        blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  )
}

