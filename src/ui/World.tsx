import { useEffect, useState, type CSSProperties } from 'react'
import type { Plot, PlotCount } from '../engine'
import { PALETTE, skyAt } from '../themes'
import { PlantArt, Person } from './art'

export interface Side {
  counts: PlotCount[]
  hair: string
  glasses: boolean
  baby: boolean
  mood: 'happy' | 'flat' | 'worried' | 'beaming'
  label: string
  value: string
  promoted: boolean
  /** Colour to light up a plant by its index in this garden (the reveal). */
  highlight?: Record<number, string>
  /** Seeds to drop this step (proportional to what was saved). */
  seeds: number
}

// Order of patches from left to right inside a garden.
const PATCHES: Plot[] = [
  'pension',
  'indexFund',
  'sustainableFund',
  'activeFund',
  'governmentBonds',
  'lifeInsurance',
  'singleStocks',
  'crypto',
  'greenhouse',
  'cash',
]

const ROWS = 6
const COLS = 7

/** Deterministic layout: slots run column by column so each option grows in its own patch. */
function slots(x0: number, x1: number, ybk: number, yfr: number) {
  const out: { x: number; y: number; s: number }[] = []
  const inset = 40
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const t = (r + 0.6) / (ROWS + 0.6)
      const y = ybk + (yfr - ybk) * t
      const xa = x0 + inset * (1 - t) + 30
      const xb = x1 - inset * (1 - t) - 30
      const wobble = ((c * 7 + r * 13) % 5) - 2
      out.push({
        x: xa + ((xb - xa) * (c + 0.5)) / COLS + wobble * 3,
        y: y + wobble,
        s: 0.95 + 0.65 * t,
      })
    }
  }
  return out
}

function GardenBed({ x0, x1, side, id }: { x0: number; x1: number; side: Side; id: string }) {
  const ybk = 600
  const yfr = 860
  const plants = PATCHES.flatMap((p) => {
    const c = side.counts.find((k) => k.plot === p)
    return c ? Array.from({ length: c.plants }, () => ({ plot: p, growth: c.growth })) : []
  })
  const spots = slots(x0, x1, ybk, yfr)
  const placed = plants.slice(0, spots.length).map((p, i) => ({ ...p, i, at: spots[i] }))
  placed.sort((a, b) => a.at.y - b.at.y)
  const inset = 40
  return (
    <g>
      <path
        d={`M${x0 + inset} ${ybk}L${x1 - inset} ${ybk}L${x1} ${yfr}L${x0} ${yfr}z`}
        fill="#C79A7A"
      />
      {Array.from({ length: ROWS }, (_, i) => {
        const t = (i + 1) / (ROWS + 1)
        const y = ybk + (yfr - ybk) * t
        return (
          <path
            key={i}
            d={`M${x0 + inset * (1 - t) + 6} ${y}L${x1 - inset * (1 - t) - 6} ${y}`}
            stroke="#B8876A"
            strokeWidth={3 + 4 * t}
            strokeLinecap="round"
            opacity=".7"
          />
        )
      })}
      {placed.map(({ plot, growth, i, at }) => (
        <g key={`${id}-${i}`} transform={`translate(${at.x} ${at.y}) scale(${at.s})`}>
          <g
            className={`plant ${side.highlight?.[i] ? 'lit' : ''}`}
            style={
              side.highlight?.[i] ? ({ '--lit': side.highlight[i] } as CSSProperties) : undefined
            }
          >
            <PlantArt plot={plot} growth={growth} />
          </g>
        </g>
      ))}
    </g>
  )
}

function Label({ x, side, color }: { x: number; side: Side; color: string }) {
  return (
    <g transform={`translate(${x} 560)`}>
      <rect x="-125" y="-56" width="250" height="68" rx="34" fill="#fff" opacity=".95" />
      <text
        x="0"
        y="-30"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="16"
        fontWeight="700"
        fill={color}
        letterSpacing="1"
      >
        {side.label.toUpperCase()}
      </text>
      <text
        x="0"
        y="2"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="700"
        fontSize="32"
        fill={PALETTE.ink}
      >
        {side.value}
      </text>
      {side.promoted && (
        <g className="promo">
          <rect x="70" y="-86" width="128" height="32" rx="16" fill={PALETTE.goldenPollen} />
          <text
            x="134"
            y="-64"
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize="15"
            fontWeight="700"
            fill={PALETTE.ink}
          >
            Promoted +4%
          </text>
        </g>
      )}
    </g>
  )
}

interface Seed {
  id: string
  tick: number
  x: number
  y: number
  d: number
}

/** Seeds falling into one garden: a few per step of the time-lapse, gone after about a second. */
function useSeeds(prefix: string, count: number, x0: number, x1: number, tick: number) {
  const [seeds, setSeeds] = useState<Seed[]>([])
  useEffect(() => {
    const fresh = Array.from({ length: Math.min(count, 14) }, (_, k) => ({
      id: `${prefix}-${tick}-${k}`,
      tick,
      x: x0 + Math.random() * (x1 - x0),
      y: 260 + Math.random() * 90,
      d: 330 + Math.random() * 200,
    }))
    setSeeds((s) => [
      ...s.filter((x) => count > 0 && x.tick > tick - 4 && x.tick <= tick),
      ...fresh,
    ])
  }, [prefix, tick, count, x0, x1])
  return seeds
}

const HILL_TREES = Array.from({ length: 18 }, (_, i) => 40 + i * 90)

interface Props {
  /** 'wide' shows both gardens; 'her' or 'twin' shows one (phone). */
  mode: 'wide' | 'her' | 'twin'
  progress: number
  her: Side
  twin: Side
  tick: number
}

/** The living world: sky over a lifetime, hills, two gardens and the twins. */
export function World({ mode, progress, her, twin, tick }: Props) {
  const wide = mode === 'wide'
  const width = wide ? 1600 : 800
  const [top, bottom] = skyAt(progress)
  const sunX = (wide ? 180 : 90) + progress * (wide ? 1240 : 620)
  const sunY = 330 - Math.sin(progress * Math.PI) * 240
  const herX = wide ? [60, 740] : [60, 740]
  const twinX = wide ? [860, 1540] : [60, 740]
  const herSeeds = useSeeds(
    `h${mode}`,
    mode === 'twin' ? 0 : her.seeds,
    herX[0] + 40,
    herX[1] - 40,
    tick,
  )
  const twinSeeds = useSeeds(
    `t${mode}`,
    mode === 'her' ? 0 : twin.seeds,
    twinX[0] + 40,
    twinX[1] - 40,
    tick,
  )
  const id = `sky-${mode}`
  return (
    <svg
      className="world"
      viewBox={`0 0 ${width} 900`}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Your garden and your twin's garden"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor="#FFF3C4" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFF3C4" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-grain`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0" />
        </filter>
      </defs>
      <rect width={width} height="900" fill={`url(#${id})`} />
      <g transform={`translate(${sunX} ${sunY})`}>
        <circle r="160" fill={`url(#${id}-sun)`} />
        <circle r="54" fill={PALETTE.goldenPollen} />
      </g>
      {[
        [260, 140, 1],
        [820, 90, 0.8],
        [1300, 170, 1.1],
        [560, 210, 0.6],
      ]
        .filter(([x]) => x < width)
        .map(([x, y, s], i) => (
          <g key={i} className="cloud" transform={`translate(${x} ${y}) scale(${s})`}>
            <path
              d="M0 0c0-28 34-38 50-18 10-24 52-22 58 6 26-2 34 30 8 34H6c-16 0-20-14-6-22z"
              fill="#fff"
              opacity=".92"
            />
          </g>
        ))}
      <path
        d="M0 470C200 400 380 430 560 410S900 360 1100 400 1450 420 1600 380V900H0z"
        fill="#B6CF8A"
      />
      <path d="M0 520C260 470 520 500 760 480S1200 450 1600 490V900H0z" fill="#9DBB62" />
      <path d="M0 580C300 545 600 560 900 550S1400 540 1600 560V900H0z" fill="#86A84F" />
      {HILL_TREES.filter((x) => x < width).map((x) => (
        <g
          key={x}
          transform={`translate(${x} ${470 + 30 * Math.sin(x / 170)}) scale(.35)`}
          opacity=".55"
        >
          <path d="M-5 0L-3-46H3L5 0z" fill="#8A6146" />
          <circle cx="0" cy="-70" r="34" fill="#5D7B3D" />
          <circle cx="-12" cy="-80" r="18" fill="#7E9C4E" />
        </g>
      ))}
      {wide && (
        <path d="M770 560C760 640 700 760 640 900H960C900 760 840 640 830 560z" fill="#EBD8C3" />
      )}
      {mode !== 'twin' && <GardenBed x0={herX[0]} x1={herX[1]} side={her} id="her" />}
      {mode !== 'her' && <GardenBed x0={twinX[0]} x1={twinX[1]} side={twin} id="twin" />}
      {mode !== 'twin' && (
        <g transform={`translate(${wide ? 230 : 120} 895) scale(${wide ? 0.74 : 0.7})`}>
          <Person
            kind="her"
            hair={her.hair}
            glasses={her.glasses}
            baby={her.baby}
            mood={her.mood}
          />
        </g>
      )}
      {mode !== 'her' && (
        <g transform={`translate(${wide ? 1370 : 680} 895) scale(${wide ? 0.74 : 0.7})`}>
          <Person
            kind="twin"
            hair={twin.hair}
            glasses={twin.glasses}
            baby={twin.baby}
            mood={twin.mood}
          />
        </g>
      )}
      {mode !== 'twin' && <Label x={400} side={her} color="#C23A6F" />}
      {mode !== 'her' && <Label x={wide ? 1200 : 400} side={twin} color="#3F78AD" />}
      {[...herSeeds, ...twinSeeds].map((s) => (
        <circle
          key={s.id}
          className="seed"
          cx={s.x}
          cy={s.y}
          r="5"
          fill={PALETTE.goldenPollen}
          style={{ '--d': `${s.d}px` } as CSSProperties}
        />
      ))}
      <rect width={width} height="900" filter={`url(#${id}-grain)`} pointerEvents="none" />
    </svg>
  )
}
