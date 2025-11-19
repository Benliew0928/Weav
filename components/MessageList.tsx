'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ScrollToBottomButton } from './ScrollToBottomButton'
import { ChatMessage } from '@/data/sampleChatMessages'
import { User } from '@/data/sampleThreads'
import { useWeavStore } from '@/store/useWeavStore'

interface MessageListProps {
  messages: ChatMessage[]
  typingUsers: User[]
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function MessageList({ messages, typingUsers, messagesEndRef }: MessageListProps) {
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { currentUser } = useWeavStore()

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const atBottom = distanceFromBottom < 100

    setIsAtBottom(atBottom)
    setShowScrollButton(!atBottom && scrollTop > 200)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', checkScrollPosition)
    return () => container.removeEventListener('scroll', checkScrollPosition)
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom on new messages if user is at bottom
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex-1 overflow-hidden relative">
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto px-4 md:px-6 py-6 space-y-4"
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isOwnMessage = message.author.id === currentUser.id
            const showAvatar = !isOwnMessage && (
              index === 0 || messages[index - 1].author.id !== message.author.id
            )

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                showAvatar={showAvatar}
                index={index}
              />
            )
          })}
        </AnimatePresence>

        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}

        <div ref={messagesEndRef} />
      </div>

      <ScrollToBottomButton
        visible={showScrollButton}
        onClick={scrollToBottom}
      />
    </div>
  )
}

