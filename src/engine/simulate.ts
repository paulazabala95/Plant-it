import { GARDEN_OPTIONS, OVERTRADED_OPTIONS, type GardenOption, type PensionStep } from '../data'
import { taxRateAt } from './net'
import type { LifeEvent, Profile, Split, Timeline, YearPoint } from './types'

const monthlyRate = (yearly: number) => (1 + yearly) ** (1 / 12) - 1

const emptySplit = (): Split => Object.fromEntries(GARDEN_OPTIONS.map((o) => [o, 0])) as Split

/** Pension contribution rate in force in a calendar year (0 before the first step). */
export const pensionRate = (steps: PensionStep[], year: number): number =>
  steps.reduce((rate, step) => (step.fromYear <= year ? step.rate : rate), 0)

/**
 * Share of full-time pay earned in month `m` (months since startAge).
 * Career break: nothing. Part-time: hours share. Maternity leave: payment rate.
 * From the first child (after leave) for childPenaltyYears: 1 - child penalty, or the part-time
 * share if that is the bigger cut (they never stack).
 */
const earningsFactor = (p: Profile, m: number): number => {
  const monthOf = (age: number) => Math.round((age - p.startAge) * 12)
  const children = p.events.filter(
    (e): e is Extract<LifeEvent, { kind: 'child' }> => e.kind === 'child',
  )
  const leaveMonths = Math.round((p.maternityLeave.weeks / 52) * 12)
  let factor = 1

  for (const e of p.events) {
    if (e.kind === 'careerBreak') {
      const from = monthOf(e.fromAge)
      if (m >= from && m < from + Math.round(e.years * 12)) return 0
    }
    if (e.kind === 'partTime' && m >= monthOf(e.fromAge) && m < monthOf(e.toAge)) {
      factor *= e.hoursShare
    }
  }

  const onLeave = children.some((c) => m >= monthOf(c.age) && m < monthOf(c.age) + leaveMonths)
  if (onLeave) return factor * p.maternityLeave.paymentRate

  // The child penalty already includes mothers working fewer hours, so it never stacks with a
  // part-time card: in the years they overlap, the bigger cut applies.
  const firstChild = Math.min(...children.map((c) => monthOf(c.age)))
  if (m >= firstChild && m < firstChild + Math.round(p.childPenaltyYears * 12)) {
    const afterPenalty = 1 - p.childPenalty
    return p.childPenalty >= 0 ? Math.min(factor, afterPenalty) : factor * afterPenalty
  }

  return factor
}

/** Runs one person month by month from startAge to retirementAge. Pure and deterministic. */
export function simulate(p: Profile): Timeline {
  const months = Math.round((p.retirementAge - p.startAge) * 12)
  const yearlyPayGrowth = p.realWageGrowth + p.promotionRate * p.promotionRaise
  const rates = Object.fromEntries(
    GARDEN_OPTIONS.map((o) => [
      o,
      monthlyRate(p.returns[o] - (OVERTRADED_OPTIONS.includes(o) ? p.tradingDrag : 0)),
    ]),
  ) as Record<GardenOption, number>
  const pensionMonthly = monthlyRate(p.pensionReturn)

  const garden = emptySplit()
  const paidIn = emptySplit()
  let retirement = 0
  let retirementPaidIn = 0
  let contributed = 0

  const point = (age: number): YearPoint => {
    const gardenTotal = GARDEN_OPTIONS.reduce((sum, o) => sum + garden[o], 0)
    return {
      age,
      garden: { ...garden },
      paidIn: { ...paidIn },
      retirement,
      retirementPaidIn,
      total: gardenTotal + retirement,
      contributed,
    }
  }
  const points: YearPoint[] = [point(p.startAge)]

  for (let m = 0; m < months; m++) {
    const year = Math.floor(m / 12)
    const factor = earningsFactor(p, m)
    const yearlyPay = p.annualSalary * (1 + yearlyPayGrowth) ** year * factor
    const pay = yearlyPay / 12
    const saved = pay * (1 - taxRateAt(p.tax, yearlyPay)) * p.savingsRate
    const pensionIn = pay * pensionRate(p.pension, p.startYear + year)

    for (const o of GARDEN_OPTIONS) {
      garden[o] = garden[o] * (1 + rates[o]) + saved * p.split[o]
      paidIn[o] += saved * p.split[o]
    }
    retirement = retirement * (1 + pensionMonthly) + pensionIn
    retirementPaidIn += pensionIn
    contributed += saved + pensionIn

    if ((m + 1) % 12 === 0 && m + 1 < months) points.push(point(p.startAge + (m + 1) / 12))
  }
  if (months > 0) points.push(point(p.retirementAge))

  return { points, final: points[points.length - 1] }
}
