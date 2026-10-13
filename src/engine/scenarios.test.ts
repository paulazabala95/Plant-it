import { describe, expect, it } from 'vitest'
import { COUNTRIES, GARDEN_OPTIONS, TWIN_TRADING_DRAG } from '../data'
import {
  FACTORS,
  STRUCTURAL_FACTORS,
  atHerBest,
  bestSplit,
  herProfile,
  levelTheField,
  twinProfile,
  type HerInputs,
} from './scenarios'
import { simulate } from './simulate'
import type { Split } from './types'

const zeros = Object.fromEntries(GARDEN_OPTIONS.map((o) => [o, 0])) as Split

const inputs: HerInputs = {
  age: 30,
  country: 'NL',
  grossSalary: 45_000,
  savingsRate: 0.1,
  split: { ...zeros, cash: 0.6, indexFund: 0.2, singleStocks: 0.2 },
  startYear: 2026,
  events: [
    { kind: 'child', age: 33 },
    { kind: 'partTime', fromAge: 34, toAge: 40, hoursShare: 0.8 },
  ],
}
const nl = COUNTRIES.NL

describe('herProfile', () => {
  it('uses her inputs and her country defaults', () => {
    const p = herProfile(inputs)
    expect(p.annualSalary).toBe(45_000)
    expect(p.retirementAge).toBe(nl.retirementAge.value)
    expect(p.childPenalty).toBe(nl.childPenalty.value)
    expect(p.promotionRate).toBe(nl.promotionRate.value.women)
    expect(p.tradingDrag).toBe(0)
  })

  it('uses the Italian TFR fund only when she says it is active', () => {
    const it = { ...inputs, country: 'IT' as const }
    expect(herProfile(it).pension).toEqual(COUNTRIES.IT.investedPension.value)
    expect(herProfile({ ...it, italyTfrToFund: true }).pension).toEqual(
      COUNTRIES.IT.optionalPensionFund?.value,
    )
  })
})

describe('twinProfile', () => {
  const twin = twinProfile(inputs)

  it('earns what she would without the same-role pay gap', () => {
    expect(twin.annualSalary).toBeCloseTo(45_000 / (1 - nl.samePayGap.value), 6)
  })

  it('gets the male promotion rate and no child penalty', () => {
    expect(twin.promotionRate).toBe(nl.promotionRate.value.men)
    expect(twin.childPenalty).toBe(-nl.fatherhoodPremium.value)
    expect(twin.maternityLeave.weeks).toBe(0)
  })

  it('does not take her part-time or career-break cards', () => {
    expect(twin.events).toEqual([{ kind: 'child', age: 33 }])
  })

  it('moves the invest shift from cash to the index fund', () => {
    const shift = nl.twinInvestShift.value
    expect(twin.split.cash).toBeCloseTo(0.6 - shift, 9)
    expect(twin.split.indexFund).toBeCloseTo(0.2 + shift, 9)
    expect(twin.split.singleStocks).toBe(0.2)
  })

  it('never moves more than her cash', () => {
    const t = twinProfile({ ...inputs, split: { ...zeros, cash: 0.01, greenhouse: 0.99 } })
    expect(t.split.cash).toBe(0)
    expect(t.split.indexFund).toBeCloseTo(0.01, 9)
  })

  it('pays the overtrading drag', () => {
    expect(twin.tradingDrag).toBe(TWIN_TRADING_DRAG)
  })
})

describe('her at her best', () => {
  it('keeps a greenhouse buffer and invests the rest in her chosen recommended options', () => {
    const split = bestSplit(
      { ...zeros, cash: 0.5, indexFund: 0.3, sustainableFund: 0.1, crypto: 0.1 },
      0.1,
    )
    expect(split.greenhouse).toBeCloseTo(0.1, 9)
    expect(split.indexFund).toBeCloseTo(0.9 * 0.75, 9)
    expect(split.sustainableFund).toBeCloseTo(0.9 * 0.25, 9)
    expect(split.cash + split.singleStocks + split.crypto).toBe(0)
  })

  it('uses the index fund when she has no recommended option', () => {
    const split = bestSplit({ ...zeros, cash: 0.7, singleStocks: 0.3 }, 0.1)
    expect(split.indexFund).toBeCloseTo(0.9, 9)
    expect(split.singleStocks).toBe(0)
  })

  it('changes only her choices, not her pay or savings rate', () => {
    const best = atHerBest(inputs)
    const her = herProfile(inputs)
    expect(best).toEqual({ ...her, split: bestSplit(inputs.split, 0.1), tradingDrag: 0 })
  })
})

describe('level the field', () => {
  const { her, twin } = levelTheField(inputs)

  it('differs only in the twin trading drag', () => {
    expect(twin).toEqual({ ...her, tradingDrag: TWIN_TRADING_DRAG })
    expect(her.tradingDrag).toBe(0)
  })

  it('gives identical timelines once the drag is removed', () => {
    expect(simulate({ ...twin, tradingDrag: 0 })).toEqual(simulate(her))
  })

  it('leaves her ahead because the twin overtrades', () => {
    expect(simulate(her).final.total).toBeGreaterThan(simulate(twin).final.total)
  })

  it('removes every structural factor for her', () => {
    for (const f of STRUCTURAL_FACTORS) {
      expect(FACTORS[f](her, inputs)).toEqual(her)
    }
  })
})
