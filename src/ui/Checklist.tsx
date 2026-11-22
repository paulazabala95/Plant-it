import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_CASH_BUFFER, FUND_COSTS, REGULATORS } from '../data'
import { amountsBySplit, atHerBest, defaultsFor, pensionRate, type HerInputs } from '../engine'
import { money, pct } from './format'
import { WhyLink } from './WhyLink'

interface Item {
  id: string
  text: string
}
interface Group {
  id: string
  /** The principle behind this group (see "How Plant It thinks"). */
  why: string
  title: string
  items: Item[]
}

const STORAGE_KEY = 'plant-it-checklist'

const load = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, boolean>
  } catch {
    return {}
  }
}

/**
 * Her plan as an essentials checklist she can tick off. Ticks stay on her own device only.
 * Educational: it says what to check, never which product to buy.
 */
export function Checklist({ inputs, monthly }: { inputs: HerInputs; monthly: number }) {
  const c = defaultsFor(inputs.country)
  const regulator = REGULATORS[inputs.country]
  const amounts = useMemo(() => amountsBySplit(monthly, atHerBest(inputs).split), [inputs, monthly])
  const invest = monthly - amounts.cash - amounts.greenhouse
  const pensionNow = pensionRate(
    inputs.italyTfrToFund && c.optionalPensionFund
      ? c.optionalPensionFund.value
      : c.investedPension.value,
    inputs.startYear,
  )

  const groups: Group[] = [
    {
      id: 'buffer',
      why: 'buffer',
      title: 'Your safety buffer',
      items: [
        { id: 'costs', text: 'I know what my essential costs are each month.' },
        {
          id: 'buffer',
          text: `I keep a buffer in a savings account for surprises (in Plant It, ${pct(DEFAULT_CASH_BUFFER)} of what I save: about ${money(amounts.greenhouse)} a month).`,
        },
      ],
    },
    {
      id: 'pension',
      why: 'automate',
      title: 'Your workplace pension',
      items: [
        {
          id: 'have',
          text:
            pensionNow > 0
              ? `I know how much goes into my workplace pension (about ${pct(pensionNow, 1)} of pay in ${c.inName ?? c.name}).`
              : 'I asked my employer whether they offer a workplace pension.',
        },
        { id: 'how', text: 'I know how my pension is invested and what it costs.' },
        { id: 'add', text: 'I asked whether I can add to it, and whether my employer adds more.' },
      ],
    },
    {
      id: 'provider',
      why: 'low-costs',
      title: 'Where you invest',
      items: [
        {
          id: 'compare',
          text: 'I compared at least three places: my bank, an online broker and a robo-adviser.',
        },
        {
          id: 'regulated',
          text: `I checked the provider is authorised, with ${regulator.name}.`,
        },
        {
          id: 'fees',
          text: `I checked all yearly costs: the fund's cost (index funds and ETFs were about ${pct(FUND_COSTS.indexFund, 2)} a year in 2024) plus any account or platform fees.`,
        },
      ],
    },
    {
      id: 'what',
      why: 'spread',
      title: 'What you invest in',
      items: [
        { id: 'broad', text: 'I chose a broad, low-cost index fund or ETF.' },
        {
          id: 'spread',
          text: 'I keep single stocks and crypto, if any, to a small part of my savings.',
        },
      ],
    },
    {
      id: 'automate',
      why: 'automate',
      title: 'Make it automatic',
      items: [
        {
          id: 'plan',
          text: `I set up a monthly plan of about ${money(invest)} on payday.`,
        },
        {
          id: 'raise',
          text: 'I put a yearly reminder in my calendar to check my plan and raise it when my pay rises.',
        },
      ],
    },
    {
      id: 'life',
      why: 'time',
      title: 'Life moments',
      items: [
        {
          id: 'leave',
          text: `If I'm planning a baby: I know my leave (${c.maternityLeave.value.weeks} weeks in ${c.inName ?? c.name}) and have a buffer first.`,
        },
        {
          id: 'keep',
          text: 'If I go part-time or take a break: I keep planting, even a small amount.',
        },
      ],
    },
  ]

  const [done, setDone] = useState<Record<string, boolean>>(load)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done))
    } catch {
      /* private window: ticks just won't be remembered */
    }
  }, [done])

  const all = groups.flatMap((g) => g.items.map((i) => `${g.id}.${i.id}`))
  const count = all.filter((k) => done[k]).length

  const asText = () =>
    [
      'My Plant It checklist',
      '',
      ...groups.flatMap((g) => [
        g.title,
        ...g.items.map((i) => `${done[`${g.id}.${i.id}`] ? '[x]' : '[ ]'} ${i.text}`),
        '',
      ]),
      'Education, not financial advice. https://paulazabala95.github.io/Plant-it/',
    ].join('\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="checklist" aria-labelledby="checklist-title">
      <div className="checklist-head">
        <div>
          <p className="eyebrow">Your essentials</p>
          <h3 id="checklist-title">My checklist</h3>
        </div>
        <p className="checklist-progress" aria-live="polite">
          <b>{count}</b> of {all.length} done
        </p>
      </div>
      <div className="checklist-bar" aria-hidden>
        <span style={{ width: `${(count / all.length) * 100}%` }} />
      </div>
      <div className="checklist-groups">
        {groups.map((g) => (
          <fieldset key={g.id} className="checklist-group">
            <legend>
              {g.title} <WhyLink id={g.why} />
            </legend>
            {g.items.map((i) => {
              const key = `${g.id}.${i.id}`
              return (
                <label key={key} className={`check ${done[key] ? 'on' : ''}`} htmlFor={key}>
                  <input
                    id={key}
                    type="checkbox"
                    checked={!!done[key]}
                    onChange={(e) => setDone({ ...done, [key]: e.target.checked })}
                  />
                  <span>{i.text}</span>
                </label>
              )
            })}
          </fieldset>
        ))}
      </div>
      <div className="checklist-actions">
        <button className="btn small" onClick={copy}>
          {copied ? 'Copied ✓' : 'Copy my checklist'}
        </button>
        <button className="btn small light" onClick={() => window.print()}>
          Print or save as PDF
        </button>
      </div>
      <p className="muted checklist-note">
        Your ticks are saved on this device only. Check the provider at{' '}
        <a href={regulator.url} target="_blank" rel="noopener">
          {regulator.url.replace('https://', '')}
        </a>
        . Education, not financial advice.
      </p>
    </section>
  )
}
