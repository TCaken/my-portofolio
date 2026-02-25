/**
 * Singapore CPF & income tax calculations (for illustration only).
 * Based on 2025 rules. Verify with CPF Board and IRAS for official figures.
 * @see https://www.cpf.gov.sg
 * @see https://www.iras.gov.sg
 */

// --- CPF 2025 (age 55 and below) ---
export const CPF_OW_CEILING_MONTHLY = 7_400
export const CPF_ANNUAL_WAGE_CEILING = 102_000
export const CPF_EMPLOYEE_RATE = 0.20
export const CPF_EMPLOYER_RATE = 0.17

/**
 * CPF on Ordinary Wages (monthly salary). Capped at OW ceiling.
 */
export function cpfOnOrdinaryWages(monthlySalary) {
  const ow = Math.min(monthlySalary, CPF_OW_CEILING_MONTHLY)
  return {
    ow,
    employee: Math.round(ow * CPF_EMPLOYEE_RATE * 100) / 100,
    employer: Math.round(ow * CPF_EMPLOYER_RATE * 100) / 100,
  }
}

/**
 * Annual CPF from monthly salary (no bonus).
 */
export function cpfAnnualFromSalary(monthlySalary) {
  const monthly = cpfOnOrdinaryWages(monthlySalary)
  const months = 12
  return {
    employee: Math.round(monthly.employee * months * 100) / 100,
    employer: Math.round(monthly.employer * months * 100) / 100,
    total: Math.round((monthly.employee + monthly.employer) * months * 100) / 100,
  }
}

/**
 * Additional Wages (e.g. bonus) CPF. AW ceiling = 102,000 - total OW already subject to CPF for the year.
 */
export function cpfOnAdditionalWages(annualOrdinaryWagesSubjectToCPF, bonusAmount) {
  const owForYear = Math.min(annualOrdinaryWagesSubjectToCPF, CPF_OW_CEILING_MONTHLY * 12)
  const awCeiling = Math.max(0, CPF_ANNUAL_WAGE_CEILING - owForYear)
  const awSubject = Math.min(bonusAmount, awCeiling)
  return {
    awSubject,
    employee: Math.round(awSubject * CPF_EMPLOYEE_RATE * 100) / 100,
    employer: Math.round(awSubject * CPF_EMPLOYER_RATE * 100) / 100,
  }
}

// --- Income tax (resident, YA 2025 / income year 2024) ---
// Brackets: chargeable income → rate on that slice. Cumulative tax computed step-wise.
const TAX_BRACKETS = [
  [0, 20_000, 0],
  [20_000, 30_000, 0.02],
  [30_000, 40_000, 0.035],
  [40_000, 80_000, 0.07],
  [80_000, 120_000, 0.115],
  [120_000, 160_000, 0.15],
  [160_000, 200_000, 0.18],
  [200_000, 240_000, 0.19],
  [240_000, 280_000, 0.195],
  [280_000, 320_000, 0.20],
  [320_000, 500_000, 0.22],
  [500_000, 1_000_000, 0.23],
  [1_000_000, Infinity, 0.24],
]

/** Earned Income Relief (under 55). Capped at taxable earned income. */
export const EARNED_INCOME_RELIEF_UNDER_55 = 1_000

/** Personal income tax rebate YA 2025: 60% of tax payable, cap $200. */
export const TAX_REBATE_RATE_2025 = 0.6
export const TAX_REBATE_CAP_2025 = 200

/**
 * Compute income tax (resident) from chargeable income. Progressive brackets.
 */
export function taxOnChargeableIncome(chargeableIncome) {
  if (chargeableIncome <= 0) return { taxBeforeRebate: 0, rebate: 0, taxPayable: 0, brackets: [] }
  let remaining = chargeableIncome
  let taxBeforeRebate = 0
  const brackets = []

  for (const [low, high, rate] of TAX_BRACKETS) {
    const band = Math.min(remaining, high - low)
    if (band <= 0) break
    const taxInBand = band * rate
    taxBeforeRebate += taxInBand
    brackets.push({
      from: low,
      to: high === Infinity ? null : high,
      rate: rate * 100,
      amount: Math.round(taxInBand * 100) / 100,
    })
    remaining -= band
    if (remaining <= 0) break
  }

  const rebate = Math.min(
    taxBeforeRebate * TAX_REBATE_RATE_2025,
    TAX_REBATE_CAP_2025
  )
  const taxPayable = Math.max(0, Math.round((taxBeforeRebate - rebate) * 100) / 100)

  return {
    taxBeforeRebate: Math.round(taxBeforeRebate * 100) / 100,
    rebate: Math.round(rebate * 100) / 100,
    taxPayable,
    brackets,
  }
}

/**
 * Full Singapore CPF + tax breakdown (employment + other income).
 * Set noCPF: true for EP holders (no CPF; tax on full employment + other income).
 * @param {Object} opts
 * @param {boolean} [opts.noCPF] - If true, no CPF (e.g. EP holder); tax on gross employment + other income.
 */
export function computeSGCPFAndTax({
  monthlySalary = 0,
  annualBonus = 0,
  annualRent = 0,
  annualTradeOther = 0,
  earnedIncomeRelief = EARNED_INCOME_RELIEF_UNDER_55,
  noCPF = false,
}) {
  const monthlySalaryNum = Number(monthlySalary) || 0
  const annualBonusNum = Number(annualBonus) || 0
  const annualRentNum = Number(annualRent) || 0
  const annualTradeNum = Number(annualTradeOther) || 0

  const grossEmployment = monthlySalaryNum * 12 + annualBonusNum

  let cpfTotalEmployee = 0
  let cpfTotalEmployer = 0
  let cpfMonthly = { ow: 0, employee: 0, employer: 0 }
  let cpfSalaryAnnual = { employee: 0, employer: 0 }
  let cpfBonus = { employee: 0, employer: 0 }

  if (!noCPF) {
    cpfMonthly = cpfOnOrdinaryWages(monthlySalaryNum)
    cpfSalaryAnnual = {
      employee: cpfMonthly.employee * 12,
      employer: cpfMonthly.employer * 12,
    }
    const bonus = cpfOnAdditionalWages(monthlySalaryNum * 12, annualBonusNum)
    cpfBonus = { employee: bonus.employee, employer: bonus.employer }
    cpfTotalEmployee = cpfSalaryAnnual.employee + cpfBonus.employee
    cpfTotalEmployer = cpfSalaryAnnual.employer + cpfBonus.employer
  }

  // Employment income for tax: gross minus CPF (employee) only if CPF applies
  const employmentForTax = grossEmployment - cpfTotalEmployee
  const totalIncomeBeforeRelief = employmentForTax + annualRentNum + annualTradeNum
  const chargeableIncome = Math.max(0, totalIncomeBeforeRelief - earnedIncomeRelief)

  const taxResult = taxOnChargeableIncome(chargeableIncome)
  const totalTakeHome = employmentForTax + annualRentNum + annualTradeNum - taxResult.taxPayable

  return {
    noCPF,
    cpf: {
      monthly: cpfMonthly,
      annual: {
        salary: cpfSalaryAnnual,
        bonus: cpfBonus,
        totalEmployee: Math.round(cpfTotalEmployee * 100) / 100,
        totalEmployer: Math.round(cpfTotalEmployer * 100) / 100,
      },
    },
    income: {
      grossEmployment: Math.round(grossEmployment * 100) / 100,
      employmentAfterCPF: Math.round(employmentForTax * 100) / 100,
      otherIncome: annualRentNum + annualTradeNum,
      chargeableIncome: Math.round(chargeableIncome * 100) / 100,
      earnedIncomeRelief: earnedIncomeRelief,
    },
    tax: taxResult,
    summary: {
      totalTax: taxResult.taxPayable,
      totalTakeHome: Math.round(totalTakeHome * 100) / 100,
      grossEmployment: Math.round(grossEmployment * 100) / 100,
    },
  }
}
