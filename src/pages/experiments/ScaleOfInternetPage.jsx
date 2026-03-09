import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { scaleLayers } from '@/data/scaleOfInternet'

function formatBytes(n) {
  if (n >= 1e24) return (n / 1e24).toFixed(0) + ' × 10²⁴'
  if (n >= 1e21) return (n / 1e21).toFixed(0) + ' × 10²¹'
  if (n >= 1e18) return (n / 1e18).toFixed(0) + ' × 10¹⁸'
  if (n >= 1e15) return (n / 1e15).toFixed(0) + ' × 10¹⁵'
  if (n >= 1e12) return (n / 1e12).toFixed(0) + ' × 10¹²'
  if (n >= 1e9) return (n / 1e9).toFixed(0) + ' × 10⁹'
  if (n >= 1e6) return (n / 1e6).toFixed(0) + ' × 10⁶'
  if (n >= 1e3) return (n / 1e3).toFixed(0) + ' × 10³'
  return String(n)
}

// Fixed 0/1 sequence for green-screen (no random during render)
const GREEN_GRID_COLS = 24
const GREEN_GRID_ROWS = 14
const greenScreenDigits = Array.from(
  { length: GREEN_GRID_COLS * GREEN_GRID_ROWS },
  (_, i) => ((i * 7 + 13) % 2 === 0 ? '1' : '0')
)

// Green-screen terminal: 0s and 1s so we visualize "memory byte"
function GreenScreenBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden font-mono text-[10px] leading-tight text-[#00ff41]/20 select-none"
      style={{
        background: 'linear-gradient(180deg, #0a1a0a 0%, #051005 50%, #020802 100%)',
        letterSpacing: '0.15em',
      }}
      aria-hidden
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)',
        }}
      />
      {/* Grid of 0 and 1 */}
      <div
        className="absolute inset-0 grid gap-0 pl-4 pt-4"
        style={{ gridTemplateColumns: `repeat(${GREEN_GRID_COLS}, minmax(0, 1fr))` }}
      >
        {greenScreenDigits.map((d, i) => (
          <span key={i} className="opacity-70">
            {d}
          </span>
        ))}
      </div>
      {/* Brighter strip to suggest "active" memory */}
      <div
        className="absolute left-0 right-0 top-1/3 h-24 bg-linear-to-b from-[#00ff41]/10 via-[#00ff41]/5 to-transparent"
        style={{ transform: 'translateY(-50%)' }}
      />
    </div>
  )
}

const themeStyles = {
  greenScreen: {
    section: 'relative bg-[#0a1a0a] text-[#00ff41]',
    title: 'text-[#00ff41] font-mono',
    subtitle: 'text-[#00ff41]/90 font-mono',
    body: 'text-[#00ff41]/95',
    fact: 'text-[#00ff41]/80 italic',
    hint: 'text-[#00ff41]/60',
    depth: 'text-[#00ff41]/70 font-mono',
  },
  typewriter: {
    section: 'relative bg-[#1a1510] text-amber-100',
    title: 'text-amber-200 font-serif',
    subtitle: 'text-amber-300/90 font-mono',
    body: 'text-amber-100/95',
    fact: 'text-amber-200/80 italic',
    hint: 'text-amber-400/60',
    depth: 'text-amber-400/70 font-mono',
  },
  waveform: {
    section: 'relative bg-[#0f0a1a] text-violet-200',
    title: 'text-violet-200',
    subtitle: 'text-violet-300/90 font-mono',
    body: 'text-violet-100/95',
    fact: 'text-violet-200/80 italic',
    hint: 'text-violet-400/60',
    depth: 'text-violet-400/70 font-mono',
  },
  library: {
    section: 'relative bg-[#0c1218] text-sky-100',
    title: 'text-sky-200',
    subtitle: 'text-sky-300/90 font-mono',
    body: 'text-sky-100/95',
    fact: 'text-sky-200/80 italic',
    hint: 'text-sky-400/60',
    depth: 'text-sky-400/70 font-mono',
  },
  server: {
    section: 'relative bg-[#0a0e14] text-slate-200',
    title: 'text-slate-100',
    subtitle: 'text-slate-300/90 font-mono',
    body: 'text-slate-200/95',
    fact: 'text-slate-300/80 italic',
    hint: 'text-slate-500/60',
    depth: 'text-slate-500/70 font-mono',
  },
  globe: {
    section: 'relative bg-[#071018] text-cyan-100',
    title: 'text-cyan-200',
    subtitle: 'text-cyan-300/90 font-mono',
    body: 'text-cyan-100/95',
    fact: 'text-cyan-200/80 italic',
    hint: 'text-cyan-400/60',
    depth: 'text-cyan-400/70 font-mono',
  },
  speech: {
    section: 'relative bg-[#14101a] text-fuchsia-100',
    title: 'text-fuchsia-200',
    subtitle: 'text-fuchsia-300/90 font-mono',
    body: 'text-fuchsia-100/95',
    fact: 'text-fuchsia-200/80 italic',
    hint: 'text-fuchsia-400/60',
    depth: 'text-fuchsia-400/70 font-mono',
  },
  sand: {
    section: 'relative bg-[#1c1408] text-amber-100',
    title: 'text-amber-200',
    subtitle: 'text-amber-300 font-mono',
    body: 'text-amber-100',
    fact: 'text-amber-200/90 italic',
    hint: 'text-amber-500/80',
    depth: 'text-amber-400/90 font-mono',
  },
  cosmic: {
    section: 'relative bg-[#0a0a12] text-indigo-100',
    title: 'text-indigo-200',
    subtitle: 'text-indigo-300 font-mono',
    body: 'text-indigo-100',
    fact: 'text-indigo-200/90 italic',
    hint: 'text-indigo-400/80',
    depth: 'text-indigo-400/90 font-mono',
  },
}

function SectionContent({ layer, index, themeKey }) {
  const t = themeStyles[themeKey] || themeStyles.greenScreen
  return (
    <div className="mx-auto max-w-2xl px-6">
      <p className={`mb-2 text-sm uppercase tracking-widest ${t.depth}`}>
        Depth {index + 1} of {scaleLayers.length}
      </p>
      <h2 className={`mb-2 text-4xl font-bold md:text-5xl ${t.title}`}>{layer.name}</h2>
      <p className={`mb-4 text-lg ${t.subtitle}`}>
        {layer.suffix} · {formatBytes(layer.bytes)} bytes
      </p>
      <p className={`mb-2 leading-relaxed ${t.body}`}>{layer.description}</p>
      <p className={t.fact}>{layer.fact}</p>
    </div>
  )
}

const WHEEL_THRESHOLD = 60
const TRANSITION_MS = 500
/** One scroll = one page: cooldown longer than a typical scroll gesture */
const WHEEL_COOLDOWN_MS = 850

// Deterministic particle positions (no random in render)
const PARTICLE_COUNT = 48
const particleData = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: (i * 13 + 7) % 100,
  top: (i * 17 + 11) % 100,
  size: 4 + (i % 5),
  delay: (i % 8) * 0.04,
  hue: (i * 47) % 360,
}))

function TransitionParticles({ active, direction }) {
  if (!active) return null
  const rise = direction === 'up'
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden
    >
      {particleData.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: `hsla(${p.hue}, 70%, 70%, 0.7)`,
            animation: rise ? 'scale-particle-rise 0.7s ease-out forwards' : 'scale-particle-fall 0.7s ease-out forwards',
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export function ScaleOfInternetPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [particleDirection, setParticleDirection] = useState('up')
  const wheelAccum = useRef(0)
  const transitionLock = useRef(false)

  const goNext = () => {
    if (transitionLock.current) return
    transitionLock.current = true
    setParticleDirection('up')
    setIsTransitioning(true)
    setCurrentIndex((i) => Math.min(i + 1, scaleLayers.length - 1))
    setTimeout(() => {
      setIsTransitioning(false)
      transitionLock.current = false
    }, WHEEL_COOLDOWN_MS)
  }
  const goPrev = () => {
    if (transitionLock.current) return
    transitionLock.current = true
    setParticleDirection('down')
    setIsTransitioning(true)
    setCurrentIndex((i) => Math.max(i - 1, 0))
    setTimeout(() => {
      setIsTransitioning(false)
      transitionLock.current = false
    }, WHEEL_COOLDOWN_MS)
  }

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      if (transitionLock.current) return
      wheelAccum.current += e.deltaY
      if (wheelAccum.current >= WHEEL_THRESHOLD) {
        wheelAccum.current = 0
        goNext()
      } else if (wheelAccum.current <= -WHEEL_THRESHOLD) {
        wheelAccum.current = 0
        goPrev()
      }
    }
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      }
    }
    const el = document.getElementById('scale-page-root')
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div id="scale-page-root" className="fixed inset-0 bg-black overflow-hidden">
      {/* Sliding strip: whole page transitions to next block (Byte → KB → … → YB) */}
      <div className="h-full overflow-hidden relative">
        <div
          className="w-full transition-transform duration-500 ease-in-out"
          style={{
            height: `${scaleLayers.length * 100}vh`,
            transform: `translateY(-${currentIndex * 100}vh)`,
          }}
        >
          {scaleLayers.map((layer, index) => {
            const themeKey = layer.visual || 'greenScreen'
            const isByte = layer.id === 'byte'
            return (
              <section
                key={layer.id}
                className={`w-full flex flex-col justify-center ${themeStyles[themeKey]?.section || ''}`}
                style={{ height: '100vh' }}
              >
                {isByte && <GreenScreenBackground />}
                <div className="relative z-10 pt-14 pb-20 px-4">
                  <SectionContent layer={layer} index={index} themeKey={themeKey} />
                </div>
                {index < scaleLayers.length - 1 && (
                  <p className={`absolute bottom-6 left-0 right-0 text-center text-xs ${themeStyles[themeKey]?.hint || 'text-white/50'}`}>
                    ↓ Scroll or ↓ / Space for next
                  </p>
                )}
                {index === scaleLayers.length - 1 && (
                  <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-white/50">
                    You've reached the scale of a Yottabyte. No API used — all content is static.
                  </p>
                )}
              </section>
            )
          })}
        </div>
      </div>

      {/* Particle overlay during slide transition */}
      <TransitionParticles active={isTransitioning} direction={particleDirection} />

      {/* Minimal overlay header: doesn't take layout space, grid stays visible */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-black/40 border-b border-white/5">
        <Link
          to="/experiments"
          className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70 font-mono tabular-nums">
            {currentIndex + 1} / {scaleLayers.length}
          </span>
          <div className="flex gap-0.5 justify-end" aria-hidden>
            {scaleLayers.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-1 w-1 rounded-full shrink-0 transition-all duration-300 ${
                  i === currentIndex ? 'bg-white scale-150' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to ${scaleLayers[i].name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
