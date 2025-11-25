'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { X, Send, MessageCircle, ArrowLeft } from 'lucide-react'
import { useWeavStore } from '@/store/useWeavStore'
import { Thread, Comment } from '@/data/sampleThreads'
import { CommentBubble } from './CommentBubble'
import { Avatar } from './Avatar'
import { ReactionBar } from './ReactionBar'
import { ChatRoomView } from './ChatRoomView'
import { formatTimeAgo } from '@/lib/utils'
import { triggerHaptic } from '@/lib/perf'
import { addCommentToThread } from '@/lib/firebase/threads'

export function ThreadDetailPanel() {
  const {
    threads,
    selectedThreadId,
    isThreadDetailOpen,
    setThreadDetailOpen,
    setWeavRingVisible,
    addComment,
    setZoom,
    defaultCameraZ,
    transitionPhase,
    setTransitionPhase,
    selectedNodePosition,
    setFocusLocked,
    selectNode,
    setSelectedNodePosition,
    theme,
    currentUser,
  } = useWeavStore()

  const [thread, setThread] = useState<Thread | null>(null)
  const [replyText, setReplyText] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showChatRoom, setShowChatRoom] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Parallax motion values
  const parallaxX = useMotionValue(0)
  const parallaxY = useMotionValue(0)
  const springX = useSpring(parallaxX, { stiffness: 150, damping: 15 })
  const springY = useSpring(parallaxY, { stiffness: 150, damping: 15 })

  useEffect(() => {
    if (selectedThreadId) {
      const foundThread = threads.find((t) => t.id === selectedThreadId)
      if (foundThread) {
        setThread(foundThread)
      } else {
        // Thread not found, clear state
        setThread(null)
      }
    } else if (transitionPhase === 'idle' && !selectedThreadId && !showChatRoom) {
      // Only clear thread when fully idle, no selection, and chat is not open
      setThread(null)
    }
  }, [selectedThreadId, threads, transitionPhase, showChatRoom])

  // Handle transition phases - coordinate the animation sequence
  useEffect(() => {
    if (transitionPhase === 'focusing') {
      // Focus lock phase - wait for sphere to slow down
      setTimeout(() => {
        setTransitionPhase('detaching')
      }, 300)
    } else if (transitionPhase === 'detaching') {
      // Card detach phase
      setTimeout(() => {
        setTransitionPhase('expanding')
      }, 400)
    } else if (transitionPhase === 'expanding') {
      // Expanding to panel phase
      setTimeout(() => {
        setTransitionPhase('expanded')
        setThreadDetailOpen(true)
      }, 300)
    }
  }, [transitionPhase, setTransitionPhase, setThreadDetailOpen])

  // Parallax effect on mouse move - only when panel is fully expanded
  useEffect(() => {
    if (transitionPhase !== 'expanded' || showChatRoom) {
      // Reset parallax when not expanded or when chat is open
      parallaxX.set(0)
      parallaxY.set(0)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const deltaX = (e.clientX - centerX) / centerX
      const deltaY = (e.clientY - centerY) / centerY
      parallaxX.set(deltaX * 10)
      parallaxY.set(deltaY * 10)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      // Reset parallax on cleanup
      parallaxX.set(0)
      parallaxY.set(0)
    }
  }, [transitionPhase, showChatRoom, parallaxX, parallaxY])

  const handleClose = () => {
    triggerHaptic([10])

    // Start reverse animation
    setTransitionPhase('collapsing')
    setThreadDetailOpen(false)

    // Mark thread as read before clearing
    if (thread) {
      thread.unread = false
    }

    // After collapse animation, restore sphere and fully reset state
    setTimeout(() => {
      // Fully reset all state (but keep current zoom level)
      setTransitionPhase('idle')
      setFocusLocked(false)
      setWeavRingVisible(true)
      // Don't reset zoom - keep user's current zoom level
      setSelectedNodePosition(null)
      selectNode(null)
      // Clear thread state after state is reset
      setThread(null)
    }, 400)
  }

  const handleJoinChat = () => {
    triggerHaptic([20])
    setShowChatRoom(true)
  }

  const handleCloseChat = () => {
    setShowChatRoom(false)
    // Wait for chat exit animation to complete before ensuring panel is visible
    setTimeout(() => {
      // Force panel to be visible and ensure state is correct
      if (thread && selectedThreadId) {
        setThreadDetailOpen(true)
        setFocusLocked(true) // Keep focus locked to prevent sphere interaction
        if (transitionPhase !== 'expanded') {
          setTransitionPhase('expanded')
        }
        // Ensure thread is still set
        const foundThread = threads.find((t) => t.id === selectedThreadId)
        if (foundThread) {
          setThread(foundThread)
        }
      }
    }, 350) // Wait for exit animation (300ms) + small buffer
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !thread) return

    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: replyText,
      timestamp: new Date(),
      reactions: [],
      replies: [],
    }

    try {
      // Optimistic update (optional, but good for UX)
      addComment(thread.id, newComment)

      // Write to Firestore
      await addCommentToThread(thread.id, newComment)

      setReplyText('')
      triggerHaptic([20])
    } catch (error) {
      console.error('Failed to add comment:', error)
      // TODO: Revert optimistic update if needed
    }
  }

  const isExpanding = transitionPhase === 'expanding' || transitionPhase === 'expanded'
  const isCollapsing = transitionPhase === 'collapsing'
  const shouldShowPanel = (isThreadDetailOpen || isExpanding || transitionPhase === 'detaching' || transitionPhase === 'focusing') && thread

  // Don't render if no thread and not in transition
  if (!thread && transitionPhase === 'idle') return null

  // Show chat room if opened with slide animation
  return (
    <>
      <AnimatePresence>
        {showChatRoom && thread && (
          <ChatRoomView
            key="chatroom"
            thread={thread}
            onClose={handleCloseChat}
          />
        )}
      </AnimatePresence>

      {/* Panel - only show when chat is NOT open */}
      {!showChatRoom && (
        <AnimatePresence mode="wait">
          {shouldShowPanel && (
            <>
              {/* Backdrop with dimming - reduced blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isExpanding ? 0.4 : 0.5,
                  backdropFilter: 'blur(4px)',
                }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={handleClose}
                style={{
                  x: springX,
                  y: springY,
                }}
              />

              {/* Panel with morph animation */}
              <motion.div
                ref={panelRef}
                initial={selectedNodePosition && transitionPhase === 'focusing' ? {
                  x: typeof window !== 'undefined'
                    ? (window.innerWidth > 768 ? window.innerWidth / 2 - 220 : window.innerWidth / 2 - window.innerWidth / 2)
                    : 0,
                  y: typeof window !== 'undefined' ? window.innerHeight / 2 - 200 : 0,
                  scale: 0.15,
                  opacity: 0,
                } : {
                  x: '100%',
                  scale: 1,
                  opacity: 1,
                }}
                animate={isCollapsing ? {
                  x: selectedNodePosition && typeof window !== 'undefined'
                    ? (window.innerWidth > 768 ? window.innerWidth / 2 - 220 : window.innerWidth / 2 - window.innerWidth / 2)
                    : '100%',
                  y: selectedNodePosition && typeof window !== 'undefined' ? window.innerHeight / 2 - 200 : 0,
                  scale: selectedNodePosition ? 0.15 : 1,
                  opacity: 0,
                } : {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }}
                exit={isCollapsing ? {
                  x: selectedNodePosition && typeof window !== 'undefined'
                    ? (window.innerWidth > 768 ? window.innerWidth / 2 - 220 : window.innerWidth / 2 - window.innerWidth / 2)
                    : '100%',
                  y: selectedNodePosition && typeof window !== 'undefined' ? window.innerHeight / 2 - 200 : 0,
                  scale: selectedNodePosition ? 0.15 : 1,
                  opacity: 0,
                } : {
                  x: '100%',
                  opacity: 0,
                }}
                transition={{
                  duration: isCollapsing ? 0.4 : 0.5,
                  ease: [0.22, 1, 0.36, 1], // Apple-style easing
                }}
                className={`fixed top-0 right-0 h-full w-full md:w-[440px] border-l z-50 flex flex-col overflow-y-auto transition-colors duration-300 ${theme === 'dark'
                  ? 'border-white/10 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]'
                  : 'border-gray-200/50 bg-gradient-to-br from-white via-gray-50 to-white'
                  }`}
                style={{
                  x: transitionPhase === 'expanded' && !showChatRoom ? springX : 0,
                  y: transitionPhase === 'expanded' && !showChatRoom ? springY : 0,
                  pointerEvents: 'auto',
                  backdropFilter: 'none',
                  filter: 'none',
                }}
              >
                {/* Header */}
                <div className={`p-6 border-b transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
                  }`}>
                  <div className="flex items-center justify-between mb-4">
                    <motion.button
                      onClick={handleClose}
                      className={`p-2 rounded-button transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                        }`}
                      aria-label="Back to sphere"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                    </motion.button>

                    {/* Join Chat Button */}
                    <motion.button
                      onClick={handleJoinChat}
                      className="px-4 py-2 rounded-button gradient-primary text-white flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-small font-semibold">Join Chat</span>
                    </motion.button>
                  </div>

                  <div className="flex items-start space-x-4">
                    {thread.image ? (
                      <img
                        src={thread.image}
                        alt={thread.title}
                        className="w-16 h-16 rounded-button object-cover"
                      />
                    ) : (
                      <div className="text-5xl">{thread.icon}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h1 className={`text-page-title font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        {thread.title}
                      </h1>
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar
                          src={thread.author.avatar}
                          alt={thread.author.username}
                          size="sm"
                          userId={thread.author.id}
                        />
                        <span className={`text-small ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {thread.author.username}
                        </span>
                        <span className={`text-small ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                          · {formatTimeAgo(thread.createdAt)}
                        </span>
                      </div>
                      <p className={`text-body mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        {thread.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {thread.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1 text-small rounded-chip ${theme === 'dark'
                              ? 'bg-white/5 text-gray-400'
                              : 'bg-gray-100 text-gray-700'
                              }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <ReactionBar reactions={thread.reactions} />
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  <h2 className={`text-section-title font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    Comments ({thread.comments.length})
                  </h2>
                  {thread.comments.length === 0 ? (
                    <p className={`text-body text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
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

                {/* Reply input */}
                <div className={`p-6 border-t transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
                  }`}>
                  <form
                    onSubmit={handleSubmitReply}
                    className="flex items-end space-x-3"
                  >
                    <Avatar
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      size="sm"
                    />
                    <div className="flex-1">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Add a comment..."
                        rows={1}
                        className={`w-full px-4 py-3 rounded-button border focus:outline-none focus:ring-2 focus:ring-primary-mid resize-none max-h-[120px] ${theme === 'dark'
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                          : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'
                          }`}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement
                          target.style.height = 'auto'
                          target.style.height = `${Math.min(target.scrollHeight, 120)}px`
                        }}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="p-3 rounded-button gradient-primary text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Send comment"
                      disabled={!replyText.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  )
}

