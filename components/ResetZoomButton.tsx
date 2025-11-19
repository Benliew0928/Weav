'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import { useWeavStore } from '@/store/useWeavStore'
import { triggerHaptic } from '@/lib/perf'

export function ResetZoomButton() {
  const { 
    setZoom, 
    defaultCameraZ, 
    cameraZ, 
    isWeavRingVisible, 
    isFocusLocked,
    ringRotation,
    verticalRotation,
    setVerticalRotation,
    rotateRing,
    setAngularVelocity,
    theme,
  } = useWeavStore()
  
  // Only show if zoomed/rotated from default and sphere is visible
  const isZoomed = Math.abs(cameraZ - defaultCameraZ) > 0.5
  const isRotated = Math.abs(ringRotation) > 0.1 || Math.abs(verticalRotation) > 0.1
  const shouldShow = (isZoomed || isRotated) && isWeavRingVisible && !isFocusLocked
  
  const handleReset = () => {
    triggerHaptic([20])
    
    // Reset zoom
    setZoom(defaultCameraZ)
    
    // Reset rotation to front (0, 0)
    // Calculate how much to rotate to get back to 0
    if (Math.abs(ringRotation) > 0.01) {
      rotateRing(-ringRotation)
    }
    if (Math.abs(verticalRotation) > 0.01) {
      setVerticalRotation(0)
    }
    
    // Stop any inertia
    setAngularVelocity(0)
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleReset}
          className={`fixed bottom-24 right-6 z-40 p-3 rounded-button glass border transition-all backdrop-blur-sm shadow-lg hover:shadow-xl ${
            theme === 'dark'
              ? 'border-white/10 hover:border-white/20'
              : 'border-gray-300/50 hover:border-gray-400/70'
          }`}
          aria-label="Reset view to default"
          title="Reset zoom and rotation to default"
        >
          <Maximize2 className={`w-5 h-5 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

