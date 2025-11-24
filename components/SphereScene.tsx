'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RingNode } from './RingNode'
import { Thread } from '@/data/sampleThreads'
import { generateFibonacciSphere, calculateDynamicSphereRadius } from '@/lib/sphere'
import { useWeavStore } from '@/store/useWeavStore'
import { clamp } from '@/lib/utils'
import { StarfieldBackground } from './StarfieldBackground'

interface SphereSceneProps {
  threads: Thread[]
  onNodeSelect: (threadId: string, position: { x: number; y: number; z: number }) => void
}

export function SphereScene({ threads, onNodeSelect }: SphereSceneProps) {
  const { camera, size, gl, scene } = useThree()
  const {
    ringRotation,
    verticalRotation,
    angularVelocity,
    cameraZ,
    defaultCameraZ,
    setZoom,
    setDefaultCameraZ,
    rotateRing,
    setVerticalRotation,
    setAngularVelocity,
    isFocusLocked,
    selectedThreadId,
    setSelectedNodePosition,
    transitionPhase,
    theme,
  } = useWeavStore()

  const [isDragging, setIsDragging] = useState(false)
  const [lastPointer, setLastPointer] = useState<{ x: number; y: number } | null>(null)
  const [isZooming, setIsZooming] = useState(false)
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0))
  const initialized = useRef(false)
  const isDraggingRef = useRef(false) // Track dragging state for event handlers
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rafIdRef = useRef<number | null>(null) // For requestAnimationFrame
  const touchStartDistance = useRef<number | null>(null) // For pinch zoom
  const lastTouchTime = useRef(0) // Throttle touch events

  // Store state in refs for event handlers to avoid stale closures
  const stateRef = useRef({
    lastPointer: null as { x: number; y: number } | null,
    isDragging: false,
    verticalRotation: 0,
    cameraZ: 10,
    defaultCameraZ: 10,
    rotateRing: (delta: number) => { },
    setVerticalRotation: (rotation: number) => { },
    setAngularVelocity: (velocity: number) => { },
    setZoom: (z: number) => { },
  })

  // Calculate dynamic sphere radius based on node count
  const dynamicRadius = useMemo(() => {
    return calculateDynamicSphereRadius(threads.length)
  }, [threads.length])

  // Initialize camera position based on dynamic radius
  useEffect(() => {
    if (!initialized.current && size.width > 0 && size.height > 0 && threads.length > 0) {
      // Calculate camera Z to fit the dynamic sphere
      const fov = 50
      const fovRad = (fov * Math.PI) / 180
      const margin = 24
      const visibleHeight = 2 * dynamicRadius + margin * 2
      const initialZ = (visibleHeight / (2 * Math.tan(fovRad / 2))) * 1.3

      setDefaultCameraZ(initialZ)
      setZoom(initialZ)
      camera.position.set(0, 0, initialZ)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
      initialized.current = true
    }
  }, [size.width, size.height, threads.length, dynamicRadius, setDefaultCameraZ, setZoom, camera])

  // Generate sphere points with dynamic radius
  const spherePoints = threads.length > 0 ? generateFibonacciSphere(threads.length, dynamicRadius) : []

  // Track if we're clicking on a node
  const clickStartTime = useRef(0)
  const clickStartPos = useRef<{ x: number; y: number } | null>(null)

  // Update state refs when values change
  useEffect(() => {
    stateRef.current = {
      lastPointer,
      isDragging: isDraggingRef.current,
      verticalRotation,
      cameraZ,
      defaultCameraZ,
      rotateRing,
      setVerticalRotation,
      setAngularVelocity,
      setZoom,
    }
  }, [lastPointer, verticalRotation, cameraZ, defaultCameraZ, rotateRing, setVerticalRotation, setAngularVelocity, setZoom])

  // Handle pointer events
  const handlePointerDown = (event: any) => {
    // Don't allow dragging when focus locked
    if (isFocusLocked) return

    // Reset touch distance to prevent accidental zoom
    if (event.pointerType === 'touch') {
      touchStartDistance.current = null
    }

    // Always track pointer down for drag detection
    clickStartTime.current = Date.now()
    clickStartPos.current = { x: event.clientX, y: event.clientY }
    setIsDragging(false)
    isDraggingRef.current = false
    setLastPointer({ x: event.clientX, y: event.clientY })
    setAngularVelocity(0)
  }

  const handlePointerMove = (event: any) => {
    // Don't allow dragging when focus locked
    if (isFocusLocked || transitionPhase !== 'idle') return

    // For touch events, only handle single-finger rotation (pinch zoom is handled separately)
    if (event.pointerType === 'touch') {
      // Check if this is a multi-touch event (should be handled by touch handlers, not pointer)
      if ((event as any).touches && (event as any).touches.length > 1) {
        return // Let touch handlers handle multi-touch
      }
    }

    // Throttle touch events on mobile for better performance
    const now = Date.now()
    if (event.pointerType === 'touch' && now - lastTouchTime.current < 16) {
      return // ~60fps throttling for touch
    }
    lastTouchTime.current = now

    const state = stateRef.current
    if (!state.lastPointer) return

    const deltaX = Math.abs(event.clientX - state.lastPointer.x)
    const deltaY = Math.abs(event.clientY - state.lastPointer.y)
    const totalDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Only start dragging if moved more than 5px (prevents accidental drags when clicking)
    if (!isDraggingRef.current && totalDelta > 5) {
      setIsDragging(true)
      isDraggingRef.current = true
      gl.domElement.style.cursor = 'grabbing'
      gl.domElement.style.userSelect = 'none'
    }

    // Continue dragging even if pointer moves over nodes - use capture phase
    if (isDraggingRef.current) {
      event.stopPropagation() // Prevent nodes from interfering

      // Use requestAnimationFrame for smooth updates
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const moveDeltaX = event.clientX - state.lastPointer!.x
        const moveDeltaY = event.clientY - state.lastPointer!.y

        // Optimized sensitivity for mobile (slightly reduced for smoother feel)
        const sensitivity = event.pointerType === 'touch' ? 0.003 : 0.004
        const verticalSensitivity = event.pointerType === 'touch' ? 0.002 : 0.003

        // Inverted drag: drag left = rotate right, drag right = rotate left
        // drag up = rotate down, drag down = rotate up
        state.rotateRing(-moveDeltaX * sensitivity) // Inverted horizontal
        const currentVertical = state.verticalRotation - moveDeltaY * verticalSensitivity // Inverted vertical
        state.setVerticalRotation(clamp(currentVertical, -Math.PI / 2, Math.PI / 2))

        setLastPointer({ x: event.clientX, y: event.clientY })
      })
    }
  }

  const handlePointerUp = (event: any) => {
    // Cancel any pending animation frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    const state = stateRef.current
    if (isDraggingRef.current && state.lastPointer) {
      const deltaX = event.clientX - state.lastPointer.x
      // Reduced velocity calculation for smoother inertia on mobile
      const velocityMultiplier = event.pointerType === 'touch' ? 0.002 : 0.003
      const velocity = deltaX * velocityMultiplier
      if (Math.abs(velocity) > 0.005) {
        setAngularVelocity(velocity)
      }
    }

    // Keep isDragging true briefly to prevent click events from firing
    const wasDragging = isDraggingRef.current
    isDraggingRef.current = false
    setLastPointer(null)
    clickStartPos.current = null
    touchStartDistance.current = null
    gl.domElement.style.cursor = 'grab'
    gl.domElement.style.userSelect = 'auto'

    // Delay resetting isDragging state to ensure click events are blocked
    if (wasDragging) {
      setTimeout(() => {
        setIsDragging(false)
      }, 100)
    } else {
      setIsDragging(false)
    }
  }

  const handlePointerLeave = (event: any) => {
    // Only end drag if we're not actively dragging
    // This prevents the drag from being interrupted when pointer leaves canvas at extreme angles
    // Check both isDraggingRef and lastPointer to ensure we don't interrupt an active drag
    if (!isDraggingRef.current && !lastPointer) {
      handlePointerUp(event)
    }
    // If we are dragging, just ignore the leave event and let the user release naturally
  }

  const handleWheel = (event: any) => {
    // Don't allow zooming when focus locked
    if (isFocusLocked) return

    // Prevent wheel zoom during touch interactions (mobile trackpad gestures)
    // Only allow wheel zoom for actual mouse wheel events
    if (event.pointerType === 'touch' || (event as any).touches) {
      return // Let touch handlers manage zoom
    }

    event.preventDefault()
    event.stopPropagation()

    // Clear any pending zoom timeout
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current)
    }

    setIsZooming(true)

    const state = stateRef.current
    const currentZ = state.cameraZ || state.defaultCameraZ || 15

    // Calculate zoom delta based on deltaMode for consistent behavior across devices
    let zoomDelta = 0
    if (event.deltaMode === 0) {
      // Pixel mode - most common (mouse wheel) - increased sensitivity
      zoomDelta = event.deltaY * 0.02
    } else if (event.deltaMode === 1) {
      // Line mode - some trackpads - increased sensitivity
      zoomDelta = event.deltaY * 0.4
    } else if (event.deltaMode === 2) {
      // Page mode - rare - increased sensitivity
      zoomDelta = event.deltaY * 3.0
    }

    // Calculate zoom limits based on default camera Z
    // Allow deep zoom into the heart of the sphere for immersive experience
    // Smaller Z = closer to origin = zoomed in (into sphere)
    // Larger Z = farther from origin = zoomed out (away from sphere)
    const minZoom = Math.max(1, state.defaultCameraZ * 0.1) // Minimum Z (10% of default) - allows deep zoom INTO sphere center
    const maxZoom = state.defaultCameraZ * 3.0 // Maximum Z (300% of default) - allows zooming out far
    const newZ = clamp(currentZ + zoomDelta, minZoom, maxZoom)

    // Only update if there's a meaningful change (prevents unnecessary updates)
    if (Math.abs(newZ - currentZ) > 0.01) {
      state.setZoom(newZ)
    }

    // Debounce zoom end - shorter timeout for responsiveness
    zoomTimeoutRef.current = setTimeout(() => {
      setIsZooming(false)
    }, 100)
  }

  // Handle touch events for pinch-to-zoom
  const handleTouchStart = (event: TouchEvent) => {
    // Only handle pinch zoom (2 fingers), ignore single finger
    if (event.touches.length === 2) {
      // Stop any ongoing rotation
      isDraggingRef.current = false
      setIsDragging(false)
      setLastPointer(null)

      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      touchStartDistance.current = distance
    } else if (event.touches.length === 1) {
      // Single finger - ensure zoom is disabled
      touchStartDistance.current = null
    }
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (isFocusLocked || transitionPhase !== 'idle') return

    // Only handle pinch zoom (2 fingers)
    if (event.touches.length === 2 && touchStartDistance.current !== null) {
      event.preventDefault()
      event.stopPropagation()

      // Ensure rotation is stopped during pinch
      isDraggingRef.current = false
      setIsDragging(false)

      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )

      const state = stateRef.current
      const currentZ = state.cameraZ || state.defaultCameraZ || 15
      const scale = currentDistance / touchStartDistance.current
      const zoomDelta = (currentZ * (1 - scale)) * 0.5 // Smooth pinch zoom

      const minZoom = Math.max(1, state.defaultCameraZ * 0.1)
      const maxZoom = state.defaultCameraZ * 3.0
      const newZ = clamp(currentZ + zoomDelta, minZoom, maxZoom)

      if (Math.abs(newZ - currentZ) > 0.01) {
        state.setZoom(newZ)
        setIsZooming(true)
      }

      touchStartDistance.current = currentDistance
    } else if (event.touches.length === 1) {
      // Single finger - ensure no zoom
      touchStartDistance.current = null
    }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    // If we still have 2 touches, update the distance
    if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      touchStartDistance.current = distance
    } else {
      // No more touches or only 1 touch - reset zoom tracking
      touchStartDistance.current = null
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current)
      }
      zoomTimeoutRef.current = setTimeout(() => {
        setIsZooming(false)
      }, 100)
    }
  }

  // Camera movement - optimized for mobile performance
  useFrame(() => {
    if (!initialized.current) return

    // Apply inertia with smoother decay - slow down when focus locked
    if (Math.abs(angularVelocity) > 0.0005) {
      const decayFactor = isFocusLocked ? 0.85 : 0.94 // Slower decay for smoother, longer inertia
      rotateRing(angularVelocity * (isFocusLocked ? 0.3 : 1)) // Slow rotation when locked
      setAngularVelocity(angularVelocity * decayFactor)

      if (isFocusLocked && Math.abs(angularVelocity) < 0.0005) {
        setAngularVelocity(0)
      }
    } else {
      setAngularVelocity(0)
    }

    // Separate zoom and rotation calculations to prevent interference
    // The zoom level (radius) is independent of rotation
    const targetRadius = cameraZ || defaultCameraZ || 15

    // Interpolate the radius (zoom) smoothly
    const currentRadius = Math.sqrt(
      camera.position.x * camera.position.x +
      camera.position.y * camera.position.y +
      camera.position.z * camera.position.z
    )
    const radiusDiff = targetRadius - currentRadius
    const zoomLerp = isZooming ? 0.5 : 0.25 // Faster when actively zooming
    const newRadius = currentRadius + radiusDiff * zoomLerp

    // Calculate camera position based on rotations using the interpolated radius
    // This ensures rotation and zoom are completely independent
    const x = Math.sin(ringRotation) * Math.cos(verticalRotation) * newRadius
    const y = Math.sin(verticalRotation) * newRadius
    const z = Math.cos(ringRotation) * Math.cos(verticalRotation) * newRadius

    // Optimized camera movement - smoother lerp for mobile
    const positionLerp = 0.3 // Increased from 0.25 for smoother movement
    const targetPosition = new THREE.Vector3(x, y, z)
    camera.position.lerp(targetPosition, positionLerp)
    camera.lookAt(cameraTarget.current)
  })

  // Store handlers in refs to avoid stale closures
  const handlersRef = useRef({
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  })

  // Update refs when handlers change
  useEffect(() => {
    handlersRef.current = {
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      handlePointerLeave,
      handleWheel,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    }
  }, [handlePointerDown, handlePointerMove, handlePointerUp, handlePointerLeave, handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd])

  // Attach event listeners
  useEffect(() => {
    const canvas = gl.domElement
    canvas.style.cursor = 'grab'
    canvas.style.touchAction = 'none' // Prevent default touch behaviors

    // Wrapper functions that use refs
    const onPointerDown = (e: any) => handlersRef.current.handlePointerDown(e)
    const onPointerMove = (e: any) => handlersRef.current.handlePointerMove(e)
    const onPointerUp = (e: any) => handlersRef.current.handlePointerUp(e)
    const onPointerLeave = (e: any) => handlersRef.current.handlePointerLeave(e)
    const onWheel = (e: any) => handlersRef.current.handleWheel(e)

    // Use capture phase to catch events before nodes
    canvas.addEventListener('pointerdown', onPointerDown, true)
    canvas.addEventListener('pointermove', onPointerMove, true)
    canvas.addEventListener('pointerup', onPointerUp, true)
    canvas.addEventListener('pointerleave', onPointerLeave, true)
    canvas.addEventListener('pointercancel', onPointerUp, true)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    // Touch events for pinch-to-zoom - use capture phase to handle before pointer events
    const onTouchStart = (e: TouchEvent) => handlersRef.current.handleTouchStart(e)
    const onTouchMove = (e: TouchEvent) => handlersRef.current.handleTouchMove(e)
    const onTouchEnd = (e: TouchEvent) => handlersRef.current.handleTouchEnd(e)

    canvas.addEventListener('touchstart', onTouchStart, { passive: false, capture: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false, capture: true })
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false, capture: true })

    return () => {
      // Cancel any pending animation frames
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }

      canvas.removeEventListener('pointerdown', onPointerDown, true)
      canvas.removeEventListener('pointermove', onPointerMove, true)
      canvas.removeEventListener('pointerup', onPointerUp, true)
      canvas.removeEventListener('pointerleave', onPointerLeave, true)
      canvas.removeEventListener('pointercancel', onPointerUp, true)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('touchstart', onTouchStart, true)
      canvas.removeEventListener('touchmove', onTouchMove, true)
      canvas.removeEventListener('touchend', onTouchEnd, true)
      canvas.removeEventListener('touchcancel', onTouchEnd, true)
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current)
      }
    }
  }, [gl.domElement])

  // Update scene background based on theme
  useEffect(() => {
    if (theme === 'light') {
      scene.background = new THREE.Color(0xf5f5f5)
    } else {
      scene.background = new THREE.Color(0x0a0a0f)
    }
  }, [theme, scene])

  if (threads.length === 0 || spherePoints.length === 0) {
    return null
  }

  return (
    <>
      {/* Immersive starfield background */}
      <StarfieldBackground count={2000} />

      {/* Lighting - adjusted for light mode */}
      <ambientLight intensity={theme === 'light' ? 1.2 : 0.8} />
      <directionalLight position={[10, 10, 5]} intensity={theme === 'light' ? 1.5 : 1.2} />
      <directionalLight position={[-10, -10, -5]} intensity={theme === 'light' ? 0.6 : 0.4} />
      <pointLight position={[0, 0, 0]} intensity={theme === 'light' ? 0.7 : 0.5} distance={20} decay={2} />

      {/* Sphere nodes */}
      {threads.map((thread, index) => {
        const point = spherePoints[index]
        if (!point) return null
        const isSelected = selectedThreadId === thread.id
        const nodePosition = { x: point.x, y: point.y, z: point.z }

        return (
          <RingNode
            key={thread.id}
            thread={thread}
            position={[point.x, point.y, point.z]}
            onSelect={(threadId) => {
              setSelectedNodePosition(nodePosition)
              onNodeSelect(threadId, nodePosition)
            }}
            isSelected={isSelected}
            isFocusLocked={isFocusLocked}
            transitionPhase={transitionPhase}
            isDragging={isDragging}
          />
        )
      })}
    </>
  )
}
