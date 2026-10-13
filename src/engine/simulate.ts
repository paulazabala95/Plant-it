import { GARDEN_OPTIONS, TRADED_OPTIONS, type GardenOption, type PensionStep } from '../data'
import type { LifeEvent, Profile, Split, Timeline, YearPoint } from './types'

const monthlyRate = (yearly: number) => (1 + yearly) ** (1 / 12) - 1

const emptySplit = (): Split => Object.fromEntries(GARDEN_OPTIONS.map((o) => [o, 0])) as Split

/** Pension contribution rate in force in a calendar year (0 before the first step). */
export const pensionRate = (steps: PensionStep[], year: number): number =>
  steps.reduce((rate, step) => (step.fromYear <= year ? step.rate : rate), 0)

/**
 * Share of full-time pay earned in month `m` (months since startAge).
 * Career break: nothing. Part-time: hours share. Maternity leave: payment rate.
 * From the first child on (after leave): 1 - child penalty.
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

  const firstChild = Math.min(...children.map((c) => monthOf(c.age)))
  if (m >= firstChild) factor *= 1 - p.childPenalty

  return factor
}

/** Runs one person month by month from startAge to retirementAge. Pure and deterministic. */
export function simulate(p: Profile): Timeline {
  const months = Math.round((p.retirementAge - p.startAge) * 12)
  const yearlyPayGrowth = p.realWageGrowth + p.promotionRate * p.promotionRaise
  const rates = Object.fromEntries(
    GARDEN_OPTIONS.map((o) => [
      o,
      monthlyRate(p.returns[o] - (TRADED_OPTIONS.includes(o) ? p.tradingDrag : 0)),
    ]),
  ) as Record<GardenOption, number>
  const pensionMonthly = monthlyRate(p.pensionReturn)

  const garden = emptySplit()
  let retirement = 0
  let contributed = 0

  const point = (age: number): YearPoint => {
    const gardenTotal = GARDEN_OPTIONS.reduce((sum, o) => sum + garden[o], 0)
    return { age, garden: { ...garden }, retirement, total: gardenTotal + retirement, contributed }
  }
  const points: YearPoint[] = [point(p.startAge)]

  for (let m = 0; m < months; m++) {
    const year = Math.floor(m / 12)
    const pay = ((p.annualSalary * (1 + yearlyPayGrowth) ** year) / 12) * earningsFactor(p, m)
    const saved = pay * p.savingsRate
    const pensionIn = pay * pensionRate(p.pension, p.startYear + year)

    for (const o of GARDEN_OPTIONS) {
      garden[o] = garden[o] * (1 + rates[o]) + saved * p.split[o]
    }
    retirement = retirement * (1 + pensionMonthly) + pensionIn
    contributed += saved + pensionIn

    if ((m + 1) % 12 === 0 && m + 1 < months) points.push(point(p.startAge + (m + 1) / 12))
  }
  if (months > 0) points.push(point(p.retirementAge))

  return { points, final: points[points.length - 1] }
}
