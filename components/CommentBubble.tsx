'use client'

import { Avatar } from './Avatar'
import { ReactionBar } from './ReactionBar'
import { Comment } from '@/data/sampleThreads'
import { formatTimeAgo } from '@/lib/utils'
import { useWeavStore } from '@/store/useWeavStore'

interface CommentBubbleProps {
  comment: Comment
  onReaction?: (emoji: string) => void
}

export function CommentBubble({ comment, onReaction }: CommentBubbleProps) {
  const { theme } = useWeavStore()
  
  return (
    <div className="flex space-x-3 p-4 rounded-lg gradient-border">
      <Avatar
        src={comment.author.avatar}
        alt={comment.author.username}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className={`text-sm font-semibold transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {comment.author.username}
          </span>
          <span className={`text-xs transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {formatTimeAgo(comment.timestamp)}
          </span>
        </div>
        <p className={`text-sm mb-2 transition-colors duration-300 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {comment.content}
        </p>
        <ReactionBar reactions={comment.reactions} onReaction={onReaction} />
      </div>
    </div>
  )
}

