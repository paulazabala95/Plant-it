import { describe, expect, it } from 'vitest'
import { COUNTRIES, GARDEN_OPTIONS } from '../data'
import { amountsBySplit, netMonthly, savingsShare, taxRateAt } from './net'
import type { Split } from './types'

const points = [
  { gross: 40_000, rate: 0.2 },
  { gross: 60_000, rate: 0.3 },
]

describe('taxRateAt', () => {
  it('interpolates between the OECD points', () => {
    expect(taxRateAt(points, 50_000)).toBeCloseTo(0.25, 12)
  })
  it('stays flat below the first and above the last point', () => {
    expect(taxRateAt(points, 10_000)).toBe(0.2)
    expect(taxRateAt(points, 200_000)).toBe(0.3)
  })
  it('is zero with no tax data', () => {
    expect(taxRateAt([], 50_000)).toBe(0)
  })
})

describe('net pay helpers', () => {
  it('estimates monthly net pay from gross with the country rates', () => {
    const nl = COUNTRIES.NL.netPayTax.value
    expect(netMonthly(46_249, 'NL')).toBeCloseTo((46_249 * (1 - nl[0].rate)) / 12, 6)
  })
  it('turns a monthly amount into a share of net pay, capped at 100%', () => {
    const net = netMonthly(40_000, 'ES')
    expect(savingsShare(net / 10, 40_000, 'ES')).toBeCloseTo(0.1, 12)
    expect(savingsShare(net * 2, 40_000, 'ES')).toBe(1)
    expect(savingsShare(100, 0, 'ES')).toBe(0)
  })
  it('splits a monthly amount across options', () => {
    const zeros = Object.fromEntries(GARDEN_OPTIONS.map((o) => [o, 0])) as Split
    const a = amountsBySplit(300, { ...zeros, cash: 0.6, indexFund: 0.4 })
    expect(a.cash).toBeCloseTo(180, 9)
    expect(a.indexFund).toBeCloseTo(120, 9)
  })
})
