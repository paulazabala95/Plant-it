import type { GardenOption, PensionStep } from '../data'

export type Split = Record<GardenOption, number>

/** Something that happens in her life, placed on the timeline with an event card. */
export type LifeEvent =
  | { kind: 'child'; age: number }
  | { kind: 'partTime'; fromAge: number; toAge: number; hoursShare: number }
  | { kind: 'careerBreak'; fromAge: number; years: number }

/** Everything the simulation needs for one person. All money in today's euros. */
export interface Profile {
  startAge: number
  retirementAge: number
  /** Calendar year at startAge (passed in by the UI; the engine never reads the clock). */
  startYear: number
  /** Gross yearly salary at startAge, full-time. */
  annualSalary: number
  /** Share of gross pay saved every month. */
  savingsRate: number
  /** How monthly savings are split across garden options (sums to 1). */
  split: Split
  realWageGrowth: number
  promotionRate: number
  promotionRaise: number
  events: LifeEvent[]
  /** Earnings drop after the first child (negative = premium). */
  childPenalty: number
  /** Years after the first birth the drop lasts (what the study measured). */
  childPenaltyYears: number
  maternityLeave: { weeks: number; paymentRate: number }
  /** Invested pension contributions, share of gross pay, by calendar year. */
  pension: PensionStep[]
  /** Extra yearly cost on traded options. */
  tradingDrag: number
  returns: Record<GardenOption, number>
  pensionReturn: number
}

/** Balances at one whole age, in today's euros. */
export interface YearPoint {
  age: number
  garden: Split
  /** Invested pension pot (the retirement field). */
  retirement: number
  total: number
  /** Total paid in so far (savings + pension), without growth. */
  contributed: number
}

export interface Timeline {
  points: YearPoint[]
  final: YearPoint
}
