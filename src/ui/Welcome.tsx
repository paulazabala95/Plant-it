import { PEOPLE } from '../themes'
import { Blob } from './Blob'

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <>
      <section className="card pink stack" style={{ paddingTop: 28, paddingBottom: 28 }}>
        <p className="eyebrow">Welcome to your garden</p>
        <h1 className="display xl">PLANT IT</h1>
        <div className="row" style={{ alignItems: 'flex-end', position: 'relative' }}>
          <div className="grow">
            <Blob color={PEOPLE.her.color} shape="drop" stage={3} title="You" />
          </div>
          <div className="grow">
            <Blob color={PEOPLE.twin.color} shape="bean" stage={4} mood="wow" title="Your twin" />
          </div>
          <span
            className="sticker yellow"
            style={{ position: 'absolute', top: 8, left: 4, fontSize: 18 }}
          >
            hey, twin!
          </span>
        </div>
        <h2 className="display m">Same life. Same job. One difference.</h2>
        <p>
          Meet your identical twin brother. Watch your two gardens grow side by side until you
          retire, and see what really makes his bigger.
        </p>
      </section>

      <section className="card lime stack">
        <p className="display m">Women don't invest worse. They invest less.</p>
        <p className="muted">Five quick questions. No sign-up, nothing leaves your phone.</p>
      </section>

      <button className="btn block" onClick={onStart}>
        Plant my garden →
      </button>
    </>
  )
}
