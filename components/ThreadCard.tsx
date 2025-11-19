'use client'

import { motion } from 'framer-motion'
import { Thread } from '@/data/sampleThreads'
import { Avatar } from './Avatar'
import { formatTimeAgo } from '@/lib/utils'
import { useWeavStore } from '@/store/useWeavStore'

interface ThreadCardProps {
  thread: Thread
  index?: number
  onClick?: () => void
}

export function ThreadCard({ thread, index = 0, onClick }: ThreadCardProps) {
  const { theme, selectNode } = useWeavStore()
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Default behavior: open detail panel
      selectNode(thread.id)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 240,
        damping: 28,
      }}
    >
      <div 
        onClick={handleClick}
        className={`p-4 sm:p-6 rounded-card glass border transition-colors cursor-pointer ${
          theme === 'dark' 
            ? 'border-white/10 hover:border-white/20' 
            : 'border-gray-200/50 hover:border-gray-300/70'
        }`}
      >
          <div className="flex items-start space-x-3 sm:space-x-4">
            {thread.image ? (
              <img
                src={thread.image}
                alt={thread.title}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-button object-cover flex-shrink-0"
              />
            ) : (
              <div className="text-3xl sm:text-4xl flex-shrink-0">{thread.icon}</div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {thread.title}
              </h3>
              <p className={`text-sm mb-3 sm:mb-4 line-clamp-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {thread.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="flex items-center space-x-2">
                  <Avatar
                    src={thread.author.avatar}
                    alt={thread.author.username}
                    size="sm"
                  />
                  <span className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {thread.author.username}
                  </span>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    · {formatTimeAgo(thread.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 flex-wrap">
                  {thread.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs rounded-full ${
                        theme === 'dark' 
                          ? 'bg-white/5 text-gray-400' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </motion.div>
  )
}

