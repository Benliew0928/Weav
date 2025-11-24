'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeavStore } from '@/store/useWeavStore'
import { Thread } from '@/data/sampleThreads'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { MessageComposer } from './MessageComposer'
import {
  ChatMessage,
  subscribeToMessages,
  sendMessage as sendFirebaseMessage,
  addReaction,
  editMessage,
  deleteMessage,
  markMessageAsRead,
  markMessagesAsRead
} from '@/lib/firebase/messages'
import {
  subscribeToTypingUsers,
  subscribeToOnlineUsers,
  updateLastSeen,
  setUserOffline,
  UserPresence,
  createTypingDebouncer
} from '@/lib/firebase/presence'
import { uploadChatAttachment } from '@/lib/firebase/storage'
import { User } from '@/data/sampleThreads'

interface ChatRoomViewProps {
  thread: Thread
  onClose: () => void
}

export function ChatRoomView({ thread, onClose }: ChatRoomViewProps) {
  const { theme, currentUser, currentUserId } = useWeavStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [activeMembers, setActiveMembers] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
  const [typingUsers, setTypingUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const typingUnsubscribeRef = useRef<(() => void) | null>(null)
  const onlineUnsubscribeRef = useRef<(() => void) | null>(null)
  const typingDebouncerRef = useRef<ReturnType<typeof createTypingDebouncer> | null>(null)

  useEffect(() => {
    setMessages([])
    setIsLoading(true)
    setError(null)

    const userId = currentUserId || currentUser?.id

    // Update user's last seen when entering chat
    if (userId && currentUser) {
      updateLastSeen(thread.id, userId, currentUser)
    }

    // Initialize typing debouncer
    if (userId && currentUser) {
      typingDebouncerRef.current = createTypingDebouncer(thread.id, userId, currentUser, 1000)
    }

    try {
      // Subscribe to messages
      const unsubscribe = subscribeToMessages(
        thread.id,
        (newMessages) => {
          setMessages(newMessages)
          setIsLoading(false)
          const uniqueAuthors = new Set(newMessages.map(m => m.authorId))
          setActiveMembers(Math.max(uniqueAuthors.size, 1))
        },
        (err) => {
          console.error('Error in message subscription:', err)
          setError('Failed to load messages. Please try again.')
          setIsLoading(false)
        }
      )

      unsubscribeRef.current = unsubscribe

      // Subscribe to typing indicators
      const typingUnsubscribe = subscribeToTypingUsers(
        thread.id,
        (users) => {
          // Filter out current user from typing indicators
          const otherUsers = users.filter(u => u.id !== userId)
          setTypingUsers(otherUsers)
        }
      )

      typingUnsubscribeRef.current = typingUnsubscribe

      // Subscribe to online users
      const onlineUnsubscribe = subscribeToOnlineUsers(
        thread.id,
        (count, users) => {
          setActiveMembers(Math.max(count, 1))
          setOnlineUsers(users)
        }
      )

      onlineUnsubscribeRef.current = onlineUnsubscribe

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current()
        }
        if (typingUnsubscribeRef.current) {
          typingUnsubscribeRef.current()
        }
        if (onlineUnsubscribeRef.current) {
          onlineUnsubscribeRef.current()
        }
        // Cleanup typing debouncer
        if (typingDebouncerRef.current) {
          typingDebouncerRef.current.cleanup()
        }
        // Set user offline when leaving chat
        if (userId) {
          setUserOffline(thread.id, userId)
        }
      }
    } catch (err) {
      console.error('Error setting up message subscription:', err)
      setError('Failed to connect to chat. Please refresh the page.')
      setIsLoading(false)
    }
  }, [thread.id, currentUserId, currentUser])

  // Mark messages as read
  useEffect(() => {
    const userId = currentUserId || currentUser?.id
    if (!userId || messages.length === 0) return

    const unreadMessageIds = messages
      .filter(msg => !msg.readBy?.[userId])
      .map(msg => msg.id)

    if (unreadMessageIds.length > 0) {
      markMessagesAsRead(thread.id, unreadMessageIds, userId)
    }
  }, [messages, currentUserId, currentUser, thread.id])

  const handleSendMessage = async (content: string, attachment?: File) => {
    const userId = currentUserId || currentUser?.id

    if (!userId) {
      console.error('No user ID available:', { currentUserId, currentUser })
      setError('You must be signed in to send messages')
      return
    }

    if (!content.trim() && !attachment) return

    setIsSending(true)
    setError(null)

    try {
      console.log('Sending message:', { threadId: thread.id, userId, content: content.trim(), hasAttachment: !!attachment })

      let mediaUrl = undefined
      let type: 'text' | 'image' | 'file' = 'text'

      if (attachment) {
        mediaUrl = await uploadChatAttachment(attachment, thread.id)
        type = attachment.type.startsWith('image/') ? 'image' : 'file'
      }

      await sendFirebaseMessage(thread.id, userId, content.trim(), type, mediaUrl)

      console.log('Message sent successfully')

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message. Please try again.')
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsSending(false)
    }
  }

  const handleSendVoice = async (audioBlob: Blob, duration: number) => {
    const userId = currentUserId || currentUser?.id

    if (!userId) {
      setError('You must be signed in to send voice messages')
      return
    }

    setIsSending(true)
    setError(null)

    try {
      // Convert blob to file
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' })

      // Upload to storage
      const mediaUrl = await uploadChatAttachment(audioFile, thread.id)

      // Send as audio message
      await sendFirebaseMessage(
        thread.id,
        userId,
        'Voice message',
        'audio',
        mediaUrl,
        { duration }
      )

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      console.error('Error sending voice message:', err)
      setError('Failed to send voice message. Please try again.')
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsSending(false)
    }
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    const userId = currentUserId || currentUser?.id
    if (!userId) return

    try {
      await addReaction(thread.id, messageId, emoji, userId)
    } catch (err) {
      console.error('Error adding reaction:', err)
    }
  }

  const handleEdit = async (messageId: string, newContent: string) => {
    const userId = currentUserId || currentUser?.id
    if (!userId) return

    try {
      await editMessage(thread.id, messageId, newContent, userId)
    } catch (err) {
      console.error('Error editing message:', err)
    }
  }

  const handleDelete = async (messageId: string) => {
    const userId = currentUserId || currentUser?.id
    if (!userId) return

    try {
      await deleteMessage(thread.id, messageId, userId)
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-0 z-[60] flex flex-col transition-colors duration-300 ${theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]'
        : 'bg-gradient-to-br from-white via-gray-50 to-white'
        }`}
      style={{ backdropFilter: 'none' }}
    >
      <motion.div
        className={`absolute inset-0 backdrop-blur-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/40'
          }`}
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader
          thread={thread}
          activeMembers={activeMembers}
          onlineUsers={onlineUsers}
          onBack={onClose}
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`px-4 py-3 text-center text-sm ${theme === 'dark'
                ? 'bg-red-500/20 text-red-300 border-b border-red-500/30'
                : 'bg-red-100 text-red-700 border-b border-red-200'
                }`}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${theme === 'dark' ? 'text-primary-mid' : 'text-primary-dark'
                }`} />
              <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading messages...
              </p>
            </motion.div>
          </div>
        ) : (
          <MessageList
            messages={messages}
            typingUsers={typingUsers}
            messagesEndRef={messagesEndRef}
            onReaction={handleReaction}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <MessageComposer
          onSend={handleSendMessage}
          onSendVoice={handleSendVoice}
          disabled={isSending || isLoading}
          onTypingStart={() => typingDebouncerRef.current?.startTyping()}
          onTypingStop={() => typingDebouncerRef.current?.stopTyping()}
        />
      </div>
    </motion.div>
  )
}
