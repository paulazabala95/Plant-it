import { showPrinciple } from './showPrinciple'

/** A small "Why?" link to the principle behind a tip. */
export function WhyLink({ id }: { id: string }) {
  return (
    <button className="why-link" onClick={() => showPrinciple(id)}>
      Why?
    </button>
  )
}
