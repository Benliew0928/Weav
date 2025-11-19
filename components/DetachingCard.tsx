'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Thread } from '@/data/sampleThreads'
import { useWeavStore } from '@/store/useWeavStore'

interface DetachingCardProps {
  thread: Thread
  startPosition: { x: number; y: number; z: number }
  onComplete: () => void
}

export function DetachingCard({ thread, startPosition, onComplete }: DetachingCardProps) {
  const { transitionPhase, setTransitionPhase } = useWeavStore()
  const progress = useMotionValue(0)
  const springProgress = useSpring(progress, {
    stiffness: 200,
    damping: 30,
    mass: 0.5,
  })

  // Animate progress through phases
  useEffect(() => {
    if (transitionPhase === 'focusing') {
      progress.set(0.2) // Focus lock
      setTimeout(() => {
        setTransitionPhase('detaching')
        progress.set(0.5) // Detach
      }, 300)
    } else if (transitionPhase === 'detaching') {
      setTimeout(() => {
        setTransitionPhase('expanding')
        progress.set(1) // Expand
      }, 400)
    } else if (transitionPhase === 'expanding') {
      setTimeout(() => {
        setTransitionPhase('expanded')
        onComplete()
      }, 300)
    }
  }, [transitionPhase, progress, setTransitionPhase, onComplete])

  // Calculate position based on progress
  const x = useTransform(springProgress, [0, 1], [startPosition.x * 100, 0])
  const y = useTransform(springProgress, [0, 1], [startPosition.y * 100, 0])
  const z = useTransform(springProgress, [0, 0.5, 1], [startPosition.z, -5, 0])
  const scale = useTransform(springProgress, [0, 0.5, 1], [1, 1.12, 1])
  const opacity = useTransform(springProgress, [0, 0.5, 1], [1, 1, 1])

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      style={{
        x,
        y,
        z: z,
        scale,
        opacity,
      }}
    >
      <div className="w-18 h-18 rounded-full flex items-center justify-center text-3xl gradient-primary ring-4 ring-primary-mid/60 shadow-2xl shadow-primary-mid/50">
        {thread.icon}
      </div>
    </motion.div>
  )
}

