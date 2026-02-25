import { useState, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  computeProjectile,
  sampleTrajectory,
  projectileParams,
  G_DEFAULT,
} from '@/lib/projectile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const GRID_STEP = 5
const CANNON_BARREL_M = 2
const X0_FIXED = 0

function ProjectileView({ y0, v0, deg, g, onDragY, width = 640, height = 400 }) {
  const x0N = X0_FIXED
  const y0N = Number(y0) || 0
  const v0N = Number(v0) || 0
  const degN = Number(deg) || 0
  const gN = Number(g) || G_DEFAULT

  const svgRef = useRef(null)
  const layoutRef = useRef({ scale: 1, padX: 0, padY: 0, height: 400 })

  const result = useMemo(
    () => computeProjectile(x0N, y0N, v0N, degN, gN),
    [x0N, y0N, v0N, degN, gN]
  )
  const { vx0, vy0 } = projectileParams(x0N, y0N, v0N, degN)
  const points = useMemo(
    () => sampleTrajectory(x0N, y0N, vx0, vy0, 120, gN),
    [x0N, y0N, vx0, vy0, gN]
  )

  const rangeX = Math.max(40, result.range != null ? result.x0 + result.range + 5 : 60)
  const rangeY = Math.max(30, result.maxHeight != null ? Math.max(result.maxHeight, result.y0) + 5 : 35)
  const range = Math.max(rangeX, rangeY)
  const scale = Math.min(width, height) / range
  const padX = (width - range * scale) / 2
  const padY = (height - range * scale) / 2

  layoutRef.current = { scale, padX, padY, height }

  const toPx = (xm, ym) => ({
    x: padX + xm * scale,
    y: height - padY - ym * scale,
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toPx(p.x, p.y).x} ${toPx(p.x, p.y).y}`)
    .join(' ')

  const angleRad = (degN * Math.PI) / 180
  const cannonPx = toPx(x0N, y0N)
  const muzzleEnd = toPx(
    x0N + CANNON_BARREL_M * Math.cos(angleRad),
    y0N + CANNON_BARREL_M * Math.sin(angleRad)
  )
  const cannonR = Math.max(4, scale * 0.8)

  const handleCannonMouseDown = useCallback(
    (e) => {
      e.preventDefault()
      const svg = svgRef.current
      if (!svg || typeof onDragY !== 'function') return
      const pt = svg.createSVGPoint()
      const move = (ev) => {
        pt.x = ev.clientX
        pt.y = ev.clientY
        const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse())
        const { scale: s, padY: py, height: h } = layoutRef.current
        const yMetres = (h - py - svgPt.y) / s
        onDragY(Math.max(0, yMetres))
      }
      const up = () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
      }
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', up)
    },
    [onDragY]
  )

  const gridLines = []
  for (let v = 0; v <= range; v += GRID_STEP) {
    const px = toPx(v, 0)
    gridLines.push(
      <line
        key={`v${v}`}
        x1={px.x}
        y1={0}
        x2={px.x}
        y2={height}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1"
      />
    )
  }
  for (let h = 0; h <= range; h += GRID_STEP) {
    const py = toPx(0, h)
    gridLines.push(
      <line
        key={`h${h}`}
        x1={0}
        y1={py.y}
        x2={width}
        y2={py.y}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1"
      />
    )
  }

  const maxHeightPx = result.maxHeight != null ? toPx(result.xAtMaxHeight, result.maxHeight) : null
  const landingPx = result.range != null ? toPx(result.x0 + result.range, 0) : null

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-hidden rounded-xl border border-white/20 bg-slate-900/80"
      aria-label="Projectile trajectory"
    >
      <defs>
        <linearGradient id="trajGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke="url(#trajGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g>{gridLines}</g>
      <line
        x1={padX}
        y1={height - padY}
        x2={width - padX}
        y2={height - padY}
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        strokeDasharray="4 2"
      />
      {maxHeightPx && (
        <g>
          <circle
            cx={maxHeightPx.x}
            cy={maxHeightPx.y}
            r="6"
            fill="rgba(251, 191, 36, 0.9)"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1"
          />
          <text
            x={maxHeightPx.x}
            y={maxHeightPx.y - 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.95)"
            fontSize="11"
            fontWeight="600"
          >
            Max height
          </text>
          <text
            x={maxHeightPx.x}
            y={maxHeightPx.y - 2}
            textAnchor="middle"
            fill="rgba(255,255,255,0.75)"
            fontSize="10"
          >
            x={result.xAtMaxHeight.toFixed(1)} y={result.maxHeight.toFixed(1)} t={result.tAtMaxHeight.toFixed(1)}s
          </text>
        </g>
      )}
      {landingPx && (
        <g>
          <circle
            cx={landingPx.x}
            cy={landingPx.y}
            r="6"
            fill="rgba(239, 68, 68, 0.9)"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1"
          />
          <text
            x={landingPx.x}
            y={landingPx.y - 14}
            textAnchor="middle"
            fill="rgba(255,255,255,0.95)"
            fontSize="11"
            fontWeight="600"
          >
            Landing
          </text>
          <text
            x={landingPx.x}
            y={landingPx.y - 4}
            textAnchor="middle"
            fill="rgba(255,255,255,0.75)"
            fontSize="10"
          >
            x={(result.x0 + result.range).toFixed(1)} t={result.timeOfFlight.toFixed(1)}s
          </text>
        </g>
      )}
      <g
        onMouseDown={handleCannonMouseDown}
        style={{ cursor: onDragY ? 'grab' : 'default' }}
        aria-label="Drag cannon to set initial height"
      >
        <circle
          cx={cannonPx.x}
          cy={cannonPx.y}
          r={cannonR}
          fill="rgba(100,100,100,0.9)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
        <line
          x1={cannonPx.x}
          y1={cannonPx.y}
          x2={muzzleEnd.x}
          y2={muzzleEnd.y}
          stroke="rgba(80,80,80,0.95)"
          strokeWidth={Math.max(6, cannonR * 1.2)}
          strokeLinecap="round"
        />
        <line
          x1={cannonPx.x}
          y1={cannonPx.y}
          x2={muzzleEnd.x}
          y2={muzzleEnd.y}
          stroke="rgba(200,200,200,0.8)"
          strokeWidth={Math.max(3, cannonR * 0.6)}
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export function ProjectileCalculatorPage() {
  const [y0, setY0] = useState('2')
  const [v0, setV0] = useState('20')
  const [deg, setDeg] = useState('45')
  const [g, setG] = useState(String(G_DEFAULT))
  const [queryX, setQueryX] = useState('')
  const [queryY, setQueryY] = useState('')
  const [queryT, setQueryT] = useState('')

  const x0Num = X0_FIXED
  const y0Num = parseFloat(y0) || 0
  const v0Num = parseFloat(v0) || 0
  const degNum = parseFloat(deg) || 0
  const gNum = parseFloat(g) || G_DEFAULT

  const result = useMemo(
    () => computeProjectile(x0Num, y0Num, v0Num, degNum, gNum),
    [x0Num, y0Num, v0Num, degNum, gNum]
  )

  const handleDragY = useCallback((yMetres) => {
    setY0(String(Math.max(0, Math.round(yMetres * 10) / 10)))
  }, [])

  const derived = useMemo(() => {
    const qx = parseFloat(queryX)
    const qy = parseFloat(queryY)
    const qt = parseFloat(queryT)
    const hasX = !Number.isNaN(qx) && queryX !== ''
    const hasY = !Number.isNaN(qy) && queryY !== ''
    const hasT = !Number.isNaN(qt) && queryT !== ''

    if (hasT && !hasX && !hasY) {
      const p = result.positionAtTime(qt)
      const inFlight = result.timeOfFlight != null && qt >= 0 && qt <= result.timeOfFlight
      return inFlight ? { x: p.x, y: p.y, t: qt } : null
    }
    if (hasX && !hasY && !hasT) {
      const y = result.yAtX(qx)
      if (y == null) return null
      const t = (qx - result.x0) / result.vx0
      return { x: qx, y, t }
    }
    if (hasY && !hasX && !hasT) {
      const times = result.timeAtY(qy)
      if (times.length === 0) return null
      const t = times[0]
      const p = result.positionAtTime(t)
      return { x: p.x, y: qy, t }
    }
    if (hasX && hasT) {
      const p = result.positionAtTime(qt)
      return Math.abs(p.x - qx) < 0.01 ? { x: qx, y: p.y, t: qt } : null
    }
    if (hasY && hasT) {
      const p = result.positionAtTime(qt)
      return Math.abs(p.y - qy) < 0.01 ? { x: p.x, y: qy, t: qt } : null
    }
    if (hasX && hasY) {
      const t = (qx - result.x0) / result.vx0
      const p = result.positionAtTime(t)
      return Math.abs(p.y - qy) < 0.01 ? { x: qx, y: qy, t } : null
    }
    return null
  }, [queryX, queryY, queryT, result])

  return (
    <>
      <p className="mb-8">
        <Link
          to="/experiments"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Experiments
        </Link>
      </p>

      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          Parabolic (Projectile) Motion Calculator
        </h1>
        <p className="text-white/80">
          Drag the cannon vertically to set initial height. Velocity, angle, and g in the panel. Grid shows max height and landing. Trajectory behind grid.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Cannon (initial)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Initial height y (m)</span>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={y0}
                onChange={(e) => setY0(e.target.value)}
              />
              <p className="mt-1 text-xs text-white/60">Or drag the cannon on the grid</p>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Initial velocity v₀ (m/s)</span>
              <Input
                type="number"
                min="0"
                step="1"
                value={v0}
                onChange={(e) => setV0(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Angle from horizontal (°)</span>
              <Input
                type="number"
                min="0"
                max="90"
                step="5"
                value={deg}
                onChange={(e) => setDeg(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Gravity g (m/s²)</span>
              <Input
                type="number"
                min="0.1"
                step="0.5"
                placeholder="9.81"
                value={g}
                onChange={(e) => setG(e.target.value)}
              />
              <p className="mt-1 text-xs text-white/60">Earth ≈ 9.81; Moon ≈ 1.62</p>
            </label>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <ProjectileView
            y0={y0}
            v0={v0}
            deg={deg}
            g={g}
            onDragY={handleDragY}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/80">Distance (range)</span>
                  <span className="text-white font-mono">
                    {result.range != null ? `${result.range.toFixed(2)} m` : '–'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Initial velocity</span>
                  <span className="text-white font-mono">{v0Num.toFixed(1)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Max height</span>
                  <span className="text-white font-mono">
                    {result.maxHeight != null ? `${result.maxHeight.toFixed(2)} m` : '–'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">At x</span>
                  <span className="text-white font-mono">
                    {result.xAtMaxHeight != null ? `${result.xAtMaxHeight.toFixed(2)} m` : '–'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Time of flight</span>
                  <span className="text-white font-mono">
                    {result.timeOfFlight != null ? `${result.timeOfFlight.toFixed(2)} s` : '–'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">g</span>
                  <span className="text-white font-mono">{gNum.toFixed(2)} m/s²</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Point on trajectory (x, y, t)</CardTitle>
                <p className="text-sm text-white/60">Fill any one; the other two are computed</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-white/70">x (m)</span>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="x"
                      value={queryX}
                      onChange={(e) => {
                        setQueryX(e.target.value)
                        setQueryY('')
                        setQueryT('')
                      }}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-white/70">y (m)</span>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="y"
                      value={queryY}
                      onChange={(e) => {
                        setQueryY(e.target.value)
                        setQueryX('')
                        setQueryT('')
                      }}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-white/70">t (s)</span>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="t"
                      value={queryT}
                      onChange={(e) => {
                        setQueryT(e.target.value)
                        setQueryX('')
                        setQueryY('')
                      }}
                    />
                  </label>
                </div>
                {derived != null && (
                  <div className="space-y-1 rounded-lg bg-white/10 p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">x</span>
                      <span className="text-white font-mono">{derived.x.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">y</span>
                      <span className="text-white font-mono">{derived.y.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">t</span>
                      <span className="text-white font-mono">{derived.t.toFixed(2)} s</span>
                    </div>
                  </div>
                )}
                {((queryX !== '' || queryY !== '' || queryT !== '') && derived === null) && (
                  <p className="text-xs text-white/60">Not on trajectory or invalid.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
