'use client'

import { motion } from 'framer-motion'
import { ChatMessage } from '@/data/sampleChatMessages'
import { Avatar } from './Avatar'
import { formatTimeAgo } from '@/lib/utils'
import { useWeavStore } from '@/store/useWeavStore'

interface MessageBubbleProps {
  message: ChatMessage
  isOwnMessage: boolean
  showAvatar: boolean
  index: number
}

export function MessageBubble({ message, isOwnMessage, showAvatar, index }: MessageBubbleProps) {
  const { theme } = useWeavStore()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.02,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {showAvatar && !isOwnMessage && (
        <div className="flex-shrink-0">
          <Avatar src={message.author.avatar} alt={message.author.username} size="sm" />
        </div>
      )}

      {isOwnMessage && <div className="flex-shrink-0 w-10" />}

      {/* Message Bubble */}
      <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isOwnMessage && showAvatar && (
          <span className={`text-xs mb-1 px-1 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {message.author.username}
          </span>
        )}

        <motion.div
          className={`px-4 py-2.5 rounded-2xl transition-colors duration-300 ${
            isOwnMessage
              ? 'gradient-primary text-white'
              : theme === 'dark'
              ? 'glass bg-white/5 text-gray-100 border border-white/10'
              : 'glass bg-gray-100/80 text-gray-900 border border-gray-200/50'
          }`}
          style={{
            boxShadow: isOwnMessage
              ? '0 4px 20px rgba(127, 127, 255, 0.3)'
              : theme === 'dark'
              ? '0 2px 10px rgba(0, 0, 0, 0.2)'
              : '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p className="text-body whitespace-pre-wrap break-words">{message.content}</p>
        </motion.div>

        {/* Timestamp */}
        <motion.span
          className={`text-xs mt-1 px-1 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {formatTimeAgo(message.timestamp)}
        </motion.span>
      </div>
    </motion.div>
  )
}

