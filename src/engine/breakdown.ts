import { PENSION_REAL_RETURN, type Region } from '../data'
import {
  ALL_FACTORS,
  CHOICE_FACTORS,
  STRUCTURAL_FACTORS,
  applyFactors,
  defaultsFor,
  herProfile,
  type Factor,
  type HerInputs,
} from './scenarios'
import { simulate } from './simulate'
import type { Timeline } from './types'

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1))

/**
 * Exact Shapley values: each key's marginal effect averaged over every order of adding keys.
 * Shares are order-independent and sum to value(all) - value(none).
 */
export function shapley<K extends string>(
  keys: readonly K[],
  value: (set: ReadonlySet<K>) => number,
): Record<K, number> {
  const n = keys.length
  const cache = new Map<number, number>()
  const v = (mask: number) => {
    let result = cache.get(mask)
    if (result === undefined) {
      result = value(new Set(keys.filter((_, i) => mask & (1 << i))))
      cache.set(mask, result)
    }
    return result
  }
  const shares = {} as Record<K, number>
  keys.forEach((key, i) => {
    let share = 0
    for (let mask = 0; mask < 1 << n; mask++) {
      if (mask & (1 << i)) continue
      let size = 0
      for (let j = 0; j < n; j++) if (mask & (1 << j)) size++
      const weight = (factorial(size) * factorial(n - size - 1)) / factorial(n)
      share += weight * (v(mask | (1 << i)) - v(mask))
    }
    shares[key] = share
  })
  return shares
}

export interface Breakdown {
  /** Twin's final total minus hers, today's euros. */
  gap: number
  factors: Record<Factor, number>
  structural: number
  choice: number
  /** Shares of the gap (sum to 1 when the gap is not zero). */
  structuralShare: number
  choiceShare: number
}

/** How much bigger her garden ends with every structural gap removed (her own choices kept). */
export function fairWorldGain(inputs: HerInputs): number {
  const her = herProfile(inputs)
  return (
    simulate(applyFactors(her, STRUCTURAL_FACTORS, inputs)).final.total - simulate(her).final.total
  )
}

/** Splits the gap between her and her twin into structural factors and her own choices. */
export function breakdown(inputs: HerInputs): Breakdown {
  const her = herProfile(inputs)
  const factors = shapley(
    ALL_FACTORS,
    (set) => simulate(applyFactors(her, set, inputs)).final.total,
  )
  const sum = (keys: readonly Factor[]) => keys.reduce((s, k) => s + factors[k], 0)
  const structural = sum(STRUCTURAL_FACTORS)
  const choice = sum(CHOICE_FACTORS)
  const gap = structural + choice
  return {
    gap,
    factors,
    structural,
    choice,
    structuralShare: gap === 0 ? 0 : structural / gap,
    choiceShare: gap === 0 ? 0 : choice / gap,
  }
}

/**
 * An amount at retirement as an equal monthly payout for the rest of an average life
 * (Eurostat life expectancy at the retirement age), with what is left still growing at the
 * pension real return.
 */
export function monthlyIncome(amount: number, region: Region): number {
  const months = Math.round(defaultsFor(region).lifeExpectancy.value * 12)
  const m = (1 + PENSION_REAL_RETURN) ** (1 / 12) - 1
  return (amount * m) / (1 - (1 + m) ** -months)
}

/** How much bigger the twin's garden ends than hers (negative when hers is bigger). */
export const gardenGap = (her: Timeline, twin: Timeline): number =>
  twin.final.total - her.final.total
