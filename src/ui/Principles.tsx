import { PRINCIPLES } from '../data'

/** "How Plant It thinks": the principles behind the guidance, each with its evidence. */
export function Principles() {
  return (
    <section className="principles" aria-labelledby="principles-title">
      <div className="plan-head">
        <p className="eyebrow">How Plant It thinks</p>
        <h2 id="principles-title">The principles behind your plan</h2>
        <p className="muted">
          Every tip in your plan rests on research. Open a principle to see the evidence and its
          limits.
        </p>
      </div>
      <div className="principle-grid">
        {PRINCIPLES.map((p) => (
          <details key={p.id} id={`principle-${p.id}`} className="principle">
            <summary>
              <span className="principle-title">{p.title}</span>
              <span className="principle-idea">{p.idea}</span>
            </summary>
            <div className="principle-body">
              <p>
                <b>In Plant It:</b> {p.inPlantIt}
              </p>
              <ul>
                {p.evidence.map((e) => (
                  <li key={e.source}>
                    {e.finding}{' '}
                    <a href={e.url} target="_blank" rel="noopener">
                      {e.source}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
