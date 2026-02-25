import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { computeSGCPFAndTax } from '@/lib/sg-cpf-tax'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const formatMoney = (n) =>
  typeof n === 'number' && !Number.isNaN(n)
    ? new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', minimumFractionDigits: 2 }).format(n)
    : '–'

const EMPLOYMENT_TYPE = { WITH_CPF: 'with_cpf', EP_NO_CPF: 'ep_no_cpf' }

export function CPFTaxCalculatorPage() {
  const [employmentType, setEmploymentType] = useState(EMPLOYMENT_TYPE.EP_NO_CPF)
  const [monthlySalary, setMonthlySalary] = useState('')
  const [annualBonus, setAnnualBonus] = useState('')
  const [annualRent, setAnnualRent] = useState('')
  const [annualTradeOther, setAnnualTradeOther] = useState('')

  const salaryNum = parseFloat(monthlySalary) || 0
  const bonusNum = parseFloat(annualBonus) || 0
  const rentNum = parseFloat(annualRent) || 0
  const tradeNum = parseFloat(annualTradeOther) || 0
  const hasInput = salaryNum > 0 || bonusNum > 0 || rentNum > 0 || tradeNum > 0
  const noCPF = employmentType === EMPLOYMENT_TYPE.EP_NO_CPF

  const result = hasInput
    ? computeSGCPFAndTax({
        monthlySalary: salaryNum,
        annualBonus: bonusNum,
        annualRent: rentNum,
        annualTradeOther: tradeNum,
        noCPF,
      })
    : null

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

      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          Singapore CPF &amp; Tax Calculator
        </h1>
        <p className="text-white/80">
          Estimate CPF contributions and income tax (resident) from salary and other income. Based on <strong>2025</strong> rules (OW ceiling $7,400/mth; YA 2025 tax rates). For illustration only — refer to{' '}
          <a href="https://www.cpf.gov.sg" target="_blank" rel="noopener noreferrer" className="text-white underline">CPF</a>
          {' '}and{' '}
          <a href="https://www.iras.gov.sg" target="_blank" rel="noopener noreferrer" className="text-white underline">IRAS</a> for official figures.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <fieldset className="block">
              <legend className="mb-2 block text-sm font-medium text-white/90">Employment type</legend>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="employmentType"
                    checked={employmentType === EMPLOYMENT_TYPE.EP_NO_CPF}
                    onChange={() => setEmploymentType(EMPLOYMENT_TYPE.EP_NO_CPF)}
                    className="h-4 w-4 border-white/30 bg-white/5 text-white focus:ring-white/50"
                  />
                  <span className="text-sm text-white/90">EP holder — tax only (no CPF)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="employmentType"
                    checked={employmentType === EMPLOYMENT_TYPE.WITH_CPF}
                    onChange={() => setEmploymentType(EMPLOYMENT_TYPE.WITH_CPF)}
                    className="h-4 w-4 border-white/30 bg-white/5 text-white focus:ring-white/50"
                  />
                  <span className="text-sm text-white/90">Singaporean / PR — with CPF</span>
                </label>
              </div>
            </fieldset>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Monthly basic salary (SGD)</span>
              <Input
                type="number"
                min="0"
                step="100"
                placeholder="e.g. 5000"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Annual bonus (SGD)</span>
              <Input
                type="number"
                min="0"
                step="500"
                placeholder="0"
                value={annualBonus}
                onChange={(e) => setAnnualBonus(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Other income: Rent (SGD/year)</span>
              <Input
                type="number"
                min="0"
                step="500"
                placeholder="0"
                value={annualRent}
                onChange={(e) => setAnnualRent(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Other income: Trade / other (SGD/year)</span>
              <Input
                type="number"
                min="0"
                step="500"
                placeholder="0"
                value={annualTradeOther}
                onChange={(e) => setAnnualTradeOther(e.target.value)}
              />
            </label>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!result && (
            <p className="text-white/60">Enter at least one value to see the breakdown.</p>
          )}

          {result && (
            <>
              {!result.noCPF && (
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white">CPF breakdown (2025, age 55 & below)</CardTitle>
                    <p className="text-sm text-white/60">OW ceiling $7,400/mth; total wage ceiling $102,000/year</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Monthly (employee)</span>
                      <span className="text-white">{formatMoney(result.cpf.monthly.employee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Monthly (employer)</span>
                      <span className="text-white">{formatMoney(result.cpf.monthly.employer)}</span>
                    </div>
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <div className="flex justify-between">
                        <span className="text-white/80">Annual total (employee)</span>
                        <span className="text-white">{formatMoney(result.cpf.annual.totalEmployee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Annual total (employer)</span>
                        <span className="text-white">{formatMoney(result.cpf.annual.totalEmployer)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">
                    {result.noCPF ? 'Income for tax (EP holder — no CPF)' : 'Income for tax'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">Gross employment</span>
                    <span className="text-white">{formatMoney(result.income.grossEmployment)}</span>
                  </div>
                  {!result.noCPF && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/80">Less CPF (employee)</span>
                        <span className="text-white">−{formatMoney(result.cpf.annual.totalEmployee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Employment after CPF</span>
                        <span className="text-white">{formatMoney(result.income.employmentAfterCPF)}</span>
                      </div>
                    </>
                  )}
                  {result.noCPF && (
                    <div className="flex justify-between">
                      <span className="text-white/80">Employment (taxable)</span>
                      <span className="text-white">{formatMoney(result.income.grossEmployment)}</span>
                    </div>
                  )}
                  {result.income.otherIncome > 0 && (
                    <div className="flex justify-between">
                      <span className="text-white/80">Other income (rent, trade)</span>
                      <span className="text-white">{formatMoney(result.income.otherIncome)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/80">Less Earned Income Relief</span>
                    <span className="text-white">−{formatMoney(result.income.earnedIncomeRelief)}</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-medium">
                    <span className="text-white">Chargeable income</span>
                    <span className="text-white">{formatMoney(result.income.chargeableIncome)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Tax (resident, YA 2025)</CardTitle>
                  <p className="text-sm text-white/60">60% rebate cap $200 applied</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {result.tax.brackets.filter((b) => b.amount > 0).map((b, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-white/80">
                        {formatMoney(b.from)} – {b.to != null ? formatMoney(b.to) : '∞'} ({b.rate}%)
                      </span>
                      <span className="text-white">{formatMoney(b.amount)}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex justify-between border-t border-white/10 pt-3">
                    <span className="text-white/80">Tax before rebate</span>
                    <span className="text-white">{formatMoney(result.tax.taxBeforeRebate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Rebate (60%, cap $200)</span>
                    <span className="text-white">−{formatMoney(result.tax.rebate)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-white">Tax payable</span>
                    <span className="text-white">{formatMoney(result.tax.taxPayable)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/20 bg-emerald-950/20 backdrop-blur-xl border">
                <CardContent className="pt-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/70">
                        {result.noCPF
                          ? 'Estimated take-home (after tax only)'
                          : 'Estimated take-home (after CPF & tax)'}
                      </p>
                      <p className="text-2xl font-bold text-white">{formatMoney(result.summary.totalTakeHome)}</p>
                      <p className="mt-1 text-xs text-white/60">per year</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  )
}
