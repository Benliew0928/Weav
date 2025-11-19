'use client'

import { motion } from 'framer-motion'
import { Reaction } from '@/data/sampleThreads'

interface ReactionBarProps {
  reactions: Reaction[]
  onReaction?: (emoji: string) => void
}

export function ReactionBar({ reactions, onReaction }: ReactionBarProps) {
  if (reactions.length === 0) return null

  return (
    <div className="flex items-center space-x-2 mt-2">
      {reactions.map((reaction, index) => (
        <motion.button
          key={index}
          onClick={() => onReaction?.(reaction.emoji)}
          className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: index * 0.05,
            type: 'spring',
            stiffness: 240,
            damping: 28,
          }}
        >
          <span>{reaction.emoji}</span>
          <span className="text-gray-400">{reaction.count}</span>
        </motion.button>
      ))}
    </div>
  )
}

