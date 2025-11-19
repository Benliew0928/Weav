/**
 * Fibonacci sphere generator for immersive 3D sphere layout
 * Generates evenly distributed points on a sphere surface
 */

export interface SpherePoint {
  x: number
  y: number
  z: number
  theta: number
  phi: number
}

/**
 * Generate N points evenly distributed on a sphere using Fibonacci sphere algorithm
 * This ensures even distribution for any number of points
 * @param n Number of points to generate
 * @param radius Radius of the sphere
 * @returns Array of 3D points
 */
export function generateFibonacciSphere(n: number, radius: number = 5): SpherePoint[] {
  const points: SpherePoint[] = []
  if (n === 0) return points
  
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // Golden angle in radians
  const nMinusOne = n > 1 ? n - 1 : 1

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / nMinusOne) * 2 // y goes from 1 to -1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y)) // radius at y, ensure non-negative
    const theta = goldenAngle * i // golden angle increment

    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY

    points.push({
      x: x * radius,
      y: y * radius,
      z: z * radius,
      theta,
      phi: Math.acos(Math.max(-1, Math.min(1, y / radius))), // Clamp to valid range
    })
  }

  return points
}

/**
 * Calculate optimal sphere radius based on viewport dimensions
 * @param width Viewport width
 * @param height Viewport height
 * @returns Sphere radius in world units
 */
export function calculateSphereRadius(width: number, height: number): number {
  return Math.min(width, height) * 0.25
}

/**
 * Calculate dynamic sphere radius based on number of nodes
 * Uses logarithmic scaling to ensure nodes don't get too compacted or too spread out
 * @param nodeCount Number of nodes to display
 * @param baseRadius Base radius for small node counts (default: 5)
 * @param minRadius Minimum radius (default: 4)
 * @param maxRadius Maximum radius (default: 12)
 * @returns Optimal sphere radius
 */
export function calculateDynamicSphereRadius(
  nodeCount: number,
  baseRadius: number = 5,
  minRadius: number = 4,
  maxRadius: number = 12
): number {
  if (nodeCount <= 0) return baseRadius
  if (nodeCount === 1) return minRadius
  
  // Use logarithmic scaling for smooth growth
  // Formula: radius = baseRadius * (1 + log(nodeCount) * scaleFactor)
  // This ensures:
  // - Small counts (1-10): radius stays close to baseRadius
  // - Medium counts (10-50): gradual increase
  // - Large counts (50+): continues to grow but at a slower rate
  
  const scaleFactor = 0.8 // Controls how fast radius grows with node count
  const logScale = Math.log(nodeCount) / Math.log(10) // Base 10 logarithm
  const dynamicRadius = baseRadius * (1 + logScale * scaleFactor)
  
  // Clamp to min/max bounds
  return Math.max(minRadius, Math.min(maxRadius, dynamicRadius))
}

/**
 * Calculate camera Z position to fit sphere with margin
 * @param sphereRadius Sphere radius
 * @param fov Camera field of view in degrees
 * @param margin Margin in pixels (default 24px = 1.5rem)
 * @returns Camera Z position
 */
export function calculateCameraZ(
  sphereRadius: number,
  fov: number = 50,
  margin: number = 24
): number {
  const fovRad = (fov * Math.PI) / 180
  const visibleHeight = 2 * sphereRadius + margin * 2
  const cameraZ = visibleHeight / (2 * Math.tan(fovRad / 2))
  return cameraZ * 1.3 // Add extra space for immersive feel
}
