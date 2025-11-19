/**
 * Toroidal ring generator for Weav Garden Ring
 * Generates positions along a toroidal ring with subtle depth variation
 */

export interface RingPoint {
  x: number
  y: number
  z: number
  theta: number
  phi: number
}

/**
 * Generate N positions along a toroidal ring
 * @param n Number of points to generate
 * @param ringRadius Base radius of the ring (R)
 * @param nodeRadiusOffset Small offset for depth variation (r)
 * @returns Array of 3D points
 */
export function generateRingPoints(
  n: number,
  ringRadius: number = 5,
  nodeRadiusOffset: number = 0.3
): RingPoint[] {
  const points: RingPoint[] = []

  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2 // Angle around the ring
    // Small random phi for depth variation (subtle vertical variation)
    const phi = (Math.random() - 0.5) * 0.4 // Small angle variation

    // Toroidal ring parametric equations
    const x = (ringRadius + nodeRadiusOffset * Math.cos(phi)) * Math.cos(theta)
    const y = nodeRadiusOffset * Math.sin(phi) * 0.16 // Subtle vertical variation
    const z = (ringRadius + nodeRadiusOffset * Math.cos(phi)) * Math.sin(theta)

    points.push({
      x,
      y,
      z,
      theta,
      phi,
    })
  }

  return points
}

/**
 * Calculate optimal ring radius based on viewport dimensions
 * @param width Viewport width
 * @param height Viewport height
 * @returns Ring radius in world units
 */
export function calculateRingRadius(width: number, height: number): number {
  return Math.min(width, height) * 0.36
}

/**
 * Calculate camera Z position to fit ring with margin
 * @param ringRadius Ring radius
 * @param fov Camera field of view in degrees
 * @param margin Margin in pixels (default 24px = 1.5rem)
 * @returns Camera Z position
 */
export function calculateCameraZ(
  ringRadius: number,
  fov: number = 50,
  margin: number = 24
): number {
  const fovRad = (fov * Math.PI) / 180
  const visibleHeight = 2 * ringRadius + margin * 2
  const cameraZ = visibleHeight / (2 * Math.tan(fovRad / 2))
  return cameraZ * 1.2 // Add some extra space
}

