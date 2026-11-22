import { REAL_RETURNS } from '../data'
import { netMonthly } from './net'
import { atHerBest, notInvesting, type HerInputs } from './scenarios'
import { simulate } from './simulate'

const monthlyRate = (yearly: number) => (1 + yearly) ** (1 / 12) - 1

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

export interface GoalPlan {
  /** What she sets aside each month, in a savings account, to have the amount in time. */
  monthly: number
  /** What she saves each month today. */
  currentMonthly: number
  /** How much more than she saves today the goal needs each month (0 if it fits). */
  shortfall: number
  /**
   * How much smaller her invested retirement garden ends if the goal money comes out of what
   * she saves now (what those euros would have grown into, invested).
   */
  retirementCost: number
}

/**
 * A goal (a home, a baby buffer, a sabbatical...): `amount` euros in `years`. Money needed within
 * a few years stays in a savings account, so it uses the savings-account return.
 */
export function goalPlan(inputs: HerInputs, amount: number, years: number): GoalPlan {
  const months = Math.max(1, Math.round(years * 12))
  const m = monthlyRate(REAL_RETURNS.greenhouse)
  const monthly = m === 0 ? amount / months : (amount * m) / ((1 + m) ** months - 1)
  const net = netMonthly(inputs.grossSalary, inputs.country)
  const currentMonthly = inputs.savingsRate * net
  const fromPlan = Math.min(monthly, currentMonthly)
  const retirementCost = simulate({
    ...atHerBest(inputs),
    savingsRate: fromPlan / net,
    saveUntilMonth: months,
  }).final.savings
  return {
    monthly,
    currentMonthly,
    shortfall: Math.max(0, monthly - currentMonthly),
    retirementCost,
  }
}
