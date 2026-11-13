// Garden theme: how engine output looks. No React, no maths on money.
import type { GardenOption, Plot } from '../engine'

export interface PlotLook {
  /** Plain financial name, shown first. */
  plain: string
  /** The garden metaphor. */
  metaphor: string
  /** One line that explains the metaphor. */
  meaning: string
  color: string
}

export const PLOT_LOOKS: Record<Plot, PlotLook> = {
  cash: {
    plain: 'Cash',
    metaphor: 'Seeds in a drawer',
    meaning: 'They never sprout. Prices rise, so they slowly lose value.',
    color: '#FBE7EE',
  },
  greenhouse: {
    plain: 'Savings account',
    metaphor: 'Greenhouse seedlings',
    meaning: 'Safe and sheltered, but they barely grow.',
    color: '#E3EEF8',
  },
  governmentBonds: {
    plain: 'Government bonds',
    metaphor: 'A hedge',
    meaning: 'You lend to a country. Steady and slow, grows a little each year.',
    color: '#E6F0DA',
  },
  indexFund: {
    plain: 'Index fund or ETF',
    metaphor: 'Oak trees',
    meaning: 'Thousands of companies in one, at a low fee. Slow and steady, huge after decades.',
    color: '#EAF3D2',
  },
  activeFund: {
    plain: 'Actively managed fund',
    metaphor: 'Fruit bushes',
    meaning:
      'A manager picks companies for you. Similar to the oak, but higher fees eat the fruit.',
    color: '#FDF1D3',
  },
  sustainableFund: {
    plain: 'Sustainable fund',
    metaphor: 'Wildflower meadow',
    meaning: 'Grows like the oak, with greener companies.',
    color: '#FCE3EC',
  },
  singleStocks: {
    plain: 'Single stocks',
    metaphor: 'Sunflowers',
    meaning: 'A few shoot up, most wilt. Picking winners is hard.',
    color: '#FDF1D3',
  },
  lifeInsurance: {
    plain: 'Life-insurance savings',
    metaphor: 'Vines',
    meaning: 'Assurance-vie or unit-linked plans. Sheltered, so they climb slowly.',
    color: '#EEE7F5',
  },
  crypto: {
    plain: 'Crypto',
    metaphor: 'Mushrooms',
    meaning: 'Pop up overnight. Nobody knows how long they last.',
    color: '#F8E1E8',
  },
  pension: {
    plain: 'Workplace pension',
    metaphor: 'Fruit orchard',
    meaning: 'Planted for you from your pay every month. You pick the fruit when you retire.',
    color: '#E6F0DA',
  },
}

/** Kept for onboarding chips. */
export const OPTION_LOOKS: Record<GardenOption, PlotLook> = PLOT_LOOKS

export const PALETTE = {
  sunsetPetal: '#E4568B',
  goldenPollen: '#F6C94D',
  eveningSky: '#A7C7E4',
  leaflitGreen: '#5D7B3D',
  rosebudBlush: '#F29BB9',
  sorbetStem: '#C2DC80',
  petalGlaze: '#EA9CAF',
  dustyOrchid: '#D56989',
  lilacGrey: '#F3EEF1',
  ink: '#2F4220',
} as const

export const PEOPLE = {
  her: { label: 'You', color: PALETTE.sunsetPetal, text: '#C23A6F' },
  twin: { label: 'Your twin', color: PALETTE.eveningSky, text: '#3F78AD' },
} as const

/** Sky over a life: morning at the start (0), golden afternoon, pink sunset at retirement (1). */
const SKY_STOPS: [number, string, string][] = [
  [0, '#A7C7E4', '#F3EEF1'],
  [0.45, '#BFD8EE', '#FFF4D6'],
  [0.75, '#F6C94D', '#F7DCE6'],
  [1, '#E4568B', '#F6C94D'],
]

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a: string, b: string, t: number) =>
  '#' +
  hex(a)
    .map((v, i) =>
      Math.round(v + (hex(b)[i] - v) * t)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')

/** Top and bottom sky colours at a point in the career (0 = today, 1 = retirement). */
export function skyAt(progress: number): [string, string] {
  const p = Math.min(1, Math.max(0, progress))
  for (let i = 1; i < SKY_STOPS.length; i++) {
    const [b, top, bottom] = SKY_STOPS[i]
    if (p <= b) {
      const [a, topA, bottomA] = SKY_STOPS[i - 1]
      const t = (p - a) / (b - a)
      return [mix(topA, top, t), mix(bottomA, bottom, t)]
    }
  }
  return [SKY_STOPS[3][1], SKY_STOPS[3][2]]
}

/** How a character looks at an age: hair colour and glasses. */
export function lookAtAge(age: number, youngHair: string): { hair: string; glasses: boolean } {
  if (age >= 58) return { hair: '#D7D2CB', glasses: true }
  if (age >= 46) return { hair: '#857368', glasses: age >= 55 }
  return { hair: youngHair, glasses: false }
}

/** Fruit to hang on one plant: more growth, more fruit (0 to 5). */
export const fruitFor = (growth: number): number =>
  growth <= 0 ? 0 : Math.min(5, Math.round(growth * 2))

/** A plant looks wilted when it is worth less than what was put in. */
export const isWilted = (growth: number): boolean => growth < 0

/** 0 = seed, 4 = in full bloom. */
export type GrowthStage = 0 | 1 | 2 | 3 | 4

/** Stage of a garden compared with the biggest garden on screen. */
export function growthStage(total: number, biggest: number): GrowthStage {
  if (biggest <= 0 || total <= 0) return 0
  const share = total / biggest
  if (share < 0.4) return 1
  if (share < 0.7) return 2
  if (share < 0.97) return 3
  return 4
}
