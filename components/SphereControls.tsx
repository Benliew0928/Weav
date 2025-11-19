'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useWeavStore } from '@/store/useWeavStore'
import { clamp } from '@/lib/utils'

export function SphereControls() {
  const {
    cameraZ,
    defaultCameraZ,
    setZoom,
    rotateRing,
    isWeavRingVisible,
    isFocusLocked,
    theme,
  } = useWeavStore()

  const zoomInIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const zoomOutIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const rotateLeftIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const rotateRightIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (zoomInIntervalRef.current) clearInterval(zoomInIntervalRef.current)
      if (zoomOutIntervalRef.current) clearInterval(zoomOutIntervalRef.current)
      if (rotateLeftIntervalRef.current) clearInterval(rotateLeftIntervalRef.current)
      if (rotateRightIntervalRef.current) clearInterval(rotateRightIntervalRef.current)
    }
  }, [])

  const startZoomIn = (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior (text selection, context menu)
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Immediate action
    const currentZ = cameraZ || defaultCameraZ || 15
    const minZoom = Math.max(1, defaultCameraZ * 0.1)
    const newZ = clamp(currentZ * 0.95, minZoom, defaultCameraZ * 3.0)
    setZoom(newZ)
    
    // Continuous action
    zoomInIntervalRef.current = setInterval(() => {
      const z = useWeavStore.getState().cameraZ || defaultCameraZ || 15
      const min = Math.max(1, defaultCameraZ * 0.1)
      const nextZ = clamp(z * 0.95, min, defaultCameraZ * 3.0)
      setZoom(nextZ)
    }, 50) // Update every 50ms for smooth continuous action
  }

  const stopZoomIn = () => {
    if (zoomInIntervalRef.current) {
      clearInterval(zoomInIntervalRef.current)
      zoomInIntervalRef.current = null
    }
  }

  const startZoomOut = (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior (text selection, context menu)
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Immediate action
    const currentZ = cameraZ || defaultCameraZ || 15
    const maxZoom = defaultCameraZ * 3.0
    const newZ = clamp(currentZ * 1.05, Math.max(1, defaultCameraZ * 0.1), maxZoom)
    setZoom(newZ)
    
    // Continuous action
    zoomOutIntervalRef.current = setInterval(() => {
      const z = useWeavStore.getState().cameraZ || defaultCameraZ || 15
      const max = defaultCameraZ * 3.0
      const nextZ = clamp(z * 1.05, Math.max(1, defaultCameraZ * 0.1), max)
      setZoom(nextZ)
    }, 50)
  }

  const stopZoomOut = () => {
    if (zoomOutIntervalRef.current) {
      clearInterval(zoomOutIntervalRef.current)
      zoomOutIntervalRef.current = null
    }
  }

  const startRotateLeft = (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior (text selection, context menu)
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Immediate action
    rotateRing(-0.05)
    
    // Continuous action
    rotateLeftIntervalRef.current = setInterval(() => {
      rotateRing(-0.05)
    }, 50)
  }

  const stopRotateLeft = () => {
    if (rotateLeftIntervalRef.current) {
      clearInterval(rotateLeftIntervalRef.current)
      rotateLeftIntervalRef.current = null
    }
  }

  const startRotateRight = (e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior (text selection, context menu)
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Immediate action
    rotateRing(0.05)
    
    // Continuous action
    rotateRightIntervalRef.current = setInterval(() => {
      rotateRing(0.05)
    }, 50)
  }

  const stopRotateRight = () => {
    if (rotateRightIntervalRef.current) {
      clearInterval(rotateRightIntervalRef.current)
      rotateRightIntervalRef.current = null
    }
  }

  if (!isWeavRingVisible || isFocusLocked) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      {/* Zoom Controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`flex flex-col gap-2 glass rounded-card p-2 border transition-colors ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
        }`}
      >
        <motion.button
          onMouseDown={startZoomIn}
          onMouseUp={stopZoomIn}
          onMouseLeave={stopZoomIn}
          onTouchStart={startZoomIn}
          onTouchEnd={stopZoomIn}
          onContextMenu={(e) => e.preventDefault()}
          className={`p-3 rounded-button transition-colors select-none touch-none ${
            theme === 'dark'
              ? 'bg-white/5 hover:bg-white/10 active:bg-white/15 text-white'
              : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900'
          }`}
          style={{ 
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation',
            userSelect: 'none'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </motion.button>
        <motion.button
          onMouseDown={startZoomOut}
          onMouseUp={stopZoomOut}
          onMouseLeave={stopZoomOut}
          onTouchStart={startZoomOut}
          onTouchEnd={stopZoomOut}
          onContextMenu={(e) => e.preventDefault()}
          className={`p-3 rounded-button transition-colors select-none touch-none ${
            theme === 'dark'
              ? 'bg-white/5 hover:bg-white/10 active:bg-white/15 text-white'
              : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900'
          }`}
          style={{ 
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation',
            userSelect: 'none'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Rotation Controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`flex flex-row gap-2 glass rounded-card p-2 border transition-colors ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
        }`}
      >
        <motion.button
          onMouseDown={startRotateLeft}
          onMouseUp={stopRotateLeft}
          onMouseLeave={stopRotateLeft}
          onTouchStart={startRotateLeft}
          onTouchEnd={stopRotateLeft}
          onContextMenu={(e) => e.preventDefault()}
          className={`p-3 rounded-button transition-colors select-none touch-none ${
            theme === 'dark'
              ? 'bg-white/5 hover:bg-white/10 active:bg-white/15 text-white'
              : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900'
          }`}
          style={{ 
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation',
            userSelect: 'none'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Rotate left"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.button
          onMouseDown={startRotateRight}
          onMouseUp={stopRotateRight}
          onMouseLeave={stopRotateRight}
          onTouchStart={startRotateRight}
          onTouchEnd={stopRotateRight}
          onContextMenu={(e) => e.preventDefault()}
          className={`p-3 rounded-button transition-colors select-none touch-none ${
            theme === 'dark'
              ? 'bg-white/5 hover:bg-white/10 active:bg-white/15 text-white'
              : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900'
          }`}
          style={{ 
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation',
            userSelect: 'none'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Rotate right"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  )
}

