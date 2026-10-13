# Decisions log

Product and modelling decisions agreed with the project owner. Read before changing behaviour.

## Scope

- Countries: NL, ES, DE, FR, IT, IE. Missing country data falls back to an EU figure, flagged in
  the assumptions panel ("EU average, no country data").
- Currency: EUR everywhere. Language: English only (v1).
- Repo: `paulazabala95/Plant-it`, deployed to GitHub Pages at `/Plant-it/`.

## Engine

- Deterministic: fixed expected returns, no randomness. Risk is shown visually only.
- Structural vs choice breakdown uses Shapley attribution: each factor's share is averaged over
  every removal order, so shares are order-independent and sum to 100%.
- "Her at her best": same savings rate as today, cash reduced to a small editable buffer (default
  10%) kept in the greenhouse (high-yield savings), the rest invested across her chosen invested
  options (index fund if none), zero trading drag.
- "Level the field": both twins use her "at her best" mix; all structural factors removed; the only
  remaining difference is the twin's overtrading drag.
- Retirement field: counts only contributions that are actually invested (e.g. NL employer
  pension). State pay-as-you-go pensions are excluded from both gardens and noted in the UI.
  Same mechanics in every country; no country-specific pension or tax rules.
- Italy is the one exception to "no country-specific rules": onboarding asks Italian users one
  yes/no question, whether their TFR goes to a pension fund. Yes: 7.41% of pay is invested
  (1/13.5, Codice civile art. 2120). No: 0% (TFR kept with the employer is not invested).
- Twin's investment mix: he starts from her savings split and moves 3.8% of his savings from cash
  to the index fund, never more than her cash. 3.8 pp = like-for-like gender gap in holding risky
  assets (singles, same income, education, job; Bruegel 2025, HFCS 2021). Same for every country.
  Additive, so the twin still invests a little when she invests nothing. Replaces the 2010
  per-country gaps (6–9 pp), which were older and not like-for-like.

## Data

- Same-role pay gap: national figures where they exist (NL, DE, FR), Eurostat's decomposition for
  ES, IT and IE. The mix is kept; those three show a note in the assumptions panel explaining that
  Eurostat's method gives higher gaps everywhere, so the gap may look larger partly by method.
- Promotion rate (men 7.3% vs women 4.9% a year), promotion raise (+4%) and fatherhood premium
  (0%) are EU-wide (`eu-fallback`) for every country (Finnish linked data; Kleven et al.).
- Child penalty = drop in mothers' earnings from national event studies (horizons differ, noted in
  each source). Ireland and the EU fallback use the Child Penalty Atlas employment penalty, a lower
  bound, because no earnings estimate exists.

## Engine model (Milestone 2)

- One monthly simulation for any person (`simulate`); scenarios only build different profiles.
- Pay: her gross salary, growing each year by real wage growth + promotion rate × promotion raise
  (expected value, no randomness).
- Life event cards change pay: career break = no pay; part-time = hours share; child = maternity
  leave at the country's payment rate, then the child penalty for the rest of the career (applied
  once, from the first child). **Open: the penalty is measured 5–15 years after birth; applying it
  until retirement is an assumption.**
- The twin lives the same life with the male value of every factor: pay without the same-role gap,
  male promotion rate, fatherhood premium instead of the child penalty, no maternity leave, no
  part-time or career-break cards (they are the structural gaps), the 3.8 pp invest shift and the
  overtrading drag.
- Savings and invested pension contributions are a share of actual pay, so breaks and part-time
  cut both. The retirement field grows at the OECD funded-pension real return (2.5%).
- Trading drag is charged on every traded option (index, sustainable, single stocks, crypto).
  **Open: Barber & Odean measured stock-picking accounts; see the owner question below.**
- Breakdown: exact Shapley values over 7 factors (structural: pay gap, promotions, child penalty,
  part-time, career break; choice: invest mix, trading drag). Shares sum to the full gap.
- The engine never reads the clock: the UI passes the current year (needed for Ireland's
  auto-enrolment steps).

## Garden options

| Option             | Metaphor                | Default real return                                       |
| ------------------ | ----------------------- | --------------------------------------------------------- |
| Cash               | seed packet in a drawer | −2.0% (0% nominal − inflation)                            |
| High-yield savings | greenhouse seed tray    | from ECB deposit rates                                    |
| Index fund         | oak tree                | 5.2% (DMS world equities)                                 |
| Sustainable fund   | wildflower meadow       | same as index                                             |
| Single stocks      | sunflowers              | typical stock ≈ T-bills; selectable but never recommended |
| Crypto             | mushrooms               | 0.0%, labelled "no reliable long-run estimate"            |

The app's message is diversified funds; swaps and "her at her best" never recommend single stocks
or crypto.

## UI

- Life event cards: tap a card, then tap an age (drag on desktop is a nice-to-have).
- Real-life units: years of rent and fully funded sabbatical years. No flights (no official
  source). Rent = Eurostat rent of a 1-bed flat in the capital, labelled with the city; it is
  deliberately a capital-city market rent (overstates a national average). Rent is a yardstick only; housing and home ownership are not modelled (README limitation).
- "Plant it" action: to be decided with the owner before Milestone 7.
