/**
 * Indonesian income tax (PPh 21 / PPh OP) — for illustration only.
 * Based on UU HPP and progressive brackets. Verify with DJP (pajak.go.id) for official figures.
 * @see https://www.pajak.go.id
 */

// All amounts in IDR per year

/** PTKP 2024–2025: base (single). */
export const PTKP_BASE = 54_000_000
/** Additional PTKP if married. */
export const PTKP_MARRIED = 4_500_000
/** Per dependent (max 3). */
export const PTKP_PER_DEPENDENT = 4_500_000
export const PTKP_MAX_DEPENDENTS = 3

/**
 * Get total PTKP (non-taxable income) in IDR/year.
 * @param {{ married: boolean, dependents: number }} opts
 */
export function getPTKP({ married = false, dependents = 0 } = {}) {
  let ptkp = PTKP_BASE
  if (married) ptkp += PTKP_MARRIED
  ptkp += Math.min(Number(dependents) || 0, PTKP_MAX_DEPENDENTS) * PTKP_PER_DEPENDENT
  return ptkp
}

/**
 * Progressive tax brackets (UU HPP). Chargeable income (PKP) in IDR.
 * [threshold up to, rate]
 */
const TAX_BRACKETS = [
  [50_000_000, 0.05],
  [250_000_000, 0.15],
  [500_000_000, 0.25],
  [Infinity, 0.30],
]

/**
 * Compute income tax from taxable income (PKP). Progressive.
 * @param {number} pkp - Penghasilan Kena Pajak (chargeable income) in IDR/year
 */
export function taxOnPKP(pkp) {
  if (pkp <= 0) return { taxPayable: 0, brackets: [] }
  let remaining = pkp
  let totalTax = 0
  let prevThreshold = 0
  const brackets = []

  for (const [threshold, rate] of TAX_BRACKETS) {
    const band = Math.min(remaining, threshold - prevThreshold)
    if (band <= 0) break
    const taxInBand = band * rate
    totalTax += taxInBand
    brackets.push({
      from: prevThreshold,
      to: threshold === Infinity ? null : threshold,
      rate: rate * 100,
      amount: Math.round(taxInBand),
    })
    remaining -= band
    prevThreshold = threshold
    if (remaining <= 0) break
  }

  return {
    taxPayable: Math.round(totalTax),
    brackets,
  }
}

/**
 * Full Indonesia tax breakdown (annual income - PTKP → tax).
 * @param {Object} opts
 * @param {number} [opts.monthlySalary] - Monthly salary IDR
 * @param {number} [opts.annualBonus] - Annual bonus IDR
 * @param {number} [opts.annualOther] - Other income (rent, trade, etc.) IDR/year
 * @param {boolean} [opts.married] - Married (extra PTKP)
 * @param {number} [opts.dependents] - Number of dependents (0–3)
 */
export function computeIDTax({
  monthlySalary = 0,
  annualBonus = 0,
  annualOther = 0,
  married = false,
  dependents = 0,
}) {
  const salaryNum = Number(monthlySalary) || 0
  const bonusNum = Number(annualBonus) || 0
  const otherNum = Number(annualOther) || 0

  const grossAnnual = salaryNum * 12 + bonusNum + otherNum
  const ptkp = getPTKP({ married, dependents })
  const pkp = Math.max(0, grossAnnual - ptkp)
  const taxResult = taxOnPKP(pkp)
  const takeHome = grossAnnual - taxResult.taxPayable

  return {
    income: {
      grossAnnual: Math.round(grossAnnual),
      ptkp,
      pkp: Math.round(pkp),
    },
    tax: taxResult,
    summary: {
      totalTax: taxResult.taxPayable,
      totalTakeHome: Math.round(takeHome),
    },
    ptkpConfig: { married, dependents },
  }
}
