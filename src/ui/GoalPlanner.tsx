import { useMemo, useState } from 'react'
import { defaultsFor, goalPlan, type HerInputs } from '../engine'
import { compactMoney, money } from './format'
import { WhyLink } from './WhyLink'

type GoalKind = 'home' | 'baby' | 'break' | 'studies' | 'business' | 'other'

const GOALS: { kind: GoalKind; label: string; icon: string }[] = [
  { kind: 'home', label: 'A home', icon: '🏡' },
  { kind: 'baby', label: 'A baby', icon: '🍼' },
  { kind: 'break', label: 'Time off', icon: '🌴' },
  { kind: 'studies', label: 'Studies', icon: '🎓' },
  { kind: 'business', label: 'My own business', icon: '💡' },
  { kind: 'other', label: 'Something else', icon: '✨' },
]

/**
 * "Plan for something": she types how much she needs and when. The engine works out the monthly
 * amount (kept in a savings account, because it's needed soon) and what it costs her retirement
 * garden if it comes out of what she saves now.
 */
export function GoalPlanner({
  inputs,
  onAddBaby,
  onTryBreak,
}: {
  inputs: HerInputs
  onAddBaby: (age: number) => void
  onTryBreak: () => void
}) {
  const [kind, setKind] = useState<GoalKind>('home')
  const [amount, setAmount] = useState('')
  const [years, setYears] = useState(3)
  const c = defaultsFor(inputs.country)
  const value = Number(amount.replace(/[^\d]/g, '')) || 0
  const plan = useMemo(
    () => (value > 0 ? goalPlan(inputs, value, years) : null),
    [inputs, value, years],
  )
  const goal = GOALS.find((g) => g.kind === kind)!
  const atAge = inputs.age + years

  return (
    <div className="plan-card goal">
      <h3>Plan for something</h3>
      <p className="muted">
        Something coming up? Say how much you need and when. Money you need within a few years stays
        in a savings account. <WhyLink id="time" />
      </p>

      <div className="goal-chips" role="radiogroup" aria-label="What are you planning for?">
        {GOALS.map((g) => (
          <button
            key={g.kind}
            role="radio"
            aria-checked={kind === g.kind}
            className={`chip ${kind === g.kind ? 'on' : ''}`}
            onClick={() => setKind(g.kind)}
          >
            <span aria-hidden>{g.icon}</span> {g.label}
          </button>
        ))}
      </div>

      <div className="goal-inputs">
        <label htmlFor="goal-amount" className="goal-field">
          <span>
            {kind === 'home'
              ? 'How much do you need (deposit and buying costs)?'
              : 'How much do you need?'}
          </span>
          <span className="goal-money">
            €
            <input
              id="goal-amount"
              inputMode="numeric"
              placeholder="Type an amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </span>
        </label>
        <label htmlFor="goal-years" className="goal-field">
          <span>
            In <b>{years}</b> {years === 1 ? 'year' : 'years'} (at {atAge})
          </span>
          <input
            id="goal-years"
            type="range"
            min={1}
            max={10}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </label>
      </div>

      {!plan ? (
        <p className="goal-result muted">
          Type an amount to see what to set aside each month for {goal.label.toLowerCase()}.
        </p>
      ) : (
        <div className="goal-result">
          <p className="goal-big">
            Set aside about <b>{money(plan.monthly)}</b> a month for {years}{' '}
            {years === 1 ? 'year' : 'years'}.
          </p>
          {plan.shortfall > 0 ? (
            <p className="bad">
              That's {money(plan.shortfall)} more than the {money(plan.currentMonthly)} you save
              now. Try more time or a smaller amount, or save more.
            </p>
          ) : (
            <p>
              If it comes out of your {money(plan.currentMonthly)} a month, your retirement garden
              ends about <b>{compactMoney(plan.retirementCost)}</b> smaller. Saving it on top keeps
              your garden on track.
            </p>
          )}
          {kind === 'home' && (
            <p className="muted">
              How much of the price you need up front differs by country and bank: ask your bank
              before you settle on an amount.
            </p>
          )}
          {kind === 'baby' && (
            <p className="goal-action">
              In {c.inName ?? c.name} you get {c.maternityLeave.value.weeks} weeks of paid leave.{' '}
              <button className="inline-link" onClick={() => onAddBaby(atAge)}>
                Add a baby at {atAge} to your garden
              </button>
            </p>
          )}
          {kind === 'break' && (
            <p className="goal-action">
              A break also pauses your pension.{' '}
              <button className="inline-link" onClick={onTryBreak}>
                Try a career break in Life happens
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
