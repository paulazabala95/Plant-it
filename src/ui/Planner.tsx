import { useEffect, useMemo, useState } from 'react'
import { defaultsFor, investMore, notInvesting, simulate, type LifeEvent } from '../engine'
import { ActionPlan } from './ActionPlan'
import { GoalPlanner } from './GoalPlanner'
import { Principles } from './Principles'
import { WhatIf } from './WhatIf'
import { compactMoney, money } from './format'
import { toInputs, type Answers } from './answers'

type Step = 'numbers' | 'goals' | 'actions'

const STEPS: { key: Step; label: string }[] = [
  { key: 'numbers', label: 'Your numbers' },
  { key: 'goals', label: 'Your goals' },
  { key: 'actions', label: 'Action plan' },
]

/**
 * The Planner: turns the simulation into a plan in three steps. The garden stays a clean
 * illustration; this is where she plans and acts.
 */
export function Planner({
  answers,
  events,
  onGarden,
  onEdit,
  onAddBaby,
  onTryBreak,
}: {
  answers: Answers
  events: LifeEvent[]
  onGarden: () => void
  onEdit: () => void
  onAddBaby: (age: number) => void
  onTryBreak: () => void
}) {
  // Coming back to a plan she already started: open on her action plan.
  const [step, setStep] = useState<Step>(() => {
    try {
      return localStorage.getItem('plant-it-plan-v1') ? 'actions' : 'numbers'
    } catch {
      return 'numbers'
    }
  })
  const inputs = useMemo(() => toInputs(answers, events), [answers, events])
  const c = defaultsFor(answers.country)
  const retire = Math.floor(c.retirementAge.value)
  const invested = useMemo(() => investMore(inputs, 0).savings, [inputs])
  const saved = useMemo(() => simulate(notInvesting(inputs)).final.savings, [inputs])
  const index = STEPS.findIndex((s) => s.key === step)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  return (
    <div className="planner">
      <div className="bar">
        <span className="logo">Plant it</span>
        <span className="planner-links">
          <button className="edit-pill" onClick={onGarden}>
            <span aria-hidden>←</span> My garden
          </button>
          <button className="edit-pill" onClick={onEdit}>
            <span aria-hidden>✎</span> Edit answers
          </button>
        </span>
      </div>

      <header className="planner-head">
        <p className="eyebrow">Your plan</p>
        <h1>From seeing it to planting it</h1>
        <p className="lead">
          Invested, your {money(answers.monthlySavings)} a month becomes about{' '}
          <b>{compactMoney(invested)}</b> by {retire}, instead of {compactMoney(saved)} in a savings
          account.
        </p>
      </header>

      <nav className="stepper" aria-label="Plan steps">
        <ol>
          {STEPS.map((s, i) => (
            <li key={s.key}>
              <button
                className={`step ${s.key === step ? 'on' : ''} ${i < index ? 'past' : ''}`}
                aria-current={s.key === step ? 'step' : undefined}
                onClick={() => setStep(s.key)}
              >
                <span className="step-n" aria-hidden>
                  {i < index ? '✓' : i + 1}
                </span>
                <span className="step-label">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section className="planner-step panel">
        {step === 'numbers' && (
          <div className="stack">
            <h2>What small changes do</h2>
            <p className="muted">Move the sliders. Every number is worked out for you.</p>
            <WhatIf inputs={inputs} retire={retire} />
          </div>
        )}
        {step === 'goals' && (
          <div className="stack">
            <h2>Anything coming up?</h2>
            <p className="muted">
              A home, a baby, time off: set money aside for it, apart from your retirement garden.
              You can skip this.
            </p>
            <GoalPlanner inputs={inputs} onAddBaby={onAddBaby} onTryBreak={onTryBreak} />
          </div>
        )}
        {step === 'actions' && <ActionPlan inputs={inputs} monthly={answers.monthlySavings} />}

        <div className="planner-nav">
          {index > 0 && (
            <button className="btn small light" onClick={() => setStep(STEPS[index - 1].key)}>
              ← {STEPS[index - 1].label}
            </button>
          )}
          {index < STEPS.length - 1 && (
            <button className="btn small" onClick={() => setStep(STEPS[index + 1].key)}>
              Next: {STEPS[index + 1].label} →
            </button>
          )}
        </div>
      </section>

      <section className="panel" id="how-plant-it-thinks">
        <Principles />
      </section>
    </div>
  )
}
