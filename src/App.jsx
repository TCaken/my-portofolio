import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { ExperimentsPage } from '@/pages/ExperimentsPage'
import { CPFTaxCalculatorPage } from '@/pages/experiments/CPFTaxCalculatorPage'
import { IDTaxCalculatorPage } from '@/pages/experiments/IDTaxCalculatorPage'
import { ProjectileCalculatorPage } from '@/pages/experiments/ProjectileCalculatorPage'
import { ScaleOfInternetPage } from '@/pages/experiments/ScaleOfInternetPage'
import { ThreePlaygroundPage } from '@/pages/experiments/ThreePlaygroundPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experiments" element={<ExperimentsPage />} />
        <Route path="/experiments/cpf-tax-calculator" element={<CPFTaxCalculatorPage />} />
        <Route path="/experiments/indonesia-tax-calculator" element={<IDTaxCalculatorPage />} />
        <Route path="/experiments/projectile-calculator" element={<ProjectileCalculatorPage />} />
        <Route path="/experiments/scale-of-internet" element={<ScaleOfInternetPage />} />
        <Route path="/experiments/three-playground" element={<ThreePlaygroundPage />} />
      </Routes>
    </Layout>
  )
}
