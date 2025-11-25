'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { Thread } from '@/data/sampleThreads'
import { triggerHaptic } from '@/lib/perf'
import { useWeavStore } from '@/store/useWeavStore'
import { UserPresence } from '@/lib/firebase/presence'
import { Avatar } from './Avatar'

interface ChatHeaderProps {
  thread: Thread
  activeMembers: number
  onlineUsers?: UserPresence[]
  onBack: () => void
}

export function ChatHeader({ thread, activeMembers, onlineUsers = [], onBack }: ChatHeaderProps) {
  const { theme } = useWeavStore()
  const [showUserList, setShowUserList] = useState(false)
  const userListRef = useRef<HTMLDivElement>(null)

  // Close user list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userListRef.current && !userListRef.current.contains(event.target as Node)) {
        setShowUserList(false)
      }
    }

    if (showUserList) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserList])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-20 glass backdrop-blur-xl transition-colors duration-300 ${theme === 'dark' ? 'border-b border-white/10' : 'border-b border-gray-200/50'
        }`}
    >
      <div className="px-4 md:px-6 py-4 flex items-center gap-4">
        {/* Back Button */}
        <motion.button
          onClick={() => {
            triggerHaptic([10])
            onBack()
          }}
          className={`p-2 rounded-button transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
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
          <h1 className={`text-section-title font-semibold truncate transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            {thread.title}
          </h1>
          <p className={`text-small transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
            {activeMembers} active now
          </p>
        </div>

        {/* Animated glow ring behind avatar cluster */}
        <div className="relative" ref={userListRef}>
          <motion.button
            onClick={() => setShowUserList(!showUserList)}
            className="relative outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary-start to-primary-mid flex items-center justify-center text-white font-semibold cursor-pointer shadow-lg hover:shadow-primary-mid/30 transition-shadow">
              {activeMembers}
            </div>
          </motion.button>

          {/* User List Dropdown */}
          <AnimatePresence>
            {showUserList && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 top-14 w-64 rounded-2xl shadow-2xl overflow-hidden glass border ${theme === 'dark'
                  ? 'bg-[#1a1a2e]/95 border-white/10'
                  : 'bg-white/95 border-gray-200/50'
                  }`}
              >
                <div className={`p-3 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
                  }`}>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    Active Users ({onlineUsers.length})
                  </span>
                  <button
                    onClick={() => setShowUserList(false)}
                    className={`p-1 rounded-full hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                  {onlineUsers.length > 0 ? (
                    onlineUsers.map((user) => (
                      <div
                        key={user.userId}
                        className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${theme === 'dark'
                          ? 'hover:bg-white/5 text-gray-200'
                          : 'hover:bg-gray-100 text-gray-800'
                          }`}
                      >
                        <div className="relative">
                          <Avatar src={user.avatar} alt={user.username} size="sm" userId={user.userId} />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#1a1a2e]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.username}</p>
                          {user.isTyping && (
                            <p className="text-xs text-primary-mid animate-pulse">typing...</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`p-4 text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                      No active users found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
