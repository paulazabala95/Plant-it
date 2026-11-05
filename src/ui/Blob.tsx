import type { GrowthStage } from '../themes'

const INK = '#1F4D3A'
const LEAF = '#D4F06B'
const LEAF_DARK = '#1F4D3A'

const SHAPES = {
  round: 'M100 36c38 0 64 26 64 66s-26 62-64 62-64-22-64-62 26-66 64-66z',
  bean: 'M104 40c34-2 58 22 58 58 0 40-30 66-66 66-34 0-60-24-58-58 2-38 30-64 66-66z',
  drop: 'M100 28c22 24 64 44 64 82 0 34-28 56-64 56s-64-22-64-56c0-38 42-58 64-82z',
} as const

export type BlobShape = keyof typeof SHAPES

interface Props {
  color: string
  shape?: BlobShape
  stage?: GrowthStage
  mood?: 'happy' | 'sleepy' | 'wow'
  title?: string
}

/** A cute blob character. With a stage it becomes a plant: leaves and a flower grow on top. */
export function Blob({ color, shape = 'round', stage, mood = 'happy', title }: Props) {
  const scale = stage === undefined ? 1 : [0.55, 0.68, 0.8, 0.9, 1][stage]
  const sleepy = mood === 'sleepy' || stage === 0
  return (
    <svg viewBox="0 0 200 240" role="img" aria-label={title}>
      {title && <title>{title}</title>}
      <g transform={`translate(100 236) scale(${scale}) translate(-100 -176)`}>
        {stage !== undefined && stage >= 1 && <Sprout stage={stage} />}
        <path d={SHAPES[shape]} fill={color} stroke={INK} strokeWidth={5} />
        {/* cheeks */}
        <ellipse cx="68" cy="118" rx="11" ry="7" fill="#FF7BB8" opacity="0.55" />
        <ellipse cx="132" cy="118" rx="11" ry="7" fill="#FF7BB8" opacity="0.55" />
        {sleepy ? (
          <>
            <path
              d="M70 100q10 8 20 0"
              stroke={INK}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M110 100q10 8 20 0"
              stroke={INK}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <ellipse cx="80" cy="98" rx="7" ry={mood === 'wow' ? 11 : 9} fill={INK} />
            <ellipse cx="120" cy="98" rx="7" ry={mood === 'wow' ? 11 : 9} fill={INK} />
            <circle cx="82" cy="94" r="2.5" fill="#fff" />
            <circle cx="122" cy="94" r="2.5" fill="#fff" />
          </>
        )}
        {mood === 'wow' ? (
          <ellipse cx="100" cy="126" rx="8" ry="10" fill={INK} />
        ) : (
          <path
            d="M86 120q14 14 28 0"
            stroke={INK}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  )
}

function Sprout({ stage }: { stage: GrowthStage }) {
  const top = [44, 30, 16, 4, -6][stage]
  return (
    <g stroke={INK} strokeWidth={5} strokeLinejoin="round">
      <path d={`M100 44V${top + 20}`} fill="none" strokeLinecap="round" />
      <path d={`M100 ${top + 26}c-6-22-30-30-46-24 4 20 24 32 46 24z`} fill={LEAF} />
      {stage >= 2 && <path d={`M100 ${top + 18}c8-24 34-30 50-22-6 20-28 30-50 22z`} fill={LEAF} />}
      {stage >= 3 && (
        <path d={`M100 ${top + 44}c-4-14-20-20-32-16 2 14 18 22 32 16z`} fill={LEAF_DARK} />
      )}
      {stage >= 4 && (
        <g transform={`translate(100 ${top + 4})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse
              key={r}
              cx="0"
              cy="-14"
              rx="9"
              ry="13"
              fill="#FF9A5C"
              transform={`rotate(${r})`}
            />
          ))}
          <circle r="9" fill="#F7D55C" />
        </g>
      )}
    </g>
  )
}

/** Small icons for the life event cards. */
export function LifeIcon({ kind }: { kind: 'child' | 'partTime' | 'careerBreak' }) {
  if (kind === 'child') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="34" r="22" fill="#FFF8EE" stroke={INK} strokeWidth={3} />
        <path d="M26 20q6-10 12 0" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
        <circle cx="25" cy="34" r="3" fill={INK} />
        <circle cx="39" cy="34" r="3" fill={INK} />
        <path d="M27 42q5 5 10 0" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'partTime') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="32" r="24" fill="#FFF8EE" stroke={INK} strokeWidth={3} />
        <path d="M32 32V8a24 24 0 0 1 24 24z" fill={INK} />
        <circle cx="32" cy="32" r="3" fill={INK} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden>
      <path
        d="M10 46h44l-6-22H16z"
        fill="#FFF8EE"
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path
        d="M32 24V10m0 0-8 6m8-6 8 6"
        stroke={INK}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <path d="M20 54h24" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}
