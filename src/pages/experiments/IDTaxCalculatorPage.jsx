import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { computeIDTax } from '@/lib/id-tax'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const formatIDR = (n) =>
  typeof n === 'number' && !Number.isNaN(n)
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(n)
    : '–'

export function IDTaxCalculatorPage() {
  const [monthlySalary, setMonthlySalary] = useState('')
  const [annualBonus, setAnnualBonus] = useState('')
  const [annualOther, setAnnualOther] = useState('')
  const [married, setMarried] = useState(false)
  const [dependents, setDependents] = useState(0)

  const salaryNum = parseFloat(monthlySalary) || 0
  const bonusNum = parseFloat(annualBonus) || 0
  const otherNum = parseFloat(annualOther) || 0
  const hasInput = salaryNum > 0 || bonusNum > 0 || otherNum > 0

  const result = hasInput
    ? computeIDTax({
        monthlySalary: salaryNum,
        annualBonus: bonusNum,
        annualOther: otherNum,
        married,
        dependents: Math.min(3, Math.max(0, parseInt(dependents, 10) || 0)),
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
          Indonesia Tax Calculator (PPh 21)
        </h1>
        <p className="text-white/80">
          Estimate income tax (Pajak Penghasilan) from salary and other income. Uses <strong>progressive rates</strong> and <strong>PTKP</strong>. For illustration only — refer to{' '}
          <a href="https://www.pajak.go.id" target="_blank" rel="noopener noreferrer" className="text-white underline">DJP</a> for official figures.
        </p>
      </header>

      <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">What is PTKP?</CardTitle>
          <p className="text-sm text-white/60">Penghasilan Tidak Kena Pajak = non-taxable income</p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/85">
          <p>
            <strong>PTKP</strong> is an amount of income that the tax office (DJP) does <strong>not</strong> tax. Think of it as a “free allowance” — only the part of your income <em>above</em> your PTKP is subject to tax.
          </p>
          <p>
            <strong>How it works:</strong> Your total income (salary + bonus + other) minus your PTKP = <strong>PKP</strong> (Penghasilan Kena Pajak = taxable income). Tax is calculated only on PKP. So a higher PTKP means less tax.
          </p>
          <p>
            <strong>Your PTKP depends on your situation:</strong>
          </p>
          <ul className="list-inside list-disc space-y-1 text-white/80">
            <li><strong>Base (everyone):</strong> Rp 54 juta per year.</li>
            <li><strong>Married:</strong> Add Rp 4,5 juta.</li>
            <li><strong>Dependents:</strong> Add Rp 4,5 juta per person (e.g. children or family you support), up to 3 people.</li>
          </ul>
          <p>
            Example: Single, no dependents → PTKP = Rp 54 juta. If your gross income is Rp 80 juta, only Rp 26 juta (80 − 54) is taxed. If you’re married with 1 child → PTKP = 54 + 4,5 + 4,5 = Rp 63 juta, so more of your income is “protected” from tax.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Inputs (IDR)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Monthly salary</span>
              <Input
                type="number"
                min="0"
                step="100000"
                placeholder="e.g. 15000000"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Annual bonus</span>
              <Input
                type="number"
                min="0"
                step="500000"
                placeholder="0"
                value={annualBonus}
                onChange={(e) => setAnnualBonus(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/90">Other income (rent, trade, etc.) / year</span>
              <Input
                type="number"
                min="0"
                step="500000"
                placeholder="0"
                value={annualOther}
                onChange={(e) => setAnnualOther(e.target.value)}
              />
            </label>
            <fieldset className="block">
              <legend className="mb-2 block text-sm font-medium text-white/90">PTKP (non-taxable income)</legend>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={married}
                  onChange={(e) => setMarried(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30 bg-white/5 text-white focus:ring-white/50"
                />
                <span className="text-sm text-white/90">Married (+Rp 4,5 jt)</span>
              </label>
              <label className="mt-2 block">
                <span className="mb-1 block text-xs text-white/70">Dependents (max 3)</span>
                <Input
                  type="number"
                  min="0"
                  max="3"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                />
              </label>
              <p className="mt-1 text-xs text-white/60">
                Base PTKP Rp 54 jt + married + Rp 4,5 jt per dependent
              </p>
            </fieldset>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!result && (
            <p className="text-white/60">Enter at least one value to see the breakdown.</p>
          )}

          {result && (
            <>
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Income & PTKP</CardTitle>
                  <p className="text-sm text-white/60">Gross income minus PTKP = PKP (taxable income)</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">Gross annual income</span>
                    <span className="text-white">{formatIDR(result.income.grossAnnual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Less PTKP</span>
                    <span className="text-white">−{formatIDR(result.income.ptkp)}</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-medium">
                    <span className="text-white">PKP (taxable income)</span>
                    <span className="text-white">{formatIDR(result.income.pkp)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Pajak (progressive)</CardTitle>
                  <p className="text-sm text-white/60">Up to 50 jt @ 5%; 50–250 jt @ 15%; 250–500 jt @ 25%; above 500 jt @ 30%</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {result.tax.brackets.filter((b) => b.amount > 0).map((b, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-white/80">
                        {formatIDR(b.from)} – {b.to != null ? formatIDR(b.to) : '∞'} ({b.rate}%)
                      </span>
                      <span className="text-white">{formatIDR(b.amount)}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-medium">
                    <span className="text-white">PPh payable</span>
                    <span className="text-white">{formatIDR(result.tax.taxPayable)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/20 bg-emerald-950/20 backdrop-blur-xl border">
                <CardContent className="pt-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/70">Estimated take-home (after tax)</p>
                      <p className="text-2xl font-bold text-white">{formatIDR(result.summary.totalTakeHome)}</p>
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
