'use client'

import { useState, useRef, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smile, Pencil, Trash2, X, Check, CheckCheck, FileText } from 'lucide-react'
import { ChatMessage } from '@/lib/firebase/messages'
import { Avatar } from './Avatar'
import { formatTimeAgo } from '@/lib/utils'
import { useWeavStore } from '@/store/useWeavStore'
import { ReactionPicker } from './ReactionPicker'
import { AudioPlayer } from './AudioPlayer'

interface MessageBubbleProps {
  message: ChatMessage
  isOwnMessage: boolean
  showAvatar: boolean
  isFirstInGroup: boolean
  isLastInGroup: boolean
  isMiddleInGroup: boolean
  index: number
  onReaction: (messageId: string, emoji: string) => void
  onEdit: (messageId: string, newContent: string) => void
  onDelete: (messageId: string) => void
  currentUserId: string | null
}

const MessageBubbleComponent = ({
  message,
  isOwnMessage,
  showAvatar,
  isFirstInGroup,
  isLastInGroup,
  isMiddleInGroup,
  index,
  onReaction,
  onEdit,
  onDelete,
  currentUserId
}: MessageBubbleProps) => {
  const { theme } = useWeavStore()
  const [showPicker, setShowPicker] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [isEditing])

  const handleReactionClick = (emoji: string) => {
    onReaction(message.id, emoji)
    setShowPicker(false)
  }

  const handleSaveEdit = () => {
    if (editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim())
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditContent(message.content)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  // Calculate border radius based on grouping
  const getBorderRadius = () => {
    const base = '1.25rem'
    const small = '0.25rem'

    if (isOwnMessage) {
      // Own messages (right side)
      if (isFirstInGroup && isLastInGroup) return `${base} ${base} ${small} ${base}` // Single message
      if (isFirstInGroup) return `${base} ${base} ${small} ${base}` // First in group
      if (isLastInGroup) return `${base} ${small} ${base} ${base}` // Last in group
      return `${base} ${small} ${small} ${base}` // Middle in group
    } else {
      // Other messages (left side)
      if (isFirstInGroup && isLastInGroup) return `${base} ${base} ${base} ${small}` // Single message
      if (isFirstInGroup) return `${base} ${base} ${base} ${small}` // First in group
      if (isLastInGroup) return `${small} ${base} ${base} ${base}` // Last in group
      return `${small} ${base} ${base} ${small}` // Middle in group
    }
  }

  // Calculate margin based on grouping
  const getMarginTop = () => {
    if (isFirstInGroup) return 'mt-4'
    return 'mt-0.5'
  }

  if (message.isDeleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} ${getMarginTop()}`}
      >
        {/* Placeholder for alignment if avatar is hidden but needed for spacing */}
        {!isOwnMessage && (
          <div className="flex-shrink-0 w-8">
            {showAvatar && (
              <Avatar src={message.author.avatar} alt={message.author.username} size="sm" />
            )}
          </div>
        )}
        {isOwnMessage && <div className="flex-shrink-0 w-10" />}

        <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-2.5 rounded-2xl border italic text-sm ${theme === 'dark'
              ? 'bg-white/5 border-white/10 text-gray-500'
              : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
            Message deleted
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.02,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex gap-3 group relative ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} ${getMarginTop()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (showPicker) setShowPicker(false)
      }}
    >
      {/* Avatar */}
      {!isOwnMessage && (
        <div className="flex-shrink-0 w-8 flex items-end">
          {showAvatar && (
            <Avatar src={message.author.avatar} alt={message.author.username} size="sm" />
          )}
        </div>
      )}

      {isOwnMessage && <div className="flex-shrink-0 w-10" />}

      {/* Message Content & Actions */}
      <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isOwnMessage && isFirstInGroup && (
          <span className={`text-xs mb-1 px-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
            {message.author.username}
          </span>
        )}

        <div className="relative">
          <motion.div
            className={`px-4 py-2.5 transition-colors duration-300 relative ${isOwnMessage
                ? 'gradient-primary text-white'
                : theme === 'dark'
                  ? 'glass bg-white/5 text-gray-100 border border-white/10'
                  : 'glass bg-gray-100/80 text-gray-900 border border-gray-200/50'
              }`}
            style={{
              borderRadius: getBorderRadius(),
              boxShadow: isOwnMessage
                ? '0 4px 20px rgba(127, 127, 255, 0.3)'
                : theme === 'dark'
                  ? '0 2px 10px rgba(0, 0, 0, 0.2)'
                  : '0 2px 10px rgba(0, 0, 0, 0.1)',
              minWidth: isEditing ? '300px' : 'auto'
            }}
          >
            {/* Image Attachment */}
            {message.type === 'image' && message.mediaUrl && !isEditing && (
              <div className="mb-2 rounded-lg overflow-hidden">
                <img
                  src={message.mediaUrl}
                  alt="Image attachment"
                  className="max-w-full max-h-[300px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.mediaUrl, '_blank')}
                />
              </div>
            )}

            {/* File Attachment */}
            {message.type === 'file' && message.mediaUrl && !isEditing && (
              <a
                href={message.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-3 mb-2 rounded-xl transition-colors ${isOwnMessage
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-gray-200'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm underline">Download Attachment</span>
              </a>
            )}

            {/* Audio Message */}
            {message.type === 'audio' && message.mediaUrl && !isEditing && (
              <div className="py-1">
                <AudioPlayer
                  audioUrl={message.mediaUrl}
                  duration={message.metadata?.duration}
                  isOwnMessage={isOwnMessage}
                />
              </div>
            )}

            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => {
                    setEditContent(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = e.target.scrollHeight + 'px'
                  }}
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-transparent border-none focus:ring-0 p-0 resize-none text-sm ${isOwnMessage ? 'text-white placeholder-white/50' : 'text-current'
                    }`}
                  rows={1}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className={`p-1 rounded-full hover:bg-black/10 transition-colors`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className={`p-1 rounded-full hover:bg-black/10 transition-colors`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              message.type !== 'audio' && <p className="text-body whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </motion.div>

          {/* Action Buttons (Hover) */}
          <AnimatePresence>
            {(isHovered || showPicker) && !isEditing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute top-1/2 -translate-y-1/2 flex gap-1 ${isOwnMessage ? '-left-24' : '-right-24'
                  }`}
              >
                {/* Reaction Button */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowPicker(!showPicker)
                    }}
                    className={`p-1.5 rounded-full transition-colors ${theme === 'dark'
                        ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                      }`}
                    title="Add reaction"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {showPicker && (
                      <ReactionPicker
                        onSelect={handleReactionClick}
                        onClose={() => setShowPicker(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Edit/Delete Buttons (Only for own messages) */}
                {isOwnMessage && message.type !== 'audio' && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`p-1.5 rounded-full transition-colors ${theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                        }`}
                      title="Edit message"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this message?')) {
                          onDelete(message.id)
                        }
                      }}
                      className={`p-1.5 rounded-full transition-colors ${theme === 'dark'
                          ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400'
                          : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                        }`}
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Delete only for audio messages */}
                {isOwnMessage && message.type === 'audio' && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this message?')) {
                        onDelete(message.id)
                      }
                    }}
                    className={`p-1.5 rounded-full transition-colors ${theme === 'dark'
                        ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400'
                        : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                      }`}
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reactions Display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {message.reactions.map((reaction) => {
              const hasReacted = currentUserId ? reaction.userIds.includes(currentUserId) : false
              return (
                <button
                  key={reaction.emoji}
                  onClick={() => onReaction(message.id, reaction.emoji)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border transition-all ${hasReacted
                      ? 'bg-primary-mid/20 border-primary-mid text-primary-light'
                      : theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <span>{reaction.emoji}</span>
                  <span className="opacity-80">{reaction.userIds.length}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Timestamp & Edited Status & Read Receipts */}
        {isLastInGroup && (
          <div className={`flex items-center gap-1 mt-1 px-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <motion.span
              className={`text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {formatTimeAgo(message.timestamp)}
            </motion.span>
            {message.isEdited && (
              <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                (edited)
              </span>
            )}
            {isOwnMessage && (
              <span className={`ml-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {message.readBy && Object.keys(message.readBy).length > 1 ? (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export const MessageBubble = memo(MessageBubbleComponent)
