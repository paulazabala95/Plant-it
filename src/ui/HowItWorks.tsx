import { amountsBySplit, splitFromWeights, type GardenOption, type Plot } from '../engine'
import { PLOT_LOOKS } from '../themes'
import type { Answers } from './answers'
import { PlotIcon } from './art'
import { money, pct } from './format'

const ORDER: Plot[] = [
  'cash',
  'greenhouse',
  'governmentBonds',
  'indexFund',
  'activeFund',
  'sustainableFund',
  'singleStocks',
  'crypto',
  'lifeInsurance',
]

/** After the questions: the metaphor, with her own mix highlighted first. */
export function HowItWorks({
  answers,
  onNext,
  onBack,
}: {
  answers: Answers
  onNext: () => void
  onBack: () => void
}) {
  const split = splitFromWeights(answers.weights)
  const euros = amountsBySplit(answers.monthlySavings, split)
  const mine = (p: Plot): p is GardenOption => p !== 'pension' && split[p] > 0
  const ordered = [...ORDER.filter(mine), ...ORDER.filter((p) => !mine(p))]
  return (
    <div className="how">
      <button className="link" style={{ alignSelf: 'flex-start' }} onClick={onBack}>
        ← Back
      </button>
      <section className="sheet-card how-intro">
        <p className="eyebrow">How your garden grows</p>
        <h1>Every euro you save is a seed.</h1>
        <p className="lead">
          Where you plant it decides how much it grows. Here is what your money becomes in the
          garden. The fruit on a plant is what it has grown on top of what you put in. Your
          workplace pension is invested for you either way, so it's shown apart.
        </p>
      </section>
      <div className="how-grid">
        {ordered.map((p) => (
          <article key={p} className={`how-card ${mine(p) ? 'mine' : ''}`}>
            <div className="how-art" style={{ background: PLOT_LOOKS[p].color }}>
              <PlotIcon plot={p} size={64} />
            </div>
            <p className="how-badge">
              {p !== 'pension' && mine(p)
                ? `In your garden: ${pct(split[p])} · ${money(euros[p])} a month`
                : p === 'pension'
                  ? 'Filled in from your pay'
                  : 'Not in your garden yet'}
            </p>
            <h3>{PLOT_LOOKS[p].plain}</h3>
            <p className="how-metaphor">{PLOT_LOOKS[p].metaphor}</p>
            <p className="how-meaning">{PLOT_LOOKS[p].meaning}</p>
          </article>
        ))}
      </div>
      <button className="btn how-next" onClick={onNext}>
        See my garden
      </button>
    </div>
  )
}
