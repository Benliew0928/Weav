'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { useWeavStore } from '@/store/useWeavStore'
import { Thread, Comment, currentUser } from '@/data/sampleThreads'
import { CommentBubble } from '@/components/CommentBubble'
import { Avatar } from '@/components/Avatar'
import { ReactionBar } from '@/components/ReactionBar'
import { formatTimeAgo } from '@/lib/utils'
import { ChatRoomView } from '@/components/ChatRoomView'

export const runtime = 'edge'

export default function ThreadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { threads, addComment, setWeavRingVisible, theme } = useWeavStore()
  const [thread, setThread] = useState<Thread | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [showChatRoom, setShowChatRoom] = useState(false)

  useEffect(() => {
    setWeavRingVisible(false)
    const foundThread = threads.find((t) => t.id === params.id)
    if (foundThread) {
      setThread(foundThread)
      setTimeout(() => setIsVisible(true), 100)
    }

    return () => {
      // Ensure sphere is restored if user navigates away without using back button
      setWeavRingVisible(true)
    }
  }, [params.id, threads, setWeavRingVisible])

  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      setWeavRingVisible(true)
      router.push('/')
    }, 300)
  }

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !thread) return

    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: replyText,
      timestamp: new Date(),
      reactions: [],
    }

    addComment(thread.id, newComment)
    setReplyText('')
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Thread not found</p>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {showChatRoom && thread && (
          <ChatRoomView
            key="chatroom"
            thread={thread}
            onClose={() => setShowChatRoom(false)}
          />
        )}
      </AnimatePresence>
      
      {!showChatRoom && (
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 28,
              }}
              className="h-full overflow-y-auto pb-40"
            >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={handleBack}
              className={`flex items-center space-x-2 transition-colors mb-6 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Feed</span>
            </button>

            <div className={`glass rounded-card p-8 border mb-6 transition-colors ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
            }`}>
              <div className="flex items-start space-x-4 mb-6">
                {thread.image ? (
                  <img
                    src={thread.image}
                    alt={thread.title}
                    className="w-16 h-16 rounded-button object-cover"
                  />
                ) : (
                  <div className="text-5xl">{thread.icon}</div>
                )}
                <div className="flex-1">
                  <h1 className={`text-3xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {thread.title}
                  </h1>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar
                      src={thread.author.avatar}
                      alt={thread.author.username}
                      size="sm"
                    />
                    <span className={`text-sm ${
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
                  <p className={`text-base mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {thread.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-xs rounded-full ${
                          theme === 'dark' 
                            ? 'bg-white/5 text-gray-400' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ReactionBar reactions={thread.reactions} />
                  
                  {/* Join Chat Button */}
                  <motion.button
                    onClick={() => setShowChatRoom(true)}
                    className="mt-4 px-6 py-3 rounded-button gradient-primary text-white text-base font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Join Chat</span>
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h2 className={`text-xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Comments ({thread.comments.length})
              </h2>
              {thread.comments.length === 0 ? (
                <p className={`text-center py-8 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                thread.comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 240,
                      damping: 28,
                    }}
                  >
                    <CommentBubble comment={comment} />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div
            className={`fixed left-0 right-0 glass border-t backdrop-blur-xl transition-colors z-40 ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
            }`}
            style={{
              bottom: 0,
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 0.5rem)',
            }}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form
                onSubmit={handleSubmitReply}
                className="flex items-center space-x-3"
              >
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  size="sm"
                />
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add a comment..."
                  className={`flex-1 px-4 py-3 rounded-button border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <motion.button
                  type="submit"
                  className="p-3 rounded-button gradient-primary text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Send comment"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
      )}
    </>
  )
}

