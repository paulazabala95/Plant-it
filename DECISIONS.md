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
- Twin's investment mix: he starts from her savings split and moves (men's − women's share
  investing in shares or funds, per country) of his savings from cash to the index fund, never more
  than her cash. Source: EC "Wealth and Gender in Europe" (HFCS). Additive, so the twin still
  invests a little when she invests nothing.

## Data

- Same-role pay gap: national figures where they exist (NL, DE, FR), Eurostat's decomposition for
  ES, IT and IE. The mix is kept; those three show a note in the assumptions panel explaining that
  Eurostat's method gives higher gaps everywhere, so the gap may look larger partly by method.
- Promotion raise (+4%) and fatherhood premium (0%) are EU-wide (`eu-fallback`) for every country.

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
