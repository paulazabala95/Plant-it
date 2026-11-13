// Living-world art. Plants are drawn side-on with their base at (0, 0); `s` scales them.
import type { Plot } from '../engine'
import { PALETTE } from '../themes'

const G = ['#3B5226', '#4D6A30', '#5D7B3D', '#7E9C4E', '#9DBB62', '#C2DC80', '#E4EFC4']
const BARK = '#8A6146'
const SHADOW = <ellipse cx="0" cy="2" rx="26" ry="7" fill={PALETTE.ink} opacity=".16" />

function Oak({ fruit }: { fruit: number }) {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="34" ry="9" fill={PALETTE.ink} opacity=".16" />
      <path d="M-5 0L-3-46H3L5 0z" fill={BARK} />
      <circle cx="0" cy="-70" r="34" fill={G[2]} />
      <circle cx="-14" cy="-80" r="20" fill={G[3]} />
      <circle cx="12" cy="-86" r="16" fill={G[4]} />
      <circle cx="-4" cy="-92" r="9" fill={G[5]} opacity=".8" />
      {Array.from({ length: fruit }, (_, i) => (
        <circle
          key={i}
          cx={Math.cos(i * 2.1) * 22}
          cy={-70 + Math.sin(i * 2.1) * 20}
          r="4.5"
          fill={i % 2 ? PALETTE.sunsetPetal : PALETTE.goldenPollen}
        />
      ))}
    </g>
  )
}

function AppleTree({ fruit }: { fruit: number }) {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="24" ry="7" fill={PALETTE.ink} opacity=".16" />
      <path d="M-4 0L-3-30H3L4 0z" fill={BARK} />
      <ellipse cx="0" cy="-48" rx="26" ry="24" fill={G[1]} />
      <ellipse cx="-8" cy="-56" rx="14" ry="11" fill={G[3]} />
      {Array.from({ length: Math.max(1, fruit) }, (_, i) => (
        <circle
          key={i}
          cx={Math.cos(i * 1.7) * 15}
          cy={-46 + Math.sin(i * 1.7) * 12}
          r="4.2"
          fill="#E8344E"
        />
      ))}
    </g>
  )
}

function Flowers() {
  const heads: [number, number, string][] = [
    [-10, 30, PALETTE.sunsetPetal],
    [0, 40, '#fff'],
    [11, 26, PALETTE.petalGlaze],
    [5, 20, PALETTE.dustyOrchid],
  ]
  return (
    <g>
      {SHADOW}
      {heads.map(([dx, h, c]) => (
        <g key={dx}>
          <path
            d={`M${dx * 0.3} 0Q${dx * 0.6} ${-h / 2} ${dx} ${-h}`}
            stroke={G[2]}
            strokeWidth="2.4"
            fill="none"
          />
          <path d={`M${dx * 0.4} ${-h * 0.35}c-6-6-12-2-12 2 6 2 10 0 12-2z`} fill={G[4]} />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse
              key={r}
              cx="0"
              cy="-5"
              rx="3.6"
              ry="5.4"
              fill={c}
              transform={`translate(${dx} ${-h}) rotate(${r})`}
            />
          ))}
          <circle cx={dx} cy={-h} r="2.6" fill={PALETTE.goldenPollen} />
        </g>
      ))}
    </g>
  )
}

function Sunflower({ wilted }: { wilted: boolean }) {
  return (
    <g>
      {SHADOW}
      <path d={wilted ? 'M0 0Q3-40 14-52' : 'M0 0V-62'} stroke={G[2]} strokeWidth="4" fill="none" />
      <path d="M0-24c-12-12-24-6-26 0 10 6 20 4 26 0z" fill={G[3]} />
      <g transform={wilted ? 'translate(16 -48) rotate(115)' : 'translate(0 -66)'}>
        {Array.from({ length: 12 }, (_, p) => (
          <ellipse
            key={p}
            cx="0"
            cy="-12"
            rx="4"
            ry="8"
            fill={wilted ? '#C9A24A' : PALETTE.goldenPollen}
            transform={`rotate(${p * 30})`}
          />
        ))}
        <circle r="8" fill={BARK} />
      </g>
    </g>
  )
}

function Bush({ fruit }: { fruit: number }) {
  return (
    <g>
      {SHADOW}
      <path d="M-26 0C-30-26-8-38 0-30 10-40 32-24 26 0z" fill={G[3]} />
      <path
        d="M-16-6C-18-22-2-30 6-22"
        fill="none"
        stroke={G[5]}
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".7"
      />
      {Array.from({ length: fruit + 2 }, (_, i) => (
        <circle key={i} cx={(i - 2) * 8} cy={-(12 + (i % 2) * 10)} r="3.4" fill="#7A5CD6" />
      ))}
    </g>
  )
}

function Hedge() {
  return (
    <g>
      {SHADOW}
      <path d="M-28 0v-22c0-10 8-14 14-12 4-8 24-8 28 0 6-2 14 2 14 12V0z" fill="#4E8B5A" />
      <path
        d="M-16-18v6M0-24v6M16-18v6"
        stroke={G[5]}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".6"
      />
    </g>
  )
}

function Mushrooms() {
  return (
    <g>
      {SHADOW}
      {[
        [-10, 1],
        [10, 0.75],
      ].map(([x, s]) => (
        <g key={x} transform={`translate(${x} 0) scale(${s})`}>
          <path d="M-6 0v-16h12V0z" fill="#FFF8EE" />
          <path d="M-20-14c0-14 9-22 20-22s20 8 20 22z" fill={PALETTE.dustyOrchid} />
          <circle cx="-8" cy="-24" r="3" fill="#FFF8EE" />
          <circle cx="7" cy="-27" r="2.6" fill="#FFF8EE" />
        </g>
      ))}
    </g>
  )
}

function Vines() {
  return (
    <g>
      {SHADOW}
      <path
        d="M-14 0v-40M14 0v-40M-16-34h32M-16-18h32"
        stroke={BARK}
        strokeWidth="2.6"
        fill="none"
      />
      <path d="M-14-4c12-8-6-16 4-26s16 4 22-8" fill="none" stroke={G[2]} strokeWidth="3.4" />
      {[
        [-6, -12],
        [7, -24],
        [-2, -32],
      ].map(([x, y]) => (
        <path key={`${x}${y}`} d={`M${x} ${y}c-6-4-10 0-8 4 4 1 6 0 8-4z`} fill={G[4]} />
      ))}
      <circle cx="10" cy="-14" r="3.4" fill="#7A5CD6" />
      <circle cx="13" cy="-10" r="3.4" fill="#7A5CD6" />
    </g>
  )
}

function SeedPackets() {
  return (
    <g>
      {[-9, 9].map((x, i) => (
        <g key={x} transform={`translate(${x} -2) rotate(${i ? 8 : -8})`}>
          <rect x="-8" y="-22" width="16" height="22" rx="2.5" fill="#fff" />
          <rect x="-8" y="-22" width="16" height="7" rx="2.5" fill={PALETTE.sunsetPetal} />
          <circle cx="0" cy="-8" r="3" fill={BARK} />
        </g>
      ))}
    </g>
  )
}

function Greenhouse() {
  return (
    <g>
      {SHADOW}
      <path d="M-24 0v-22l24-16 24 16V0z" fill="#CFE8F5" opacity=".9" />
      <path
        d="M-24 0v-22l24-16 24 16V0zM0-38V0M-24-22h48"
        fill="none"
        stroke="#9BBFD6"
        strokeWidth="2"
      />
      {[-14, -2, 10].map((x) => (
        <path
          key={x}
          d={`M${x} -2v-8m0 0c-4-4-7-3-8-1 3 2 5 2 8 1z`}
          stroke={G[3]}
          strokeWidth="2"
          fill={G[4]}
        />
      ))}
    </g>
  )
}

/** The plant for one savings option. `growth` decides fruit and wilting. */
export function PlantArt({ plot, growth }: { plot: Plot; growth: number }) {
  const fruit = growth <= 0 ? 0 : Math.min(4, Math.round(growth * 2))
  switch (plot) {
    case 'indexFund':
      return <Oak fruit={fruit} />
    case 'pension':
      return <AppleTree fruit={fruit} />
    case 'sustainableFund':
      return <Flowers />
    case 'singleStocks':
      return <Sunflower wilted={growth < 0} />
    case 'activeFund':
      return <Bush fruit={fruit} />
    case 'governmentBonds':
      return <Hedge />
    case 'crypto':
      return <Mushrooms />
    case 'lifeInsurance':
      return <Vines />
    case 'cash':
      return <SeedPackets />
    case 'greenhouse':
      return <Greenhouse />
  }
}

/** Small framed icon of a plot's plant (legends, onboarding). */
export function PlotIcon({ plot, size = 56 }: { plot: Plot; size?: number }) {
  return (
    <svg viewBox="-45 -105 90 112" width={size} height={size * 1.2} aria-hidden>
      <PlantArt plot={plot} growth={0.8} />
    </svg>
  )
}

interface PersonProps {
  kind: 'her' | 'twin'
  hair: string
  glasses: boolean
  baby: boolean
  mood: 'happy' | 'flat' | 'worried' | 'beaming'
}

/** One of the twins, standing, holding a watering can (and a baby in the baby years). */
export function Person({ kind, hair, glasses, baby, mood }: PersonProps) {
  const top = kind === 'her' ? PALETTE.sunsetPetal : PALETTE.eveningSky
  const trousers = kind === 'her' ? '#5D4A6E' : '#3B5226'
  const skin = '#F3C9A8'
  const ink = PALETTE.ink
  const mouth = {
    happy: 'M-9 -240q9 8 18 0',
    flat: 'M-9 -238q9 2 18 0',
    worried: 'M-9 -236q9 -4 18 0',
    beaming: 'M-12 -242q12 14 24 0z',
  }[mood]
  return (
    <g className={`person person-${kind}`}>
      <ellipse cx="0" cy="4" rx="70" ry="14" fill={ink} opacity=".2" />
      <g className="bob">
        <path d="M-26 0L-22-110H-4L-6 0zM6 0L4-110H22L26 0z" fill={trousers} />
        <ellipse cx="-16" cy="-2" rx="20" ry="9" fill={ink} />
        <ellipse cx="16" cy="-2" rx="20" ry="9" fill={ink} />
        <path d="M-47-102C-49-172-37-206 0-209 37-206 49-172 47-102z" fill={top} />
        {kind === 'twin' && <path d="M-10-208L0-186 10-208z" fill="#fff" opacity=".8" />}
        <path
          d="M-40-190C-70-170-80-140-74-118"
          stroke={top}
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="-74" cy="-114" r="10" fill={skin} />
        <g>
          <path d="M-110-120h44v34a8 8 0 0 1-8 8h-28a8 8 0 0 1-8-8z" fill={PALETTE.goldenPollen} />
          <path
            d="M-110-110L-142-136"
            stroke={PALETTE.goldenPollen}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M-80-120a14 14 0 0 1 0-26 14 14 0 0 1 14 14"
            stroke={PALETTE.goldenPollen}
            strokeWidth="5"
            fill="none"
          />
        </g>
        <path
          d="M40-190C66-172 70-150 62-126"
          stroke={top}
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="62" cy="-120" r="10" fill={skin} />
        {baby && (
          <g>
            <ellipse cx="20" cy="-150" rx="34" ry="24" fill="#fff" />
            <circle cx="8" cy="-158" r="15" fill={skin} />
            <circle cx="3" cy="-160" r="1.8" fill={ink} />
            <circle cx="13" cy="-160" r="1.8" fill={ink} />
            <path d="M5-152q3 3 6 0" stroke={ink} strokeWidth="1.6" fill="none" />
          </g>
        )}
        <rect x="-10" y="-226" width="20" height="24" rx="8" fill={skin} />
        {kind === 'her' && (
          <path
            d="M-46-246C-52-300-26-330 2-330 34-330 56-300 48-246 46-226 40-214 34-212V-270H-32V-212C-40-214-44-228-46-246z"
            fill={hair}
          />
        )}
        <ellipse cx="0" cy="-262" rx="36" ry="40" fill={skin} />
        <path
          d={
            kind === 'her'
              ? 'M-38-270C-36-300-14-312 4-312 24-312 40-298 40-272 24-292-8-294-38-270z'
              : 'M-36-272C-38-300-16-312 2-312 22-312 40-300 38-272 28-286-20-290-36-272z'
          }
          fill={hair}
        />
        <ellipse cx="-24" cy="-246" rx="8" ry="5" fill={PALETTE.rosebudBlush} opacity=".75" />
        <ellipse cx="24" cy="-246" rx="8" ry="5" fill={PALETTE.rosebudBlush} opacity=".75" />
        <ellipse cx="-13" cy="-262" rx="4" ry="5" fill={ink} />
        <ellipse cx="13" cy="-262" rx="4" ry="5" fill={ink} />
        {glasses && (
          <g fill="none" stroke={ink} strokeWidth="2.4">
            <circle cx="-13" cy="-262" r="10" />
            <circle cx="13" cy="-262" r="10" />
            <path d="M-3-262h6" />
          </g>
        )}
        <path
          d={mouth}
          stroke={ink}
          strokeWidth="3"
          fill={mood === 'beaming' ? '#fff' : 'none'}
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}

/** Icons for the life event cards. */
export function LifeIcon({ kind }: { kind: 'child' | 'partTime' | 'careerBreak' }) {
  const ink = PALETTE.ink
  if (kind === 'child') {
    return (
      <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden>
        <ellipse cx="32" cy="38" rx="24" ry="18" fill="#fff" />
        <circle cx="26" cy="30" r="12" fill="#F3C9A8" />
        <circle cx="22" cy="29" r="1.8" fill={ink} />
        <circle cx="30" cy="29" r="1.8" fill={ink} />
        <path d="M23 35q3 3 6 0" stroke={ink} strokeWidth="1.8" fill="none" />
      </svg>
    )
  }
  if (kind === 'partTime') {
    return (
      <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden>
        <circle cx="32" cy="32" r="22" fill="#fff" />
        <path d="M32 32V10a22 22 0 0 1 22 22z" fill={PALETTE.sunsetPetal} />
        <circle cx="32" cy="32" r="3" fill={ink} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden>
      <path d="M12 46h40l-5-20H17z" fill="#fff" />
      <path
        d="M32 26V10m0 0-7 6m7-6 7 6"
        stroke={ink}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
