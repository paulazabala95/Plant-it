import type { CountryCode } from '../data'
import { realLifeUnits, type Breakdown as Result, type Factor } from '../engine'
import { compactMoney, pct, years } from './format'
import { Sheet } from './Sheet'

const LABELS: Record<Factor, { name: string; color: string }> = {
  payGap: { name: 'Same-role pay gap', color: 'var(--pink)' },
  promotions: { name: 'Fewer promotions', color: 'var(--pink)' },
  childPenalty: { name: 'Motherhood penalty', color: 'var(--pink)' },
  partTime: { name: 'Part-time years', color: 'var(--pink)' },
  careerBreak: { name: 'Career break', color: 'var(--pink)' },
  investMix: { name: 'Investing less', color: 'var(--lime)' },
  tradingDrag: { name: 'His overtrading', color: 'var(--lilac)' },
}

export function Breakdown({
  result,
  country,
  onClose,
}: {
  result: Result
  country: CountryCode
  onClose: () => void
}) {
  const factors = (Object.keys(LABELS) as Factor[]).filter((f) => Math.abs(result.factors[f]) >= 1)
  const largest = Math.max(1, ...factors.map((f) => Math.abs(result.factors[f])))
  return (
    <Sheet title="Why his garden grows bigger" onClose={onClose}>
      {result.gap <= 0 ? (
        <p>Your garden already ends as big as his. Nice.</p>
      ) : (
        <>
          <div className="gardens">
            <div className="card pink" style={{ padding: 14 }}>
              <p className="eyebrow">Structural</p>
              <p className="display l">{pct(result.structuralShare)}</p>
              <p style={{ fontSize: 13 }}>Pay, promotions, motherhood, time out</p>
            </div>
            <div className="card lime" style={{ padding: 14 }}>
              <p className="eyebrow">Your choices</p>
              <p className="display l">{pct(result.choiceShare)}</p>
              <p style={{ fontSize: 13 }}>How much you invest</p>
            </div>
          </div>
          <p>
            In total his garden ends <b>{compactMoney(result.gap)}</b> bigger, about{' '}
            <b>{years(realLifeUnits(result.gap, country).yearsOfRent)} of rent</b> or{' '}
            <b>{years(realLifeUnits(result.gap, country).sabbaticalYears)}</b> of fully funded
            sabbatical. In today's money.
          </p>
          <div className="stack">
            {factors.map((f) => (
              <div key={f} className="bar-row">
                <span style={{ fontWeight: 700, fontSize: 14 }}>{LABELS[f].name}</span>
                <span style={{ fontSize: 14 }}>{compactMoney(result.factors[f])}</span>
                <div className="bar">
                  <span
                    style={{
                      width: `${(Math.abs(result.factors[f]) / largest) * 100}%`,
                      background: LABELS[f].color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13 }}>
            Each share is averaged over every order the differences could be added, so they add up
            to the whole gap.
          </p>
        </>
      )}
    </Sheet>
  )
}
