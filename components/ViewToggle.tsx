'use client'

import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import { motion } from 'framer-motion'
import { useWeavStore } from '@/store/useWeavStore'
import { soundManager } from '@/lib/audio'

export function ViewToggle() {
  const { viewMode, setViewMode, theme } = useWeavStore()
  const sphereLottieRef = useRef<any>(null)
  const bookLottieRef = useRef<any>(null)
  const [sphereAnimationData, setSphereAnimationData] = useState<any>(null)
  const [bookAnimationData, setBookAnimationData] = useState<any>(null)

  useEffect(() => {
    // Load sphere icon animation
    fetch('/sphere-icon.json')
      .then((res) => res.json())
      .then((data) => setSphereAnimationData(data))
      .catch(console.error)

    // Load book icon animation
    fetch('/book-icon.json')
      .then((res) => res.json())
      .then((data) => setBookAnimationData(data))
      .catch(console.error)
  }, [])

  const handleSphereClick = () => {
    if (viewMode !== 'sphere') {
      soundManager.playSFX('click')
      setViewMode('sphere')
    }
  }

  const handleBookClick = () => {
    if (viewMode !== 'list') {
      soundManager.playSFX('click')
      setViewMode('list')
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Sphere Icon Button */}
      <motion.button
        onClick={handleSphereClick}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${viewMode === 'sphere'
          ? theme === 'dark'
            ? 'bg-primary-mid/20 border-2 border-primary-mid'
            : 'bg-primary-mid/10 border-2 border-primary-mid'
          : theme === 'dark'
            ? 'bg-white/5 border border-white/10 hover:bg-white/10'
            : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
          }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Sphere View"
        title="Sphere View"
      >
        {sphereAnimationData && (
          <Lottie
            lottieRef={sphereLottieRef}
            animationData={sphereAnimationData}
            loop={viewMode === 'sphere'}
            autoplay={viewMode === 'sphere'}
            style={{ width: 24, height: 24 }}
          />
        )}
      </motion.button>

      {/* Book Icon Button */}
      <motion.button
        onClick={handleBookClick}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${viewMode === 'list'
          ? theme === 'dark'
            ? 'bg-primary-mid/20 border-2 border-primary-mid'
            : 'bg-primary-mid/10 border-2 border-primary-mid'
          : theme === 'dark'
            ? 'bg-white/5 border border-white/10 hover:bg-white/10'
            : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
          }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="List View"
        title="List View"
      >
        {bookAnimationData && (
          <Lottie
            lottieRef={bookLottieRef}
            animationData={bookAnimationData}
            loop={viewMode === 'list'}
            autoplay={viewMode === 'list'}
            style={{ width: 24, height: 24 }}
          />
        )}
      </motion.button>
    </div>
  )
}

