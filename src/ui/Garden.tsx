import { useMemo, useState } from 'react'
import {
  atHerBest,
  defaultsFor,
  eventImpact,
  gardenGap,
  herProfile,
  levelTheField,
  monthlyIncome,
  plantCounts,
  plantUnit,
  simulate,
  splitFromWeights,
  twinProfile,
  type HerInputs,
  type LifeEvent,
  type Profile,
} from '../engine'
import { Assumptions } from './Assumptions'
import { LifeIcon } from './Blob'
import { BabyPlanning } from './BabyPlanning'
import { WhySection } from './WhySection'
import { ageLabel, compactMoney, money } from './format'
import type { Answers } from './answers'
import { Scene } from './Scene'

type Scenario = 'today' | 'best' | 'fair'
type Kind = LifeEvent['kind']

const SCENARIOS: { key: Scenario; label: string; explain: string }[] = [
  {
    key: 'today',
    label: 'Your path',
    explain: 'You keep saving and investing exactly as you do today.',
  },
  {
    key: 'best',
    label: 'Your best path',
    explain:
      'Same pay, same savings. You keep 10% as a cash buffer and plant the rest in index or sustainable funds.',
  },
  {
    key: 'fair',
    label: 'A fair world',
    explain: 'No pay gap, no motherhood penalty, the same promotions. You both use your best path.',
  },
]

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

/** Signs to show in a garden at an age, from the events in that person's profile. */
const signsAt = (p: Profile, age: number) => {
  const signs: string[] = []
  for (const e of p.events) {
    if (e.kind === 'careerBreak' && age >= e.fromAge && age < e.fromAge + e.years)
      signs.push('Break: no new seeds')
    if (e.kind === 'partTime' && age >= e.fromAge && age < e.toAge) signs.push('Part-time')
  }
  return signs
}
const babyAt = (p: Profile, age: number) => p.events.some((e) => e.kind === 'child' && age >= e.age)

export function Garden({ answers, onEdit }: { answers: Answers; onEdit: () => void }) {
  const [scenario, setScenario] = useState<Scenario>('today')
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [picking, setPicking] = useState<Kind | null>(null)
  const [days, setDays] = useState(4)
  const [length, setLength] = useState(2)
  const [step, setStep] = useState<number | null>(null)
  const [showNumbers, setShowNumbers] = useState(false)

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

  const { herP, twinP } = useMemo((): { herP: Profile; twinP: Profile } => {
    if (scenario === 'fair') {
      const l = levelTheField(inputs)
      return { herP: l.her, twinP: l.twin }
    }
    return {
      herP: scenario === 'best' ? atHerBest(inputs) : herProfile(inputs),
      twinP: twinProfile(inputs),
    }
  }, [inputs, scenario])
  const her = useMemo(() => simulate(herP), [herP])
  const twin = useMemo(() => simulate(twinP), [twinP])

  const last = her.points.length - 1
  const i = step === null || step > last ? last : step
  const herNow = her.points[i]
  const twinNow = twin.points[i]
  const unit = plantUnit(Math.max(her.final.total, twin.final.total))

  const gap = gardenGap(her, twin)
  const perMonth = monthlyIncome(Math.abs(gap), answers.country)
  const level = Math.abs(gap) < 500
  const atAge = `At ${ageLabel(retirementAge)}, the retirement age in ${country.inName ?? country.name}`
  const headline = level
    ? 'You end exactly level.'
    : gap > 0
      ? `His garden is worth ${compactMoney(gap)} more than yours.`
      : `Your garden is worth ${compactMoney(-gap)} more than his.`
  const income = level
    ? 'With the gaps removed and your own choices, you retire with the same garden as him.'
    : gap > 0
      ? `That's about ${money(perMonth)} more for him every month of his retirement.`
      : `That's about ${money(perMonth)} more for you every month of your retirement.`

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
  const markers = new Set(events.map((e) => (e.kind === 'child' ? e.age : e.fromAge)))
  const thinking = picking === 'child' || events.some((e) => e.kind === 'child')

  return (
    <div className="page">
      <div className="row between">
        <span className="display" style={{ fontSize: 22 }}>
          PLANT IT
        </span>
        <button className="link" onClick={onEdit}>
          Edit answers
        </button>
      </div>

      <div className="tabs" role="tablist">
        {SCENARIOS.map((s) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={scenario === s.key}
            className={`tab ${scenario === s.key ? 'on' : ''}`}
            onClick={() => setScenario(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="explain">{SCENARIOS.find((s) => s.key === scenario)!.explain}</p>

      <section className="card yellow stack">
        <p className="eyebrow">{atAge}</p>
        <h1 className="display l">{headline}</h1>
        <p style={{ fontSize: 17 }}>{income}</p>
        <p className="muted" style={{ fontSize: 13 }}>
          All amounts in today's money, after inflation.
        </p>
      </section>

      <div className="scenes">
        {(
          [
            ['her', 'Your garden', herNow, herP, 'pink'],
            ['twin', "Your twin's garden", twinNow, twinP, 'lilac'],
          ] as const
        ).map(([who, title, point, profile, color]) => (
          <section key={who} className={`scene-card ${color}`}>
            <div className="row between" style={{ padding: '12px 16px' }}>
              <b>{title}</b>
              <span className="display" style={{ fontSize: 20 }}>
                {compactMoney(point.total)}
              </span>
            </div>
            <Scene
              person={who}
              counts={plantCounts(point, unit)}
              signs={signsAt(profile, point.age)}
              baby={babyAt(profile, point.age)}
            />
          </section>
        ))}
      </div>

      <section className="card white stack">
        <div className="row between">
          <b>Watch them grow</b>
          <span className="display" style={{ fontSize: 20 }}>
            Age {Math.floor(herNow.age)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={last}
          value={i}
          onChange={(e) => setStep(Number(e.target.value))}
          aria-label="Age"
        />
        <div className="row between muted" style={{ fontSize: 13 }}>
          <span>Today, {answers.age}</span>
          <span>1 plant ≈ {compactMoney(unit)} · fruit = growth</span>
          <span>{Math.floor(retirementAge)}</span>
        </div>
      </section>

      <div className="split">
        <section className="stack">
          <div>
            <h2 className="display m">Life happens</h2>
            <p className="muted">
              Tap a card, then the age it happens. See what it does to your garden.
            </p>
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
                  className={`age ${markers.has(age) ? 'has' : ''}`}
                  onClick={() => place(age)}
                >
                  {age}
                </button>
              ))}
            </div>
          )}
          {events.map((e, k) => (
            <div key={k} className="assumption row between" style={{ flexDirection: 'row' }}>
              <div>
                <b>{describe(e)}</b>
                <p style={{ fontSize: 14 }}>
                  Your garden ends <b>{compactMoney(eventImpact(inputs, e))}</b> smaller at{' '}
                  {Math.floor(retirementAge)}
                  {e.kind === 'child' ? '. His stays the same.' : '.'}
                </p>
              </div>
              <button
                className="chip"
                onClick={() => setEvents(events.filter((_, j) => j !== k))}
                aria-label={`Remove ${describe(e)}`}
              >
                ✕
              </button>
            </div>
          ))}
          {thinking && <BabyPlanning country={answers.country} />}
        </section>

        <WhySection inputs={inputs} />
      </div>

      <section className="stack">
        <div className="row between">
          <h2 className="display m">Where do these numbers come from?</h2>
        </div>
        <p className="muted">
          Every number is from a public source: national statistics offices, Eurostat, the OECD and
          academic studies. Each one says whether it is for {country.inName ?? country.name} or an
          EU average.
        </p>
        <button className="btn light" onClick={() => setShowNumbers(!showNumbers)}>
          {showNumbers ? 'Hide the numbers' : 'Show all the numbers'}
        </button>
        {showNumbers && (
          <Assumptions country={answers.country} italyTfrToFund={answers.italyTfrToFund} />
        )}
      </section>
    </div>
  )
}
