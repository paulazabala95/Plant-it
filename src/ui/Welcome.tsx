import { Person } from './art'

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <section className="sheet-card welcome">
      <p className="eyebrow">Plant it</p>
      <h1>Have you ever pictured your life with, and without, investing?</h1>
      <svg viewBox="-170 -350 640 380" className="twins" aria-hidden>
        <Person kind="her" hair="#3B2A2A" glasses={false} baby={false} mood="happy" />
        <g transform="translate(300 0)">
          <Person kind="twin" hair="#4A3426" glasses={false} baby={false} mood="happy" />
        </g>
      </svg>
      <p className="lead">
        Meet your <b>identical twin brother</b>. Same job, same savings, same life. The only
        difference: he's a man.
      </p>
      <p className="lead">
        See whose money grows more by the time you both retire, and what you can do about it.
      </p>
      <button className="btn" onClick={onStart}>
        Show me the difference
      </button>
    </section>
  )
}
