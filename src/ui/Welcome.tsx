import { PEOPLE } from '../themes'
import { Blob } from './Blob'

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <>
      <section className="card pink stack" style={{ paddingTop: 28, paddingBottom: 28 }}>
        <p className="eyebrow">Plant it</p>
        <h1 className="display l">
          Have you ever pictured your life with, and without, investing?
        </h1>
        <div className="row" style={{ alignItems: 'flex-end', position: 'relative' }}>
          <div className="grow">
            <Blob color={PEOPLE.her.color} shape="drop" stage={2} title="You" />
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
        <p style={{ fontSize: 17 }}>
          Meet your <b>identical twin brother</b>. Same job, same savings, same life. The only
          difference: he's a man.
        </p>
        <p style={{ fontSize: 17 }}>
          See whose money grows more by the time you both retire, and what you can do about it.
        </p>
      </section>

      <section className="card lime">
        <p className="display m">Women don't invest worse. They invest less.</p>
      </section>

      <button className="btn block" onClick={onStart}>
        Show me the difference
      </button>
    </>
  )
}
