import { useMemo, useState } from 'react'
import { investMore, waitingCost, type HerInputs } from '../engine'
import { compactMoney, money } from './format'
import { WhyLink } from './WhyLink'

/** Two what-if sliders: invest a little more, or wait before starting. The engine does the maths. */
export function WhatIf({ inputs, retire }: { inputs: HerInputs; retire: number }) {
  const [extra, setExtra] = useState(50)
  const [wait, setWait] = useState(5)
  const more = useMemo(() => investMore(inputs, extra), [inputs, extra])
  const late = useMemo(() => waitingCost(inputs, wait), [inputs, wait])

  return (
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
          I wait <b>{wait}</b> {wait === 1 ? 'year' : 'years'} before I start{' '}
          <WhyLink id="start-early" />
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
  )
}
