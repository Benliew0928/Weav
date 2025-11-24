'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Check } from 'lucide-react'
import { useWeavStore } from '@/store/useWeavStore'
import { Thread } from '@/data/sampleThreads'
import { triggerHaptic } from '@/lib/perf'
import { createThread, updateThreadImage } from '@/lib/firebase/threads'
import { notifyNewThread } from '@/lib/firebase/notifications'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { uploadThreadImage } from '@/lib/firebase/storage'

const availableTags = [
  'AI',
  'Technology',
  'Design',
  'Philosophy',
  'WebGL',
  'React',
  'UX',
  'Ideas',
  'Future',
  'Systems',
]

export function CreateThreadModal() {
  const { isCreateThreadOpen, setCreateThreadOpen, currentUser, theme, currentUserId } = useWeavStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [icon, setIcon] = useState('💬')
  const [image, setImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    if (!currentUser || !currentUserId) {
      setError('You must be logged in to create a thread')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Create thread first (without image)
      const newThreadData: Omit<Thread, 'id' | 'createdAt'> = {
        title: title.trim(),
        description: description.trim(),
        author: currentUser,
        icon,
        image: undefined, // Will be set after upload
        tags: selectedTags,
        reactions: [],
        comments: [],
        unread: false,
      }

      const threadId = await createThread(newThreadData)

      // Upload image to Firebase Storage if present (after thread is created)
      if (imageFile) {
        try {
          const imageUrl = await uploadThreadImage(imageFile, threadId)
          // Update thread with image URL
          await updateThreadImage(threadId, imageUrl)
        } catch (uploadError: any) {
          console.error('Error uploading image:', uploadError)
          setError('Thread created but failed to upload image. Please try again.')
          setLoading(false)
          return
        }
      }
      triggerHaptic([20, 50, 20])

      // Create notifications for all users (simplified - in production, optimize this)
      try {
        if (db) {
          const usersSnapshot = await getDocs(collection(db, 'users'))
          // Notify all known users (including the creator) so you can see notifications while testing
          const userIds = usersSnapshot.docs.map(doc => doc.id)
          if (userIds.length > 0) {
            await notifyNewThread(
              threadId,
              newThreadData.title,
              currentUser.displayName || currentUser.username,
              userIds
            )
          }
        }
      } catch (notifError) {
        console.error('Error creating notifications:', notifError)
        // Don't fail thread creation if notifications fail
      }

      // Show success animation
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setTitle('')
        setDescription('')
        setSelectedTags([])
        setIcon('💬')
        setImage(null)
        setImagePreview(null)
        setImageFile(null)
        setCreateThreadOpen(false)
        setLoading(false)
      }, 1000)
    } catch (err: any) {
      console.error('Error creating thread:', err)
      setError(err.message || 'Failed to create thread')
      setLoading(false)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }

    // Store the file for upload
    setImageFile(file)

    // Create preview (base64 for preview only)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setImagePreview(base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
    setImageFile(null)
  }

  return (
    <AnimatePresence>
      {isCreateThreadOpen && (
        <Dialog.Root open={isCreateThreadOpen} onOpenChange={setCreateThreadOpen}>
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                className={`fixed inset-0 backdrop-blur-sm z-50 transition-colors ${
                  theme === 'dark' ? 'bg-black/60' : 'bg-black/30'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 28,
                }}
              >
                <div
                  className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-card p-4 sm:p-6 md:p-8 border transition-colors ${
                    theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <Dialog.Title className={`text-lg sm:text-page-title font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Create New Thread
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className={`p-2 rounded-button transition-colors ${
                          theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                        }`}
                        aria-label="Close"
                      >
                        <X className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {error && (
                      <div className={`p-3 rounded-button text-sm ${
                        theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
                      }`}>
                        {error}
                      </div>
                    )}
                    <div>
                    <label className={`block text-small font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Logo (Image or Icon)
                    </label>
                    <div className="space-y-3">
                      {/* Image Upload */}
                      <div>
                        <label className={`block text-xs font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Upload Image (optional)
                        </label>
                        {imagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-20 h-20 rounded-button object-cover border-2 border-primary-mid/50"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                              aria-label="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label className={`inline-block cursor-pointer px-4 py-2 rounded-button border transition-colors ${
                            theme === 'dark'
                              ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                          }`}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <span className="text-small">Choose Image</span>
                          </label>
                        )}
                      </div>
                      
                      {/* Icon Input (shown when no image) */}
                      {!imagePreview && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className={`w-20 px-3 py-2 rounded-button border text-2xl text-center ${
                              theme === 'dark'
                                ? 'bg-white/5 border-white/10 text-white'
                                : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                            maxLength={2}
                            placeholder="💬"
                          />
                          <span className={`text-small ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Or choose an emoji
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-small font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Title <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}> (max 60 chars)</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value.slice(0, 60))}
                      className={`w-full px-4 py-3 rounded-button border text-body focus:outline-none focus:ring-2 focus:ring-primary-mid ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                      placeholder="Enter thread title..."
                      required
                      maxLength={60}
                    />
                    <div className={`text-xs mt-1 text-right ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {title.length}/60
                    </div>
                  </div>

                  <div>
                    <label className={`block text-small font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Description <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}> (max 400 chars)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 400))}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-button border text-body focus:outline-none focus:ring-2 focus:ring-primary-mid resize-none ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                      placeholder="Describe your thread..."
                      maxLength={400}
                    />
                    <div className={`text-xs mt-1 text-right ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {description.length}/400
                    </div>
                  </div>

                  <div>
                    <label className={`block text-small font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-chip text-small font-medium transition-colors ${
                            selectedTags.includes(tag)
                              ? 'gradient-primary text-white'
                              : theme === 'dark'
                                ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t transition-colors ${
                    theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
                  }`}>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className={`px-4 sm:px-6 py-2.5 sm:py-2 rounded-button transition-colors text-sm sm:text-base ${
                          theme === 'dark'
                            ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <motion.button
                      type="submit"
                      className="px-4 sm:px-6 py-2.5 sm:py-2 rounded-button gradient-primary text-white font-medium text-sm sm:text-base shadow-lg hover:opacity-90 transition-opacity relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: title.trim() && !loading ? 1.02 : 1 }}
                      whileTap={{ scale: title.trim() && !loading ? 0.98 : 1 }}
                      disabled={!title.trim() || loading}
                    >
                      {showSuccess ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center space-x-2"
                        >
                          <Check className="w-5 h-5" />
                          <span>Posted!</span>
                        </motion.div>
                      ) : loading ? (
                        'Creating...'
                      ) : (
                        'Post Thread'
                      )}
                    </motion.button>
                  </div>
                </form>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  )
}
