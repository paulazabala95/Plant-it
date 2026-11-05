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
    color: '#F4E3C3',
  },
  greenhouse: {
    plain: 'Savings account',
    metaphor: 'Greenhouse seedlings',
    meaning: 'Safe and sheltered, but they barely grow.',
    color: '#BFE9F2',
  },
  governmentBonds: {
    plain: 'Government bonds',
    metaphor: 'A hedge',
    meaning: 'You lend to a country. Steady and slow, grows a little each year.',
    color: '#CFE8D8',
  },
  indexFund: {
    plain: 'Index fund or ETF',
    metaphor: 'Oak trees',
    meaning: 'Thousands of companies in one, at a low fee. Slow and steady, huge after decades.',
    color: '#D4F06B',
  },
  activeFund: {
    plain: 'Actively managed fund',
    metaphor: 'Fruit bushes',
    meaning:
      'A manager picks companies for you. Similar to the oak, but higher fees eat the fruit.',
    color: '#FFD3B5',
  },
  sustainableFund: {
    plain: 'Sustainable fund',
    metaphor: 'Wildflower meadow',
    meaning: 'Grows like the oak, with greener companies.',
    color: '#FFB3D9',
  },
  singleStocks: {
    plain: 'Single stocks',
    metaphor: 'Sunflowers',
    meaning: 'A few shoot up, most wilt. Picking winners is hard.',
    color: '#F7D55C',
  },
  lifeInsurance: {
    plain: 'Life-insurance savings',
    metaphor: 'Vines',
    meaning: 'Assurance-vie or unit-linked plans. Sheltered, so they climb slowly.',
    color: '#E6D7F7',
  },
  crypto: {
    plain: 'Crypto',
    metaphor: 'Mushrooms',
    meaning: 'Pop up overnight. Nobody knows how long they last.',
    color: '#FF9A5C',
  },
  pension: {
    plain: 'Workplace pension',
    metaphor: 'Fruit orchard',
    meaning: 'Planted for you from your pay every month. You pick the fruit when you retire.',
    color: '#C8F0C0',
  },
}

/** Kept for onboarding chips. */
export const OPTION_LOOKS: Record<GardenOption, PlotLook> = PLOT_LOOKS

export const PEOPLE = {
  her: { label: 'You', color: '#F4A6D7', sky: '#FBD3EC' },
  twin: { label: 'Your twin', color: '#B9A6F5', sky: '#E3DAFC' },
} as const

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
