import { netMonthly } from './net'
import { atHerBest, notInvesting, type HerInputs } from './scenarios'
import { simulate } from './simulate'

/** Her own savings at retirement when invested, with and without a what-if change. */
export interface WhatIf {
  /** Her savings at retirement with the change. */
  savings: number
}

/**
 * Investing a little more: she adds `extraMonthly` euros (at today's pay) to what she invests.
 * Like her answer, the extra is a share of net pay, so it grows with her pay.
 */
export function investMore(inputs: HerInputs, extraMonthly: number): WhatIf & { extra: number } {
  const best = atHerBest(inputs)
  const base = simulate(best).final.savings
  const extraRate = Math.max(0, extraMonthly) / netMonthly(inputs.grossSalary, inputs.country)
  const savings = simulate({ ...best, savingsRate: best.savingsRate + extraRate }).final.savings
  return { savings, extra: savings - base }
}

/**
 * The cost of waiting: for `years` she keeps saving in a savings account (and leaves that
 * money there), then invests her new savings from then on.
 */
export function waitingCost(inputs: HerInputs, years: number): WhatIf & { cost: number } {
  const best = atHerBest(inputs)
  const base = simulate(best).final.savings
  const months = Math.max(0, Math.round(years * 12))
  const waiting = simulate({ ...notInvesting(inputs), saveUntilMonth: months }).final.savings
  const later = simulate({ ...best, saveFromMonth: months }).final.savings
  const savings = waiting + later
  return { savings, cost: base - savings }
}
