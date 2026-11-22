import { useEffect, useRef, useState } from 'react'
import { PRINCIPLE_GROUPS, PRINCIPLES, type Principle } from '../data'
import { PRINCIPLE_EVENT } from './showPrinciple'
import { useIsPhone } from './useIsPhone'

/** One principle's content: the idea, where Plant It applies it, and the evidence. */
function Detail({ p }: { p: Principle }) {
  return (
    <div className="pr-detail-body">
      <p className="pr-idea">{p.idea}</p>
      <div className="pr-inplant">
        <span className="pr-label">In Plant It</span>
        <p>{p.inPlantIt}</p>
      </div>
      <span className="pr-label">The evidence</span>
      <ul className="pr-evidence">
        {p.evidence.map((e) => (
          <li key={e.who + e.title} className="pr-source">
            <div className="pr-source-head">
              <span className={`pr-kind ${e.kind.toLowerCase()}`}>{e.kind}</span>
              <span className="pr-who">{e.who}</span>
            </div>
            <p className="pr-finding">{e.finding}</p>
            <a href={e.url} target="_blank" rel="noopener" className="pr-cite">
              {e.title} <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * "How Plant It thinks": desktop shows a list beside the selected principle; phones show one
 * accordion, one principle open at a time.
 */
export function Principles() {
  const phone = useIsPhone()
  const [selected, setSelected] = useState<string>(PRINCIPLES[0].id)
  const [open, setOpen] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onShow = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      setSelected(id)
      setOpen(id)
      requestAnimationFrame(() => {
        const target = phone ? document.getElementById(`principle-${id}`) : sectionRef.current
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
    window.addEventListener(PRINCIPLE_EVENT, onShow)
    return () => window.removeEventListener(PRINCIPLE_EVENT, onShow)
  }, [phone])

  const current = PRINCIPLES.find((p) => p.id === selected) ?? PRINCIPLES[0]

  return (
    <section className="principles" aria-labelledby="principles-title" ref={sectionRef}>
      <header className="pr-header">
        <p className="eyebrow">How Plant It thinks</p>
        <h2 id="principles-title">The principles behind your plan</h2>
        <p className="muted">
          Every tip rests on research, from feminist economics to investing studies. Each source
          comes with its limits.
        </p>
      </header>

      {phone ? (
        <div className="pr-accordion">
          {PRINCIPLE_GROUPS.map((g) => (
            <div key={g.id} className="pr-group">
              <h3 className="pr-group-title">{g.title}</h3>
              <p className="pr-group-intro">{g.intro}</p>
              {PRINCIPLES.filter((p) => p.group === g.id).map((p) => {
                const isOpen = open === p.id
                return (
                  <div
                    key={p.id}
                    id={`principle-${p.id}`}
                    className={`pr-item ${isOpen ? 'open' : ''}`}
                  >
                    <button
                      className="pr-row"
                      aria-expanded={isOpen}
                      aria-controls={`principle-body-${p.id}`}
                      onClick={() => setOpen(isOpen ? null : p.id)}
                    >
                      <span className="pr-row-title">{p.title}</span>
                      <span className="pr-chevron" aria-hidden>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div id={`principle-body-${p.id}`} className="pr-item-body">
                        <Detail p={p} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="pr-split">
          <nav className="pr-nav" aria-label="Principles">
            {PRINCIPLE_GROUPS.map((g) => (
              <div key={g.id} className="pr-group">
                <h3 className="pr-group-title">{g.title}</h3>
                <p className="pr-group-intro">{g.intro}</p>
                <ul>
                  {PRINCIPLES.filter((p) => p.group === g.id).map((p) => (
                    <li key={p.id}>
                      <button
                        className={`pr-nav-item ${p.id === current.id ? 'on' : ''}`}
                        aria-current={p.id === current.id ? 'true' : undefined}
                        onClick={() => setSelected(p.id)}
                      >
                        {p.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <article className="pr-detail" aria-live="polite" id={`principle-${current.id}`}>
            <span className="pr-detail-group">
              {PRINCIPLE_GROUPS.find((g) => g.id === current.group)!.title}
            </span>
            <h3 className="pr-detail-title">{current.title}</h3>
            <Detail p={current} />
          </article>
        </div>
      )}
    </section>
  )
}
