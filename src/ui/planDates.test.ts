import { describe, expect, it } from 'vitest'
import { addDays, daysBetween, dueLabel, fromISO, nextPayday, toICS, toISO } from './planDates'

const d = (s: string) => fromISO(s)

describe('nextPayday', () => {
  it('is this month when the day has not passed yet, including today', () => {
    expect(toISO(nextPayday(d('2026-11-23'), 25))).toBe('2026-11-25')
    expect(toISO(nextPayday(d('2026-11-25'), 25))).toBe('2026-11-25')
  })
  it('moves to next month when the day has passed', () => {
    expect(toISO(nextPayday(d('2026-11-26'), 25))).toBe('2026-12-25')
  })
  it('uses the last day of a short month', () => {
    expect(toISO(nextPayday(d('2027-02-01'), 31))).toBe('2027-02-28')
    expect(toISO(nextPayday(d('2026-11-23'), 31))).toBe('2026-11-30')
  })
})

describe('dueLabel', () => {
  const today = d('2026-11-23')
  it('describes late, near and far due dates', () => {
    expect(dueLabel('2026-11-21', today)).toEqual({ text: 'due 2 days ago', tone: 'late' })
    expect(dueLabel('2026-11-23', today)).toEqual({ text: 'due today', tone: 'soon' })
    expect(dueLabel('2026-11-24', today).text).toBe('due tomorrow')
    expect(dueLabel('2026-11-27', today).text).toBe('due in 4 days')
    expect(dueLabel('2026-12-25', today).tone).toBe('later')
    expect(dueLabel('2026-12-25', today).text).not.toContain('2026')
    expect(dueLabel('2027-11-23', today).text).toContain('2027')
  })
})

describe('dates', () => {
  it('adds days across months and counts whole days', () => {
    expect(toISO(addDays(d('2026-11-28'), 7))).toBe('2026-12-05')
    expect(daysBetween(d('2026-11-23'), d('2026-12-25'))).toBe(32)
  })
})

describe('toICS', () => {
  it('writes all-day events, escaping text and repeating yearly items', () => {
    const ics = toICS(
      [
        {
          id: 'plan',
          title: 'Set up your plan',
          description: 'Low cost, wide spread',
          due: '2026-11-25',
        },
        {
          id: 'review',
          title: 'Yearly check-up',
          description: 'Raise it',
          due: '2027-11-23',
          yearly: true,
        },
      ],
      d('2026-11-23'),
    )
    expect(ics).toContain('DTSTART;VALUE=DATE:20261125')
    expect(ics).toContain('DTEND;VALUE=DATE:20261126')
    expect(ics).toContain('DESCRIPTION:Low cost\\, wide spread')
    expect(ics.match(/RRULE:FREQ=YEARLY/g)).toHaveLength(1)
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true)
  })
})
