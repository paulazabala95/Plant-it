// Garden theme: how engine output looks. No React, no maths on money beyond picking a stage.
import type { GardenOption } from '../engine'

export interface OptionLook {
  name: string
  short: string
  /** Fill colour of the option's blob character. */
  color: string
}

export const OPTION_LOOKS: Record<GardenOption, OptionLook> = {
  cash: { name: 'Seed packet in a drawer', short: 'Cash', color: '#F4E3C3' },
  greenhouse: { name: 'Greenhouse seed tray', short: 'Savings account', color: '#BFE9F2' },
  indexFund: { name: 'Oak tree', short: 'Index fund', color: '#D4F06B' },
  sustainableFund: { name: 'Wildflower meadow', short: 'Sustainable fund', color: '#FFB3D9' },
  singleStocks: { name: 'Sunflowers', short: 'Single stocks', color: '#F7D55C' },
  crypto: { name: 'Mushrooms', short: 'Crypto', color: '#FF9A5C' },
}

export const PEOPLE = {
  her: { label: 'You', color: '#F4A6D7' },
  twin: { label: 'Your twin', color: '#B9A6F5' },
} as const

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

export const STAGE_WORDS: Record<GrowthStage, string> = {
  0: 'a seed',
  1: 'a sprout',
  2: 'a young plant',
  3: 'growing strong',
  4: 'in full bloom',
}
