import type { CountryCode, GardenOption } from '../data'
import { savingsShare, splitFromWeights, type HerInputs, type LifeEvent } from '../engine'

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

/** Her answers and life events as engine inputs (shared by the garden and the planner). */
export const toInputs = (answers: Answers, events: LifeEvent[]): HerInputs => ({
  age: answers.age,
  country: answers.country,
  grossSalary: answers.grossSalary,
  savingsRate: savingsShare(answers.monthlySavings, answers.grossSalary, answers.country),
  split: splitFromWeights(answers.weights),
  startYear: new Date().getFullYear(),
  events,
  italyTfrToFund: answers.italyTfrToFund,
})

/** What is kept on her device between visits. Nothing leaves the browser. */
export interface Session {
  answers: Answers
  events: LifeEvent[]
  /** She opened her plan: next visit starts on the Planner. */
  planner: boolean
}

const SESSION_KEY = 'plant-it-session-v1'

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function saveSession(s: Session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  } catch {
    /* private window: nothing is remembered */
  }
}
