import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function generatePalette(seed, count) {
  const base = seed.trim() || 'portfolio'
  let h = 0
  for (let i = 0; i < base.length; i += 1) {
    h = (h * 31 + base.charCodeAt(i)) % 360
  }
  const colors = []
  const step = 360 / count
  for (let i = 0; i < count; i += 1) {
    const hue = (h + step * i) % 360
    const sat = 55 + ((h + i * 17) % 30) // 55–85
    const light = 45 + ((h + i * 13) % 20) // 45–65
    colors.push(`hsl(${hue} ${sat}% ${light}%)`)
  }
  return colors
}

export function ColorPalettePlaygroundPage() {
  const [seed, setSeed] = useState('portfolio vibes')
  const [count, setCount] = useState(5)
  const colors = generatePalette(seed, Math.min(Math.max(count, 3), 8))

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-8">
      <p className="text-sm">
        <Link
          to="/experiments"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Experiments
        </Link>
      </p>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Color Palette Playground
        </h1>
        <p className="max-w-2xl text-white/80">
          Type any words (or leave the default), choose how many colors you want, and get a
          deterministic palette you can use for UI themes, charts, or branding ideas.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Controls</CardTitle>
            <CardDescription>
              Palettes are deterministic: same text, same colors — great for bookmarking later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-white/90">
                Seed text
              </label>
              <Input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Type a mood, project name, or emoji"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-white/90">
                Number of colors
              </label>
              <Input
                type="number"
                min={3}
                max={8}
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 3)}
              />
              <p className="mt-1 text-xs text-white/60">
                Between 3 and 8 colors works best for UI palettes.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-white/20 bg-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white">Palette</CardTitle>
              <CardDescription>
                Click a color to copy its HSL value. Use this section as a quick moodboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {colors.map((c, index) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCopy(c)}
                    className="group flex items-center gap-3 rounded-xl border border-white/20 bg-black/30 p-3 text-left transition hover:border-white/40 hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    aria-label={`Copy ${c}`}
                  >
                    <div
                      className="h-10 w-12 shrink-0 rounded-lg border border-white/20"
                      style={{ background: c }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-mono text-white">
                        {c.replace('hsl', 'HSL')}
                      </p>
                      <p className="text-xs text-white/60">
                        Color {index + 1}
                      </p>
                    </div>
                    <Copy className="h-4 w-4 text-white/40 group-hover:text-white/80" aria-hidden />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed border-white/20 bg-linear-to-r from-sky-500/30 via-indigo-500/30 to-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">
                How I&apos;d use this
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-white/80">
              <p>
                I use this kind of tool when designing dashboards or small side projects, to keep
                colors consistent while still feeling a bit playful.
              </p>
              <p>
                Because it&apos;s deterministic, you can come back later with the same seed and get
                the exact same palette.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-xs text-white/50">
        Tip: try seeds like &quot;space night&quot;, &quot;finance dashboard&quot;, or your own name.
      </div>
    </div>
  )
}

