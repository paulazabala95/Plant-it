// Display formatting only. No financial maths here: amounts come from the engine.
const eur = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export const money = (x: number) => eur.format(Math.round(x))

export const compactMoney = (x: number) =>
  Math.abs(x) >= 1_000_000
    ? `€${(x / 1_000_000).toFixed(1)}M`
    : Math.abs(x) >= 1000
      ? `€${Math.round(x / 1000)}k`
      : money(x)

export const pct = (x: number, digits = 0) => `${(x * 100).toFixed(digits)}%`

export const years = (x: number) => `${x.toFixed(1)} ${Math.abs(x) === 1 ? 'year' : 'years'}`

/** 67.25 -> "67 years and 3 months", 64 -> "64". */
export const ageLabel = (age: number) => {
  const whole = Math.floor(age)
  const months = Math.round((age - whole) * 12)
  return months === 0 ? String(whole) : `${whole} years and ${months} months`
}
