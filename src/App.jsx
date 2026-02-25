import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { ExperimentsPage } from '@/pages/ExperimentsPage'
import { CPFTaxCalculatorPage } from '@/pages/experiments/CPFTaxCalculatorPage'
import { IDTaxCalculatorPage } from '@/pages/experiments/IDTaxCalculatorPage'
import { ProjectileCalculatorPage } from '@/pages/experiments/ProjectileCalculatorPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experiments" element={<ExperimentsPage />} />
        <Route path="/experiments/cpf-tax-calculator" element={<CPFTaxCalculatorPage />} />
        <Route path="/experiments/indonesia-tax-calculator" element={<IDTaxCalculatorPage />} />
        <Route path="/experiments/projectile-calculator" element={<ProjectileCalculatorPage />} />
      </Routes>
    </Layout>
  )
}
