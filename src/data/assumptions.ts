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

/**
 * Options where the twin's overtrading cost applies. Barber & Odean (2001) measured accounts
 * picking individual stocks, so it is not applied to index or sustainable funds.
 */
export const OVERTRADED_OPTIONS: readonly GardenOption[] = ['singleStocks', 'crypto']

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

/** One-line sources for the assumptions panel (full entries in SOURCES.md). */
export const ASSUMPTION_SOURCES = {
  inflation: 'ECB medium-term inflation target (2021 strategy review)',
  cash: '0% interest minus 2% inflation',
  greenhouse: 'ECB MFI interest rate statistics: euro-area deposits ~1.8% nominal (Oct 2025)',
  indexFund: 'UBS Global Investment Returns Yearbook 2025: world equities, real, 1900-2024',
  sustainableFund: 'Morningstar (2020): no consistent long-run gap vs conventional funds',
  singleStocks: 'Bessembinder (2018): the typical stock returns about as much as T-bills',
  crypto: 'No reliable long-run estimate exists',
  tradingDrag: 'Barber & Odean (2001), Boys Will Be Boys: men 2.65 pp vs women 1.72 pp a year',
  pensionReturn: 'OECD Pensions at a Glance 2025: funded pensions, base case',
  cashBuffer: 'Plant It default, editable',
} as const
