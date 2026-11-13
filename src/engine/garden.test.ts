import { describe, expect, it } from 'vitest'
import { GARDEN_OPTIONS } from '../data'
import { eventImpact, plantCounts, plantUnit } from './garden'
import type { HerInputs } from './scenarios'
import type { Split, YearPoint } from './types'

const zeros = Object.fromEntries(GARDEN_OPTIONS.map((o) => [o, 0])) as Split

describe('plantUnit', () => {
  it('picks a round amount so the biggest garden has at most 16 plants', () => {
    expect(plantUnit(800_000)).toBe(50_000)
    expect(plantUnit(150_000)).toBe(10_000)
    expect(plantUnit(0)).toBe(1000)
  })
})

describe('plantCounts', () => {
  const point: YearPoint = {
    age: 70,
    garden: { ...zeros, cash: 40_000, indexFund: 300_000 },
    paidIn: { ...zeros, cash: 50_000, indexFund: 100_000 },
    retirement: 100_000,
    retirementPaidIn: 80_000,
    total: 440_000,
    contributed: 230_000,
  }
  const counts = plantCounts(point, 50_000)

  it('gives one plant per unit, rounded, for every plot with money in it', () => {
    expect(counts.find((c) => c.plot === 'indexFund')?.plants).toBe(6)
    expect(counts.find((c) => c.plot === 'cash')?.plants).toBe(1)
    expect(counts.find((c) => c.plot === 'pension')?.plants).toBe(2)
    expect(counts.find((c) => c.plot === 'crypto')).toBeUndefined()
  })

  it('shows at least one plant for a small plot', () => {
    const small = plantCounts({ ...point, garden: { ...point.garden, cash: 5000 } }, 50_000)
    expect(small.find((c) => c.plot === 'cash')?.plants).toBe(1)
  })

  it('reports growth on what was paid in (negative when it shrank)', () => {
    expect(counts.find((c) => c.plot === 'indexFund')?.growth).toBeCloseTo(2, 9)
    expect(counts.find((c) => c.plot === 'cash')?.growth).toBeCloseTo(-0.2, 9)
  })
})

describe('eventImpact', () => {
  it('is how much smaller her garden ends because of one card', () => {
    const inputs: HerInputs = {
      age: 30,
      country: 'NL',
      grossSalary: 45_000,
      savingsRate: 0.1,
      split: { ...zeros, indexFund: 1 },
      startYear: 2026,
      events: [],
    }
    const impact = eventImpact(inputs, { kind: 'careerBreak', fromAge: 35, years: 1 })
    expect(impact).toBeGreaterThan(0)
    expect(eventImpact(inputs, { kind: 'child', age: 69.99 })).toBeGreaterThanOrEqual(0)
  })
})

describe('causePlants', () => {
  it('splits extra plants across causes by their share of the gap, largest remainder first', async () => {
    const { causePlants } = await import('./garden')
    const counts = causePlants(
      { childPenalty: 64, payGap: 40, investMix: 13, promotions: 10, tradingDrag: 0 },
      6,
    )
    expect(counts).toEqual({
      childPenalty: 3,
      payGap: 2,
      investMix: 1,
      promotions: 0,
      tradingDrag: 0,
    })
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(6)
  })

  it('ignores causes that make his garden smaller', async () => {
    const { causePlants } = await import('./garden')
    expect(causePlants({ payGap: 10, tradingDrag: -5 }, 2)).toEqual({ payGap: 2, tradingDrag: 0 })
  })

  it('gives nothing when there are no extra plants', async () => {
    const { causePlants } = await import('./garden')
    expect(causePlants({ payGap: 10 }, 0)).toEqual({ payGap: 0 })
  })
})

describe('promotionAges', () => {
  it('spreads the expected number of promotions evenly over the career', async () => {
    const { promotionAges } = await import('./garden')
    // 37 years x 7.3% = 2.7 -> 3 promotions
    expect(promotionAges(30, 67, 0.073)).toEqual([39, 48, 57])
    // 37 years x 4.9% = 1.8 -> 2 promotions
    expect(promotionAges(30, 67, 0.049)).toEqual([42, 54])
    expect(promotionAges(60, 61, 0.05)).toEqual([])
  })
})

describe('seedsBetween', () => {
  it('drops more seeds when more was paid in that year, between 1 and 14', async () => {
    const { seedsBetween } = await import('./garden')
    const at = (contributed: number) => ({ contributed }) as YearPoint
    expect(seedsBetween(at(0), at(5000), 50_000)).toBe(1)
    expect(seedsBetween(at(0), at(40_000), 50_000)).toBe(8)
    expect(seedsBetween(at(0), at(1e9), 50_000)).toBe(14)
    expect(seedsBetween(at(100), at(100), 50_000)).toBe(0)
  })
})
