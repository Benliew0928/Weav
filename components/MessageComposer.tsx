'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Paperclip, X, Image as ImageIcon, File as FileIcon, Square } from 'lucide-react'
import { triggerHaptic } from '@/lib/perf'
import { useWeavStore } from '@/store/useWeavStore'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'

interface MessageComposerProps {
  onSend: (message: string, attachment?: File) => void
  onSendVoice?: (audioBlob: Blob, duration: number) => void
  disabled?: boolean
  onTypingStart?: () => void
  onTypingStop?: () => void
}

export function MessageComposer({
  onSend,
  onSendVoice,
  disabled = false,
  onTypingStart,
  onTypingStop
}: MessageComposerProps) {
  const { theme } = useWeavStore()
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [attachment, setAttachment] = useState<File | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isRecording, recordingTime, audioBlob, startRecording, stopRecording, cancelRecording } = useVoiceRecorder()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setMessage(newValue)

    // Trigger typing indicator
    if (newValue.trim() && onTypingStart) {
      onTypingStart()
    } else if (!newValue.trim() && onTypingStop) {
      onTypingStop()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0])
    }
  }

  const handleRemoveAttachment = () => {
    setAttachment(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !attachment) || disabled) return

    onSend(message.trim(), attachment || undefined)
    setMessage('')
    setAttachment(null)
    setIsFocused(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Stop typing indicator when sending
    if (onTypingStop) {
      onTypingStop()
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    triggerHaptic([20])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleMicClick = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      try {
        await startRecording()
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to start recording')
      }
    }
  }

  // Track the last sent audio blob to prevent duplicate sends
  const lastSentBlobRef = useRef<Blob | null>(null)

  // Send voice message when recording stops
  useEffect(() => {
    if (audioBlob && !isRecording && onSendVoice && audioBlob !== lastSentBlobRef.current) {
      lastSentBlobRef.current = audioBlob
      onSendVoice(audioBlob, recordingTime)
    }
  }, [audioBlob, isRecording, onSendVoice, recordingTime])

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
      className={`sticky bottom-0 z-20 glass backdrop-blur-xl transition-colors duration-300 ${theme === 'dark' ? 'border-t border-white/10' : 'border-t border-gray-200/50'
        }`}
    >
      {/* Attachment Preview */}
      <AnimatePresence>
        {attachment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`px-4 pt-4 flex items-center gap-3`}
          >
            <div className={`relative group rounded-xl overflow-hidden border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'
              }`}>
              {attachment.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(attachment)}
                  alt="Attachment preview"
                  className="h-16 w-16 object-cover"
                />
              ) : (
                <div className={`h-16 w-16 flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                  }`}>
                  <FileIcon className="w-8 h-8 opacity-50" />
                </div>
              )}
              <button
                onClick={handleRemoveAttachment}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {attachment.name}
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {(attachment.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="px-4 md:px-6 py-4">
        <div className="flex items-end gap-3">
          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={`p-3 rounded-full transition-colors ${theme === 'dark'
              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "Sending..." : "Type a message..."}
              rows={1}
              disabled={disabled}
              className={`w-full px-4 py-3 rounded-2xl glass text-body focus:outline-none focus:ring-2 focus:ring-primary-mid resize-none max-h-[120px] transition-all ${theme === 'dark'
                ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                : 'bg-gray-100/80 border border-gray-200/50 text-gray-900 placeholder-gray-500'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                boxShadow: isFocused
                  ? '0 4px 20px rgba(127, 127, 255, 0.2)'
                  : '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>

          {/* Send/Mic Button */}
          {isRecording ? (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                {formatRecordingTime(recordingTime)}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={cancelRecording}
                className="p-3 rounded-full bg-gray-500 text-white shadow-lg"
              >
                <X className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleMicClick}
                className="p-3 rounded-full bg-red-500 text-white shadow-lg animate-pulse"
              >
                <Square className="w-5 h-5" fill="currentColor" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type={message.trim() || attachment ? "submit" : "button"}
              onClick={message.trim() || attachment ? undefined : handleMicClick}
              disabled={disabled && !(message.trim() || attachment)}
              className={`p-3 rounded-full gradient-primary text-white shadow-lg shadow-primary-mid/30 ${disabled && !(message.trim() || attachment) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-primary-mid/50'
                }`}
            >
              {message.trim() || attachment ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  )
}
