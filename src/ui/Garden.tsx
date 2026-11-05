import { useMemo, useState } from 'react'
import {
  atHerBest,
  breakdown,
  defaultsFor,
  gardenGap,
  herProfile,
  levelTheField,
  realLifeUnits,
  simulate,
  splitFromWeights,
  twinProfile,
  type HerInputs,
  type LifeEvent,
  type Timeline,
} from '../engine'
import { PEOPLE, STAGE_WORDS, growthStage } from '../themes'
import { Assumptions } from './Assumptions'
import { Blob, LifeIcon } from './Blob'
import { Breakdown } from './Breakdown'
import { years } from './format'
import type { Answers } from './answers'

type Scenario = 'today' | 'best' | 'level'
type Kind = LifeEvent['kind']

const CARDS: { kind: Kind; title: string; text: string; color: string }[] = [
  { kind: 'child', title: 'A baby', text: 'You become a parent', color: 'pink' },
  { kind: 'partTime', title: 'Part-time', text: 'Fewer days a week', color: 'yellow' },
  { kind: 'careerBreak', title: 'Career break', text: 'Time out, any reason', color: 'lime' },
]

const describe = (e: LifeEvent) =>
  e.kind === 'child'
    ? `Baby at ${e.age}`
    : e.kind === 'partTime'
      ? `${Math.round(e.hoursShare * 5)} days a week, ${e.fromAge}–${e.toAge}`
      : `Break at ${e.fromAge}, ${e.years} yr`

export function Garden({ answers, onEdit }: { answers: Answers; onEdit: () => void }) {
  const [scenario, setScenario] = useState<Scenario>('today')
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [picking, setPicking] = useState<Kind | null>(null)
  const [days, setDays] = useState(4)
  const [length, setLength] = useState(2)
  const [sheet, setSheet] = useState<'why' | 'assumptions' | null>(null)

  const inputs: HerInputs = useMemo(
    () => ({
      age: answers.age,
      country: answers.country,
      grossSalary: answers.grossSalary,
      savingsRate: answers.savingsRate,
      split: splitFromWeights(answers.weights),
      startYear: new Date().getFullYear(),
      events,
      italyTfrToFund: answers.italyTfrToFund,
    }),
    [answers, events],
  )
  const country = defaultsFor(answers.country)
  const retirementAge = country.retirementAge.value

  const { her, twin } = useMemo((): { her: Timeline; twin: Timeline } => {
    if (scenario === 'level') {
      const l = levelTheField(inputs)
      return { her: simulate(l.her), twin: simulate(l.twin) }
    }
    const herP = scenario === 'best' ? atHerBest(inputs) : herProfile(inputs)
    return { her: simulate(herP), twin: simulate(twinProfile(inputs)) }
  }, [inputs, scenario])

  const gap = gardenGap(her, twin)
  const rentYears = realLifeUnits(Math.abs(gap), answers.country).yearsOfRent
  const biggest = Math.max(her.final.total, twin.final.total)
  const herStage = growthStage(her.final.total, biggest)
  const twinStage = growthStage(twin.final.total, biggest)
  const level = rentYears < 0.05

  const headline = level
    ? 'You end exactly level.'
    : gap > 0
      ? `His garden ends ${years(rentYears)} of rent bigger.`
      : `Yours ends ${years(rentYears)} of rent bigger.`
  const sub =
    scenario === 'today'
      ? 'Same life, same job. Tap "Why?" to see what makes the difference.'
      : scenario === 'best'
        ? 'Same pay, same savings: just a small cash buffer and the rest planted in funds.'
        : 'Remove every structural gap and use your best mix. This is what is left.'

  const ages = Array.from(
    { length: Math.floor(retirementAge) - answers.age },
    (_, k) => answers.age + k,
  )
  const place = (age: number) => {
    if (!picking) return
    const e: LifeEvent =
      picking === 'child'
        ? { kind: 'child', age }
        : picking === 'partTime'
          ? {
              kind: 'partTime',
              fromAge: age,
              toAge: Math.min(age + length, Math.floor(retirementAge)),
              hoursShare: days / 5,
            }
          : { kind: 'careerBreak', fromAge: age, years: length }
    setEvents([...events, e])
    setPicking(null)
  }
  const usedAges = new Set(events.map((e) => (e.kind === 'child' ? e.age : e.fromAge)))

  return (
    <>
      <div className="row between">
        <span className="display" style={{ fontSize: 22 }}>
          PLANT IT
        </span>
        <button className="link" onClick={onEdit}>
          Edit answers
        </button>
      </div>

      <div className="tabs" role="tablist">
        {(
          [
            ['today', 'You today'],
            ['best', 'At your best'],
            ['level', 'Level the field'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={scenario === key}
            className={`tab ${scenario === key ? 'on' : ''}`}
            onClick={() => setScenario(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="card yellow stack">
        <p className="eyebrow">At {retirementAge}</p>
        <h1 className="display l">{headline}</h1>
        <p>{sub}</p>
      </section>

      <div className="gardens">
        <div className="garden pink">
          <Blob color="#FFF8EE" shape="drop" stage={herStage} title="Your garden" />
          <b>{PEOPLE.her.label}</b>
          <span className="muted" style={{ fontSize: 13 }}>
            {STAGE_WORDS[herStage]}
          </span>
        </div>
        <div className="garden lilac">
          <Blob color="#FFF8EE" shape="bean" stage={twinStage} title="Your twin's garden" />
          <b>{PEOPLE.twin.label}</b>
          <span className="muted" style={{ fontSize: 13 }}>
            {STAGE_WORDS[twinStage]}
          </span>
        </div>
      </div>

      <div className="row">
        <button className="btn grow" onClick={() => setSheet('why')}>
          Why?
        </button>
        <button className="btn light grow" onClick={() => setSheet('assumptions')}>
          Assumptions
        </button>
      </div>

      <section className="stack">
        <div className="row between">
          <h2 className="display m">Life happens</h2>
          <span className="eyebrow muted">tap a card, then an age</span>
        </div>
        <div className="scroller">
          {CARDS.map((c) => (
            <button
              key={c.kind}
              className={`life-card ${c.color} ${picking === c.kind ? 'on' : ''}`}
              onClick={() => setPicking(picking === c.kind ? null : c.kind)}
            >
              <LifeIcon kind={c.kind} />
              <b>{c.title}</b>
              <span style={{ fontSize: 13 }}>{c.text}</span>
            </button>
          ))}
        </div>

        {picking === 'partTime' && (
          <div className="chips">
            {[3, 4].map((d) => (
              <button
                key={d}
                className={`chip ${days === d ? 'on' : ''}`}
                onClick={() => setDays(d)}
              >
                {d} days a week
              </button>
            ))}
          </div>
        )}
        {(picking === 'partTime' || picking === 'careerBreak') && (
          <div className="chips">
            {(picking === 'partTime' ? [2, 5, 10] : [1, 2, 3]).map((y) => (
              <button
                key={y}
                className={`chip ${length === y ? 'on' : ''}`}
                onClick={() => setLength(y)}
              >
                {y} {y === 1 ? 'year' : 'years'}
              </button>
            ))}
          </div>
        )}
        {picking && (
          <div className="ages" aria-label="Pick an age">
            {ages.map((age) => (
              <button
                key={age}
                className={`age ${usedAges.has(age) ? 'has' : ''}`}
                onClick={() => place(age)}
              >
                {age}
              </button>
            ))}
          </div>
        )}
        {events.length > 0 && (
          <div className="placed">
            {events.map((e, k) => (
              <button
                key={k}
                className="chip"
                onClick={() => setEvents(events.filter((_, j) => j !== k))}
                aria-label={`Remove ${describe(e)}`}
              >
                {describe(e)} ✕
              </button>
            ))}
          </div>
        )}
      </section>

      {sheet === 'why' && (
        <Breakdown
          result={breakdown(inputs)}
          country={answers.country}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === 'assumptions' && (
        <Assumptions
          country={answers.country}
          italyTfrToFund={answers.italyTfrToFund}
          onClose={() => setSheet(null)}
        />
      )}
    </>
  )
}
