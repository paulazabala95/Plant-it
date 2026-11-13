import type { CountryCode, GardenOption } from '../data'

export interface Answers {
  age: number
  country: CountryCode
  grossSalary: number
  /** Euros put aside each month from net pay. */
  monthlySavings: number
  weights: Partial<Record<GardenOption, number>>
  italyTfrToFund?: boolean
}

export const DEFAULT_ANSWERS: Answers = {
  age: 30,
  country: 'NL',
  grossSalary: 40_000,
  monthlySavings: 300,
  weights: { cash: 6, indexFund: 4 },
}
