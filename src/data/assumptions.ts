// Sourced assumptions shared by every country. See SOURCES.md sections 1-3 and 7.
// Rates are real (after inflation), per year, as fractions.

export const GARDEN_OPTIONS = [
  'cash',
  'greenhouse',
  'indexFund',
  'sustainableFund',
  'singleStocks',
  'crypto',
] as const

export type GardenOption = (typeof GARDEN_OPTIONS)[number]

/** Options that are bought and sold, so overtrading costs apply. */
export const TRADED_OPTIONS: readonly GardenOption[] = [
  'indexFund',
  'sustainableFund',
  'singleStocks',
  'crypto',
]

/** Options "her at her best" may use. Never single stocks or crypto. */
export const RECOMMENDED_OPTIONS: readonly GardenOption[] = ['indexFund', 'sustainableFund']

export const INFLATION = 0.02

export const REAL_RETURNS: Record<GardenOption, number> = {
  cash: -0.02,
  greenhouse: -0.002,
  indexFund: 0.052,
  sustainableFund: 0.052,
  singleStocks: 0.005,
  crypto: 0,
}

/** Extra yearly trading cost of the twin (Barber & Odean 2001: 2.65 pp men vs 1.72 pp women). */
export const TWIN_TRADING_DRAG = 0.0094

/** Net real return on funded pensions (OECD Pensions at a Glance 2025, base case). */
export const PENSION_REAL_RETURN = 0.025

/** "Her at her best" keeps this share of savings in the greenhouse as a buffer (editable). */
export const DEFAULT_CASH_BUFFER = 0.1
