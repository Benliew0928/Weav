'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useWeavStore } from '@/store/useWeavStore'

interface FloatingButtonProps {
  onClick: () => void
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  const { isCreateThreadOpen } = useWeavStore()

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full gradient-primary shadow-2xl flex items-center justify-center text-white z-50 hover:scale-105 active:scale-95 transition-transform"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      animate={{
        rotate: isCreateThreadOpen ? 45 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 28,
      }}
      aria-label="Create new thread"
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  )
}

