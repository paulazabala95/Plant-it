import {
  COUNTRIES,
  DEFAULT_CASH_BUFFER,
  EU,
  PENSION_REAL_RETURN,
  REAL_RETURNS,
  RECOMMENDED_OPTIONS,
  TWIN_TRADING_DRAG,
  type CountryDefaults,
  type Region,
} from '../data'
import type { LifeEvent, Profile, Split } from './types'

/** The five onboarding answers (+ the Italy TFR question) and the cards she placed. */
export interface HerInputs {
  age: number
  country: Region
  /** Gross yearly salary, full-time. */
  grossSalary: number
  savingsRate: number
  split: Split
  /** Current calendar year, passed in by the UI. */
  startYear: number
  events?: LifeEvent[]
  /** Italy only: does her TFR go to a pension fund? */
  italyTfrToFund?: boolean
  /** "Her at her best" greenhouse buffer, default 10%. */
  cashBuffer?: number
}

export const defaultsFor = (region: Region): CountryDefaults =>
  region === 'EU' ? EU : COUNTRIES[region]

/** Her today: her own inputs with her country's defaults for women. */
export function herProfile(inputs: HerInputs): Profile {
  const c = defaultsFor(inputs.country)
  const pension =
    inputs.italyTfrToFund && c.optionalPensionFund
      ? c.optionalPensionFund.value
      : c.investedPension.value
  return {
    startAge: inputs.age,
    retirementAge: c.retirementAge.value,
    startYear: inputs.startYear,
    annualSalary: inputs.grossSalary,
    savingsRate: inputs.savingsRate,
    split: inputs.split,
    realWageGrowth: c.realWageGrowth.value,
    promotionRate: c.promotionRate.value.women,
    promotionRaise: c.promotionRaise.value,
    events: inputs.events ?? [],
    childPenalty: c.childPenalty.value.drop,
    childPenaltyYears: c.childPenalty.value.years,
    maternityLeave: c.maternityLeave.value,
    pension,
    tradingDrag: 0,
    returns: REAL_RETURNS,
    pensionReturn: PENSION_REAL_RETURN,
  }
}

/** Her split with the twin's invest shift moved from cash to the index fund. */
export function twinSplit(split: Split, shift: number): Split {
  const moved = Math.min(shift, split.cash)
  return { ...split, cash: split.cash - moved, indexFund: split.indexFund + moved }
}

/**
 * Her at her best: a greenhouse buffer, the rest across the recommended options she chose
 * (in her proportions), or the index fund if she chose none.
 */
export function bestSplit(split: Split, buffer: number): Split {
  const chosen = RECOMMENDED_OPTIONS.filter((o) => split[o] > 0)
  const weights = chosen.length > 0 ? chosen : (['indexFund'] as const)
  const totalWeight = chosen.reduce((sum, o) => sum + split[o], 0)
  const best = Object.fromEntries(Object.keys(split).map((o) => [o, 0])) as Split
  best.greenhouse = buffer
  for (const o of weights) {
    best[o] = (1 - buffer) * (chosen.length > 0 ? split[o] / totalWeight : 1)
  }
  return best
}

/**
 * Each factor turns her value into the twin's for one difference between them.
 * Factors touch separate fields and are idempotent, so any subset can be applied in any order
 * (needed for the Shapley breakdown).
 */
export const FACTORS = {
  // Structural
  payGap: (p: Profile, i: HerInputs): Profile => ({
    ...p,
    annualSalary: i.grossSalary / (1 - defaultsFor(i.country).samePayGap.value),
  }),
  promotions: (p: Profile, i: HerInputs): Profile => ({
    ...p,
    promotionRate: defaultsFor(i.country).promotionRate.value.men,
  }),
  childPenalty: (p: Profile, i: HerInputs): Profile => ({
    ...p,
    childPenalty: -defaultsFor(i.country).fatherhoodPremium.value,
    maternityLeave: { weeks: 0, paymentRate: 1 },
  }),
  partTime: (p: Profile): Profile => ({
    ...p,
    events: p.events.filter((e) => e.kind !== 'partTime'),
  }),
  careerBreak: (p: Profile): Profile => ({
    ...p,
    events: p.events.filter((e) => e.kind !== 'careerBreak'),
  }),
  // Choice
  investMix: (p: Profile, i: HerInputs): Profile => ({
    ...p,
    split: twinSplit(i.split, defaultsFor(i.country).twinInvestShift.value),
  }),
  tradingDrag: (p: Profile): Profile => ({ ...p, tradingDrag: TWIN_TRADING_DRAG }),
}

export type Factor = keyof typeof FACTORS

export const STRUCTURAL_FACTORS: readonly Factor[] = [
  'payGap',
  'promotions',
  'childPenalty',
  'partTime',
  'careerBreak',
]
export const CHOICE_FACTORS: readonly Factor[] = ['investMix', 'tradingDrag']
export const ALL_FACTORS: readonly Factor[] = [...STRUCTURAL_FACTORS, ...CHOICE_FACTORS]

export const applyFactors = (p: Profile, factors: Iterable<Factor>, i: HerInputs): Profile =>
  [...factors].reduce((acc, f) => FACTORS[f](acc, i), p)

/** Her identical male twin: her life with every factor switched to the male value. */
export const twinProfile = (inputs: HerInputs): Profile =>
  applyFactors(herProfile(inputs), ALL_FACTORS, inputs)

/** Her at her best: same pay and savings rate, better mix, no trading drag. */
export const atHerBest = (inputs: HerInputs): Profile => ({
  ...herProfile(inputs),
  split: bestSplit(inputs.split, inputs.cashBuffer ?? DEFAULT_CASH_BUFFER),
  tradingDrag: 0,
})

/**
 * Level the field: both use her "at her best" mix and no structural factor applies, so the
 * only remaining difference is the twin's overtrading drag. Her best mix holds no single stocks
 * or crypto, so the drag costs nothing and both gardens end equal.
 */
export function levelTheField(inputs: HerInputs): { her: Profile; twin: Profile } {
  const her = applyFactors(atHerBest(inputs), STRUCTURAL_FACTORS, inputs)
  return { her, twin: FACTORS.tradingDrag(her) }
}
