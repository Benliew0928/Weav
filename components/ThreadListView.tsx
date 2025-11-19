'use client'

import { motion } from 'framer-motion'
import { Thread } from '@/data/sampleThreads'
import { ThreadCard } from './ThreadCard'
import { useWeavStore } from '@/store/useWeavStore'

export function ThreadListView() {
  const { threads, theme } = useWeavStore()

  return (
    <div 
      className="h-full overflow-y-auto transition-colors duration-300"
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : 'transparent'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 28,
          }}
        >
          <div className="mb-6">
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              All Threads
            </h1>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {threads.length} {threads.length === 1 ? 'thread' : 'threads'}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {threads.map((thread, index) => (
              <ThreadCard key={thread.id} thread={thread} index={index} />
            ))}
          </div>

          {threads.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No threads yet. Create one to get started!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

