'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeavStore } from '@/store/useWeavStore'

export function ViewTransition() {
  const { viewMode, isTransitioning, setIsTransitioning } = useWeavStore()
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    // Load Kinoplay animation
    fetch('/kinoplay-sphere.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (isTransitioning) {
      // Show animation for 2 seconds (allowing full animation to play), then hide
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, setIsTransitioning])

  if (!animationData) return null

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0, rotate: 180 }}
            transition={{ 
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay={true}
              style={{ 
                width: '100%', 
                height: '100%', 
                maxWidth: 'min(90vw, 800px)', 
                maxHeight: 'min(90vh, 800px)',
                filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))'
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

