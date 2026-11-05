import type { Plot, PlotCount } from '../engine'
import { PEOPLE, fruitFor, isWilted } from '../themes'
import {
  AppleTree,
  Drawer,
  FruitBush,
  Greenhouse,
  Hedge,
  Mushroom,
  Oak,
  Sign,
  Sunflower,
  Vines,
  Wildflowers,
} from './plants'

const INK = '#1F4D3A'

// Fixed planting spots, back to front (deterministic layout, no randomness).
const SPOTS: [number, number][] = [
  [52, 138],
  [100, 134],
  [148, 138],
  [196, 134],
  [244, 138],
  [292, 134],
  [70, 154],
  [118, 150],
  [166, 154],
  [214, 150],
  [262, 154],
  [310, 150],
  [46, 182],
  [92, 186],
  [138, 182],
  [222, 182],
  [268, 186],
  [314, 182],
  [24, 214],
  [62, 218],
  [100, 214],
  [250, 214],
  [290, 218],
  [330, 214],
]

const TALL: Plot[] = ['indexFund', 'pension', 'singleStocks']
const MID: Plot[] = ['activeFund', 'governmentBonds']
const SHORT: Plot[] = ['sustainableFund', 'crypto', 'lifeInsurance']

interface Props {
  person: 'her' | 'twin'
  counts: PlotCount[]
  /** Short labels for life events active at this age. */
  signs: string[]
  baby: boolean
}

/** One person's garden at one age. Plants come from the engine's plant counts. */
export function Scene({ person, counts, signs, baby }: Props) {
  const look = PEOPLE[person]
  const get = (p: Plot) => counts.find((c) => c.plot === p)

  // Tall plants take spots from the back, short ones from the front, the rest in between.
  const many = (plots: Plot[]) =>
    plots.flatMap((p) => Array.from({ length: get(p)?.plants ?? 0 }, () => p))
  const free = [...SPOTS]
  const items: { p: Plot; at: [number, number] }[] = []
  for (const p of many(TALL)) if (free.length) items.push({ p, at: free.shift()! })
  for (const p of many(SHORT)) if (free.length) items.push({ p, at: free.pop()! })
  for (const p of many(MID))
    if (free.length) items.push({ p, at: free.splice(Math.floor(free.length / 2), 1)[0] })
  items.sort((a, b) => a.at[1] - b.at[1])

  const cash = get('cash')
  const greenhouse = get('greenhouse')
  const empty = items.length === 0 && !cash?.plants && !greenhouse?.plants

  const draw = (p: Plot) => {
    const c = get(p)!
    if (p === 'indexFund') return <Oak fruit={fruitFor(c.growth)} s={0.8} />
    if (p === 'pension') return <AppleTree fruit={fruitFor(c.growth)} s={0.85} />
    if (p === 'singleStocks') return <Sunflower wilted={isWilted(c.growth)} />
    if (p === 'sustainableFund') return <Wildflowers />
    if (p === 'activeFund') return <FruitBush fruit={fruitFor(c.growth)} />
    if (p === 'governmentBonds') return <Hedge />
    if (p === 'lifeInsurance') return <Vines />
    return <Mushroom />
  }

  return (
    <svg
      viewBox="0 0 360 240"
      role="img"
      aria-label={person === 'her' ? 'Your garden' : "Your twin's garden"}
      style={{ display: 'block', width: '100%' }}
    >
      <rect width="360" height="240" fill={look.sky} />
      <circle cx="318" cy="38" r="18" fill="#F7D55C" stroke={INK} strokeWidth={2.5} />
      <path
        d="M40 46c0-8 10-12 16-7 3-6 14-6 16 2 8-1 11 9 3 11H43c-4 0-5-4-3-6z"
        fill="#fff"
        stroke={INK}
        strokeWidth={2.5}
      />
      <path
        d="M0 132C70 112 130 124 190 118s120-6 170 8v114H0z"
        fill="#A6DE7E"
        stroke={INK}
        strokeWidth={2.5}
      />
      <path d="M0 168c90-12 220-6 360 4v68H0z" fill="#93D06C" opacity="0.6" />

      {greenhouse && greenhouse.plants > 0 && (
        <g transform="translate(300 160)">
          <Greenhouse seedlings={greenhouse.plants} />
        </g>
      )}
      {items.map(({ p, at }, k) => (
        <g key={k} transform={`translate(${at[0]} ${at[1]})`}>
          {draw(p)}
        </g>
      ))}
      {cash && cash.plants > 0 && (
        <g transform="translate(176 232)">
          <Drawer packets={cash.plants} />
        </g>
      )}

      {/* the gardener */}
      <g transform={`translate(${cash?.plants ? 222 : 180} 236) scale(0.32)`}>
        <path
          d={
            person === 'her'
              ? 'M0-150c22 24 64 44 64 82 0 34-28 56-64 56s-64-22-64-56c0-38 42-58 64-82z'
              : 'M4-140c34-2 58 22 58 58 0 40-30 66-66 66-34 0-60-24-58-58 2-38 30-64 66-66z'
          }
          fill={look.color}
          stroke={INK}
          strokeWidth={7}
        />
        <ellipse cx="-20" cy="-78" rx="8" ry="10" fill={INK} />
        <ellipse cx="20" cy="-78" rx="8" ry="10" fill={INK} />
        <path
          d="M-14-54q14 14 28 0"
          stroke={INK}
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {baby && (
        <g transform={`translate(${cash?.plants ? 252 : 210} 236) scale(0.18)`}>
          <circle cx="0" cy="-60" r="56" fill="#FFF8EE" stroke={INK} strokeWidth={10} />
          <circle cx="-18" cy="-62" r="7" fill={INK} />
          <circle cx="18" cy="-62" r="7" fill={INK} />
          <path
            d="M-12-40q12 10 24 0"
            stroke={INK}
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}
      {signs.map((s, k) => (
        <g key={s} transform={`translate(${36 + k * 96} 120)`}>
          <Sign text={s} color="#F7D55C" />
        </g>
      ))}
      {empty && (
        <text
          x="180"
          y="200"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={INK}
          fontFamily="DM Sans, sans-serif"
        >
          Nothing planted yet
        </text>
      )}
    </svg>
  )
}

/** Small icon of a plot's plant, for legends and onboarding. */
export function PlotIcon({ plot }: { plot: Plot }) {
  const art =
    plot === 'indexFund' ? (
      <Oak fruit={2} s={0.62} />
    ) : plot === 'pension' ? (
      <AppleTree fruit={3} s={0.8} />
    ) : plot === 'singleStocks' ? (
      <Sunflower s={0.75} />
    ) : plot === 'sustainableFund' ? (
      <Wildflowers s={1.1} />
    ) : plot === 'crypto' ? (
      <Mushroom s={1.1} />
    ) : plot === 'activeFund' ? (
      <FruitBush fruit={3} s={1.1} />
    ) : plot === 'governmentBonds' ? (
      <Hedge s={1.1} />
    ) : plot === 'lifeInsurance' ? (
      <Vines s={1.1} />
    ) : plot === 'cash' ? (
      <g transform="scale(0.62)">
        <Drawer packets={3} />
      </g>
    ) : (
      <g transform="scale(0.62)">
        <Greenhouse seedlings={3} />
      </g>
    )
  return (
    <svg viewBox="-30 -60 60 64" width="64" height="68" aria-hidden>
      {art}
    </svg>
  )
}
