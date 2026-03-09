import { useState, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'

const SHAPES = [
  { id: 'box', label: 'Box' },
  { id: 'sphere', label: 'Sphere' },
  { id: 'torus', label: 'Torus' },
  { id: 'cone', label: 'Cone' },
  { id: 'icosahedron', label: 'Icosahedron' },
]

function Shape({ type }) {
  switch (type) {
    case 'sphere':
      return <sphereGeometry args={[1, 32, 32]} />
    case 'torus':
      return <torusGeometry args={[0.8, 0.3, 16, 48]} />
    case 'cone':
      return <coneGeometry args={[0.9, 1.8, 32]} />
    case 'icosahedron':
      return <icosahedronGeometry args={[1, 0]} />
    default:
      return <boxGeometry args={[1.2, 1.2, 1.2]} />
  }
}

function RotatingMesh({ shape, wireframe, color }) {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4
  })
  const c = color || '#6b8cff'
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <Shape type={shape} />
      <meshStandardMaterial
        wireframe={wireframe}
        color={c}
        metalness={wireframe ? 0 : 0.3}
        roughness={wireframe ? 1 : 0.6}
      />
    </mesh>
  )
}

function Scene({ shape, wireframe, color }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-4, 4, -2]} intensity={0.4} color="#88aaff" />
      <Grid
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#333"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#444"
        fadeDistance={20}
        fadeStrength={1}
        infiniteGrid
      />
      <group position={[0, 1, 0]}>
        <RotatingMesh shape={shape} wireframe={wireframe} color={color} />
      </group>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI - 0.1}
      />
      <Environment preset="city" />
    </>
  )
}

export function ThreePlaygroundPage() {
  const [shape, setShape] = useState('box')
  const [wireframe, setWireframe] = useState(false)
  const [color, setColor] = useState('#6b8cff')

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-white/10">
        <Link
          to="/experiments"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Experiments
        </Link>
        <h1 className="text-sm font-medium text-white/90">Three.js Playground</h1>
      </div>

      <div className="flex-1 min-h-0 pt-12">
        <Canvas
          shadows
          camera={{ position: [4, 3, 6], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense
            fallback={
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="#333" wireframe />
              </mesh>
            }
          >
            <Scene shape={shape} wireframe={wireframe} color={color} />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center gap-3 rounded-lg bg-slate-900/90 border border-white/10 px-4 py-3 backdrop-blur">
        <span className="text-xs text-white/60 uppercase tracking-wider">Shape</span>
        <div className="flex flex-wrap gap-2">
          {SHAPES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setShape(id)}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                shape === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
            className="rounded border-white/30"
          />
          Wireframe
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-12 cursor-pointer rounded border border-white/20 bg-transparent"
          />
        </div>
      </div>
    </div>
  )
}
