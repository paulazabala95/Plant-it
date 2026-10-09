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
  source). Rent is a yardstick only; housing and home ownership are not modelled (README limitation).
- "Plant it" action: to be decided with the owner before Milestone 7.
