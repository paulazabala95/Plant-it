import { useState } from 'react'
import { shortSource, type SourceLine } from './sources'

/**
 * A compact source line with an (i) button that unfolds the full citation.
 * `compact` shows only "(i) Source" until tapped (for the boxes over the garden).
 */
export function SourceNote({ sources, compact }: { sources: SourceLine[]; compact?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <span className={`source-note ${open ? 'open' : ''}`}>
      <button
        className="source-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Hide the full source' : 'Show the full source'}
      >
        <span className="i-icon" aria-hidden>
          i
        </span>
        {compact && !open ? 'Source' : `Source: ${sources.map(shortSource).join('; ')}`}
      </button>
      {open && (
        <span className="source-full">
          {sources.map((s, k) => (
            <span key={k}>
              {s.text}
              {s.euAverage && <em> (same for every country)</em>}
            </span>
          ))}
        </span>
      )}
    </span>
  )
}
