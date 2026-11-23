import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_CASH_BUFFER,
  FUND_COSTS,
  PUBLIC_CLIENT,
  REGULATORS,
  type ClientConfig,
} from '../data'
import { amountsBySplit, atHerBest, defaultsFor, pensionRate, type HerInputs } from '../engine'
import { money, pct } from './format'
import {
  addDays,
  addYears,
  daysBetween,
  dueLabel,
  formatDay,
  fromISO,
  nextPayday,
  toICS,
  toISO,
  type CalendarItem,
} from './planDates'
import { WhyLink } from './WhyLink'

type Timing = 'done' | 'week' | 'twoWeeks' | 'payday' | 'year' | 'someday'
type Status = 'todo' | 'done' | 'skip'

interface Action {
  id: string
  title: string
  detail?: string
  why?: string
  timing: Timing
  yearly?: boolean
  link?: { label: string; url: string }
}

interface ItemState {
  due?: string
  status: Status
  doneAt?: string
  /** She picked the date herself: a new payday doesn't move it. */
  custom?: boolean
}

interface PlanState {
  /** Day of the month she's paid; null = she skipped the question. */
  payday?: number | null
  created: string
  items: Record<string, ItemState>
}

const STORAGE_KEY = 'plant-it-plan-v1'
const SOON_DAYS = 30
const JOIN_URL = `${import.meta.env.BASE_URL}join/`

const loadPlan = (): PlanState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PlanState) : null
  } catch {
    return null
  }
}

const savePlan = (p: PlanState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch {
    /* private window: the plan isn't remembered */
  }
}

/** The suggested due date for an action, from when the plan was made. */
function suggestedDue(timing: Timing, created: Date, payday: number | null | undefined) {
  switch (timing) {
    case 'week':
      return toISO(addDays(created, 7))
    case 'twoWeeks':
      return toISO(addDays(created, 14))
    case 'payday':
      return toISO(payday ? nextPayday(addDays(created, 1), payday) : addDays(created, 14))
    case 'year':
      return toISO(addYears(created, 1))
    default:
      return undefined
  }
}

/**
 * Her action plan: each step has a due date and a status (to do, done, not for me).
 * Saved on her device only. Educational: what to check, never which product to buy.
 */
export function ActionPlan({
  inputs,
  monthly,
  client = PUBLIC_CLIENT,
}: {
  inputs: HerInputs
  monthly: number
  client?: ClientConfig
}) {
  const c = defaultsFor(inputs.country)
  const regulator = REGULATORS[inputs.country]
  const amounts = useMemo(() => amountsBySplit(monthly, atHerBest(inputs).split), [inputs, monthly])
  const buffer = amounts.cash + amounts.greenhouse
  const invest = monthly - buffer
  const pensionNow = pensionRate(
    inputs.italyTfrToFund && c.optionalPensionFund
      ? c.optionalPensionFund.value
      : c.investedPension.value,
    inputs.startYear,
  )

  const actions: Action[] = [
    { id: 'seen', title: 'See what not investing costs you', timing: 'done' },
    ...(monthly > 0
      ? [
          {
            id: 'saving',
            title: `Save every month (you put aside ${money(monthly)})`,
            timing: 'done' as const,
          },
        ]
      : []),
    {
      id: 'pension',
      title:
        pensionNow > 0
          ? 'Ask how your workplace pension is invested, and whether you can add to it'
          : 'Ask your employer whether they offer a workplace pension',
      detail:
        pensionNow > 0
          ? `About ${pct(pensionNow, 1)} of your pay already goes in (${c.inName ?? c.name}).`
          : undefined,
      why: 'automate',
      timing: 'week',
    },
    {
      id: 'compare',
      title: 'Compare three places to invest: your bank, an online broker and a robo-adviser',
      detail: client.whereToStart.text,
      why: 'low-costs',
      timing: 'week',
    },
    {
      id: 'regulated',
      title: `Check the one you pick is authorised by ${regulator.name}`,
      link: { label: regulator.url.replace('https://', ''), url: regulator.url },
      why: 'education',
      timing: 'week',
    },
    {
      id: 'fund',
      title: 'Choose a broad, low-cost index fund or ETF',
      detail: `Index funds and ETFs cost about ${pct(FUND_COSTS.indexFund, 2)} a year in 2024, against ${pct(FUND_COSTS.activeFund, 2)} for active funds.`,
      why: 'spread',
      timing: 'twoWeeks',
    },
    {
      id: 'buffer',
      title: `Keep a buffer: about ${money(buffer)} a month stays in a savings account`,
      detail: `That's ${pct(DEFAULT_CASH_BUFFER)} of what you save, for surprises.`,
      why: 'buffer',
      timing: 'payday',
    },
    {
      id: 'plan',
      title: `Set up your ${money(invest)} monthly plan on payday`,
      why: 'automate',
      timing: 'payday',
    },
    {
      id: 'review',
      title: 'Yearly check-up: raise your plan when your pay rises',
      why: 'start-early',
      timing: 'year',
      yearly: true,
    },
    {
      id: 'baby',
      title: `Planning a baby? Know your leave (${c.maternityLeave.value.weeks} weeks) and build a buffer first`,
      why: 'time',
      timing: 'someday',
    },
    {
      id: 'keep-planting',
      title: 'Going part-time or taking a break? Keep planting, even a little',
      why: 'care-is-work',
      timing: 'someday',
    },
  ]

  const today = useMemo(() => new Date(), [])
  const [plan, setPlan] = useState<PlanState>(() => {
    const saved = loadPlan()
    if (saved) return saved
    const created = toISO(today)
    const items: Record<string, ItemState> = {}
    for (const a of actions) {
      items[a.id] =
        a.timing === 'done'
          ? { status: 'done', doneAt: created }
          : { status: 'todo', due: suggestedDue(a.timing, today, undefined) }
    }
    return { created, items }
  })
  const [tab, setTab] = useState<'next' | 'done' | 'later'>('next')
  const [editing, setEditing] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => savePlan(plan), [plan])

  // Actions added in later versions get their state on first view.
  const stateOf = (a: Action): ItemState =>
    plan.items[a.id] ??
    (a.timing === 'done'
      ? { status: 'done', doneAt: plan.created }
      : { status: 'todo', due: suggestedDue(a.timing, fromISO(plan.created), plan.payday) })

  const update = (id: string, patch: Partial<ItemState>) =>
    setPlan((p) => ({
      ...p,
      items: { ...p.items, [id]: { ...stateOfId(p, id), ...patch } },
    }))
  const stateOfId = (p: PlanState, id: string) =>
    p.items[id] ?? stateOf(actions.find((a) => a.id === id)!)

  const setPayday = (day: number | null) =>
    setPlan((p) => {
      const items = { ...p.items }
      for (const a of actions.filter((x) => x.timing === 'payday')) {
        const s = items[a.id] ?? stateOf(a)
        if (s.status === 'todo' && !s.custom)
          items[a.id] = { ...s, due: suggestedDue('payday', today, day) }
      }
      return { ...p, payday: day, items }
    })

  const counted = actions.filter((a) => stateOf(a).status !== 'skip' && a.timing !== 'someday')
  const doneCount = counted.filter((a) => stateOf(a).status === 'done').length
  const todo = actions
    .filter((a) => stateOf(a).status === 'todo')
    .sort((a, b) => (stateOf(a).due ?? '9999').localeCompare(stateOf(b).due ?? '9999'))
  const isSoon = (a: Action) => {
    const due = stateOf(a).due
    return !!due && daysBetween(today, fromISO(due)) <= SOON_DAYS
  }
  const nextUp = todo.filter(isSoon)
  const later = todo.filter((a) => !isSoon(a))
  const done = actions
    .filter((a) => stateOf(a).status !== 'todo')
    .sort((a, b) => (stateOf(b).doneAt ?? '').localeCompare(stateOf(a).doneAt ?? ''))
  const next = nextUp[0] ?? later.find((a) => stateOf(a).due)
  const lists = { next: nextUp, later, done }

  const calendarItem = (a: Action): CalendarItem => ({
    id: a.id,
    title: `Plant It: ${a.title}`,
    description: [a.detail, 'Your Plant It plan. Education, not financial advice.']
      .filter(Boolean)
      .join('\n'),
    due: stateOf(a).due!,
    yearly: a.yearly,
  })

  const downloadICS = (items: Action[], name: string) => {
    const ics = toICS(items.filter((a) => stateOf(a).due).map(calendarItem), new Date())
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
    const link = document.createElement('a')
    link.href = url
    link.download = name
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const asMarkdown = () =>
    [
      '# My Plant It plan',
      '',
      ...actions
        .filter((a) => stateOf(a).status !== 'skip')
        .map((a) => {
          const s = stateOf(a)
          const when =
            s.status === 'done'
              ? s.doneAt && ` (done ${formatDay(fromISO(s.doneAt))})`
              : s.due && ` (due ${formatDay(fromISO(s.due))})`
          return `- [${s.status === 'done' ? 'x' : ' '}] ${a.title}${when ?? ''}`
        }),
      '',
      'Education, not financial advice. https://paulazabala95.github.io/Plant-it/',
    ].join('\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asMarkdown())
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const nextLabel = next && stateOf(next).due ? dueLabel(stateOf(next).due!, today) : null

  return (
    <section className="action-plan" aria-labelledby="action-plan-title">
      <header className="ap-head">
        <div className="ap-title-row">
          <h2 id="action-plan-title">Your action plan</h2>
          <p className="ap-count">
            <b>{doneCount}</b> of {counted.length} done
          </p>
        </div>
        <div
          className="ap-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={counted.length}
          aria-valuenow={doneCount}
          aria-label="Steps done"
        >
          <span style={{ width: `${(doneCount / Math.max(1, counted.length)) * 100}%` }} />
        </div>
        {next ? (
          <p className={`ap-next ${nextLabel?.tone ?? ''}`}>
            <span className="ap-next-label">Next up</span>
            <span>
              {next.title}
              {nextLabel && <b> · {nextLabel.text}</b>}
            </span>
          </p>
        ) : (
          <p className="ap-next done">
            <span className="ap-next-label">All done 🌱</span>
            <span>Your yearly check-up will come round. Keep planting.</span>
          </p>
        )}
      </header>

      {plan.payday === undefined ? (
        <div className="ap-payday">
          <label htmlFor="payday">What day of the month do you get paid?</label>
          <div className="ap-payday-row">
            <select
              id="payday"
              defaultValue=""
              onChange={(e) => e.target.value && setPayday(Number(e.target.value))}
            >
              <option value="" disabled>
                Choose a day
              </option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button className="btn small light" onClick={() => setPayday(null)}>
              Skip
            </button>
          </div>
          <p className="muted">We use it to date your payday steps. You can change any date.</p>
        </div>
      ) : (
        <p className="ap-payday-set muted">
          {plan.payday ? `Paid on day ${plan.payday} of the month.` : 'No payday set.'}{' '}
          <button
            className="inline-link"
            onClick={() => setPlan((p) => ({ ...p, payday: undefined }))}
          >
            Change
          </button>
        </p>
      )}

      <div className="ap-tabs" role="tablist" aria-label="Your steps">
        {(
          [
            ['next', 'Next up', nextUp.length],
            ['done', 'Done', done.length],
            ['later', 'Later', later.length],
          ] as const
        ).map(([key, label, n]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={`ap-tab ${tab === key ? 'on' : ''}`}
            onClick={() => setTab(key)}
          >
            {label} <span className="ap-tab-n">{n}</span>
          </button>
        ))}
      </div>

      <ul className="ap-list" role="tabpanel">
        {lists[tab].length === 0 && (
          <li className="ap-empty muted">
            {tab === 'next'
              ? 'Nothing due in the next month. Look in Later.'
              : tab === 'done'
                ? 'Tick a step when you have done it. It moves here.'
                : 'Nothing planned for later.'}
          </li>
        )}
        {lists[tab].map((a) => {
          const s = stateOf(a)
          const label = s.due ? dueLabel(s.due, today) : null
          return (
            <li key={a.id} className={`ap-item ${s.status}`}>
              <label className="ap-check" htmlFor={`ap-${a.id}`}>
                <input
                  id={`ap-${a.id}`}
                  type="checkbox"
                  checked={s.status === 'done'}
                  disabled={s.status === 'skip'}
                  onChange={(e) =>
                    update(
                      a.id,
                      e.target.checked
                        ? { status: 'done', doneAt: toISO(new Date()) }
                        : { status: 'todo', doneAt: undefined },
                    )
                  }
                />
                <span className="ap-title">{a.title}</span>
              </label>
              <div className="ap-meta">
                {s.status === 'done' && s.doneAt && (
                  <span className="ap-due done">Done {formatDay(fromISO(s.doneAt))}</span>
                )}
                {s.status === 'skip' && <span className="ap-due">Not for me</span>}
                {s.status === 'todo' &&
                  (label ? (
                    <span className={`ap-due ${label.tone}`}>{label.text}</span>
                  ) : (
                    <span className="ap-due">No date yet</span>
                  ))}
                {a.yearly && s.status === 'todo' && <span className="ap-due">every year</span>}
              </div>
              {a.detail && s.status === 'todo' && <p className="ap-detail">{a.detail}</p>}
              {a.link && s.status === 'todo' && (
                <a className="ap-link" href={a.link.url} target="_blank" rel="noopener">
                  {a.link.label} ↗
                </a>
              )}
              {editing === a.id && (
                <label className="ap-date" htmlFor={`ap-date-${a.id}`}>
                  <span>Due date</span>
                  <input
                    id={`ap-date-${a.id}`}
                    type="date"
                    min={toISO(today)}
                    value={s.due ?? ''}
                    onChange={(e) =>
                      e.target.value && update(a.id, { due: e.target.value, custom: true })
                    }
                  />
                  <button className="ap-action" onClick={() => setEditing(null)}>
                    Done
                  </button>
                </label>
              )}
              <div className="ap-actions">
                {s.status === 'todo' && (
                  <>
                    {s.due && (
                      <button
                        className="ap-action"
                        onClick={() => downloadICS([a], `plant-it-${a.id}.ics`)}
                      >
                        <span aria-hidden>📅</span> Add to calendar
                      </button>
                    )}
                    <button
                      className="ap-action"
                      onClick={() => setEditing(editing === a.id ? null : a.id)}
                    >
                      {s.due ? 'Change date' : 'Set a date'}
                    </button>
                    <button className="ap-action" onClick={() => update(a.id, { status: 'skip' })}>
                      Not for me
                    </button>
                  </>
                )}
                {s.status === 'skip' && (
                  <button className="ap-action" onClick={() => update(a.id, { status: 'todo' })}>
                    Undo
                  </button>
                )}
                {a.why && <WhyLink id={a.why} />}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="ap-export">
        <button className="btn small" onClick={copy}>
          {copied ? 'Copied: paste it into Notion ✓' : 'Copy to Notion'}
        </button>
        <button
          className="btn small light"
          onClick={() =>
            downloadICS(
              actions.filter((a) => stateOf(a).status === 'todo'),
              'plant-it-plan.ics',
            )
          }
        >
          <span aria-hidden>📅</span> Add all to calendar
        </button>
        <a className="btn small light" href={JOIN_URL} target="_blank" rel="noopener">
          Email me reminders
        </a>
      </div>
      <p className="muted ap-note">
        Your plan is saved on this device only. Pasted into Notion, it becomes a to-do list.
        Education, not financial advice.
      </p>
    </section>
  )
}
