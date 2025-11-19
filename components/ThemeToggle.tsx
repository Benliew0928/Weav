'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { useWeavStore } from '@/store/useWeavStore'
import { triggerHaptic } from '@/lib/perf'

export function ThemeToggle() {
  const { theme, toggleTheme } = useWeavStore()
  const lottieRef = useRef<any>(null)
  const [animationData, setAnimationData] = useState<any>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const isInitialized = useRef(false)
  const isHandlingToggle = useRef(false)

  // Load animation data
  useEffect(() => {
    fetch('/theme-toggle-animation.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
  }, [])

  // Set initial frame based on theme (only on mount or when animation data loads)
  useEffect(() => {
    if (lottieRef.current && animationData && !isInitialized.current && !isAnimating) {
      // Animation: 0 = sun, 90 = moon (reversed from what we thought)
      const targetFrame = theme === 'dark' ? 90 : 0
      lottieRef.current.goToAndStop(targetFrame, true)
      isInitialized.current = true
    }
  }, [animationData, theme, isAnimating])

  // Ensure correct frame after animation completes (only when not animating and theme changes externally)
  useEffect(() => {
    if (lottieRef.current && animationData && isInitialized.current && !isAnimating && !isHandlingToggle.current) {
      const targetFrame = theme === 'dark' ? 90 : 0
      // Only update if not already at the correct frame (with some tolerance)
      const currentFrame = lottieRef.current.currentFrame || 0
      if (Math.abs(currentFrame - targetFrame) > 5) {
        lottieRef.current.goToAndStop(targetFrame, true)
      }
    }
  }, [theme, animationData, isAnimating])

  const handleToggle = () => {
    triggerHaptic([20])
    
    if (!lottieRef.current || isAnimating || !animationData) return
    
    setIsAnimating(true)
    isHandlingToggle.current = true
    
    // Get current theme BEFORE toggle
    const currentTheme = theme
    
    // Calculate the NEW theme (after toggle)
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    
    // Animation structure: 
    // Frame 0 = sun (light mode)
    // Frame 90 = moon (dark mode)
    // Frame 180 = sun (light mode) - loops back
    
    // Determine animation frames based on the TRANSITION we want:
    // Dark → Light: animate from 90 (moon) to 0 (sun) - REVERSE
    // Light → Dark: animate from 0 (sun) to 90 (moon) - forward
    
    let startFrame: number
    let endFrame: number
    let playReverse = false
    const finalFrame = newTheme === 'dark' ? 90 : 0 // Final frame matches new theme
    
    if (currentTheme === 'dark') {
      // Switching FROM dark TO light: moon → sun
      // Play in REVERSE: from 90 (moon) back to 0 (sun)
      startFrame = 90  // Start at moon
      endFrame = 0     // End at sun (reverse direction)
      playReverse = true
    } else {
      // Switching FROM light TO dark: sun → moon
      startFrame = 0   // Start at sun
      endFrame = 90    // End at moon
      playReverse = false
    }
    
    // Calculate animation duration from animation data
    const frameCount = Math.abs(endFrame - startFrame)
    const fps = animationData?.fr || 60 // Frame rate is 60 fps
    const duration = (frameCount / fps) * 1000 // Convert to milliseconds
    
    // Cleanup function to set final frame
    const setFinalFrame = () => {
      if (lottieRef.current) {
        lottieRef.current.stop()
        // Ensure we're at the correct final frame
        lottieRef.current.goToAndStop(finalFrame, true)
        setIsAnimating(false)
        // Allow useEffect to run again after a delay
        setTimeout(() => {
          isHandlingToggle.current = false
        }, 200)
      }
    }
    
    // Stop any current animation
    lottieRef.current.stop()
    
    // Reset to start frame first
    lottieRef.current.goToAndStop(startFrame, true)
    
    // Add complete event listener
    const handleComplete = () => {
      setFinalFrame()
      // Remove the listener after use
      if (lottieRef.current && lottieRef.current.removeEventListener) {
        lottieRef.current.removeEventListener('complete', handleComplete)
      }
    }
    
    // Add event listener for when animation completes
    if (lottieRef.current.addEventListener) {
      lottieRef.current.addEventListener('complete', handleComplete)
    }
    
    // Play the animation segment (reverse if needed)
    if (playReverse) {
      // Play in reverse: from startFrame to endFrame (which is lower)
      lottieRef.current.playSegments([startFrame, endFrame], true)
    } else {
      // Play forward: from startFrame to endFrame
      lottieRef.current.playSegments([startFrame, endFrame], true)
    }
    
    // Toggle theme immediately
    toggleTheme()
    
    // Fallback timeout in case event listener doesn't fire
    const timeoutId = setTimeout(() => {
      setFinalFrame()
      if (lottieRef.current && lottieRef.current.removeEventListener) {
        lottieRef.current.removeEventListener('complete', handleComplete)
      }
    }, duration + 200)
    
    // Store timeout ID to clean up if component unmounts
    return () => {
      clearTimeout(timeoutId)
      if (lottieRef.current && lottieRef.current.removeEventListener) {
        lottieRef.current.removeEventListener('complete', handleComplete)
      }
    }
  }

  if (!animationData) return null

  return (
    <motion.button
      onClick={handleToggle}
      className={`w-14 h-8 rounded-full glass border transition-all backdrop-blur-sm shadow-lg hover:shadow-xl overflow-hidden flex-shrink-0 ${
        theme === 'dark' ? 'border-white/10 hover:border-white/20' : 'border-gray-200/50 hover:border-gray-300/70'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        autoplay={false}
        style={{ width: '56px', height: '32px' }}
      />
    </motion.button>
  )
}


