'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { useWeavStore } from '@/store/useWeavStore'
import { getFPS, getAverageFPS, getPerfMetrics } from '@/lib/perf'

export function DebugOverlay() {
  const { showDebugOverlay, threads, ringRotation, verticalRotation, angularVelocity, cameraZ, defaultCameraZ } = useWeavStore()
  const [fps, setFps] = useState(60)
  const [avgFps, setAvgFps] = useState(60)

  useEffect(() => {
    if (!showDebugOverlay) return

    const interval = setInterval(() => {
      setFps(getFPS())
      setAvgFps(getAverageFPS())
    }, 100)

    return () => clearInterval(interval)
  }, [showDebugOverlay])

  if (!showDebugOverlay) return null

  return (
    <div className="fixed top-20 left-4 glass rounded-card p-4 text-small font-mono z-50 border border-white/10">
      <div className="space-y-1 text-white">
        <div>FPS: {fps.toFixed(1)}</div>
        <div>Avg FPS: {avgFps.toFixed(1)}</div>
        <div>Nodes: {threads.length}</div>
        <div>Rotation: {(ringRotation * (180 / Math.PI)).toFixed(2)}°</div>
        <div>Vertical: {(verticalRotation * (180 / Math.PI)).toFixed(2)}°</div>
        <div>Angular Vel: {angularVelocity.toFixed(4)}</div>
        <div>Camera Z: {cameraZ.toFixed(2)}</div>
        <div>Default Z: {defaultCameraZ.toFixed(2)}</div>
      </div>
    </div>
  )
}

