'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Thread } from '@/data/sampleThreads'
import { triggerHaptic } from '@/lib/perf'
import { useWeavStore } from '@/store/useWeavStore'

interface ChatHeaderProps {
  thread: Thread
  activeMembers: number
  onBack: () => void
}

export function ChatHeader({ thread, activeMembers, onBack }: ChatHeaderProps) {
  const { theme } = useWeavStore()
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-20 glass backdrop-blur-xl transition-colors duration-300 ${
        theme === 'dark' ? 'border-b border-white/10' : 'border-b border-gray-200/50'
      }`}
    >
      <div className="px-4 md:px-6 py-4 flex items-center gap-4">
        {/* Back Button */}
        <motion.button
          onClick={() => {
            triggerHaptic([10])
            onBack()
          }}
          className={`p-2 rounded-button transition-colors ${
            theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to thread details"
        >
          <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
        </motion.button>

        {/* Thread Icon */}
        {thread.image ? (
          <img
            src={thread.image}
            alt={thread.title}
            className="w-12 h-12 rounded-button object-cover"
          />
        ) : (
          <div className="text-3xl">{thread.icon}</div>
        )}

        {/* Thread Info */}
        <div className="flex-1 min-w-0">
          <h1 className={`text-section-title font-semibold truncate transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {thread.title}
          </h1>
          <p className={`text-small transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {activeMembers} active now
          </p>
        </div>

        {/* Animated glow ring behind avatar cluster */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-start via-primary-mid to-primary-end opacity-30 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary-start to-primary-mid flex items-center justify-center text-white font-semibold">
            {activeMembers}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

