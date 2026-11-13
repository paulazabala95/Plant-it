import { useState } from 'react'
import type { Plot } from '../engine'
import { PLOT_LOOKS } from '../themes'
import { PlotIcon } from './art'
import { compactMoney } from './format'

/**
 * What every element of the garden means: a small folded box inside the garden, just above the
 * age slider. Only lists the plants that are in the two gardens.
 */
export function GardenKey({ plots, unit }: { plots: Plot[]; unit: number }) {
  const [open, setOpen] = useState(false)

  if (!open)
    return (
      <button className="key-box closed" onClick={() => setOpen(true)} aria-expanded={false}>
        <span className="key-icons" aria-hidden>
          {plots.slice(0, 4).map((p) => (
            <PlotIcon key={p} plot={p} size={20} />
          ))}
        </span>
        What do the plants mean?
        <span className="key-chevron" aria-hidden>
          ▴
        </span>
      </button>
    )

  return (
    <div className="key-box open" role="region" aria-labelledby="garden-key-title">
      <div className="key-head">
        <h2 id="garden-key-title">What do the plants mean?</h2>
        <button className="chip" onClick={() => setOpen(false)} aria-expanded aria-label="Hide">
          ✕
        </button>
      </div>
      <ul className="key-list">
        <li>
          <span className="key-dot seed" aria-hidden />
          <div>
            <b>Golden seeds</b>
            <span>The euros you save every month, falling into your garden.</span>
          </div>
        </li>
        {plots.map((p) => (
          <li key={p}>
            <PlotIcon plot={p} size={34} />
            <div>
              <b>
                {PLOT_LOOKS[p].metaphor} · {PLOT_LOOKS[p].plain}
              </b>
              <span>{PLOT_LOOKS[p].meaning}</span>
            </div>
          </li>
        ))}
        <li>
          <span className="key-dot fruit" aria-hidden />
          <div>
            <b>Fruit and flowers</b>
            <span>Growth. The more a plant has grown, the more fruit it carries.</span>
          </div>
        </li>
        <li>
          <span className="key-dot wilt" aria-hidden />
          <div>
            <b>Wilted plants</b>
            <span>Worth less than the money you put in.</span>
          </div>
        </li>
        <li>
          <span className="key-dot sky" aria-hidden />
          <div>
            <b>The sky</b>
            <span>
              Morning is today, sunset is your retirement. You both get older as it moves.
            </span>
          </div>
        </li>
        <li>
          <span className="key-dot count" aria-hidden />
          <div>
            <b>One plant ≈ {compactMoney(unit)}</b>
            <span>More plants means a bigger garden: more money at retirement.</span>
          </div>
        </li>
      </ul>
    </div>
  )
}
