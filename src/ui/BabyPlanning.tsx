import type { CountryCode } from '../data'
import { defaultsFor } from '../engine'
import { pct } from './format'

/** Positive, practical framing for anyone planning a baby. Things to consider, not advice. */
export function BabyPlanning({ country }: { country: CountryCode }) {
  const c = defaultsFor(country)
  const leave = c.maternityLeave.value
  const partner = c.partnerLeave.value
  return (
    <section className="card pink-soft stack">
      <p className="eyebrow">Planning a baby?</p>
      <h3 className="display m">Your garden can keep growing.</h3>
      <ul className="tips">
        <li>
          <b>Know your leave.</b> In {c.inName ?? c.name} you get {leave.weeks} weeks of paid
          maternity leave at{' '}
          {leave.paymentRate >= 1
            ? 'full pay (up to a cap)'
            : `about ${pct(leave.paymentRate)} of your pay`}
          .
        </li>
        <li>
          <b>Save a buffer before the baby arrives,</b> so you don't have to dig up what you've
          planted.
        </li>
        <li>
          <b>Keep planting, even a little.</b> A small amount invested during leave and the years
          after still grows for decades.
        </li>
        <li>
          <b>Share the leave.</b> Your partner can take {partner.weeks} weeks of paid leave
          {partner.paymentRate === undefined
            ? ''
            : partner.paymentRate >= 1
              ? ' at full pay'
              : ` at about ${pct(partner.paymentRate)} of pay`}
          . The more it's shared, the smaller the dip.
        </li>
        <li>
          <b>The dip doesn't last forever.</b> Studies in {c.inName ?? c.name} see mothers' pay
          recover after about {c.childPenalty.value.years} years.
        </li>
      </ul>
      <p className="muted" style={{ fontSize: 13 }}>
        Things to consider, not financial advice.
      </p>
    </section>
  )
}
