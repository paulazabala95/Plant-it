import type { Plot } from '../engine'
import { PLOT_LOOKS } from '../themes'
import { PlotIcon } from './art'

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
  'pension',
]

export function HowItWorks({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <>
      <button className="link" style={{ alignSelf: 'flex-start' }} onClick={onBack}>
        ← Back
      </button>
      <section className="card yellow stack">
        <p className="eyebrow">How your garden grows</p>
        <h1 className="display l">Every euro you save is a seed.</h1>
        <p style={{ fontSize: 17 }}>
          Where you plant it decides how much it grows. You and your twin each get a garden, and you
          can watch both grow until you retire.
        </p>
      </section>
      <div className="stack">
        {ORDER.map((p) => (
          <div
            key={p}
            className="assumption row"
            style={{ background: PLOT_LOOKS[p].color, gap: 12 }}
          >
            <PlotIcon plot={p} />
            <div className="grow">
              <b>
                {PLOT_LOOKS[p].plain} = {PLOT_LOOKS[p].metaphor.toLowerCase()}
              </b>
              <p style={{ fontSize: 14 }}>{PLOT_LOOKS[p].meaning}</p>
            </div>
          </div>
        ))}
      </div>
      <section className="card lilac-soft">
        <p>
          <b>Fruit = growth.</b> The more a plant has grown on top of what you put in, the more
          fruit it carries.
        </p>
      </section>
      <button className="btn block" onClick={onNext}>
        Next
      </button>
    </>
  )
}
