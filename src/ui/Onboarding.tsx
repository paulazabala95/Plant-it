import { useState } from 'react'
import { COUNTRIES, GARDEN_OPTIONS, type CountryCode } from '../data'
import { amountsBySplit, netMonthly, savingsShare, splitFromWeights } from '../engine'
import { OPTION_LOOKS } from '../themes'
import { PlotIcon } from './art'
import type { Answers } from './answers'
import { money, pct } from './format'

type Step = 'age' | 'country' | 'italy' | 'salary' | 'savings' | 'split'
const COLORS: Record<Step, string> = {
  age: 'pink',
  country: 'lilac',
  italy: 'lime',
  salary: 'yellow',
  savings: 'lime',
  split: 'lilac-soft',
}
const FLAGS: Record<CountryCode, string> = {
  NL: '🇳🇱',
  ES: '🇪🇸',
  DE: '🇩🇪',
  FR: '🇫🇷',
  IT: '🇮🇹',
  IE: '🇮🇪',
}

export function Onboarding({
  initial,
  onDone,
  onBack,
}: {
  initial: Answers
  onDone: (a: Answers) => void
  onBack: () => void
}) {
  const [a, setA] = useState(initial)
  const [i, setI] = useState(0)
  const steps: Step[] = [
    'age',
    'country',
    ...(a.country === 'IT' ? ['italy' as const] : []),
    'salary',
    'savings',
    'split',
  ]
  const step = steps[i]
  const set = (patch: Partial<Answers>) => setA({ ...a, ...patch })
  const next = () => (i === steps.length - 1 ? onDone(a) : setI(i + 1))
  const canNext = step !== 'italy' || a.italyTfrToFund !== undefined
  const split = splitFromWeights(a.weights)
  const net = netMonthly(a.grossSalary, a.country)
  const share = savingsShare(a.monthlySavings, a.grossSalary, a.country)
  const euros = amountsBySplit(Math.min(a.monthlySavings, net), split)

  return (
    <>
      <div className="row between">
        <button className="link" onClick={() => (i === 0 ? onBack() : setI(i - 1))}>
          ← Back
        </button>
        <span className="eyebrow">
          {i + 1} / {steps.length}
        </span>
      </div>
      <div className="dots">
        {steps.map((s, k) => (
          <span key={s} className={`dot ${k <= i ? 'on' : ''}`} />
        ))}
      </div>

      <section className={`card ${COLORS[step]} stack`} style={{ minHeight: 420 }}>
        {step === 'age' && (
          <>
            <h1 className="display l">How old are you?</h1>
            <div className="big-number">{a.age}</div>
            <input
              type="range"
              min={18}
              max={64}
              value={a.age}
              onChange={(e) => set({ age: Number(e.target.value) })}
              aria-label="Age"
            />
          </>
        )}

        {step === 'country' && (
          <>
            <h1 className="display l">Where do you pay income tax?</h1>
            <p>
              Usually the country where you live. Pay gaps, pensions and leave differ in every
              country.
            </p>
            <div className="stack">
              {(Object.keys(COUNTRIES) as CountryCode[]).map((c) => (
                <button
                  key={c}
                  className={`chip ${a.country === c ? 'on' : ''}`}
                  style={{ padding: '14px 18px', fontSize: 17, textAlign: 'left' }}
                  onClick={() => set({ country: c, italyTfrToFund: undefined })}
                >
                  {FLAGS[c]} &nbsp;{COUNTRIES[c].name}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'italy' && (
          <>
            <h1 className="display l">One Italy question</h1>
            <p>Does your TFR (trattamento di fine rapporto) go to a pension fund?</p>
            <p className="muted">
              If it stays with your employer it isn't invested. Check your payslip or ask HR if
              you're not sure.
            </p>
            <div className="stack">
              <button
                className={`chip ${a.italyTfrToFund === true ? 'on' : ''}`}
                style={{ padding: 16, fontSize: 17 }}
                onClick={() => set({ italyTfrToFund: true })}
              >
                Yes, it goes to a pension fund
              </button>
              <button
                className={`chip ${a.italyTfrToFund === false ? 'on' : ''}`}
                style={{ padding: 16, fontSize: 17 }}
                onClick={() => set({ italyTfrToFund: false })}
              >
                No / it stays with my employer
              </button>
            </div>
          </>
        )}

        {step === 'salary' && (
          <>
            <h1 className="display l">Your gross salary</h1>
            <p>Per year, before tax, as if you worked full-time.</p>
            <label className="money-input">
              €
              <input
                inputMode="numeric"
                value={a.grossSalary.toLocaleString('en-IE')}
                onChange={(e) =>
                  set({ grossSalary: Number(e.target.value.replace(/\D/g, '')) || 0 })
                }
                aria-label="Gross yearly salary in euros"
              />
            </label>
            <input
              type="range"
              min={15_000}
              max={150_000}
              step={1000}
              value={a.grossSalary}
              onChange={(e) => set({ grossSalary: Number(e.target.value) })}
              aria-label="Gross yearly salary"
            />
            <div className="estimate">
              ≈ <b>{money(net)}</b> a month after tax and social contributions
              <span className="muted">
                Estimate for {COUNTRIES[a.country].inName ?? COUNTRIES[a.country].name}, single, no
                children (OECD Taxing Wages 2025).
              </span>
            </div>
          </>
        )}

        {step === 'savings' && (
          <>
            <h1 className="display l">How much of your net pay do you put aside each month?</h1>
            <p>
              Your net pay is about <b>{money(net)}</b> a month.
            </p>
            <label className="money-input">
              €
              <input
                inputMode="numeric"
                value={a.monthlySavings.toLocaleString('en-IE')}
                onChange={(e) =>
                  set({ monthlySavings: Number(e.target.value.replace(/\D/g, '')) || 0 })
                }
                aria-label="Euros put aside each month"
              />
            </label>
            <input
              type="range"
              min={0}
              max={Math.max(10, Math.round(net / 10) * 10)}
              step={10}
              value={Math.min(a.monthlySavings, Math.round(net / 10) * 10)}
              onChange={(e) => set({ monthlySavings: Number(e.target.value) })}
              aria-label="Euros put aside each month"
            />
            <p className="estimate">
              = <b>{pct(share)}</b> of your net pay
            </p>
          </>
        )}

        {step === 'split' && (
          <>
            <h1 className="display l">Where do your savings go?</h1>
            <p>
              Of your <b>{money(Math.min(a.monthlySavings, net))}</b> a month: tap everything you
              use, then slide roughly how much goes to each.
            </p>
            <div className="chips">
              {GARDEN_OPTIONS.map((o) => (
                <button
                  key={o}
                  className={`chip ${a.weights[o] ? 'on' : ''}`}
                  onClick={() => {
                    const weights = { ...a.weights }
                    if (weights[o]) delete weights[o]
                    else weights[o] = 5
                    set({ weights })
                  }}
                >
                  {OPTION_LOOKS[o].plain}
                </button>
              ))}
            </div>
            <div className="stack">
              {GARDEN_OPTIONS.filter((o) => a.weights[o]).map((o) => (
                <div key={o} className="assumption" style={{ background: OPTION_LOOKS[o].color }}>
                  <div className="row" style={{ gap: 10 }}>
                    <PlotIcon plot={o} />
                    <div className="grow">
                      <b>{OPTION_LOOKS[o].plain}</b>
                      <p className="split-amount">
                        {pct(split[o])} · {money(euros[o])} a month
                      </p>
                      <p style={{ fontSize: 13 }}>
                        {OPTION_LOOKS[o].metaphor} · {OPTION_LOOKS[o].meaning}
                      </p>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={a.weights[o]}
                    onChange={(e) =>
                      set({ weights: { ...a.weights, [o]: Number(e.target.value) } })
                    }
                    aria-label={`${OPTION_LOOKS[o].plain} share`}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <button className="btn block" onClick={next} disabled={!canNext}>
        Next
      </button>
    </>
  )
}
