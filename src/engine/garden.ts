import { GARDEN_OPTIONS, type GardenOption } from '../data'
import { herProfile, type HerInputs } from './scenarios'
import { simulate } from './simulate'
import type { LifeEvent, YearPoint } from './types'

/** A patch of the garden: one per savings option, plus the pension orchard. */
export type Plot = GardenOption | 'pension'

export interface PlotCount {
  plot: Plot
  /** Plants to draw: value divided by the plant unit, rounded, at least 1 if anything is there. */
  plants: number
  /** Value over what was paid in, minus 1 (0.5 = grew 50%, negative = shrank). */
  growth: number
}

const NICE_UNITS = [
  1000, 2000, 2500, 5000, 10_000, 20_000, 25_000, 50_000, 100_000, 200_000, 250_000, 500_000,
]

/** A round euro amount per plant so the biggest garden shows at most `maxPlants` plants. */
export function plantUnit(biggestTotal: number, maxPlants = 16): number {
  const needed = biggestTotal / maxPlants
  return NICE_UNITS.find((u) => u >= needed) ?? NICE_UNITS[NICE_UNITS.length - 1]
}

/** How many plants each plot gets at one age. Plots with nothing in them are left out. */
export function plantCounts(point: YearPoint, unit: number): PlotCount[] {
  const plots: { plot: Plot; value: number; paid: number }[] = [
    ...GARDEN_OPTIONS.map((o) => ({
      plot: o as Plot,
      value: point.garden[o],
      paid: point.paidIn[o],
    })),
    { plot: 'pension', value: point.retirement, paid: point.retirementPaidIn },
  ]
  return plots
    .filter((p) => p.paid > 0)
    .map((p) => ({
      plot: p.plot,
      plants: p.value > 0 ? Math.max(1, Math.round(p.value / unit)) : 0,
      growth: p.value / p.paid - 1,
    }))
}

/** How much smaller her garden ends at retirement because of one life event card. */
export function eventImpact(inputs: HerInputs, event: LifeEvent): number {
  const others = (inputs.events ?? []).filter((e) => e !== event)
  const without = simulate(herProfile({ ...inputs, events: others })).final.total
  const withIt = simulate(herProfile({ ...inputs, events: [...others, event] })).final.total
  return without - withIt
}
