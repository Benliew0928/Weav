/**
 * Performance monitoring and WebGL detection
 */

export interface PerfMetrics {
  fps: number
  averageFps: number
  frameCount: number
  lastFrameTime: number
  samples: number[]
}

let perfMetrics: PerfMetrics = {
  fps: 60,
  averageFps: 60,
  frameCount: 0,
  lastFrameTime: performance.now(),
  samples: [],
}

const MAX_SAMPLES = 120 // 2 seconds at 60fps

/**
 * Check if WebGL is supported
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}

/**
 * Check WebGL2 support
 */
export function isWebGL2Supported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    return !!gl
  } catch {
    return false
  }
}

/**
 * Update FPS counter (call in render loop)
 */
export function updateFPS(): void {
  const now = performance.now()
  const delta = now - perfMetrics.lastFrameTime

  if (delta > 0) {
    const fps = 1000 / delta
    perfMetrics.fps = fps
    perfMetrics.frameCount++

    // Add to samples
    perfMetrics.samples.push(fps)
    if (perfMetrics.samples.length > MAX_SAMPLES) {
      perfMetrics.samples.shift()
    }

    // Calculate average
    if (perfMetrics.samples.length > 0) {
      const sum = perfMetrics.samples.reduce((a, b) => a + b, 0)
      perfMetrics.averageFps = sum / perfMetrics.samples.length
    }
  }

  perfMetrics.lastFrameTime = now
}

/**
 * Get current FPS
 */
export function getFPS(): number {
  return perfMetrics.fps
}

/**
 * Get average FPS over last 2 seconds
 */
export function getAverageFPS(): number {
  return perfMetrics.averageFps
}

/**
 * Reset FPS counter
 */
export function resetFPS(): void {
  perfMetrics = {
    fps: 60,
    averageFps: 60,
    frameCount: 0,
    lastFrameTime: performance.now(),
    samples: [],
  }
}

/**
 * Check if performance is acceptable (>= 40 FPS average)
 */
export function isPerformanceAcceptable(): boolean {
  return getAverageFPS() >= 40
}

/**
 * Get all performance metrics
 */
export function getPerfMetrics(): PerfMetrics {
  return { ...perfMetrics }
}

/**
 * Trigger haptic feedback (if supported)
 */
export function triggerHaptic(pattern: number[] = [20]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

