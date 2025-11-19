'use client'

import { motion } from 'framer-motion'
import { Thread } from '@/data/sampleThreads'
import { useWeavStore } from '@/store/useWeavStore'

interface WeavRing2DProps {
  threads: Thread[]
  onNodeSelect: (threadId: string) => void
}

export function WeavRing2D({ threads, onNodeSelect }: WeavRing2DProps) {
  const { ringRotation, theme } = useWeavStore()
  const radius = 250
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 400
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400

  return (
    <div 
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#0a0a0f'
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative"
          style={{ 
            transform: `rotate(${ringRotation * (180 / Math.PI)}deg)`,
            perspective: '1000px',
          }}
        >
          {threads.map((thread, index) => {
            // Use Fibonacci sphere distribution for 2D projection
            const goldenAngle = Math.PI * (3 - Math.sqrt(5))
            const y = 1 - (index / (threads.length - 1)) * 2
            const radiusAtY = Math.sqrt(1 - y * y)
            const theta = goldenAngle * index
            
            const x3D = Math.cos(theta) * radiusAtY
            const z3D = Math.sin(theta) * radiusAtY
            
            // Project to 2D with depth
            const depth = z3D * 0.5
            const scale = 0.7 + depth * 0.3
            const x = centerX + x3D * radius * scale
            const y2D = centerY + y * radius * scale

            return (
              <motion.div
                key={thread.id}
                className="absolute cursor-pointer"
                style={{
                  left: x,
                  top: y2D,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  opacity: 0.6 + depth * 0.4,
                }}
                onClick={() => onNodeSelect(thread.id)}
                whileHover={{ scale: scale * 1.15 }}
                whileTap={{ scale: scale * 1.2 }}
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3 + index * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.05,
                }}
                role="button"
                tabIndex={0}
                aria-label={`Thread: ${thread.title}. Tags: ${thread.tags.join(', ')}. ${thread.unread ? 'Unread' : 'Read'}.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onNodeSelect(thread.id)
                  }
                }}
              >
                <div
                  className="w-18 h-18 rounded-full flex items-center justify-center text-3xl gradient-primary shadow-lg"
                  style={{
                    boxShadow: '0 0 20px rgba(160, 108, 255, 0.4)',
                  }}
                >
                  {thread.image ? (
                    <img
                      src={thread.image}
                      alt={thread.title}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    thread.icon
                  )}
                </div>
                <div
                  className="mt-2 text-small font-semibold text-white text-center max-w-[90px]"
                  style={{
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {thread.title.length > 12
                    ? thread.title.substring(0, 12) + '...'
                    : thread.title}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

