import { useEffect, useMemo, useState } from 'react'
import {
  atHerBest,
  breakdown,
  causePlants,
  defaultsFor,
  eventImpact,
  gardenGap,
  herProfile,
  investedShare,
  investingVsTwin,
  notInvesting,
  monthlyIncome,
  plantCounts,
  plantUnit,
  promotionAges,
  savingsShare,
  seedsBetween,
  simulate,
  splitFromWeights,
  twinProfile,
  type Factor,
  type HerInputs,
  type LifeEvent,
  type Plot,
  type Profile,
} from '../engine'
import { REAL_RETURNS } from '../data'
import { PALETTE, lookAtAge } from '../themes'
import { Assumptions } from './Assumptions'
import { LifeIcon } from './art'
import { BabyPlanning } from './BabyPlanning'
import { GardenKey } from './GardenKey'
import { WhySection } from './WhySection'
import { World, type Side } from './World'
import { ageLabel, compactMoney, money, pct } from './format'
import type { Answers } from './answers'
import { useIsPhone } from './useIsPhone'

type Scenario = 'none' | 'today' | 'investing'
type Phase = 'growing' | 'reveal' | 'result'
type Kind = LifeEvent['kind']

const SCENARIOS: { key: Scenario; label: string; explain: string }[] = [
  {
    key: 'none',
    label: 'Not investing',
    explain: 'All your savings stay in a savings account. Nothing is invested.',
  },
  {
    key: 'today',
    label: 'Your mix today',
    explain: 'Your savings split exactly as you told us.',
  },
  {
    key: 'investing',
    label: 'Investing',
    explain: 'The same money: a 10% cash buffer, the rest in index or sustainable funds.',
  },
]

const CARDS: { kind: Kind; title: string; text: string }[] = [
  { kind: 'child', title: 'A baby', text: 'You become a parent' },
  { kind: 'partTime', title: 'Part-time', text: 'Fewer days a week' },
  { kind: 'careerBreak', title: 'Career break', text: 'Time out, any reason' },
]

const CAUSE_COLORS: Record<Factor, string> = {
  childPenalty: PALETTE.sunsetPetal,
  payGap: PALETTE.goldenPollen,
  promotions: '#4F86B8',
  partTime: PALETTE.dustyOrchid,
  careerBreak: '#9B6FD0',
  investMix: '#7E9C4E',
  tradingDrag: '#8A6146',
}
const CAUSE_NAMES: Record<Factor, string> = {
  childPenalty: 'Motherhood penalty',
  payGap: 'Same-role pay gap',
  promotions: 'Fewer promotions',
  partTime: 'Part-time years',
  careerBreak: 'Career break',
  investMix: 'Investing less',
  tradingDrag: 'His overtrading',
}

const describe = (e: LifeEvent) =>
  e.kind === 'child'
    ? `Baby at ${e.age}`
    : e.kind === 'partTime'
      ? `${Math.round(e.hoursShare * 5)} days a week, ${e.fromAge}–${e.toAge}`
      : `Break at ${e.fromAge}, ${e.years} yr`

const STEP_MS = 300

export function Garden({ answers, onEdit }: { answers: Answers; onEdit: () => void }) {
  const phone = useIsPhone()
  const [scenario, setScenario] = useState<Scenario>('none')
  // The story plays "Not investing" then "Investing" until she picks a tab herself.
  const [story, setStory] = useState(true)
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [picking, setPicking] = useState<Kind | null>(null)
  const [days, setDays] = useState(4)
  const [length, setLength] = useState(2)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState<Phase>('growing')
  const [showNumbers, setShowNumbers] = useState(false)
  const [showKey, setShowKey] = useState(false)

  const inputs: HerInputs = useMemo(
    () => ({
      age: answers.age,
      country: answers.country,
      grossSalary: answers.grossSalary,
      savingsRate: savingsShare(answers.monthlySavings, answers.grossSalary, answers.country),
      split: splitFromWeights(answers.weights),
      startYear: new Date().getFullYear(),
      events,
      italyTfrToFund: answers.italyTfrToFund,
    }),
    [answers, events],
  )
  const c = defaultsFor(answers.country)
  const retirementAge = c.retirementAge.value

  const herP: Profile = useMemo(
    () =>
      scenario === 'none'
        ? notInvesting(inputs)
        : scenario === 'investing'
          ? atHerBest(inputs)
          : herProfile(inputs),
    [inputs, scenario],
  )
  const twinP = useMemo(() => twinProfile(inputs), [inputs])
  const her = useMemo(() => simulate(herP), [herP])
  const twin = useMemo(() => simulate(twinP), [twinP])
  const why = useMemo(() => breakdown({ ...inputs, split: herP.split }), [inputs, herP])
  const without = useMemo(() => simulate(notInvesting(inputs)), [inputs])
  const vsTwin = useMemo(() => investingVsTwin(inputs), [inputs])
  const last = her.points.length - 1

  // Replay the time-lapse whenever the scenario or the life events change.
  const replay = () => {
    setStep(0)
    setPhase('growing')
    setPlaying(true)
  }
  useEffect(replay, [events])

  useEffect(() => {
    if (!playing) return
    if (step >= last) {
      setPlaying(false)
      setPhase(scenario !== 'investing' && gardenGap(her, twin) > 0 ? 'reveal' : 'result')
      return
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [playing, step, last, scenario, her, twin])

  useEffect(() => {
    if (phase !== 'reveal') return
    const t = setTimeout(() => setPhase('result'), 9000)
    return () => clearTimeout(t)
  }, [phase])

  // Story: after the "Not investing" result, replant the same money invested.
  useEffect(() => {
    if (!story || scenario !== 'none' || phase !== 'result') return
    const t = setTimeout(() => {
      setScenario('investing')
      setStep(0)
      setPhase('growing')
      setPlaying(true)
    }, 5000)
    return () => clearTimeout(t)
  }, [story, scenario, phase])

  // Reset the time-lapse in the same update, so the old result never flashes.
  function changeScenario(key: Scenario) {
    setScenario(key)
    replay()
  }
  const pickTab = (key: Scenario) => {
    setStory(false)
    changeScenario(key)
  }

  const i = Math.min(step, last)
  const herNow = her.points[i]
  const twinNow = twin.points[i]
  const age = herNow.age
  const progress = last === 0 ? 1 : i / last
  const unit = plantUnit(Math.max(her.final.total, twin.final.total), 42)
  const herCounts = plantCounts(herNow, unit)
  const twinCounts = plantCounts(twinNow, unit)
  const plots = [
    ...new Set<Plot>(
      [...plantCounts(her.final, unit), ...plantCounts(twin.final, unit)].map((k) => k.plot),
    ),
  ]
  const gap = gardenGap(her, twin)
  const perMonth = monthlyIncome(Math.abs(gap), answers.country)

  // Reveal: light up the twin's extra plants, grouped by cause.
  const highlight: Record<number, string> = {}
  const causes = causePlants(why.factors, 0)
  if (phase === 'reveal') {
    const herN = herCounts.reduce((s, k) => s + k.plants, 0)
    const twinN = twinCounts.reduce((s, k) => s + k.plants, 0)
    const split = causePlants(why.factors, Math.max(0, twinN - herN))
    Object.assign(causes, split)
    let idx = herN
    for (const f of Object.keys(split) as Factor[]) {
      for (let k = 0; k < split[f]; k++) highlight[idx++] = CAUSE_COLORS[f]
    }
  }

  const child = herP.events.find(
    (e): e is Extract<LifeEvent, { kind: 'child' }> => e.kind === 'child',
  )
  const babyYears = (a: number) =>
    !!child && a >= child.age && a < child.age + c.childPenalty.value.years
  const herPromos = promotionAges(answers.age, retirementAge, herP.promotionRate)
  const twinPromos = promotionAges(answers.age, retirementAge, twinP.promotionRate)
  const prev = i > 0 ? i - 1 : 0
  const herMood: Side['mood'] =
    !playing && phase !== 'growing'
      ? gap > 0
        ? 'worried'
        : 'beaming'
      : babyYears(age)
        ? 'flat'
        : 'happy'

  const herSide: Side = {
    counts: herCounts,
    ...lookAtAge(age, '#3B2A2A'),
    baby: babyYears(age),
    mood: herMood,
    label: 'You',
    value: compactMoney(herNow.total),
    promoted: playing && herPromos.includes(Math.floor(age)),
    seeds: playing ? seedsBetween(her.points[prev], herNow, unit) : 0,
  }
  const twinSide: Side = {
    counts: twinCounts,
    ...lookAtAge(age, '#4A3426'),
    baby: babyYears(age),
    mood: 'happy',
    label: 'Your twin',
    value: compactMoney(twinNow.total),
    promoted: playing && twinPromos.includes(Math.floor(age)),
    highlight,
    seeds: playing ? seedsBetween(twin.points[prev], twinNow, unit) : 0,
  }

  // "Why" tags, shown while the gardens grow on your path.
  const tags: { at: number; title: string; text: string; choice?: boolean }[] = []
  if (scenario !== 'investing') {
    const f = why.factors
    if (f.payGap > 0)
      tags.push({
        at: answers.age,
        title: 'Pay gap',
        text: `Same job, but he's paid ${pct(c.samePayGap.value, 1)} more. More seeds every month, from day one.`,
      })
    if (f.investMix > 0)
      tags.push({
        at: answers.age + 1,
        title: 'Investing',
        text: `He invests ${pct(investedShare(twinP.split))} of his savings, like a typical man in ${c.inName ?? c.name}. You invest ${pct(investedShare(herP.split))}.`,
        choice: true,
      })
    if (child && f.childPenalty > 0)
      tags.push({
        at: child.age,
        title: 'Motherhood penalty',
        text: `Baby at ${child.age}: your pay drops ${pct(c.childPenalty.value.drop)} for ${c.childPenalty.value.years} years. His doesn't change.`,
      })
    if (f.promotions > 0 && twinPromos.length)
      tags.push({
        at: twinPromos[0],
        title: 'Promotions',
        text: `Each year he's more likely to be promoted (${pct(c.promotionRate.value.men, 1)} vs ${pct(c.promotionRate.value.women, 1)}).`,
      })
    for (const e of herP.events) {
      if (e.kind === 'partTime')
        tags.push({
          at: e.fromAge,
          title: 'Part-time',
          text: `From ${e.fromAge}: you work ${Math.round(e.hoursShare * 5)} days a week, he stays full-time.`,
        })
      if (e.kind === 'careerBreak')
        tags.push({
          at: e.fromAge,
          title: 'Career break',
          text: `At ${e.fromAge}: no pay, no new seeds for ${e.years} ${e.years === 1 ? 'year' : 'years'}.`,
        })
    }
    tags.sort((a, b) => a.at - b.at)
  }
  const visibleTags = phase === 'growing' ? tags.filter((t) => age >= t.at) : []

  const amount = money(answers.monthlySavings)
  const investGain = gardenGap(without, her)
  const twinLine =
    Math.abs(gap) < 500
      ? 'You end level with your twin.'
      : gap > 0
        ? `Your twin still ends ${compactMoney(gap)} ahead.`
        : `You end ${compactMoney(-gap)} ahead of your twin.`
  let headline: string
  let sub: string
  if (scenario === 'investing') {
    headline = `Investing the same ${amount} a month gives you ${compactMoney(investGain)} more.`
    sub = `That's about ${money(monthlyIncome(investGain, answers.country))} more every month of your retirement. ${twinLine}`
  } else {
    headline =
      Math.abs(gap) < 500
        ? 'You end level with your twin.'
        : gap > 0
          ? `${scenario === 'none' ? 'Not investing, his' : 'His'} garden ends ${compactMoney(gap)} bigger than yours.`
          : `Your garden ends ${compactMoney(-gap)} bigger than his.`
    sub =
      gap > 0 ? `That's about ${money(perMonth)} more for him every month of his retirement.` : ''
    const better = gardenGap(her, simulate(atHerBest(inputs)))
    if (story && scenario === 'none')
      sub += ` Now watch what happens if you plant the same ${amount}.`
    else if (better > 500) sub += ` Investing the same money would add ${compactMoney(better)}.`
  }

  const ages = Array.from(
    { length: Math.floor(retirementAge) - answers.age },
    (_, k) => answers.age + k,
  )
  const place = (a: number) => {
    if (!picking) return
    const e: LifeEvent =
      picking === 'child'
        ? { kind: 'child', age: a }
        : picking === 'partTime'
          ? {
              kind: 'partTime',
              fromAge: a,
              toAge: Math.min(a + length, Math.floor(retirementAge)),
              hoursShare: days / 5,
            }
          : { kind: 'careerBreak', fromAge: a, years: length }
    setEvents([...events, e])
    setPicking(null)
  }
  const markers = new Set(events.map((e) => (e.kind === 'child' ? e.age : e.fromAge)))
  const thinkingOfBaby = picking === 'child' || events.some((e) => e.kind === 'child')

  const legend = (
    <div className="legend">
      <h3>His garden is worth {compactMoney(gap)} more. Here's why:</h3>
      {(Object.keys(CAUSE_NAMES) as Factor[])
        .filter((f) => why.factors[f] >= 1)
        .sort((a, b) => why.factors[b] - why.factors[a])
        .map((f) => (
          <div key={f} className="legend-row">
            <span>
              <span className="swatch" style={{ background: CAUSE_COLORS[f] }} />
              {CAUSE_NAMES[f]}
            </span>
            <b>
              {compactMoney(why.factors[f])} ·{' '}
              {causes[f] === 0
                ? 'less than a plant'
                : `${causes[f]} ${causes[f] === 1 ? 'plant' : 'plants'}`}
            </b>
          </div>
        ))}
      <div className="shares">
        <div className="pink-soft">
          <strong>{pct(why.structuralShare)}</strong>the system
        </div>
        <div className="lime-soft">
          <strong>{pct(why.choiceShare)}</strong>your choices
        </div>
      </div>
      <button className="link" onClick={() => setPhase('result')}>
        See the result
      </button>
    </div>
  )

  // Investing: why she can end ahead of a twin who never faced the gaps.
  const twinInSavings = twinP.split.cash + twinP.split.greenhouse
  const aheadCard = gap < 0 && (
    <div className="ahead">
      <h3>Why do you end up ahead of him?</h3>
      <ul>
        <li>
          You put in less: <b>{compactMoney(vsTwin.herPaidIn)}</b> vs his{' '}
          <b>{compactMoney(vsTwin.twinPaidIn)}</b>, because of the gaps in pay and promotions
          {events.length > 0 ? ' and your life events' : ''}.
        </li>
        <li>
          He keeps <b>{pct(twinInSavings)}</b> of his savings in a savings account, like a typical
          man in {c.inName ?? c.name}. You invest <b>{pct(investedShare(herP.split))}</b>.
        </li>
        <li>
          Invested money grows about <b>{pct(REAL_RETURNS.indexFund)}</b> a year above prices. A
          savings account doesn't keep up.
        </li>
      </ul>
      {vsTwin.twinLikeHer > vsTwin.herTotal && (
        <p className="ahead-note">
          If he invested like you, he'd end with <b>{compactMoney(vsTwin.twinLikeHer)}</b>, still{' '}
          {compactMoney(vsTwin.twinLikeHer - vsTwin.herTotal)} ahead. Investing doesn't remove the
          gaps, it outgrows them.
        </p>
      )}
    </div>
  )

  const hudTop = (
    <div className="hud-top">
      <div className="bar">
        <span className="logo">Plant it</span>
        <span className="bar-links">
          <button className="link" onClick={() => setShowKey(true)}>
            {phone ? 'Garden key' : 'What do the plants mean?'}
          </button>
          <button className="link" onClick={onEdit}>
            Edit answers
          </button>
        </span>
      </div>
      <div className="tabs" role="tablist">
        {SCENARIOS.map((s) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={scenario === s.key}
            className={`tab ${scenario === s.key ? 'on' : ''}`}
            onClick={() => pickTab(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="explain">{SCENARIOS.find((s) => s.key === scenario)!.explain}</p>
      {phase === 'growing' && story && scenario === 'investing' && (
        <div className="banner">Now plant the same {amount} a month</div>
      )}
      {phase === 'growing' && (
        <div className="pill">
          Watching {Math.round(retirementAge - answers.age)} years · age {Math.floor(age)}
        </div>
      )}
      {phase === 'reveal' && legend}
      {phase === 'result' && (
        <div className="headline">
          <p className="eyebrow">
            At {ageLabel(retirementAge)}, the retirement age in {c.inName ?? c.name}
          </p>
          <h1>{headline}</h1>
          <p>{sub}</p>
          {scenario === 'investing' && aheadCard}
          {scenario !== 'investing' && gap > 0 && (
            <button className="link" onClick={() => setPhase('reveal')}>
              Why is his garden bigger?
            </button>
          )}
          {scenario !== 'investing' && !story && (
            <button className="btn small" onClick={() => pickTab('investing')}>
              Plant it: see it invested
            </button>
          )}
        </div>
      )}
    </div>
  )

  const tagList = (
    <div className="tags">
      {visibleTags.map((t) => (
        <div key={t.title} className={`tag ${t.choice ? 'choice' : ''}`}>
          <b>{t.title}</b>
          {t.text}
        </div>
      ))}
    </div>
  )

  const hudBottom = (
    <div className="hud-bottom">
      <button className="play" onClick={replay} aria-label="Replay the time-lapse">
        ↻
      </button>
      <span className="age">{Math.floor(age)}</span>
      <input
        type="range"
        min={0}
        max={last}
        value={i}
        onChange={(e) => {
          const v = Number(e.target.value)
          setPlaying(false)
          setStep(v)
          setPhase(v === last ? 'result' : 'growing')
        }}
        aria-label="Age"
      />
    </div>
  )

  return (
    <div className="garden-page">
      {phone ? (
        <>
          {hudTop}
          {tagList}
          <World mode="her" progress={progress} her={herSide} twin={twinSide} tick={i} />
          <World mode="twin" progress={progress} her={herSide} twin={twinSide} tick={i} />
          {hudBottom}
        </>
      ) : (
        <section className="stage">
          <World mode="wide" progress={progress} her={herSide} twin={twinSide} tick={i} />
          {hudTop}
          {tagList}
          {hudBottom}
        </section>
      )}

      {showKey && <GardenKey plots={plots} unit={unit} onClose={() => setShowKey(false)} />}

      <div className="below">
        <section className="panel stack">
          <h2>Life happens</h2>
          <p className="muted">Tap a card, then the age it happens. Your garden replays with it.</p>
          <div className="cards">
            {CARDS.map((card) => (
              <button
                key={card.kind}
                className={`life-card ${picking === card.kind ? 'on' : ''}`}
                onClick={() => setPicking(picking === card.kind ? null : card.kind)}
              >
                <LifeIcon kind={card.kind} />
                <b>{card.title}</b>
                <span>{card.text}</span>
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
              {ages.map((a) => (
                <button
                  key={a}
                  className={`age-chip ${markers.has(a) ? 'has' : ''}`}
                  onClick={() => place(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
          {events.map((e, k) => (
            <div key={k} className="event">
              <div>
                <b>{describe(e)}</b>
                <p>
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
          {thinkingOfBaby && <BabyPlanning country={answers.country} />}
        </section>

        <section className="panel">
          <WhySection inputs={inputs} />
        </section>

        <section className="panel stack wide">
          <h2>Where do these numbers come from?</h2>
          <p className="muted">
            Every number is from a public source: national statistics offices, Eurostat, the OECD
            and academic studies. Each one says whether it is for {c.inName ?? c.name} or an EU
            average.
          </p>
          <button className="btn light" onClick={() => setShowNumbers(!showNumbers)}>
            {showNumbers ? 'Hide the numbers' : 'Show all the numbers'}
          </button>
          {showNumbers && (
            <Assumptions country={answers.country} italyTfrToFund={answers.italyTfrToFund} />
          )}
        </section>
      </div>
    </div>
  )
}
