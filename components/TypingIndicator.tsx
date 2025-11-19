'use client'

import { motion } from 'framer-motion'
import { User } from '@/data/sampleThreads'
import { Avatar } from './Avatar'

interface TypingIndicatorProps {
  users: User[]
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null

  const usernames = users.map(u => u.username).join(', ')
  const displayText = users.length === 1 
    ? `${usernames} is typing...`
    : `${usernames} are typing...`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 px-4"
    >
      {users.length > 0 && (
        <Avatar src={users[0].avatar} alt={users[0].username} size="sm" />
      )}

      <div className="glass bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-small text-gray-400">{displayText}</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary-mid"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

