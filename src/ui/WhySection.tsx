import {
  breakdown,
  defaultsFor,
  fairWorldGain,
  investedShare,
  monthlyIncome,
  typicalManSplit,
  type Factor,
  type HerInputs,
} from '../engine'
import { compactMoney, money, pct } from './format'
import { SourceNote } from './SourceNote'
import { factorSources } from './sources'

export function WhySection({ inputs }: { inputs: HerInputs }) {
  const r = breakdown(inputs)
  const c = defaultsFor(inputs.country)
  const sources = factorSources(c)
  const explain: Record<Factor, { name: string; text: string; kind: 'structural' | 'choice' }> = {
    payGap: {
      name: 'Same-role pay gap',
      text: `In ${c.inName ?? c.name}, women earn ${pct(c.samePayGap.value, 1)} less than men in the same role.`,
      kind: 'structural',
    },
    promotions: {
      name: 'Fewer promotions',
      text: `Each year he has a ${pct(c.promotionRate.value.men, 1)} chance of promotion, you ${pct(c.promotionRate.value.women, 1)}.`,
      kind: 'structural',
    },
    childPenalty: {
      name: 'Motherhood penalty',
      text: `After a first baby, mothers' pay drops ${pct(c.childPenalty.value.drop)} for about ${c.childPenalty.value.years} years. Fathers' pay doesn't change.`,
      kind: 'structural',
    },
    partTime: {
      name: 'Part-time years',
      text: 'You work fewer days; he keeps working full-time.',
      kind: 'structural',
    },
    careerBreak: {
      name: 'Career break',
      text: 'You take time out; he keeps working.',
      kind: 'structural',
    },
    investMix: {
      name: r.factors.investMix >= 0 ? 'Investing less' : 'You invest more',
      text:
        r.factors.investMix >= 0
          ? `He invests ${pct(investedShare(typicalManSplit(inputs.country)))} of his savings, like a typical man in ${c.inName ?? c.name}. You invest ${pct(investedShare(inputs.split))}.`
          : `You invest more of your savings than a typical man in ${c.inName ?? c.name}, so this shrinks the gap.`,
      kind: 'choice',
    },
    tradingDrag: {
      name: 'His overtrading',
      text: 'Men trade single stocks and crypto more often, and pay for it.',
      kind: 'choice',
    },
  }
  const factors = (Object.keys(explain) as Factor[]).filter((f) => Math.abs(r.factors[f]) >= 1)
  const largest = Math.max(1, ...factors.map((f) => Math.abs(r.factors[f])))

  return (
    <section className="stack">
      <h2 className="display m">Why is his garden bigger?</h2>
      {r.gap <= 0 ? (
        <p>On your path, your garden already ends as big as his.</p>
      ) : (
        <>
          <p>
            On your path, his garden ends <b>{compactMoney(r.gap)}</b> bigger, about{' '}
            <b>{money(monthlyIncome(r.gap, inputs.country))} a month</b> through his retirement.
            Here is where that comes from:
          </p>
          <p className="muted" style={{ fontSize: 13 }}>
            The gardens compare your own savings. Workplace pensions are shown apart.
          </p>
          <div className="gardens">
            <div className="card pink" style={{ padding: 14 }}>
              <p className="eyebrow">The system</p>
              <p className="display l">{pct(r.structuralShare)}</p>
              <p style={{ fontSize: 13 }}>Pay, promotions, motherhood, time out</p>
            </div>
            <div className="card lime" style={{ padding: 14 }}>
              <p className="eyebrow">Your choices</p>
              <p className="display l">{pct(r.choiceShare)}</p>
              <p style={{ fontSize: 13 }}>How much you invest</p>
            </div>
          </div>
          <div className="stack">
            {factors.map((f) => (
              <div key={f} className="assumption">
                <div className="row between">
                  <b>{explain[f].name}</b>
                  <b>{compactMoney(r.factors[f])}</b>
                </div>
                <div className="bar">
                  <span
                    style={{
                      width: `${(Math.abs(r.factors[f]) / largest) * 100}%`,
                      background: explain[f].kind === 'structural' ? 'var(--pink)' : 'var(--lime)',
                    }}
                  />
                </div>
                <p style={{ fontSize: 14 }}>{explain[f].text}</p>
                {sources[f] ? (
                  <SourceNote sources={sources[f]} />
                ) : (
                  <p className="source">From the life event you added.</p>
                )}
              </div>
            ))}
          </div>
          {fairWorldGain(inputs) > 500 && (
            <p className="note">
              <b>In a fair world</b>, with no pay gap, no motherhood penalty and the same
              promotions, your garden would end {compactMoney(fairWorldGain(inputs))} bigger.
            </p>
          )}
          <p className="muted" style={{ fontSize: 13 }}>
            Each share is averaged over every order the differences could be added, so they add up
            to the whole gap.
          </p>
        </>
      )}
    </section>
  )
}
