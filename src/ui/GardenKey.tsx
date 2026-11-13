import { useEffect } from 'react'
import type { Plot } from '../engine'
import { PLOT_LOOKS } from '../themes'
import { PlotIcon } from './art'
import { compactMoney } from './format'

/** What every element of the garden means. Only lists the plants that are in the gardens. */
export function GardenKey({
  plots,
  unit,
  onClose,
}: {
  plots: Plot[]
  unit: number
  onClose: () => void
}) {
  useEffect(() => {
    const close = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])

  return (
    <div className="key-backdrop" onClick={onClose}>
      <div
        className="garden-key"
        role="dialog"
        aria-modal="true"
        aria-labelledby="garden-key-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="key-head">
          <h2 id="garden-key-title">What do the plants mean?</h2>
          <button className="chip" onClick={onClose} aria-label="Close">
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
              <PlotIcon plot={p} size={40} />
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
    </div>
  )
}
