# Sources (DRAFT, Milestone 1 in progress)

Every default in the app traces back to a row here. Status:
✅ found and cited · 🟡 partial / secondary source / needs a decision · ❌ not found yet

Values flagged `eu-fallback` are used for countries without their own figure.

## 1. Inflation ✅

| Value       | Applies to                | Source                                                                                                                               |
| ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 2.0% / year | all countries (euro area) | ECB monetary policy strategy, symmetric 2% medium-term target (2021 review, confirmed 2025). https://www.bis.org/review/r210722a.pdf |

## 2. Expected real returns (after inflation) per garden option

| Option                               | Default (real, / year)                   | Status    | Source / reasoning                                                                                                                                                                                                                                                                                     |
| ------------------------------------ | ---------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Seed packet in a drawer (cash)       | −2.0%                                    | ✅        | 0% nominal interest minus 2% inflation (row 1)                                                                                                                                                                                                                                                         |
| Greenhouse (high-yield savings)      | −0.2%                                    | ✅        | Euro-area household deposits with agreed maturity, new business, ~1.81% nominal (Oct 2025), ECB MFI interest rate statistics. https://www.banque-france.fr/system/files/2025-12/Statistiques_relatives_taux_interet_banques_zone_euro_octobre_2025.pdf                                                 |
| Oak tree (global index fund)         | 5.2%                                     | ✅        | World equities, annualised real return 1900–2024. UBS Global Investment Returns Yearbook 2025 (Dimson, Marsh, Staunton). https://www.jbs.cam.ac.uk/2025/report-stocks-have-far-outperformed-over-the-past-125-years/                                                                                   |
| Wildflower meadow (sustainable fund) | 5.2%                                     | 🟡        | No consistent long-run evidence of under- or out-performance vs conventional funds (Morningstar 2020, 10-year study of 4,900 funds). Default = same as index. https://global.morningstar.com/en-gb/sustainable-investing/do-sustainable-funds-beat-their-rivals                                        |
| Sunflowers (single stocks)           | 0.5% (proposed: typical stock ≈ T-bills) | 🟡        | Selectable in onboarding, never recommended by "her at her best" or swaps. Bessembinder (2018, JFE): 58% of US stocks underperformed T-bills over their lifetime; 4% of stocks created all net wealth. https://wpcarey.asu.edu/department-finance/faculty-research/do-stocks-outperform-treasury-bills |
| Mushrooms (crypto)                   | 0.0%                                     | ✅ agreed | No credible long-run expected-return estimate exists; editable, labelled as such.                                                                                                                                                                                                                      |

## 3. Trading behaviour ✅

| Value                                                                                     | Source                                                                                                                                               |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Twin overtrading drag: **0.94 pp / year** (men's trading cost 2.65 pp vs women's 1.72 pp) | Barber & Odean (2001), "Boys Will Be Boys", QJE 116(1). Men trade 45% more. https://faculty.haas.berkeley.edu/odean/papers/gender/BoysWillBeBoys.pdf |
| Context: women's returns 0.4 pp / year higher (5.2M accounts, 2011–2020)                  | Fidelity Women and Investing Study 2021. https://www.businesswire.com/news/home/20211008005269/en/                                                   |
| Context: women's returns 1.8 pp / year higher (2,800 investors, 3 years)                  | Warwick Business School / Barclays Smart Investor (2018). https://www.wbs.ac.uk/news/are-women-better-investors-than-men/                            |

## 4. Adjusted ("same role") gender pay gap

| Country                      | Value | Status | Source                                                                                                                                                                                           |
| ---------------------------- | ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| NL                           | 6.1%  | ✅     | CBS Monitor Loonverschillen 2024, private sector, corrected hourly wage. https://www.cbs.nl/nl-nl/longread/aanvullende-statistische-diensten/2025/monitor-loonverschillen-mannen-en-vrouwen-2024 |
| DE                           | 6%    | ✅     | Destatis, bereinigter Gender Pay Gap 2025. https://www.destatis.de/DE/Presse/Pressemitteilungen/2025/12/PD25_453_621.html                                                                        |
| FR                           | 3.8%  | ✅     | INSEE, same job in same establishment, 2023 (via HCREP 2025). https://strategie.gouv.fr/files/2025-03/04032025_HCREP-INSEE.pdf                                                                   |
| EU (fallback for ES, IT, IE) | 9.4%  | ✅     | Boll & Lagemann (2018) for the European Commission, SES 2014, unexplained gap. https://www.saage-network.eu/sites/default/files/media/publication/DS0118112ENN-en.pdf                            |
| ES, IT, IE                   | –     | ❌     | National adjusted figures not found yet (candidates: Anghel & Conde-Ruiz 2023, FEDEA, for ES)                                                                                                    |

Note: national methods differ (FR controls for the exact job, so it is lowest). Never use the
headline unadjusted Eurostat gap (double counts part-time, sector and promotions).

## 5. Career events

| Value                                                                                | Status       | Source                                                                                                                                             |
| ------------------------------------------------------------------------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promotions: 81 women promoted to manager per 100 men → twin promoted ~1.23× as often | 🟡 US data   | McKinsey & LeanIn.Org, Women in the Workplace 2024. https://www.mckinsey.com/featured-insights/diversity-and-inclusion/women-in-the-workplace-2024 |
| Promotion raise size                                                                 | ❌           |                                                                                                                                                    |
| Child penalty, long run: DE 61%, NL ~46% (7 yrs after birth)                         | 🟡           | Kleven, Landais, Posch, Steinhauer & Zweimüller (2019), AEA P&P; Rabaté & Rellstab (2021). https://www.nber.org/papers/w25524                      |
| Fatherhood premium                                                                   | 🟡           | Present in all 26 EU countries studied (Cukrowska-Torzewska & Lovász 2020, Social Science Research 85); size not retrieved yet.                    |
| Part-time gender gap 2024 (pp): NL 41.9, DE 37.2, IT 23.0, FR 18.3, ES 14.8, EU 20.1 | 🟡 secondary | Eurostat via Trading Economics. https://tradingeconomics.com/european-union/gender-gap-in-part-time-employment-eurostat-data.html                  |
| Paid maternity leave weeks per country                                               | ❌           | OECD Family Database PF2.1 (blocked)                                                                                                               |

## 6. Twin's investment mix 🟡

- Women keep a larger share of wealth in cash and fewer equities (European Commission, FISMA). https://ec.europa.eu/newsroom/fisma/items/749767/en
- 18% of women vs 31% of men invest regularly (ING 2024, via Funds Society). https://www.fundssociety.com/en/opinion/the-370-billion-euro-question-why-do-women-invest-less-and-how-can-it-be-changed/
- The gender investment gap is mainly a **participation** gap, not a lower risky share among
  those who invest (Bacher 2024). https://annikabacher.github.io/Bacher_GenderInvestmentGap.pdf
- Per-country men's mix: ❌ (ECB HFCS tables are on ecb.europa.eu, blocked)

## 7. Retirement contributions 🟡

Decision (agreed with project owner): the field counts **only contributions that are actually
invested** (e.g. NL employer pension). State pay-as-you-go pensions are not invested, so they are
excluded from both gardens and noted in the UI. Same mechanics in every country; only the default
differs. Per-country invested defaults: ❌ to research.

- Context only (these are mostly pay-as-you-go, NOT invested): OECD Pensions at a Glance 2023, mandatory contribution rate at average wage: IT 33.0%,
  FR 27.8%, OECD average 18.2%. NL, DE, ES, IE ❌.
  https://www.oecd.org/en/publications/pensions-at-a-glance-2023_678055dd-en/full-report/component-17.html

## 8. Wage growth ❌

- EC 2024 Ageing Report: EU potential GDP growth ~1.3% / year 2022–2070, driven by productivity.
  Productivity assumption per country not retrieved yet.

## 9. Real-life units ❌

- Average rent per country: not researched yet
- A "fully funded sabbatical year": proposed = median equivalised net income (Eurostat ilc_di03)
