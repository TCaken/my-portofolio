/**
 * Parabolic (projectile) motion. Units: metres, seconds, m/s.
 * y positive upward; g positive downward (m/s²).
 */

export const G_DEFAULT = 9.81

/**
 * @param {number} x0 - initial x (m)
 * @param {number} y0 - initial y / height (m)
 * @param {number} v0 - initial speed (m/s)
 * @param {number} deg - angle from horizontal, degrees (0 = right, 90 = up)
 */
export function projectileParams(x0, y0, v0, deg) {
  const rad = (deg * Math.PI) / 180
  const vx0 = v0 * Math.cos(rad)
  const vy0 = v0 * Math.sin(rad)
  return { x0, y0, vx0, vy0, v0, deg }
}

/**
 * Position at time t.
 * @param {number} g - gravity (m/s²), positive downward
 */
export function positionAtTime(x0, y0, vx0, vy0, t, g = G_DEFAULT) {
  const x = x0 + vx0 * t
  const y = y0 + vy0 * t - 0.5 * g * t * t
  return { x, y, t }
}

/**
 * Time when projectile hits y = 0 (ground).
 * @param {number} g - gravity (m/s²)
 */
export function timeToHitGround(y0, vy0, g = G_DEFAULT) {
  if (vy0 >= 0 && y0 <= 0) return 0
  const disc = vy0 * vy0 + 2 * g * y0
  if (disc < 0) return null
  const sqrt = Math.sqrt(disc)
  const t1 = (vy0 + sqrt) / g
  const t2 = (vy0 - sqrt) / g
  const tPos = [t1, t2].filter((t) => t >= 0)
  return tPos.length ? Math.max(...tPos) : null
}

/**
 * Time to max height (when vy = 0).
 */
export function timeToMaxHeight(vy0, g = G_DEFAULT) {
  if (vy0 <= 0) return 0
  return vy0 / g
}

/**
 * Times when projectile is at a given y (quadratic). Returns up to 2 roots in [0, tMax].
 */
export function timeAtY(y0, vy0, yTarget, g = G_DEFAULT, tMax = Infinity) {
  const c = y0 - yTarget
  const disc = vy0 * vy0 - 2 * g * c
  if (disc < 0) return []
  const sqrt = Math.sqrt(disc)
  const t1 = (vy0 + sqrt) / g
  const t2 = (vy0 - sqrt) / g
  return [t1, t2].filter((t) => t >= 0 && t <= tMax).sort((a, b) => a - b)
}

/**
 * Full projectile summary. All functions that need g receive it.
 */
export function computeProjectile(x0, y0, v0, deg, g = G_DEFAULT) {
  const { vx0, vy0 } = projectileParams(x0, y0, v0, deg)
  const tGround = timeToHitGround(y0, vy0, g)
  const tMax = timeToMaxHeight(vy0, g)

  let range = null
  let timeOfFlight = null
  if (tGround != null && tGround >= 0) {
    timeOfFlight = tGround
    const end = positionAtTime(x0, y0, vx0, vy0, tGround, g)
    range = end.x - x0
  }

  const posMax = positionAtTime(x0, y0, vx0, vy0, tMax, g)
  const maxHeight = posMax.y
  const xAtMaxHeight = posMax.x

  function yAtX(xTarget) {
    if (vx0 === 0) return null
    const t = (xTarget - x0) / vx0
    if (t < 0) return null
    if (timeOfFlight != null && t > timeOfFlight) return null
    const p = positionAtTime(x0, y0, vx0, vy0, t, g)
    return p.y
  }

  return {
    x0,
    y0,
    v0,
    deg,
    g,
    vx0,
    vy0,
    range,
    timeOfFlight,
    maxHeight,
    xAtMaxHeight,
    tAtMaxHeight: tMax,
    yAtX,
    positionAtTime: (t) => positionAtTime(x0, y0, vx0, vy0, t, g),
    timeAtY: (yTarget) => timeAtY(y0, vy0, yTarget, g, timeOfFlight ?? undefined),
  }
}

/**
 * Sample points along the trajectory for drawing.
 */
export function sampleTrajectory(x0, y0, vx0, vy0, numPoints = 80, g = G_DEFAULT) {
  const tGround = timeToHitGround(y0, vy0, g)
  const tEnd = tGround != null && tGround > 0 ? tGround : 2 * (vy0 / g) || 2
  const points = []
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * tEnd
    const p = positionAtTime(x0, y0, vx0, vy0, t, g)
    if (tGround != null && t > tGround) break
    points.push(p)
  }
  return points
}
