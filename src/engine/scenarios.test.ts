import { describe, expect, it } from 'vitest'
import { COUNTRIES, GARDEN_OPTIONS, PASSIVE_FUND_SHARE, TWIN_TRADING_DRAG } from '../data'
import {
  FACTORS,
  STRUCTURAL_FACTORS,
  atHerBest,
  bestSplit,
  herProfile,
  levelTheField,
  notInvesting,
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
    expect(p.childPenalty).toBe(nl.childPenalty.value.drop)
    expect(p.childPenaltyYears).toBe(nl.childPenalty.value.years)
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

  it('invests like a typical man in her country, whatever she picks', () => {
    const m = nl.typicalMix.value
    const shift = nl.twinInvestShift.value
    expect(twin.split.greenhouse).toBeCloseTo(m.deposits - shift, 9)
    expect(twin.split.indexFund).toBeCloseTo(m.mutualFunds * PASSIVE_FUND_SHARE + shift, 9)
    expect(twin.split.activeFund).toBeCloseTo(m.mutualFunds * (1 - PASSIVE_FUND_SHARE), 9)
    expect(twin.split.singleStocks).toBeCloseTo(m.listedShares, 9)
    expect(twin.split.lifeInsurance).toBeCloseTo(m.lifeAndPension, 9)
    const other = twinProfile({ ...inputs, split: { ...zeros, crypto: 1 } })
    expect(other.split).toEqual(twin.split)
  })

  it('has a split that sums to 1', () => {
    expect(Object.values(twin.split).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9)
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

  it('ends level: her best mix has no single stocks or crypto, so the drag costs nothing', () => {
    expect(simulate(twin)).toEqual(simulate(her))
  })

  it('removes every structural factor for her', () => {
    for (const f of STRUCTURAL_FACTORS) {
      expect(FACTORS[f](her, inputs)).toEqual(her)
    }
  })
})

describe('onboarding helpers', () => {
  it('turns weights into a split summing to 1', async () => {
    const { splitFromWeights } = await import('./scenarios')
    const s = splitFromWeights({ cash: 1, indexFund: 3 })
    expect(s.cash).toBe(0.25)
    expect(s.indexFund).toBe(0.75)
    expect(splitFromWeights({}).cash).toBe(1)
  })
})

describe('not investing', () => {
  it('keeps all her savings in a savings account, everything else the same', () => {
    const p = notInvesting(inputs)
    expect(p).toEqual({ ...herProfile(inputs), split: { ...zeros, greenhouse: 1 } })
  })
})

describe('investedShare', () => {
  it('counts everything except cash and savings accounts', async () => {
    const { investedShare } = await import('./scenarios')
    expect(
      investedShare({ ...zeros, cash: 0.2, greenhouse: 0.3, indexFund: 0.4, crypto: 0.1 }),
    ).toBeCloseTo(0.5, 12)
  })
})
