'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeavStore } from '@/store/useWeavStore'
import { Thread } from '@/data/sampleThreads'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { MessageComposer } from './MessageComposer'
import { getChatMessages, getActiveMembers, getTypingUsers, ChatMessage } from '@/data/sampleChatMessages'

interface ChatRoomViewProps {
  thread: Thread
  onClose: () => void
}

export function ChatRoomView({ thread, onClose }: ChatRoomViewProps) {
  const { theme } = useWeavStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [activeMembers, setActiveMembers] = useState(0)
  const [typingUsers, setTypingUsers] = useState(getTypingUsers(thread.id))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load chat messages
    const chatMessages = getChatMessages(thread.id)
    setMessages(chatMessages)
    setActiveMembers(getActiveMembers(thread.id))

    // Simulate typing indicators
    const typingInterval = setInterval(() => {
      setTypingUsers(getTypingUsers(thread.id))
    }, 3000)

    return () => clearInterval(typingInterval)
  }, [thread.id])

  const handleSendMessage = (content: string) => {
    const { currentUser } = useWeavStore.getState()
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: currentUser,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    
    // Auto-scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30, backdropFilter: 'blur(0px)' }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`fixed inset-0 z-[60] flex flex-col transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]'
          : 'bg-gradient-to-br from-white via-gray-50 to-white'
      }`}
      style={{
        backdropFilter: 'none',
      }}
    >
        {/* Background blur effect - only when chat is open */}
        <motion.div 
          className={`absolute inset-0 backdrop-blur-xl transition-colors duration-300 ${
            theme === 'dark' ? 'bg-black/20' : 'bg-white/40'
          }`}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
        />

        {/* Chat Room Content */}
        <div className="relative z-10 flex flex-col h-full">
          <ChatHeader
            thread={thread}
            activeMembers={activeMembers}
            onBack={onClose}
          />

          <MessageList
            messages={messages}
            typingUsers={typingUsers}
            messagesEndRef={messagesEndRef}
          />

          <MessageComposer onSend={handleSendMessage} />
        </div>
      </motion.div>
  )
}

