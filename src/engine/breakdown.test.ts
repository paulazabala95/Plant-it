import { describe, expect, it } from 'vitest'
import { COUNTRIES, GARDEN_OPTIONS } from '../data'
import { breakdown, realLifeUnits, shapley } from './breakdown'
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

  it('gives zero to cards she did not place', () => {
    expect(b.factors.partTime).toBe(0)
  })

  it('shows overtrading costs the twin, not her', () => {
    expect(b.factors.tradingDrag).toBeLessThan(0)
  })

  it('reports shares of the gap that sum to 100%', () => {
    expect(b.structuralShare + b.choiceShare).toBeCloseTo(1, 9)
  })
})

describe('realLifeUnits', () => {
  it('converts an amount into years of rent and sabbatical years', () => {
    const nl = COUNTRIES.NL
    const amount = nl.monthlyRent.value * 12 * 3
    const u = realLifeUnits(amount, 'NL')
    expect(u.yearsOfRent).toBeCloseTo(3, 9)
    expect(u.sabbaticalYears).toBeCloseTo(amount / nl.sabbaticalYear.value, 9)
  })
})
