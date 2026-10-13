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

| Value                                                                                                                                                                                                                      | Flag        | Status | Source                                                                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promotion rate per year: **men 7.3%, women 4.9%** (1.5×) for the same background, incl. career breaks. Gap is largest early in careers (years 2–5: 8.5% vs 5.2%), smallest after 10 years (4.6% vs 3.7%)                   | eu-fallback | ✅     | Kauhanen & Napari (2011), _Gender Differences in Careers_, ETLA DP 1241, Table 3 (linear probability model, Finnish white-collar linked employer-employee data 1981–2006). Same data as the promotion raise. https://www.etla.fi/wp-content/uploads/2012/09/dp1241.pdf . Replaces McKinsey/LeanIn (US). |
| Promotion raise: **+4%** on top of normal wage growth (in-firm promotion; +5.8% with an employer change)                                                                                                                   | eu-fallback | ✅     | Kauhanen & Napari (2012), _Career and Wage Dynamics_, ETLA DP 1244, Finnish linked employer-employee data, fixed effects. Context: Baker, Gibbs & Holmström (1994) 6% (US). https://www.etla.fi/wp-content/uploads/2012/09/dp1244.pdf                                                                   |
| Child penalty (mothers' earnings, long run): NL 46%, DE 61%, ES 28%, FR 20%, IT 43%, IE 28%_, EU 29%_                                                                                                                      | country     | ✅     | See table below.                                                                                                                                                                                                                                                                                        |
| Fatherhood premium: **0%**                                                                                                                                                                                                 | eu-fallback | ✅     | Kleven et al. (2019), event studies in 6 countries: "men are essentially unaffected" by the first child. https://www.nber.org/papers/w25524                                                                                                                                                             |
| Part-time share 2025, ages 20–64, women / men: NL 60.8/19.0, DE 48.7/11.6, IT 27.7/6.0, IE 26.5/8.6, FR 25.6/8.1, ES 20.9/6.3, EU 27.5/7.8                                                                                 | country     | ✅     | Eurostat lfsa_eppga (API). https://ec.europa.eu/eurostat/databrowser/view/lfsa_eppga/default/table                                                                                                                                                                                                      |
| Paid maternity leave (weeks, avg. payment): NL 16 @100%, DE 14 @100%, FR 16 @100%, IT 21.7 @80%, IE 26 @23.4% (flat €289/wk), ES 19 @100%, EU 21.5 @81% (derived: EU-27 mean full-rate-equivalent 17.5 weeks / 21.5 weeks) | country     | ✅     | OECD Family Database PF2.1, Table PF2.1.A (updated May 2026, rules as of April 2025). https://webfs.oecd.org/els-com/Family_Database/PF2_1_Parental_leave_systems.pdf . ES: Real Decreto-ley 9/2025, BOE-A-2025-15741 (16 → 19 weeks from 31 July 2025)                                                 |

Notes:

- Fatherhood premium: cross-sectional studies (e.g. Cukrowska-Torzewska & Lovász 2020) find a wage
  premium for fathers in all 26 EU countries, but event studies show no causal earnings change. The
  twin is the same person, so the causal estimate (0%) is the right one. The cross-sectional premium is
  largely selection.
- Part-time: the old Trading Economics figure was a gap in percentage points. Women and men are now
  stored separately from the primary Eurostat table (gap = women − men, e.g. NL 41.8 pp).
- NL maternity pay is 100% up to the daily wage cap; payment rate is OECD's average.

### Child penalty by country

The engine needs the drop in **earnings**. National event studies differ in horizon and comparison
group, so the numbers are not perfectly comparable; each `source` string says which.

| Country | Earnings drop | Horizon / comparison                                    | Source                                                                                                                                                                                                          |
| ------- | ------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NL      | 46%           | 7 years after first child, vs own no-child path         | Rabaté & Rellstab (2021), CPB Discussion Paper 424. https://www.cpb.nl/sites/default/files/omnidownload/CPB-Discussion-Paper-424-The-Child-Penalty.pdf                                                          |
| DE      | 61%           | years 5–10, mothers vs fathers                          | Kleven, Landais, Posch, Steinhauer & Zweimüller (2019), AEA P&P. https://www.nber.org/papers/w25524                                                                                                             |
| ES      | 28%           | 10 years after birth, mothers vs fathers                | de Quinto, Hospido & Sanz (2021), _The child penalty: evidence from Spain_, SERIEs 12. https://www.bde.es/wbe/en/publicaciones/analisis-economico-investigacion/documentos-ocasionales/child-penalty-spain.html |
| FR      | 20%           | 5 years after birth                                     | Pora & Wilner (2019), Insee Analyses No. 48. https://www.insee.fr/en/statistiques/4240363                                                                                                                       |
| IT      | 43%           | 15 years after birth, vs childless women; 57 log points | Casarico & Lattanzio (2021), CESifo WP 9155 (published 2023, J. Population Economics). 1 − e^−0.57 = 43%. https://www.ifo.de/DocDL/cesifo1_wp9155.pdf                                                           |
| IE \*   | 28%           | **employment**, not earnings (lower bound)              | Kleven, Landais & Leite-Mariante (2025), _The Child Penalty Atlas_, REStud. https://childpenaltyatlas.org (CSV export)                                                                                          |
| EU \*   | 29%           | **employment**, Europe                                  | Same Atlas.                                                                                                                                                                                                     |

Notes:

- Ireland has no earnings estimate for all mothers. The only one (Doris, O'Neill & Sweetman, IZA
  World of Labor) covers graduates: earnings fall 27% the year after birth and the drop grows. It
  is consistent with 28%.
- The Atlas gives one consistent **employment** penalty for all six (NL 20, FR 25, IE 28, IT 33,
  ES 38, DE 41, Europe 29). Earnings penalties are larger because they also include hours and pay.
- Fathers: 0% (see fatherhood premium).
- Context for promotions (not used, double counts part-time and motherhood): Eurostat lfsa_egais
  2025, share of employed aged 20–64 who are managers, men vs women: NL 8.7/4.2, DE 5.9/2.9,
  IT 4.7/2.6, ES 5.0/3.3, FR 8.9/5.9, IE 11.3/8.2, EU 6.5/4.2.

## 6. Twin's investment mix ✅

Rule (see DECISIONS.md): the twin starts from her savings split and moves **3.8%** of his savings
from the seed packet (cash) to the oak tree (index fund), never more than her cash. Same value for
every country (`eu-fallback`).

Source: Darvas & Ruer (2025), _Gender wealth inequality in the European Union: a distributional
perspective_, Bruegel Working Paper 26/2025, Table 5. ECB HFCS **2021** (wave 4), 22 EU countries,
single never-married adults aged 25–65 without children (8,817 people). Controlling for income,
education, employment status, age, inheritance, risk attitude and country, single women are
**3.8 percentage points** less likely than single men to hold risky financial assets (shares,
mutual funds, bonds), significant at 10%.
https://www.bruegel.org/working-paper/gender-wealth-inequality-european-union-distributional-perspective

Why this replaces the 2010 per-country figures (Sierminska 2017, HFCS 2010, 6–9 pp):

- Newer data (2021 vs 2010).
- Like-for-like: same income, education and job, the same logic as the same-role pay gap. The twin
  is identical apart from gender, so the raw gap would double count income effects that the engine
  models separately.
- It compares singles, so the answer is not mixed up with who in a couple holds the account.
- The raw 2021 gaps among singles are small and mixed by country (Table 4, women/men holding mutual
  funds: NL 18.4/18.2, DE 27.2/26.5, FR 7.1/10.3, IT 11.0/10.4, ES 7.1/7.0, IE 3.2/2.9; listed
  shares: NL 6.4/12.5, DE 18.3/15.9, FR 8.3/12.2, IT 6.0/5.8, ES 11.0/11.4, IE 9.5/10.5). Per type
  only, they cannot be combined into one "holds any" rate per country, so no per-country value.
- Caveat: the model also controls for risk attitude, which is partly a behaviour. 3.8 pp is
  therefore a conservative (low) estimate of the choice gap.

Context only, not used:

- Sierminska (2017) for the European Commission, _Wealth and Gender in Europe_, HFCS 2010:
  holds shares or funds, women/men: NL 17.3/25.5, ES 9.7/16.8, DE 16.7/25.9, FR 16.2/24.4,
  IT 6.1/11.8, EU15 13.3/20.8 (household's financially knowledgeable person, all households).
  https://www.saage-network.eu/sites/default/files/media/publication/Wealth-and-Gender.pdf
- 18% of women vs 31% of men invest regularly (ING 2024, via Funds Society, secondary).
- Bacher (2024): the gap is mainly participation, not risky share (**US data**, SCF).
- Household portfolios per country, HFCS wave 2023, Table D3 (% of financial assets):

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

## 7b. Retirement age and pension growth ✅

- Retirement age (both twins): OECD _Pensions at a Glance 2025_, future normal retirement age for a
  full career from age 22 starting in 2024 (OECD data explorer DF_DPS, FRPLF22, same for men and
  women): NL 70, IT 70, DE 67, IE 66, ES 65, FR 65. EU fallback: OECD average 66.4 (men; women 65.9).
- Retirement field growth: **2.5% real**, OECD _Pensions at a Glance 2025_ base-case net real rate
  of return on funded defined-contribution pensions (same report also assumes 1.25% real wage growth).
  https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/11/pensions-at-a-glance-2025_76510fe4/e40274c1-en.pdf

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
