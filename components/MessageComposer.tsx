'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic } from 'lucide-react'
import { triggerHaptic } from '@/lib/perf'
import { useWeavStore } from '@/store/useWeavStore'

interface MessageComposerProps {
  onSend: (message: string) => void
}

export function MessageComposer({ onSend }: MessageComposerProps) {
  const { theme } = useWeavStore()
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    onSend(message.trim())
    setMessage('')
    setIsFocused(false)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    triggerHaptic([20])
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        paddingBottom: isFocused ? '1.5rem' : '1rem',
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky bottom-0 z-20 glass backdrop-blur-xl transition-colors duration-300 ${
        theme === 'dark' ? 'border-t border-white/10' : 'border-t border-gray-200/50'
      }`}
    >
      <form onSubmit={handleSubmit} className="px-4 md:px-6 py-4">
        <div className="flex items-end gap-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type a message..."
              rows={1}
              className={`w-full px-4 py-3 rounded-2xl glass text-body focus:outline-none focus:ring-2 focus:ring-primary-mid resize-none max-h-[120px] transition-all ${
                theme === 'dark'
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-100/80 border border-gray-200/50 text-gray-900 placeholder-gray-500'
              }`}
              style={{
                boxShadow: isFocused 
                  ? '0 4px 20px rgba(127, 127, 255, 0.2)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>

          {/* Mic Button (when empty) */}
          <AnimatePresence mode="wait">
            {!message.trim() ? (
              <motion.button
                key="mic"
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-2xl glass border transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    : 'bg-gray-100/80 border-gray-200/50 text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Voice message"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                key="send"
                type="submit"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="p-3 rounded-2xl gradient-primary text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  )
}

