import type { Region, TaxPoint } from '../data'
import { defaultsFor } from './scenarios'
import type { Split } from './types'

/**
 * Share of gross pay that goes to income tax and employee social contributions, interpolated
 * between the OECD points (flat below the first and above the last). An estimate, not a tax rule.
 */
export function taxRateAt(points: TaxPoint[], annualGross: number): number {
  if (points.length === 0) return 0
  if (annualGross <= points[0].gross) return points[0].rate
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    if (annualGross <= b.gross)
      return a.rate + ((b.rate - a.rate) * (annualGross - a.gross)) / (b.gross - a.gross)
  }
  return points[points.length - 1].rate
}

/** Estimated net pay per month for a gross yearly salary in a country. */
export const netMonthly = (annualGross: number, region: Region): number =>
  (annualGross * (1 - taxRateAt(defaultsFor(region).netPayTax.value, annualGross))) / 12

/** A monthly amount put aside as a share of estimated net pay (0 to 1). */
export function savingsShare(monthly: number, annualGross: number, region: Region): number {
  const net = netMonthly(annualGross, region)
  return net <= 0 ? 0 : Math.min(1, Math.max(0, monthly / net))
}

/** A monthly amount split across the garden options. */
export const amountsBySplit = (monthly: number, split: Split): Split =>
  Object.fromEntries(Object.entries(split).map(([o, share]) => [o, monthly * share])) as Split
