'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  Loader2,
  Check,
  RefreshCw,
  MapPin,
  Globe,
  Link as LinkIcon,
} from 'lucide-react'
import { useWeavStore } from '@/store/useWeavStore'
import { Avatar } from '@/components/Avatar'

type SaveState = 'idle' | 'saving' | 'saved'

export default function ProfilePage() {
  const {
    currentUser,
    threads,
    theme,
    updateCurrentUser,
  } = useWeavStore()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [formState, setFormState] = useState({
    displayName: currentUser.displayName || '',
    username: currentUser.username || '',
    bio: currentUser.bio || '',
    location: currentUser.location || '',
    website: currentUser.website || '',
  })

  const myThreads = useMemo(
    () => threads.filter((t) => t.author.id === currentUser.id),
    [threads, currentUser.id]
  )

  const totalComments = useMemo(
    () => myThreads.reduce((sum, thread) => sum + thread.comments.length, 0),
    [myThreads]
  )

  const totalReactions = useMemo(
    () =>
      myThreads.reduce(
        (sum, thread) =>
          sum +
          thread.reactions.reduce((acc, reaction) => acc + reaction.count, 0),
        0
      ),
    [myThreads]
  )

  useEffect(() => {
    setFormState({
      displayName: currentUser.displayName || '',
      username: currentUser.username || '',
      bio: currentUser.bio || '',
      location: currentUser.location || '',
      website: currentUser.website || '',
    })
    setAvatarPreview(currentUser.avatar)
  }, [currentUser])

  const handleInputChange = (
    field: keyof typeof formState,
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
    setSaveState('idle')
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result as string)
      setSaveState('idle')
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarRandomize = () => {
    const seed = Math.random().toString(36).substring(2, 10)
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
    setAvatarPreview(url)
    setSaveState('idle')
  }

  const handleReset = () => {
    setFormState({
      displayName: currentUser.displayName || '',
      username: currentUser.username || '',
      bio: currentUser.bio || '',
      location: currentUser.location || '',
      website: currentUser.website || '',
    })
    setAvatarPreview(currentUser.avatar)
    setSaveState('idle')
  }

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault()
    if (saveState === 'saving') return
    setSaveState('saving')

    updateCurrentUser({
      displayName: formState.displayName || undefined,
      username: formState.username || currentUser.username,
      bio: formState.bio || undefined,
      location: formState.location || undefined,
      website: formState.website || undefined,
      avatar: avatarPreview,
    })

    setTimeout(() => {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2500)
    }, 700)
  }

  const cardBase = `rounded-3xl border backdrop-blur-xl transition-colors ${
    theme === 'dark'
      ? 'bg-white/5 border-white/10'
      : 'bg-white/90 border-gray-200/80 shadow-lg'
  }`

  const labelClass = `text-sm font-medium ${
    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  }`

  const inputClass = `mt-2 w-full rounded-2xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-mid ${
    theme === 'dark'
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
  }`

  return (
    <div
      className={`h-full overflow-y-auto transition-colors duration-300 ${
        theme === 'light' ? 'bg-white' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          className={`${cardBase} overflow-hidden relative`}
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                theme === 'dark'
                  ? 'linear-gradient(130deg, rgba(123,97,255,0.35), rgba(58,147,255,0.25))'
                  : 'linear-gradient(130deg, rgba(123,97,255,0.25), rgba(58,147,255,0.15))',
            }}
          />
          <div className="relative z-10 px-6 sm:px-10 py-10 flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={avatarPreview}
                  alt={currentUser.username}
                  size="xl"
                  className="ring-4 ring-primary-mid/40"
                />
                <button
                  onClick={handleAvatarClick}
                  className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary-mid text-white shadow-lg hover:opacity-90 transition"
                  type="button"
                  aria-label="Change avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div>
                <p
                  className={`text-sm uppercase tracking-wide ${
                    theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                  }`}
                >
                  Profile Overview
                </p>
                <h1
                  className={`text-3xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {formState.displayName || 'Your Name'}
                </h1>
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  @{formState.username || 'you'}
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-4 justify-end">
              <div className="text-left">
                <p
                  className={`text-xs uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Threads
                </p>
                <p
                  className={`text-2xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {myThreads.length}
                </p>
              </div>
              <div className="text-left">
                <p
                  className={`text-xs uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Comments
                </p>
                <p
                  className={`text-2xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {totalComments}
                </p>
              </div>
              <div className="text-left">
                <p
                  className={`text-xs uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Reactions
                </p>
                <p
                  className={`text-2xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {totalReactions}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, type: 'spring', stiffness: 220, damping: 26 }}
            className="space-y-6"
          >
            <section className={`${cardBase} p-6 space-y-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Identity
                  </h2>
                  <p
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    How other explorers will meet you.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Display name</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formState.displayName}
                    onChange={(e) =>
                      handleInputChange('displayName', e.target.value)
                    }
                    placeholder="Add your name"
                    maxLength={42}
                  />
                </div>
                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formState.username}
                    onChange={(e) =>
                      handleInputChange('username', e.target.value)
                    }
                    placeholder="Choose an @handle"
                    maxLength={32}
                  />
                </div>
              </div>
            </section>

            <section className={`${cardBase} p-6 space-y-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    About you
                  </h2>
                  <p
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Share a little context for your threads.
                  </p>
                </div>
              </div>
              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  className={`${inputClass} h-32 resize-none`}
                  value={formState.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="What inspires your threads?"
                  maxLength={220}
                />
                <p
                  className={`mt-2 text-xs text-right ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  {formState.bio.length}/220
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={`${labelClass} flex items-center gap-2`}>
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formState.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    placeholder="City, Planet"
                  />
                </div>
                <div>
                  <label className={`${labelClass} flex items-center gap-2`}>
                    <Globe className="w-4 h-4" />
                    Website
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      className={inputClass}
                      value={formState.website}
                      onChange={(e) =>
                        handleInputChange('website', e.target.value)
                      }
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>
            </section>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 26 }}
            className="space-y-6"
          >
            <section className={`${cardBase} p-6 space-y-5`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Avatar
                  </h2>
                  <p
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Upload your own or spawn a new seed.
                  </p>
                </div>
              </div>
              <div
                className={`rounded-2xl border-2 border-dashed p-4 text-center ${
                  theme === 'dark'
                    ? 'border-white/15 bg-white/5'
                    : 'border-gray-200 bg-gray-50/80'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Drag &amp; drop or upload a square image (PNG, JPG, SVG)
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="px-4 py-2 rounded-full border border-primary-mid/40 text-primary-mid font-semibold hover:border-primary-mid transition"
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={handleAvatarRandomize}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                        theme === 'dark'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition`}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Randomize
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className={`${cardBase} p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <h2
                  className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Live preview
                </h2>
                <LinkIcon
                  className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              </div>
              <div
                className={`rounded-2xl p-5 space-y-3 ${
                  theme === 'dark'
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={avatarPreview}
                    alt="Preview avatar"
                    size="md"
                    className="ring-2 ring-primary-mid/20"
                  />
                  <div>
                    <p
                      className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {formState.displayName || 'Your name'}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      @{formState.username || 'you'}
                    </p>
                  </div>
                </div>
                {formState.bio && (
                  <p
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {formState.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  {formState.location && (
                    <span
                      className={`flex items-center gap-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      {formState.location}
                    </span>
                  )}
                  {formState.website && (
                    <span
                      className={`flex items-center gap-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      {formState.website.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
              </div>
            </section>
          </motion.div>

          <div className="lg:col-span-2 flex flex-wrap items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={handleReset}
              className={`px-5 py-3 rounded-full font-semibold transition ${
                theme === 'dark'
                  ? 'bg-white/5 text-white hover:bg-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-full gradient-primary text-white font-semibold flex items-center gap-2"
            >
              {saveState === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
              {saveState === 'saved' && <Check className="w-4 h-4" />}
              {saveState === 'saving'
                ? 'Saving...'
                : saveState === 'saved'
                ? 'Saved'
                : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

