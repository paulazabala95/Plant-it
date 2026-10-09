# Sources (Milestone 1)

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

## 4. Adjusted ("same role") gender pay gap ✅

| Country | Value | Flag    | Source                                                                                                                                                                                                                  |
| ------- | ----- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NL      | 6.1%  | country | CBS Monitor Loonverschillen 2024, private sector, corrected hourly wage. https://www.cbs.nl/nl-nl/longread/aanvullende-statistische-diensten/2025/monitor-loonverschillen-mannen-en-vrouwen-2024                        |
| DE      | 6%    | country | Destatis, bereinigter Gender Pay Gap 2025. https://www.destatis.de/DE/Presse/Pressemitteilungen/2025/12/PD25_453_621.html                                                                                               |
| FR      | 3.8%  | country | INSEE, same job in same establishment, 2023 (via HCREP 2025). https://strategie.gouv.fr/files/2025-03/04032025_HCREP-INSEE.pdf                                                                                          |
| ES      | 10.9% | country | Eurostat, Leythienne & Pérez-Julián, _Gender pay gaps in the EU, 2021 ed., revision 1_ (March 2022), Table 2, unexplained gap, SES 2018. https://ec.europa.eu/eurostat/documents/3888793/14368632/KS-TC-22-002-EN-N.pdf |
| IT      | 10.9% | country | Same Eurostat paper, Table 2.                                                                                                                                                                                           |
| IE      | 16.6% | country | Same Eurostat paper, Table 2.                                                                                                                                                                                           |
| EU      | 9.4%  | –       | Boll & Lagemann (2018) for the European Commission, SES 2014, unexplained gap. https://www.saage-network.eu/sites/default/files/media/publication/DS0118112ENN-en.pdf                                                   |

Notes:

- No national adjusted figure exists for IT or IE (ISTAT publishes only the raw gap; the ESRI work for
  IE, Doorley et al. 2021, IZA DP 14441, gives 0–20% across the wage distribution, no single figure).
- Cross-check for ES: Anghel & Conde-Ruiz (2023, FEDEA EEE 2023/06), adjusted gap 13.3% in 2018.
  https://documentos.fedea.net/pubs/eee/2023/eee2023-06.pdf
- Methods differ: the Eurostat decomposition gives NL 10.8%, DE 10.0%, FR 11.9%, EU27 11.2%, all
  higher than the national figures above. So ES, IT and IE look worse partly because of the method.
  Decision (owner): keep the mix; ES, IT and IE carry a `note` shown in the assumptions panel
  explaining why their gap may look larger.
- Never use the headline unadjusted Eurostat gap (double counts part-time, sector and promotions).

## 5. Career events

| Value                                                                                                                                                                                                                      | Flag        | Status     | Source                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promotions: 81 women promoted to manager per 100 men → twin promoted ~1.23× as often                                                                                                                                       | eu-fallback | 🟡 US data | McKinsey & LeanIn.Org, Women in the Workplace 2024. https://www.mckinsey.com/featured-insights/diversity-and-inclusion/women-in-the-workplace-2024                                                                                                      |
| Promotion raise: **+4%** on top of normal wage growth (in-firm promotion; +5.8% with an employer change)                                                                                                                   | eu-fallback | ✅         | Kauhanen & Napari (2012), _Career and Wage Dynamics_, ETLA DP 1244, Finnish linked employer-employee data, fixed effects. Context: Baker, Gibbs & Holmström (1994) 6% (US). https://www.etla.fi/wp-content/uploads/2012/09/dp1244.pdf                   |
| Child penalty, long run: DE 61%, NL ~46% (7 yrs after birth)                                                                                                                                                               | country     | 🟡         | Kleven, Landais, Posch, Steinhauer & Zweimüller (2019), AEA P&P; Rabaté & Rellstab (2021). https://www.nber.org/papers/w25524                                                                                                                           |
| Fatherhood premium: **0%**                                                                                                                                                                                                 | eu-fallback | ✅         | Kleven et al. (2019), event studies in 6 countries: "men are essentially unaffected" by the first child. https://www.nber.org/papers/w25524                                                                                                             |
| Part-time share 2025, ages 20–64, women / men: NL 60.8/19.0, DE 48.7/11.6, IT 27.7/6.0, IE 26.5/8.6, FR 25.6/8.1, ES 20.9/6.3, EU 27.5/7.8                                                                                 | country     | ✅         | Eurostat lfsa_eppga (API). https://ec.europa.eu/eurostat/databrowser/view/lfsa_eppga/default/table                                                                                                                                                      |
| Paid maternity leave (weeks, avg. payment): NL 16 @100%, DE 14 @100%, FR 16 @100%, IT 21.7 @80%, IE 26 @23.4% (flat €289/wk), ES 19 @100%, EU 21.5 @81% (derived: EU-27 mean full-rate-equivalent 17.5 weeks / 21.5 weeks) | country     | ✅         | OECD Family Database PF2.1, Table PF2.1.A (updated May 2026, rules as of April 2025). https://webfs.oecd.org/els-com/Family_Database/PF2_1_Parental_leave_systems.pdf . ES: Real Decreto-ley 9/2025, BOE-A-2025-15741 (16 → 19 weeks from 31 July 2025) |

Notes:

- Fatherhood premium: cross-sectional studies (e.g. Cukrowska-Torzewska & Lovász 2020) find a wage
  premium for fathers in all 26 EU countries, but event studies show no causal earnings change. The
  twin is the same person, so the causal estimate (0%) is the right one. The cross-sectional premium is
  largely selection.
- Part-time: the old Trading Economics figure was a gap in percentage points. Women and men are now
  stored separately from the primary Eurostat table (gap = women − men, e.g. NL 41.8 pp).
- NL maternity pay is 100% up to the daily wage cap; payment rate is OECD's average.

## 6. Twin's investment mix ✅

Rule (owner decision, see DECISIONS.md): the twin starts from her savings split and moves
(men's − women's participation rate) of his savings from the seed packet (cash) to the oak tree
(index fund), never more than her cash.

| Holds shares or mutual funds | NL   | ES   | DE   | FR   | IT   | IE          | EU15 |
| ---------------------------- | ---- | ---- | ---- | ---- | ---- | ----------- | ---- |
| Women                        | 17.3 | 9.7  | 16.7 | 16.2 | 6.1  | eu-fallback | 13.3 |
| Men                          | 25.5 | 16.8 | 25.9 | 24.4 | 11.8 | eu-fallback | 20.8 |
| Shift for the twin (pp)      | 8.2  | 7.1  | 9.2  | 8.2  | 5.7  | 7.5         | 7.5  |

Source: European Commission, DG Justice (Sierminska 2017), _Wealth and Gender in Europe_, Table 2,
participation by gender of the household's financially knowledgeable person, ECB HFCS wave 1
(2010). Ireland was not in that wave. Caveat: the data are old (2010); no newer gender split of the
HFCS is published. https://www.saage-network.eu/sites/default/files/media/publication/Wealth-and-Gender.pdf

Supporting evidence:

- Same report, Table 10A: women hold about 0.58× men's share of wealth in shares and funds (EU15).
- The gap is mainly a **participation** gap, not a lower risky share among those who invest
  (Bacher 2024, **US data**, SCF 1989–2016). https://annikabacher.github.io/Bacher_GenderInvestmentGap.pdf
- 18% of women vs 31% of men invest regularly (ING 2024, via Funds Society, secondary).
  https://www.fundssociety.com/en/opinion/the-370-billion-euro-question-why-do-women-invest-less-and-how-can-it-be-changed/
- Context only, not used: household portfolios per country, HFCS wave 2023, Table D3 (% of
  financial assets). https://www.ecb.europa.eu/stats/ecb_surveys/hfcs/html/index.en.html

  | Region    | Deposits | Mutual funds | Bonds | Listed shares | Vol. pension / life ins. | Other |
  | --------- | -------- | ------------ | ----- | ------------- | ------------------------ | ----- |
  | NL        | 62.6     | 15.8         | n/a   | 5.6           | 7.5                      | 8.1   |
  | ES        | 46.1     | 12.4         | 0.8   | 8.4           | 8.6                      | 23.8  |
  | DE        | 41.2     | 15.8         | 3.4   | 12.6          | 19.7                     | 7.2   |
  | FR        | 40.4     | 9.1          | 0.4   | 8.7           | 35.2                     | 6.2   |
  | IT        | 38.7     | 10.3         | 10.1  | 9.6           | 5.8                      | 25.4  |
  | IE        | 40.7     | 9.0          | 2.3   | 9.0           | 29.5                     | 9.6   |
  | Euro area | 44.1     | 13.3         | 3.0   | 9.7           | 18.3                     | 11.6  |

## 7. Retirement contributions (invested only) ✅

Decision (agreed with project owner): the field counts **only contributions that are actually
invested**. State pay-as-you-go pensions are excluded from both gardens and noted in the UI.

| Country | Invested default (% of gross)                          | Source / reasoning                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NL      | 11.6%                                                  | OECD Pensions at a Glance 2025, Table 8.1: quasi-mandatory occupational 18.6% nominal (6.2 employee + 12.4 employer) above a franchise. Effective total at average earnings 22.0% minus AOW (18% × 0.58 ceiling = 10.4%) = **11.6%**. Observed: 7.2% of average wage per active member (Fig. 9.2, 2023).                                                                                                                                                                           |
| IE      | 3.5% from 2026 → 7% (2029) → 10.5% (2032) → 14% (2035) | MyFutureFund auto-enrolment: employee 1.5 + employer 1.5 + State 0.5 to start, matched increases every 3 years (OECD PaG 2025 ch. 1; gov.ie). Ages 23–60, earnings ≥ €20,000, on earnings up to €80,000; opt-out after 6 months.                                                                                                                                                                                                                                                   |
| IT      | 0%, or 7.41% if her TFR goes to a pension fund         | Mandatory pension is PAYG (33.0%, Table 8.1). Onboarding asks Italian users whether their TFR goes to a pension fund. Yes: TFR accrual = 1/13.5 of annual pay = **7.41%** (Codice civile art. 2120). No: TFR kept with the employer is not invested (revalued at 1.5% + 75% of inflation), so 0%. OECD PaG 2025 ch. 9: a vast majority keep TFR with the employer; 14% participate. The often quoted 6.91% (net of a 0.5% INPS contribution) was not verified from a primary text. |
| ES      | 0%                                                     | Table 8.1: public PAYG only (28.3%).                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| DE      | 0%                                                     | Table 8.1: public PAYG only (18.6%). Occupational plans are voluntary (auto-enrolment only if a collective agreement sets it up).                                                                                                                                                                                                                                                                                                                                                  |
| FR      | 0%                                                     | Table 8.1: public PAYG only (27.8%).                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| EU      | 0%                                                     | Same reasoning; most EU mandatory schemes are PAYG.                                                                                                                                                                                                                                                                                                                                                                                                                                |

Source PDF: https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/11/pensions-at-a-glance-2025_76510fe4/e40274c1-en.pdf

## 8. Real wage growth ✅

Hourly labour productivity growth, average 2022–2070, EC 2024 Ageing Report (Institutional Paper
257), Table I.3.3. The report assumes average wages grow with labour productivity.
https://economy-finance.ec.europa.eu/publications/2024-ageing-report-underlying-assumptions-and-projection-methodologies_en

| NL   | ES   | DE   | FR   | IT   | IE   | EU   |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 1.1% | 1.3% | 1.3% | 1.0% | 1.2% | 1.8% | 1.4% |

## 9. Real-life units

| Value                                              | NL     | ES     | DE     | FR     | IT     | IE     | EU     | Status | Source                                                                                                                                                                                                    |
| -------------------------------------------------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monthly rent, 1-bedroom flat, capital, 2025 (€)    | 1,800  | 1,300  | 1,350  | 1,550  | 1,300  | 2,000  | 1,150  | ✅     | Eurostat prc_colc_rents (rents used for EU staff correction coefficients). NL = The Hague. EU = median of the 27 EU capitals. https://ec.europa.eu/eurostat/databrowser/view/prc_colc_rents/default/table |
| Fully funded sabbatical year = median net income € | 34,466 | 20,367 | 28,891 | 26,459 | 22,062 | 35,138 | 22,939 | ✅     | Eurostat ilc_di03, median equivalised net income, EU-SILC 2025 (income year 2024). https://ec.europa.eu/eurostat/databrowser/view/ilc_di03/default/table                                                  |

Rent: no official source publishes a comparable national average rent in euros (Eurostat and the
OECD Affordable Housing Database only give rent as a share of income). These are capital-city market
rents, higher than a typical national rent. Owner decision: keep them, labelled "rent of a 1-bed
flat in <capital>", because capital rents are what people feel today.
