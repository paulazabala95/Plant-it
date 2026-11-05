import {
  ASSUMPTION_SOURCES,
  DEFAULT_CASH_BUFFER,
  GARDEN_OPTIONS,
  PENSION_REAL_RETURN,
  REAL_RETURNS,
  TWIN_TRADING_DRAG,
  type CountryCode,
  type Sourced,
} from '../data'
import { defaultsFor } from '../engine'
import { OPTION_LOOKS } from '../themes'
import { ageLabel, pct } from './format'

interface Row {
  label: string
  value: string
  coverage?: Sourced<unknown>['coverage']
  source: string
  note?: string
}

const fromSourced = <T,>(label: string, s: Sourced<T>, show: (v: T) => string): Row => ({
  label,
  value: show(s.value),
  coverage: s.coverage,
  source: s.source,
  note: s.note,
})

export function Assumptions({
  country,
  italyTfrToFund,
}: {
  country: CountryCode
  italyTfrToFund?: boolean
}) {
  const c = defaultsFor(country)
  const pension =
    italyTfrToFund && c.optionalPensionFund ? c.optionalPensionFund : c.investedPension
  const rows: Row[] = [
    fromSourced('Same-role pay gap', c.samePayGap, (v) => pct(v, 1)),
    fromSourced(
      'Promotions a year',
      c.promotionRate,
      (v) => `you ${pct(v.women, 1)} · him ${pct(v.men, 1)}`,
    ),
    fromSourced('Raise per promotion', c.promotionRaise, (v) => `+${pct(v)}`),
    fromSourced(
      'Motherhood penalty',
      c.childPenalty,
      (v) => `−${pct(v.drop)} pay for ${v.years} years`,
    ),
    fromSourced('Fatherhood effect', c.fatherhoodPremium, (v) => pct(v)),
    fromSourced(
      'Paid maternity leave',
      c.maternityLeave,
      (v) => `${v.weeks} weeks at ${pct(v.paymentRate)} pay`,
    ),
    fromSourced(
      'Working part-time',
      c.partTime,
      (v) => `women ${pct(v.women)} · men ${pct(v.men)}`,
    ),
    fromSourced('His extra investing', c.twinInvestShift, (v) => `${pct(v, 1)} of savings`),
    fromSourced('Invested pension', pension, (steps) =>
      steps
        .map((s) => `${pct(s.rate, 1)}${steps.length > 1 ? ` from ${s.fromYear}` : ''}`)
        .join(' → '),
    ),
    fromSourced('Real wage growth', c.realWageGrowth, (v) => `${pct(v, 1)} a year`),
    fromSourced('Retirement age', c.retirementAge, (v) => ageLabel(v)),
    fromSourced('Years of retirement', c.lifeExpectancy, (v) => `${v} years on average`),
    fromSourced("Partner's paid leave", c.partnerLeave, (v) =>
      v.paymentRate === undefined
        ? `${v.weeks} weeks`
        : `${v.weeks} weeks at ${pct(v.paymentRate)} pay`,
    ),
    ...GARDEN_OPTIONS.map((o) => ({
      label: OPTION_LOOKS[o].plain,
      value: `${pct(REAL_RETURNS[o], 1)} a year after inflation`,
      source: ASSUMPTION_SOURCES[o],
    })),
    {
      label: 'His overtrading',
      value: `−${pct(TWIN_TRADING_DRAG, 2)} a year on single stocks & crypto`,
      source: ASSUMPTION_SOURCES.tradingDrag,
    },
    {
      label: 'Pension growth',
      value: `${pct(PENSION_REAL_RETURN, 1)} a year after inflation`,
      source: ASSUMPTION_SOURCES.pensionReturn,
    },
    {
      label: 'Your best: cash buffer',
      value: pct(DEFAULT_CASH_BUFFER),
      source: ASSUMPTION_SOURCES.cashBuffer,
    },
  ]

  return (
    <div className="numbers">
      <p className="muted" style={{ gridColumn: '1 / -1' }}>
        All amounts in today's money. State pay-as-you-go pensions are left out of both gardens.
      </p>
      {rows.map((r) => (
        <div key={r.label} className="assumption">
          <div className="row between" style={{ alignItems: 'flex-start' }}>
            <b>{r.label}</b>
            {r.coverage && (
              <span className={`flag ${r.coverage}`}>
                {r.coverage === 'country' ? c.name : 'EU average'}
              </span>
            )}
          </div>
          <span className="display" style={{ fontSize: 20 }}>
            {r.value}
          </span>
          {r.note && <p className="note">{r.note}</p>}
          <p className="source">{r.source}</p>
        </div>
      ))}
    </div>
  )
}
