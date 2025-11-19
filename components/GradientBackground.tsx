'use client'

import { motion } from 'framer-motion'

interface GradientBackgroundProps {
  children?: React.ReactNode
  className?: string
}

export function GradientBackground({ children, className }: GradientBackgroundProps) {
  return (
    <div className={`fixed inset-0 overflow-hidden ${className || ''}`}>
      <motion.div
        className="absolute inset-0 gradient-primary opacity-20"
        animate={{
          background: [
            'linear-gradient(0deg, #7F7FFF, #A06CFF, #FF88C6)',
            'linear-gradient(90deg, #7F7FFF, #A06CFF, #FF88C6)',
            'linear-gradient(180deg, #7F7FFF, #A06CFF, #FF88C6)',
            'linear-gradient(270deg, #7F7FFF, #A06CFF, #FF88C6)',
            'linear-gradient(360deg, #7F7FFF, #A06CFF, #FF88C6)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      {children}
    </div>
  )
}

