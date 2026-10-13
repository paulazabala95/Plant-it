import { describe, expect, it } from 'vitest'
import { COUNTRIES, EU, type CountryDefaults } from './countries'

const all: CountryDefaults[] = [...Object.values(COUNTRIES), EU]

describe('country defaults', () => {
  it('cites a source for every value', () => {
    for (const c of all) {
      for (const field of Object.values(c)) {
        if (typeof field === 'object' && 'source' in field) {
          expect(field.source.length, c.code).toBeGreaterThan(0)
        }
      }
    }
  })

  it('keeps rates and shares between 0 and 1', () => {
    for (const c of all) {
      for (const v of [c.samePayGap, c.childPenalty, c.twinInvestShift, c.promotionRaise]) {
        expect(v.value, c.code).toBeGreaterThanOrEqual(0)
        expect(v.value, c.code).toBeLessThan(1)
      }
      const { women, men } = c.promotionRate.value
      expect(men, c.code).toBeGreaterThan(women)
    }
  })

  it('lists pension steps in calendar order', () => {
    for (const c of all) {
      const years = c.investedPension.value.map((s) => s.fromYear)
      expect(years, c.code).toEqual([...years].sort((a, b) => a - b))
    }
  })
})
