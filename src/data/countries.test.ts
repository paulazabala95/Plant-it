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

  it('has men investing at least as often as women', () => {
    for (const c of all) {
      const { women, men } = c.riskyAssetParticipation.value
      expect(men, c.code).toBeGreaterThanOrEqual(women)
    }
  })

  it('lists pension steps in calendar order', () => {
    for (const c of all) {
      const years = c.investedPension.value.map((s) => s.fromYear)
      expect(years, c.code).toEqual([...years].sort((a, b) => a - b))
    }
  })
})
