import { describe, expect, it } from 'vitest'
import { GARDEN_OPTIONS } from '../data'
import { netMonthly } from './net'
import { investMore, waitingCost } from './plan'
import { atHerBest, notInvesting, type HerInputs } from './scenarios'
import { simulate } from './simulate'
import type { Split } from './types'

const zeros = Object.fromEntries(GARDEN_OPTIONS.map((o) => [o, 0])) as Split
const inputs: HerInputs = {
  age: 30,
  country: 'NL',
  grossSalary: 40_000,
  savingsRate: 0.1,
  split: { ...zeros, greenhouse: 1 },
  startYear: 2026,
}
const invested = simulate(atHerBest(inputs)).final.savings

describe('investMore', () => {
  it('changes nothing when she adds nothing', () => {
    const r = investMore(inputs, 0)
    expect(r.savings).toBeCloseTo(invested, 6)
    expect(r.extra).toBeCloseTo(0, 6)
  })

  it('adds the extra euros to her monthly saving, as a share of today’s net pay, invested', () => {
    const extraRate = 100 / netMonthly(40_000, 'NL')
    const expected = simulate({
      ...atHerBest(inputs),
      savingsRate: 0.1 + extraRate,
    }).final.savings
    const r = investMore(inputs, 100)
    expect(r.savings).toBeCloseTo(expected, 6)
    expect(r.extra).toBeCloseTo(expected - invested, 6)
    expect(r.extra).toBeGreaterThan(0)
  })
})

describe('waitingCost', () => {
  it('costs nothing when she starts now', () => {
    expect(waitingCost(inputs, 0).cost).toBeCloseTo(0, 6)
  })

  it('keeps savings in a savings account while she waits, then invests new savings', () => {
    const months = 5 * 12
    const waitingPot = simulate({ ...notInvesting(inputs), saveUntilMonth: months }).final.savings
    const investedLater = simulate({ ...atHerBest(inputs), saveFromMonth: months }).final.savings
    const r = waitingCost(inputs, 5)
    expect(r.savings).toBeCloseTo(waitingPot + investedLater, 6)
    expect(r.cost).toBeCloseTo(invested - (waitingPot + investedLater), 6)
    expect(r.cost).toBeGreaterThan(0)
  })

  it('costs more the longer she waits', () => {
    expect(waitingCost(inputs, 10).cost).toBeGreaterThan(waitingCost(inputs, 5).cost)
  })
})
