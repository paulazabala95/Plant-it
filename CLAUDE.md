# Plant It: project conventions

A gamified financial timeline: the user and her identical male twin run side by side to
retirement, shown as two gardens. Core message: **women don't invest worse, they invest less.
Invest more, behave like you.** Never frame the fix as "invest like men".

Product and modelling decisions live in `DECISIONS.md`; read it before changing behaviour.

## Commands

- `npm run dev`: local dev server
- `npm test`: unit tests (Vitest), `npm run test:watch` while developing
- `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run build`
- Run lint, format check, tests and build before every commit. CI runs the same.

## Architecture: three strict layers

| Layer  | Folder        | May import          | Never                                        |
| ------ | ------------- | ------------------- | -------------------------------------------- |
| Engine | `src/engine/` | `src/data/` only    | React, motion, DOM, theme or UI code         |
| Theme  | `src/themes/` | engine types        | React components, UI code, any math on money |
| UI     | `src/ui/`     | engine, theme, data | financial math (always call the engine)      |

`src/data/` holds sourced country defaults as plain typed objects.
ESLint (`no-restricted-imports`) enforces the engine and theme boundaries.

- The engine is pure functions: inputs in, timeline out. Deterministic, no randomness,
  no `Date.now()`.
- Monthly compounding. All values the user sees are in today's money (inflation-adjusted).
- Every scenario (her today, her at her best, twin, level the field, swaps) is computed by the
  engine from inputs. Nothing is hardcoded in the UI.
- The theme maps engine output to visuals (plant type, growth stage, season). A new theme must
  be addable without touching the engine.

## Testing

- **Tests first** for every engine lever: write the failing test, then the implementation.
- Tests sit next to the code: `foo.ts` + `foo.test.ts`.
- Prefer small hand-checkable cases (e.g. 1 year, 1 asset) over snapshot tests.
- "Level the field" needs a test proving the only difference between the timelines is the
  trading drag.

## Data and sources

- No invented numbers. Every default in `src/data/` has a source entry in `SOURCES.md` and a
  one-line `source` string shown in the "adjust assumptions" panel.
- Each value is flagged `country` or `eu-fallback`. Countries: NL, ES, DE, FR, IT, IE + EU.
- Pay gap = **adjusted** ("same role") gap, never the headline unadjusted figure (part-time,
  sector and promotions are modelled separately by cards; using the headline gap double counts).
- Currency: EUR everywhere. No country-specific pension or tax rules.

## Product rules

- Onboarding has exactly 5 inputs: age, country, gross salary, % saved monthly, savings split.
- Never ask about children or for numbers users are unlikely to know.
- Career break copy is reason-neutral.
- Main screens show almost no numbers; numbers live in the assumptions panel and ending.
- Footer always says: "Not financial advice. These are illustrative assumptions."
- Mobile-first; layouts must screenshot well at phone width.

## Style

- TypeScript strict, Prettier (no semicolons, single quotes), named exports in engine/theme.
- Commit after each milestone with a clear message.
