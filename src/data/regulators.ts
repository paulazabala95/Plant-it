import type { Region } from './countries'

/**
 * The financial-markets regulator to check a provider against, per country (official sites).
 * EU fallback: ESMA, which links to every national regulator.
 */
export const REGULATORS: Record<Region, { name: string; url: string }> = {
  NL: { name: 'AFM (Autoriteit Financiële Markten)', url: 'https://www.afm.nl' },
  ES: { name: 'CNMV (Comisión Nacional del Mercado de Valores)', url: 'https://www.cnmv.es' },
  DE: { name: 'BaFin', url: 'https://www.bafin.de' },
  FR: { name: 'AMF (Autorité des marchés financiers)', url: 'https://www.amf-france.org' },
  IT: { name: 'CONSOB', url: 'https://www.consob.it' },
  IE: { name: 'Central Bank of Ireland', url: 'https://www.centralbank.ie' },
  EU: { name: 'your national regulator (listed by ESMA)', url: 'https://www.esma.europa.eu' },
}
