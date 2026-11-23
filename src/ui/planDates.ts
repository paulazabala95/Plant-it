// Dates for the action plan. Calendar logic only, no money maths. Dates are local
// calendar days written as YYYY-MM-DD.

const pad = (n: number) => String(n).padStart(2, '0')

export const toISO = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const fromISO = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (d: Date, n: number): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

export const addYears = (d: Date, n: number): Date =>
  new Date(d.getFullYear() + n, d.getMonth(), d.getDate())

const lastDay = (y: number, m: number) => new Date(y, m + 1, 0).getDate()

/** The next payday on or after `from`, for a payday on day `day` of the month (clamped to month end). */
export function nextPayday(from: Date, day: number): Date {
  const y = from.getFullYear()
  const m = from.getMonth()
  const thisMonth = new Date(y, m, Math.min(day, lastDay(y, m)))
  if (thisMonth >= new Date(y, m, from.getDate())) return thisMonth
  return new Date(y, m + 1, Math.min(day, lastDay(y, m + 1)))
}

/** Whole days from `a` to `b` (negative when `b` is earlier). */
export const daysBetween = (a: Date, b: Date): number =>
  Math.round(
    (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
      Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
      86_400_000,
  )

/** "Fri 25 Nov", with the year when it isn't this year: "Tue 23 Nov 2027". */
export const formatDay = (d: Date, today: Date = new Date()): string =>
  d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(d.getFullYear() !== today.getFullYear() && { year: 'numeric' }),
  })

export type DueTone = 'late' | 'soon' | 'later'

/** "Due today", "due in 3 days", "due Fri 25 Nov", "due 2 days ago". */
export function dueLabel(due: string, today: Date): { text: string; tone: DueTone } {
  const n = daysBetween(today, fromISO(due))
  if (n < 0) return { text: `due ${-n} ${n === -1 ? 'day' : 'days'} ago`, tone: 'late' }
  if (n === 0) return { text: 'due today', tone: 'soon' }
  if (n === 1) return { text: 'due tomorrow', tone: 'soon' }
  if (n <= 6) return { text: `due in ${n} days`, tone: 'soon' }
  return { text: `due ${formatDay(fromISO(due), today)}`, tone: 'later' }
}

const icsText = (s: string) =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/([,;])/g, '\\$1')
    .replace(/\n/g, '\\n')
const icsDate = (iso: string) => iso.replace(/-/g, '')

export interface CalendarItem {
  id: string
  title: string
  description: string
  due: string
  yearly?: boolean
}

/** An iCalendar file (all-day events) that Google, Apple and Outlook calendars can import. */
export function toICS(items: CalendarItem[], stamp: Date): string {
  const dtstamp = `${icsDate(toISO(stamp))}T000000Z`
  const events = items.flatMap((i) => [
    'BEGIN:VEVENT',
    `UID:${i.id}@plant-it`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${icsDate(i.due)}`,
    `DTEND;VALUE=DATE:${icsDate(toISO(addDays(fromISO(i.due), 1)))}`,
    `SUMMARY:${icsText(i.title)}`,
    `DESCRIPTION:${icsText(i.description)}`,
    ...(i.yearly ? ['RRULE:FREQ=YEARLY'] : []),
    'END:VEVENT',
  ])
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Plant It//EN',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
}
