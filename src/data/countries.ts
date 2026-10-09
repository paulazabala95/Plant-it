// Sourced per-country defaults. Every value has a row in SOURCES.md and a one-line `source`
// string shown in the "adjust assumptions" panel.
//
// Units: rates and shares are fractions (0.109 = 10.9%), money is EUR, durations are weeks.
// `coverage` is 'country' when the country has its own figure, 'eu-fallback' otherwise.

export type CountryCode = 'NL' | 'ES' | 'DE' | 'FR' | 'IT' | 'IE'
export type Region = CountryCode | 'EU'
export type Coverage = 'country' | 'eu-fallback'

export interface Sourced<T> {
  value: T
  coverage: Coverage
  source: string
  /** Extra context shown next to the value in the assumptions panel. */
  note?: string
}

/** Share of gross salary paid into an invested (funded) pension, from a calendar year on. */
export interface PensionStep {
  fromYear: number
  rate: number
}

export interface MaternityLeave {
  weeks: number
  /** Average share of previous earnings paid during the leave. */
  paymentRate: number
}

export interface PartTime {
  /** Share of employed women (20-64) working part-time. */
  women: number
  /** Share of employed men (20-64) working part-time. */
  men: number
}

/** Share of women and men (financial decision-maker of the household) holding shares or funds. */
export interface RiskyAssetParticipation {
  women: number
  men: number
}

export interface CountryDefaults {
  code: Region
  name: string
  /** Adjusted ("same role") gender pay gap. Never the headline unadjusted gap. */
  samePayGap: Sourced<number>
  /** Contributions that are actually invested by default (state PAYG pensions excluded). */
  investedPension: Sourced<PensionStep[]>
  /** Invested contributions if she answers that her pension fund is active (Italy: TFR). */
  optionalPensionFund?: Sourced<PensionStep[]>
  maternityLeave: Sourced<MaternityLeave>
  partTime: Sourced<PartTime>
  /** Real (after inflation) wage growth per year. */
  realWageGrowth: Sourced<number>
  /** Pay rise on promotion, on top of normal wage growth. */
  promotionRaise: Sourced<number>
  /** Change in a man's earnings after becoming a father. */
  fatherhoodPremium: Sourced<number>
  /** Yardstick for "years of rent": monthly rent, 1-bedroom flat. */
  monthlyRent: Sourced<number>
  /** Yardstick for "fully funded sabbatical years": one year of median net income. */
  sabbaticalYear: Sourced<number>
  /**
   * Drives the twin's savings split: he moves (men - women) of his savings from cash to the
   * index fund compared with her split (see DECISIONS.md).
   */
  riskyAssetParticipation: Sourced<RiskyAssetParticipation>
}

const SRC = {
  eurostatGpg:
    'Eurostat, Leythienne & Pérez-Julián, Gender pay gaps in the EU (2021 ed., rev. 2022), unexplained gap, SES 2018',
  oecdPag: 'OECD Pensions at a Glance 2025, Table 8.1 (mandatory contributions, 2024)',
  oecdLeave: 'OECD Family Database PF2.1, Table PF2.1.A (entitlements as of April 2025)',
  partTime: 'Eurostat lfsa_eppga, part-time employment, ages 20-64, 2025',
  ageing: 'European Commission 2024 Ageing Report, hourly labour productivity growth 2022-2070',
  promotion:
    'Kauhanen & Napari (2012), ETLA DP 1244: in-firm promotion raises wages by 4% (Finnish linked data)',
  fatherhood:
    "Kleven et al. (2019), Child Penalties Across Countries: fathers' earnings essentially unaffected",
  rent: 'Eurostat prc_colc_rents, average rent of a 1-bedroom flat in the capital, 2025',
  income: 'Eurostat ilc_di03, median equivalised net income, EU-SILC 2025',
  wealthGender:
    'European Commission (Sierminska 2017), Wealth and Gender in Europe, Table 2 (ECB HFCS 2010)',
}

const country = <T>(value: T, source: string, note?: string): Sourced<T> => ({
  value,
  coverage: 'country',
  source,
  ...(note && { note }),
})

const EUROSTAT_METHOD_NOTE =
  "National same-role figures do not exist here, so this uses Eurostat. Eurostat's method gives higher gaps everywhere (NL 10.8%, DE 10.0%, FR 11.9%), so the gap looks larger partly because of the method."

const euFallback = <T>(value: T, source: string): Sourced<T> => ({
  value,
  coverage: 'eu-fallback',
  source,
})

const NO_INVESTED_PENSION = [{ fromYear: 2024, rate: 0 }]

// Same EU-wide evidence for every country (no national figures).
const promotionRaise = euFallback(0.04, SRC.promotion)
const fatherhoodPremium = euFallback(0, SRC.fatherhood)

export const EU: CountryDefaults = {
  code: 'EU',
  name: 'EU average',
  samePayGap: country(
    0.094,
    'Boll & Lagemann (2018) for the European Commission, unexplained gap, SES 2014',
  ),
  investedPension: country(
    NO_INVESTED_PENSION,
    `${SRC.oecdPag}: most EU mandatory pensions are pay-as-you-go`,
  ),
  maternityLeave: country(
    { weeks: 21.5, paymentRate: 0.81 },
    `${SRC.oecdLeave}, EU average; pay rate = mean full-rate weeks (17.5) / weeks (21.5)`,
  ),
  partTime: country({ women: 0.275, men: 0.078 }, `${SRC.partTime}, EU27`),
  realWageGrowth: country(0.014, `${SRC.ageing}, EU`),
  promotionRaise,
  fatherhoodPremium,
  monthlyRent: country(1150, `${SRC.rent}, median of the 27 EU capitals`),
  sabbaticalYear: country(22939, `${SRC.income}, EU27`),
  riskyAssetParticipation: country({ women: 0.133, men: 0.208 }, `${SRC.wealthGender}, EU15`),
}

export const COUNTRIES: Record<CountryCode, CountryDefaults> = {
  NL: {
    code: 'NL',
    name: 'Netherlands',
    samePayGap: country(
      0.061,
      'CBS Monitor Loonverschillen 2024, private sector, corrected hourly wage gap',
    ),
    investedPension: country(
      [{ fromYear: 2024, rate: 0.116 }],
      `${SRC.oecdPag}: quasi-mandatory occupational pension, effective rate at average earnings`,
    ),
    maternityLeave: country({ weeks: 16, paymentRate: 1 }, SRC.oecdLeave),
    partTime: country({ women: 0.608, men: 0.19 }, SRC.partTime),
    realWageGrowth: country(0.011, SRC.ageing),
    promotionRaise,
    fatherhoodPremium,
    monthlyRent: country(1800, `${SRC.rent} (The Hague, no Amsterdam figure)`),
    sabbaticalYear: country(34466, SRC.income),
    riskyAssetParticipation: country({ women: 0.173, men: 0.255 }, SRC.wealthGender),
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    samePayGap: country(0.109, SRC.eurostatGpg, EUROSTAT_METHOD_NOTE),
    investedPension: country(NO_INVESTED_PENSION, `${SRC.oecdPag}: public pay-as-you-go only`),
    maternityLeave: country(
      { weeks: 19, paymentRate: 1 },
      'Real Decreto-ley 9/2025 (BOE 30 July 2025): 19 weeks per parent at 100%',
    ),
    partTime: country({ women: 0.209, men: 0.063 }, SRC.partTime),
    realWageGrowth: country(0.013, SRC.ageing),
    promotionRaise,
    fatherhoodPremium,
    monthlyRent: country(1300, `${SRC.rent} (Madrid)`),
    sabbaticalYear: country(20367, SRC.income),
    riskyAssetParticipation: country({ women: 0.097, men: 0.168 }, SRC.wealthGender),
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    samePayGap: country(0.06, 'Destatis, bereinigter Gender Pay Gap 2025'),
    investedPension: country(NO_INVESTED_PENSION, `${SRC.oecdPag}: public pay-as-you-go only`),
    maternityLeave: country({ weeks: 14, paymentRate: 1 }, SRC.oecdLeave),
    partTime: country({ women: 0.487, men: 0.116 }, SRC.partTime),
    realWageGrowth: country(0.013, SRC.ageing),
    promotionRaise,
    fatherhoodPremium,
    monthlyRent: country(1350, `${SRC.rent} (Berlin)`),
    sabbaticalYear: country(28891, SRC.income),
    riskyAssetParticipation: country({ women: 0.167, men: 0.259 }, SRC.wealthGender),
  },
  FR: {
    code: 'FR',
    name: 'France',
    samePayGap: country(0.038, 'INSEE, same job in same establishment, 2023 (via HCREP 2025)'),
    investedPension: country(NO_INVESTED_PENSION, `${SRC.oecdPag}: public pay-as-you-go only`),
    maternityLeave: country({ weeks: 16, paymentRate: 1 }, SRC.oecdLeave),
    partTime: country({ women: 0.256, men: 0.081 }, SRC.partTime),
    realWageGrowth: country(0.01, SRC.ageing),
    promotionRaise,
    fatherhoodPremium,
    monthlyRent: country(1550, `${SRC.rent} (Paris)`),
    sabbaticalYear: country(26459, SRC.income),
    riskyAssetParticipation: country({ women: 0.162, men: 0.244 }, SRC.wealthGender),
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    samePayGap: country(0.109, SRC.eurostatGpg, EUROSTAT_METHOD_NOTE),
    investedPension: country(
      NO_INVESTED_PENSION,
      `${SRC.oecdPag}: public pay-as-you-go; TFR kept with the employer is not invested`,
    ),
    optionalPensionFund: country(
      [{ fromYear: 2024, rate: 0.0741 }],
      'Codice civile art. 2120: TFR accrues 1/13.5 of annual pay, paid into the pension fund',
    ),
    maternityLeave: country({ weeks: 21.7, paymentRate: 0.8 }, SRC.oecdLeave),
    partTime: country({ women: 0.277, men: 0.06 }, SRC.partTime),
    realWageGrowth: country(0.012, SRC.ageing),
    promotionRaise,
    fatherhoodPremium,
    monthlyRent: country(1300, `${SRC.rent} (Rome)`),
    sabbaticalYear: country(22062, SRC.income),
    riskyAssetParticipation: country({ women: 0.061, men: 0.118 }, SRC.wealthGender),
  },
  IE: {
    code: 'IE',
    name: 'Ireland',
    samePayGap: country(0.166, SRC.eurostatGpg, EUROSTAT_METHOD_NOTE),
    investedPension: country(
      [
        { fromYear: 2026, rate: 0.035 },
        { fromYear: 2029, rate: 0.07 },
        { fromYear: 2032, rate: 0.105 },
        { fromYear: 2035, rate: 0.14 },
      ],
      'Auto-enrolment (MyFutureFund) from 2026, employee + employer + State (gov.ie; OECD PaG 2025)',
    ),
    maternityLeave: country({ weeks: 26, paymentRate: 0.234 }, SRC.oecdLeave),
    partTime: country({ women: 0.265, men: 0.086 }, SRC.partTime),
    realWageGrowth: country(0.018, SRC.ageing),
    promotionRaise,
    fatherhoodPremium,
    monthlyRent: country(2000, `${SRC.rent} (Dublin)`),
    sabbaticalYear: country(35138, SRC.income),
    riskyAssetParticipation: euFallback(
      { women: 0.133, men: 0.208 },
      `${SRC.wealthGender}, EU15 (IE not surveyed)`,
    ),
  },
}
