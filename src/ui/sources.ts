import { ASSUMPTION_SOURCES, type CountryDefaults } from '../data'
import type { Factor } from '../engine'

export interface SourceLine {
  text: string
  euAverage: boolean
}

const line = (s: { source: string; coverage: string }): SourceLine => ({
  text: s.source,
  euAverage: s.coverage === 'eu-fallback',
})

/**
 * Where each difference between her and her twin comes from. Part-time and career breaks
 * come from the life events she adds, so they have no outside source.
 */
export function factorSources(c: CountryDefaults): Partial<Record<Factor, SourceLine[]>> {
  return {
    payGap: [line(c.samePayGap)],
    promotions: [line(c.promotionRate)],
    childPenalty: [line(c.childPenalty)],
    investMix: [
      line(c.typicalMix),
      { text: ASSUMPTION_SOURCES.passiveShare, euAverage: true },
      line(c.twinInvestShift),
    ],
    tradingDrag: [{ text: ASSUMPTION_SOURCES.tradingDrag, euAverage: false }],
  }
}

/** Short form for the time-lapse boxes: the reference before any detail after a colon. */
export const shortSource = (s: SourceLine): string => s.text.split(':')[0]
