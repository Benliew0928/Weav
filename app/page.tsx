'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WeavRing } from '@/components/WeavRing'
import { ThreadListView } from '@/components/ThreadListView'
import { ViewTransition } from '@/components/ViewTransition'
import { FloatingFAB } from '@/components/FloatingFAB'
import { CreateThreadModal } from '@/components/CreateThreadModal'
import { ThreadDetailPanel } from '@/components/ThreadDetailPanel'
import { DebugOverlay } from '@/components/DebugOverlay'
import { ResetZoomButton } from '@/components/ResetZoomButton'
import { SphereControls } from '@/components/SphereControls'
import { useWeavStore } from '@/store/useWeavStore'
import { isWebGLSupported } from '@/lib/perf'

export default function HomePage() {
  const {
    threads,
    isWeavRingVisible,
    isThreadDetailOpen,
    selectNode,
    setWeavRingVisible,
    setUse2DFallback,
    showDebugOverlay,
    setShowDebugOverlay,
    isFocusLocked,
    transitionPhase,
    theme,
    viewMode,
  } = useWeavStore()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isWebGLSupported()) {
      setUse2DFallback(true)
    }

    // Keyboard navigation and shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Debug overlay toggle (Ctrl+D / Cmd+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        setShowDebugOverlay(!showDebugOverlay)
        return
      }

      // Keyboard navigation for sphere rotation
      const { rotateRing, setVerticalRotation, verticalRotation } = useWeavStore.getState()
      const step = (12 * Math.PI) / 180 // 12 degrees in radians

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        rotateRing(-step)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        rotateRing(step)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setVerticalRotation(Math.max(-Math.PI / 2, verticalRotation - step))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setVerticalRotation(Math.min(Math.PI / 2, verticalRotation + step))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setUse2DFallback, showDebugOverlay, setShowDebugOverlay])

  const handleNodeSelect = (threadId: string, position: { x: number; y: number; z: number }) => {
    // Don't hide ring immediately - let animation handle it
    selectNode(threadId)
  }

  if (!mounted) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full h-full transition-colors duration-300 overflow-hidden"
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#0a0a0f',
        height: '100%',
        width: '100%',
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait">
        {viewMode === 'sphere' ? (
          <motion.div
            key="sphere"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 overflow-hidden m-0 p-0"
            style={{
              width: '100%',
              height: '100%',
              margin: 0,
              padding: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }}
          >
            <AnimatePresence mode="wait">
              {isWeavRingVisible && (
                <motion.div
                  key="weavring"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isFocusLocked ? 0.6 : 1,
                    filter: isFocusLocked ? 'blur(2px)' : 'blur(0px)',
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 240,
                    damping: 28,
                  }}
                  className="absolute inset-0 m-0 p-0"
                  style={{
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }}
                >
                  <WeavRing threads={threads} onNodeSelect={handleNodeSelect} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Focus lock dimming overlay - only when panel is not expanded */}
            <AnimatePresence>
              {isFocusLocked && transitionPhase !== 'idle' && transitionPhase !== 'expanded' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/30 z-30 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <ResetZoomButton />
            <SphereControls />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <ThreadListView />
          </motion.div>
        )}
      </AnimatePresence>

      <ViewTransition />
      <FloatingFAB />
      <CreateThreadModal />
      <ThreadDetailPanel />
      <DebugOverlay />
    </div>
  )
}
