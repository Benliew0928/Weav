'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ScrollToBottomButton } from './ScrollToBottomButton'
import { ChatMessage } from '@/lib/firebase/messages'
import { User } from '@/data/sampleThreads'
import { useWeavStore } from '@/store/useWeavStore'

interface MessageListProps {
  messages: ChatMessage[]
  typingUsers: User[]
  messagesEndRef: React.RefObject<HTMLDivElement>
  onReaction: (messageId: string, emoji: string) => void
  onEdit: (messageId: string, newContent: string) => void
  onDelete: (messageId: string) => void
}

const MessageListComponent = ({
  messages,
  typingUsers,
  messagesEndRef,
  onReaction,
  onEdit,
  onDelete
}: MessageListProps) => {
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
            const isOwnMessage = currentUser ? message.author.id === currentUser.id : false

            // Determine grouping
            const previousMessage = messages[index - 1]
            const nextMessage = messages[index + 1]

            const isFirstInGroup = !previousMessage || previousMessage.author.id !== message.author.id
            const isLastInGroup = !nextMessage || nextMessage.author.id !== message.author.id
            const isMiddleInGroup = !isFirstInGroup && !isLastInGroup

            const showAvatar = !isOwnMessage && isLastInGroup

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                showAvatar={showAvatar}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
                isMiddleInGroup={isMiddleInGroup}
                index={index}
                onReaction={onReaction}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUserId={currentUser?.id || null}
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

export const MessageList = memo(MessageListComponent)

