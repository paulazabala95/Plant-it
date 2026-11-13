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
  remaining difference is the twin's overtrading drag. Her best mix has no single stocks or crypto,
  so the two gardens end equal: with the structural gaps gone and her choices, she ends exactly
  where he does.
- Retirement field: counts only contributions that are actually invested (e.g. NL employer
  pension). State pay-as-you-go pensions are excluded from both gardens and noted in the UI.
  Same mechanics in every country; no country-specific pension or tax rules.
- Italy is the one exception to "no country-specific rules": onboarding asks Italian users one
  yes/no question, whether their TFR goes to a pension fund. Yes: 7.41% of pay is invested
  (1/13.5, Codice civile art. 2120). No: 0% (TFR kept with the employer is not invested).
- Twin's investment mix (owner decision, replaces "he starts from her split"): the twin is a
  fixed benchmark, the typical man in her country, and never copies her answers. His mix starts
  from the typical household's financial assets in her country (ECB HFCS 2023, Table D3; "other"
  excluded, renormalised); mutual funds are split 41% index / 59% active (ESMA 2025: passive funds
  and ETFs were 41% of equity funds); then 3.8% of his savings move from the savings account to the
  index fund (single men vs single women holding risky assets, like-for-like; Bruegel 2025,
  HFCS 2021). Listed shares count as single stocks, so his overtrading drag applies to them.
- Story (owner decision, main goal: show women why they need to invest): the garden opens on "Not
  investing" (all her savings in a savings account) against the typical-man twin, plays the
  reveal, then automatically replays as "Investing" (her at her best: the same euros a month,
  invested). Tabs: "Not investing", "Your mix today", "Investing", each explained in one line.
  Tapping a tab stops the automatic story. "A fair world" is no longer a tab: it is one line in
  "Why is his garden bigger?" (how much bigger her garden would be with no pay gap, motherhood
  penalty or promotion gap). The engine keeps `levelTheField` and its test.
- Investing result (owner decision): the same box as the other tabs (headline, one line, a link).
  "Why do you end up ahead of him?" opens the same style of box as "Here's why": what she put in vs
  him, how much each keeps in a savings account, growth invested vs saved, and what he would have
  if he invested like her (`investingVsTwin`): the gaps remain, investing outgrows them.
- Garden key (owner decision): a small folded "What do the plants mean?" box inside the garden,
  just above the age slider; tap to open it in place. It lists golden seeds, only the plants in the
  two gardens, fruit, wilting, the sky and the euro value of one plant.
- Sources in context (owner decision): every row of "Why is his garden bigger?" shows a short
  source name with an (i) that unfolds the full citation (marked "same for every country" when
  not national); the boxes that appear while the garden grows show only "(i) Source" until tapped. Part-time and career breaks come from her own life
  events, so they say so instead.

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
  leave at the country's payment rate, then the child penalty only for the years the study
  measured (NL 7, FR 5, DE/ES/IE/EU 10, IT 15), counted from the first birth; pay is full again
  afterwards. The lost savings still cost compound growth until retirement (owner decision).
- Baby and part-time never stack (owner decision): the child penalty studies measure earnings,
  which already include mothers working fewer hours. In the years a part-time card overlaps the
  child penalty, the bigger of the two cuts applies, not both.
- The twin lives the same life with the male value of every factor: pay without the same-role gap,
  male promotion rate, fatherhood premium instead of the child penalty, no maternity leave, no
  part-time or career-break cards (they are the structural gaps), the 3.8 pp invest shift and the
  overtrading drag.
- Savings and invested pension contributions are a share of actual pay, so breaks and part-time
  cut both. The retirement field grows at the OECD funded-pension real return (2.5%).
- The twin's overtrading drag applies only to single stocks and crypto, because Barber & Odean
  measured accounts picking individual stocks (owner decision). Index and sustainable funds have
  no drag for either twin.
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

- Website first (not a native app), deployed to GitHub Pages from the default branch.
- Living-world design (owner decision): one illustrated landscape, the twins standing in their
  gardens, sky from morning (today) to sunset (retirement), golden seeds as you save, both twins
  age. Palette: Sunset Petal #E4568B (you), Evening Sky #A7C7E4 (twin), Golden Pollen #F6C94D,
  Leaflit Green #5D7B3D, Rosebud Blush, Sorbet Stem, Petal Glaze, Dusty Orchid, Powdered Lilac Grey
  background; Fraunces headlines, Inter text. Wide screens: both gardens side by side; phones:
  stacked.
- Time-lapse on open (and on every tab or life-event change): "why" tags appear when each cause
  starts; illustrative promotion moments (expected number over the career, spread evenly); then the
  reveal lights up the twin's extra plants grouped by cause (Shapley shares), then the result.
- Net pay (owner decision): gross salary is asked, net pay is estimated with OECD Taxing Wages 2025
  (income tax + employee social contributions, single, no children, interpolated between 67%, 100%
  and 167% of the average wage, flat outside). Savings are asked in euros a month from net pay and
  shown as a share of net pay; the split shows euros per option. In the engine, saving is a share of
  net pay every month (recomputed as pay changes); pensions stay on gross pay. The twin saves the
  same share of his (higher) net pay.
- Order: welcome (card centred on every screen), the five questions, then "How your garden grows"
  as a grid of equal cards (3 / 2 / 1 columns) with her own mix highlighted, then the garden.
- Flow: hook question ("Have you ever pictured your life with, and without, investing?"), "How your
  garden grows" (every euro is a seed, one plant per option, fruit = growth), then the questions.
  "Next" on every question, "See my garden" on the last. Country = where you pay income tax.
- Ten savings options with plain names first: cash, savings account, government bonds, index fund or
  ETF, actively managed fund, sustainable fund, single stocks, crypto, life-insurance savings, plus
  the workplace pension filled in from the country.
- Garden: one drawn scene per twin; plants per option from the engine (one plant per round euro
  unit, at least one if anything is there), fruit = growth, wilted sunflowers when worth less than
  paid in; an age slider to watch both grow; life events show in the scene and each card says what
  it costs. Tabs: see "Story" above.
- A baby card is framed positively with a "Planning a baby?" panel (leave, buffer, keep investing,
  share leave, the dip is temporary), as things to consider, not advice.
- Owner rule: propose changes and get agreement before building them.
- Questions on the garden screen are soft pills, never underlined links (owner decision): a round
  "?" badge, the question, an arrow; blush on "Not investing", light green on "Investing";
  "See the result" uses the same pill with a back arrow; "Edit answers" is a small white pill.

- Life event cards: tap a card, then tap an age (drag on desktop is a nice-to-have).
- Real-life unit (owner decision, replaces years of rent and sabbatical years): **extra money a month
  in retirement**, paying the gap out over average life expectancy at retirement. Rent data is kept
  in `src/data` but no longer shown. Housing and home ownership are not modelled; housing and home ownership are not modelled (README limitation).
- "Plant it" action: to be decided with the owner before Milestone 7.
