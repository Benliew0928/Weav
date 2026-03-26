'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, Trash2 } from 'lucide-react'
import { Thread } from '@/data/sampleThreads'
import { triggerHaptic } from '@/lib/perf'
import { useWeavStore } from '@/store/useWeavStore'
import { UserPresence } from '@/lib/firebase/presence'
import { deleteThread } from '@/lib/firebase/threads'
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const userListRef = useRef<HTMLDivElement>(null)

  const handleDeleteThread = async () => {
    try {
      setIsDeleting(true)
      await deleteThread(thread.id)
      triggerHaptic([10, 10, 10])
      onBack()
    } catch (error) {
      console.error('Failed to delete thread', error)
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      // Provide a simple alert if it fails
      alert('Failed to delete thread. Please try again.')
    }
  }

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

      <div className="flex items-center gap-2">
        {/* Delete Thread Button */}
        <motion.button
          onClick={() => setShowDeleteConfirm(true)}
          className={`p-2 rounded-button transition-colors ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Delete thread"
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </motion.button>

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
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl ${
                theme === 'dark' ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white border border-gray-100'
              }`}
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4 mx-auto">
                  <Trash2 className="w-6 h-6 text-red-500 dark:text-red-400" />
                </div>
                <h3 className={`text-xl font-bold text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Delete Chat Room
                </h3>
                <p className={`text-center text-sm mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Are you absolutely sure you want to delete <span className="font-semibold text-red-500">&quot;{thread.title}&quot;</span>? This action cannot be undone and will permanently delete all messages and media.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleDeleteThread}
                    disabled={isDeleting}
                    className={`w-full py-3 px-4 rounded-xl font-medium focus:outline-none transition-colors duration-200 ${
                      isDeleting 
                        ? 'bg-red-500/50 cursor-not-allowed' 
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
                    }`}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, delete forever'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className={`w-full py-3 px-4 rounded-xl font-medium focus:outline-none transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-white/5 hover:bg-white/10 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
