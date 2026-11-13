import { describe, expect, it } from 'vitest'
import { COUNTRIES, GARDEN_OPTIONS } from '../data'
import { breakdown, monthlyIncome, shapley } from './breakdown'
import { herProfile, twinProfile, type HerInputs } from './scenarios'
import { simulate } from './simulate'
import type { Split } from './types'

const zeros = Object.fromEntries(GARDEN_OPTIONS.map((o) => [o, 0])) as Split

describe('shapley', () => {
  it('gives each factor its own value in an additive game', () => {
    const w = { a: 3, b: 5, c: -2 }
    const shares = shapley(['a', 'b', 'c'], (s) => [...s].reduce((sum, k) => sum + w[k], 0))
    expect(shares).toEqual({ a: 3, b: 5, c: -2 })
  })

  it('splits an interaction equally and sums to the total change', () => {
    // v = 1 only when both are on: each gets half.
    const shares = shapley(['a', 'b'], (s) => (s.has('a') && s.has('b') ? 1 : 0))
    expect(shares.a).toBeCloseTo(0.5, 12)
    expect(shares.b).toBeCloseTo(0.5, 12)
  })

  it('does not depend on the order factors are listed', () => {
    const v = (s: ReadonlySet<string>) =>
      (s.has('x') ? 2 : 1) * (s.has('y') ? 3 : 1) + (s.has('z') ? 1 : 0)
    const one = shapley(['x', 'y', 'z'], v)
    const two = shapley(['z', 'y', 'x'], v)
    for (const k of ['x', 'y', 'z'] as const) expect(one[k]).toBeCloseTo(two[k], 12)
  })
})

describe('breakdown', () => {
  const inputs: HerInputs = {
    age: 30,
    country: 'DE',
    grossSalary: 50_000,
    savingsRate: 0.1,
    split: { ...zeros, cash: 0.7, indexFund: 0.3 },
    startYear: 2026,
    events: [
      { kind: 'child', age: 32 },
      { kind: 'careerBreak', fromAge: 32, years: 1 },
    ],
  }
  const b = breakdown(inputs)

  it('explains the whole gap between the twin and her', () => {
    const gap = simulate(twinProfile(inputs)).final.total - simulate(herProfile(inputs)).final.total
    expect(b.gap).toBeCloseTo(gap, 6)
    const sum = Object.values(b.factors).reduce((s, x) => s + x, 0)
    expect(sum).toBeCloseTo(gap, 6)
    expect(b.structural + b.choice).toBeCloseTo(gap, 6)
  })

  it('counts her choices against his: investing more than him shrinks the gap', () => {
    const investor = breakdown({ ...inputs, split: { ...zeros, indexFund: 1 } })
    expect(investor.factors.investMix).toBeLessThan(0)
    const saver = breakdown({ ...inputs, split: { ...zeros, greenhouse: 1 } })
    expect(saver.factors.investMix).toBeGreaterThan(0)
  })

  it('gives zero to cards she did not place', () => {
    expect(b.factors.partTime).toBe(0)
  })

  it('charges his overtrading on the single stocks he holds', () => {
    expect(b.factors.tradingDrag).toBeLessThan(0)
  })

  it('shows overtrading costs the twin, not her, on single stocks', () => {
    const stocks = breakdown({ ...inputs, split: { ...zeros, cash: 0.7, singleStocks: 0.3 } })
    expect(stocks.factors.tradingDrag).toBeLessThan(0)
  })

  it('reports shares of the gap that sum to 100%', () => {
    expect(b.structuralShare + b.choiceShare).toBeCloseTo(1, 9)
  })

  describe('fairWorldGain', () => {
    it('is how much bigger her garden ends without the structural gaps', async () => {
      const { fairWorldGain } = await import('./breakdown')
      const { applyFactors, STRUCTURAL_FACTORS } = await import('./scenarios')
      const her = herProfile(inputs)
      const fair = simulate(applyFactors(her, STRUCTURAL_FACTORS, inputs)).final.total
      expect(fairWorldGain(inputs)).toBeCloseTo(fair - simulate(her).final.total, 6)
      expect(fairWorldGain(inputs)).toBeGreaterThan(0)
    })
  })
})

describe('monthlyIncome', () => {
  it('pays an amount out evenly over life expectancy, still growing at the pension return', () => {
    const years = COUNTRIES.NL.lifeExpectancy.value
    const m = 1.025 ** (1 / 12) - 1
    const n = Math.round(years * 12)
    const expected = (100_000 * m) / (1 - (1 + m) ** -n)
    expect(monthlyIncome(100_000, 'NL')).toBeCloseTo(expected, 6)
  })

  it('is more than a plain split over the months, because the rest keeps growing', () => {
    const n = Math.round(COUNTRIES.NL.lifeExpectancy.value * 12)
    expect(monthlyIncome(100_000, 'NL')).toBeGreaterThan(100_000 / n)
  })
})
