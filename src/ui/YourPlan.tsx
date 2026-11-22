import { useMemo, useState } from 'react'
import { DEFAULT_CASH_BUFFER, FUND_COSTS, PUBLIC_CLIENT, type ClientConfig } from '../data'
import { defaultsFor, investMore, pensionRate, waitingCost, type HerInputs } from '../engine'
import { compactMoney, money, pct } from './format'

const JOIN_URL = `${import.meta.env.BASE_URL}join/`

/**
 * What she can do after the simulation. The engine works out every number; this panel only
 * explains. Educational: it never names products or providers (the client block may, for a
 * partner, later).
 */
export function YourPlan({
  inputs,
  monthly,
  client = PUBLIC_CLIENT,
  onLifeHappens,
}: {
  inputs: HerInputs
  monthly: number
  client?: ClientConfig
  onLifeHappens: () => void
}) {
  const [extra, setExtra] = useState(50)
  const [wait, setWait] = useState(5)
  const c = defaultsFor(inputs.country)
  const retire = Math.floor(c.retirementAge.value)
  const invested = useMemo(() => investMore(inputs, 0).savings, [inputs])
  const more = useMemo(() => investMore(inputs, extra), [inputs, extra])
  const late = useMemo(() => waitingCost(inputs, wait), [inputs, wait])
  const pensionNow = pensionRate(
    inputs.italyTfrToFund && c.optionalPensionFund
      ? c.optionalPensionFund.value
      : c.investedPension.value,
    inputs.startYear,
  )

  return (
    <section className="plan" aria-labelledby="plan-title">
      <div className="plan-head">
        <p className="eyebrow">Your plan</p>
        <h2 id="plan-title">From seeing it to planting it</h2>
        <p className="muted">
          Invested, your {money(monthly)} a month becomes about <b>{compactMoney(invested)}</b> by{' '}
          {retire}. Here's how to get started, and what small changes do.
        </p>
      </div>

      <div className="plan-grid">
        <div className="plan-card whatif">
          <h3>What if…</h3>
          <label className="whatif-row" htmlFor="plan-extra">
            <span>
              I invest <b>{money(extra)}</b> more a month
            </span>
            <input
              id="plan-extra"
              type="range"
              min={0}
              max={300}
              step={25}
              value={extra}
              onChange={(e) => setExtra(Number(e.target.value))}
            />
          </label>
          <p className="whatif-result good">
            {extra === 0
              ? 'Move the slider to see what a little more does.'
              : `${compactMoney(more.savings)} by ${retire}: ${compactMoney(more.extra)} more.`}
          </p>

          <label className="whatif-row" htmlFor="plan-wait">
            <span>
              I wait <b>{wait}</b> {wait === 1 ? 'year' : 'years'} before I start
            </span>
            <input
              id="plan-wait"
              type="range"
              min={0}
              max={10}
              step={1}
              value={wait}
              onChange={(e) => setWait(Number(e.target.value))}
            />
          </label>
          <p className="whatif-result bad">
            {wait === 0
              ? 'Starting now costs nothing.'
              : `${compactMoney(late.savings)} by ${retire}: waiting costs ${compactMoney(late.cost)}.`}
          </p>
        </div>

        <div className="plan-card">
          <h3>Your first steps</h3>
          <ol className="steps">
            <li>
              <b>Keep a safety buffer.</b> Leave some savings in a savings account for surprises. In
              Plant It, {pct(DEFAULT_CASH_BUFFER)} of what you save stays there.
            </li>
            <li>
              <b>Check your workplace pension.</b>{' '}
              {pensionNow > 0
                ? `About ${pct(pensionNow, 1)} of your pay already goes into one. Ask how it's invested and whether you can add to it.`
                : 'Ask your employer whether they offer one, and whether they add money to it.'}
            </li>
            <li>
              <b>Choose low cost and wide spread.</b> Index funds and ETFs hold thousands of
              companies. In 2024 they cost about {pct(FUND_COSTS.indexFund, 2)} a year, against{' '}
              {pct(FUND_COSTS.activeFund, 2)} for actively managed funds. Picking single stocks is a
              gamble.
            </li>
            <li>
              <b>Automate it.</b> Set up a monthly plan on payday, so investing happens without
              thinking about it.
            </li>
            <li>
              <b>Plan for life moments.</b> A baby, part-time years or a break change your garden.{' '}
              <button className="inline-link" onClick={onLifeHappens}>
                Try them in Life happens
              </button>
              .
            </li>
          </ol>
        </div>

        <div className="plan-card start">
          <h3>{client.whereToStart.title}</h3>
          <p>{client.whereToStart.text}</p>
          {client.whereToStart.link && (
            <a className="btn small" href={client.whereToStart.link.url}>
              {client.whereToStart.link.label}
            </a>
          )}
        </div>

        <div className="plan-card keep">
          <h3>Keep your plan</h3>
          <p>Get your plan by email, with a gentle reminder to start.</p>
          <a className="btn small" href={JOIN_URL} target="_blank" rel="noopener">
            Email me my plan
          </a>
          <p className="pip-soon">🌱 Soon: ask Pip your questions about your garden.</p>
        </div>
      </div>
      <p className="muted plan-note">
        This is education, not financial advice. Compare providers and check they are regulated.
      </p>
    </section>
  )
}
