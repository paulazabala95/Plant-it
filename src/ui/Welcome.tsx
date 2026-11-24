import { Person } from './art'

const STEPS = [
  { n: 1, title: 'See', text: 'your savings grow as a garden' },
  { n: 2, title: 'Plan', text: 'what small changes do' },
  { n: 3, title: 'Act', text: 'steps with dates' },
]

/** The first screen: the hook, what she'll get (See, Plan, Act) and one main action. */
export function Welcome({
  onStart,
  onContinue,
}: {
  onStart: () => void
  /** Shown when she already made a plan on this device. */
  onContinue?: () => void
}) {
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

      <p className="welcome-garden">
        Your garden is your savings. <b>Every euro you save is a seed.</b>
      </p>

      <ol className="welcome-steps" aria-label="What you'll do">
        {STEPS.map((s) => (
          <li key={s.n}>
            <span className="welcome-step-n" aria-hidden>
              {s.n}
            </span>
            <span>
              <b>{s.title}</b> {s.text}
            </span>
          </li>
        ))}
      </ol>

      <div className="welcome-actions">
        <button className="btn" onClick={onStart}>
          Show me the difference
        </button>
        {onContinue && (
          <button className="ask back" onClick={onContinue}>
            Continue my plan
            <span className="ask-arrow" aria-hidden>
              →
            </span>
          </button>
        )}
      </div>

      <p className="welcome-trust">
        2 minutes · 5 questions · Free, no sign-up · Your answers stay on your device · Every number
        has a source
      </p>
    </section>
  )
}
