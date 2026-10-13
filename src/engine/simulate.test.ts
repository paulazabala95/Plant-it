import { describe, expect, it } from 'vitest'
import { GARDEN_OPTIONS } from '../data'
import { simulate } from './simulate'
import type { Profile, Split } from './types'

const zeros = Object.fromEntries(GARDEN_OPTIONS.map((o) => [o, 0])) as Split
const only = (option: keyof Split): Split => ({ ...zeros, [option]: 1 })

// 12,000 a year, 10% saved = 100 a month, everything flat unless a test says otherwise.
const base: Profile = {
  startAge: 30,
  retirementAge: 31,
  startYear: 2026,
  annualSalary: 12_000,
  savingsRate: 0.1,
  split: only('cash'),
  realWageGrowth: 0,
  promotionRate: 0,
  promotionRaise: 0,
  events: [],
  childPenalty: 0,
  maternityLeave: { weeks: 0, paymentRate: 0 },
  pension: [{ fromYear: 2000, rate: 0 }],
  tradingDrag: 0,
  returns: { ...zeros },
  pensionReturn: 0,
}

const run = (overrides: Partial<Profile>) => simulate({ ...base, ...overrides })
const monthlyRate = (yearly: number) => (1 + yearly) ** (1 / 12) - 1
/** Value of 12 end-of-month payments after one year. */
const annuity = (payment: number, yearly: number) => {
  const m = monthlyRate(yearly)
  return m === 0 ? payment * 12 : (payment * ((1 + m) ** 12 - 1)) / m
}

describe('simulate', () => {
  it('saves a share of monthly pay with no growth', () => {
    const t = run({})
    expect(t.final.garden.cash).toBeCloseTo(1200, 6)
    expect(t.final.total).toBeCloseTo(1200, 6)
    expect(t.final.contributed).toBeCloseTo(1200, 6)
  })

  it('returns one point per whole age, starting empty', () => {
    const t = run({ retirementAge: 33 })
    expect(t.points.map((p) => p.age)).toEqual([30, 31, 32, 33])
    expect(t.points[0].total).toBe(0)
    expect(t.final).toBe(t.points[3])
  })

  it('compounds monthly at the yearly real return', () => {
    const t = run({ split: only('indexFund'), returns: { ...zeros, indexFund: 0.052 } })
    expect(t.final.garden.indexFund).toBeCloseTo(annuity(100, 0.052), 6)
  })

  it('applies a negative real return to cash', () => {
    const t = run({ returns: { ...zeros, cash: -0.02 } })
    expect(t.final.garden.cash).toBeCloseTo(annuity(100, -0.02), 6)
  })

  it('charges trading drag on traded options only', () => {
    const returns = { ...zeros, cash: 0.01, indexFund: 0.052 }
    const half = { ...zeros, cash: 0.5, indexFund: 0.5 }
    const t = run({ split: half, returns, tradingDrag: 0.0094 })
    expect(t.final.garden.cash).toBeCloseTo(annuity(50, 0.01), 6)
    expect(t.final.garden.indexFund).toBeCloseTo(annuity(50, 0.052 - 0.0094), 6)
  })

  it('grows pay with wage growth plus expected promotions', () => {
    // Second year pay = 12,000 x (1 + 1% + 50% x 4%) = 12,360, saved over 12 months.
    const t = run({
      retirementAge: 32,
      realWageGrowth: 0.01,
      promotionRate: 0.5,
      promotionRaise: 0.04,
    })
    const secondYear = t.points[2].contributed - t.points[1].contributed
    expect(t.points[1].contributed).toBeCloseTo(1200, 6)
    expect(secondYear).toBeCloseTo(1236, 6)
  })

  it('pays nothing in during a career break', () => {
    const t = run({ retirementAge: 33, events: [{ kind: 'careerBreak', fromAge: 31, years: 1 }] })
    expect(t.points.map((p) => p.contributed)).toEqual([0, 1200, 1200, 2400])
  })

  it('scales pay while working part-time', () => {
    const t = run({
      retirementAge: 32,
      events: [{ kind: 'partTime', fromAge: 31, toAge: 32, hoursShare: 0.6 }],
    })
    expect(t.final.contributed).toBeCloseTo(1200 + 720, 6)
  })

  it('pays maternity leave, then applies the child penalty', () => {
    // 26 weeks = half a year at 50% pay, then 40% penalty.
    const t = run({
      events: [{ kind: 'child', age: 30 }],
      maternityLeave: { weeks: 26, paymentRate: 0.5 },
      childPenalty: 0.4,
    })
    expect(t.final.contributed).toBeCloseTo(6 * 50 + 6 * 60, 6)
  })

  it('applies the child penalty once, from the first child', () => {
    const t = run({
      retirementAge: 33,
      events: [
        { kind: 'child', age: 30 },
        { kind: 'child', age: 32 },
      ],
      childPenalty: 0.5,
    })
    expect(t.final.contributed).toBeCloseTo(3 * 600, 6)
  })

  it('treats a negative penalty as a fatherhood premium', () => {
    const t = run({ events: [{ kind: 'child', age: 30 }], childPenalty: -0.1 })
    expect(t.final.contributed).toBeCloseTo(1320, 6)
  })

  it('invests pension contributions by calendar year in the retirement field', () => {
    const t = run({
      retirementAge: 32,
      startYear: 2028,
      savingsRate: 0,
      pension: [
        { fromYear: 2026, rate: 0.035 },
        { fromYear: 2029, rate: 0.07 },
      ],
      pensionReturn: 0.025,
    })
    const firstYear = annuity((12_000 * 0.035) / 12, 0.025)
    expect(t.points[1].retirement).toBeCloseTo(firstYear, 6)
    expect(t.final.retirement).toBeCloseTo(
      firstYear * 1.025 + annuity((12_000 * 0.07) / 12, 0.025),
      6,
    )
    expect(t.final.total).toBeCloseTo(t.final.retirement, 6)
  })

  it('stops at a fractional retirement age', () => {
    const t = run({ retirementAge: 30.5 })
    expect(t.final.age).toBe(30.5)
    expect(t.final.total).toBeCloseTo(600, 6)
  })
})
