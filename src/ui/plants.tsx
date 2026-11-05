// Garden art. Each plant is drawn with its base at (0, 0) so the scene can place it.
const INK = '#1F4D3A'
const SW = 2.5

export function Oak({ fruit = 0, s = 1 }: { fruit?: number; s?: number }) {
  const spots = [
    [-14, -58],
    [10, -66],
    [16, -48],
    [-4, -44],
    [-18, -42],
  ]
  return (
    <g transform={`scale(${s})`} stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d="M-4 0V-30h8V0z" fill="#B07A4F" />
      <path
        d="M0-82c16 0 28 10 28 24 6 4 8 10 6 16-2 8-10 12-18 11-4 5-10 7-16 7s-12-2-16-7c-8 1-16-3-18-11-2-6 0-12 6-16 0-14 12-24 28-24z"
        fill="#8FD16A"
      />
      <path d="M-12-64c4-6 12-8 18-6" fill="none" strokeLinecap="round" opacity="0.5" />
      {spots.slice(0, fruit).map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={4.5} fill="#FF7A59" />
      ))}
    </g>
  )
}

export function AppleTree({ fruit = 0, s = 1 }: { fruit?: number; s?: number }) {
  const spots = [
    [-10, -44],
    [8, -50],
    [12, -36],
    [-2, -32],
    [-14, -32],
  ]
  return (
    <g transform={`scale(${s})`} stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d="M-3 0V-22h6V0z" fill="#B07A4F" />
      <circle cx="0" cy="-40" r="20" fill="#4FB06A" />
      {spots.slice(0, fruit).map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={4} fill="#E8344E" />
      ))}
    </g>
  )
}

export function Wildflowers({ s = 1 }: { s?: number }) {
  const heads = [
    [-10, -26, '#FF8FC8'],
    [2, -34, '#FFFFFF'],
    [12, -24, '#B9A6F5'],
  ] as const
  return (
    <g transform={`scale(${s})`} stroke={INK} strokeWidth={SW}>
      {heads.map(([x, y]) => (
        <path key={`${x}`} d={`M${x * 0.4} 0Q${x * 0.6} ${y / 2} ${x} ${y}`} fill="none" />
      ))}
      {heads.map(([x, y, c]) => (
        <g key={`h${x}`} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-5" rx="3.5" ry="5" fill={c} transform={`rotate(${r})`} />
          ))}
          <circle r="2.5" fill="#F7D55C" />
        </g>
      ))}
    </g>
  )
}

export function Sunflower({ wilted = false, s = 1 }: { wilted?: boolean; s?: number }) {
  return (
    <g transform={`scale(${s})`} stroke={INK} strokeWidth={SW}>
      <path d={wilted ? 'M0 0Q2-30 10-40' : 'M0 0V-48'} fill="none" />
      <path d="M0-18c-8-8-16-6-18-2 6 4 12 4 18 2z" fill="#8FD16A" />
      <g transform={wilted ? 'translate(12 -36) rotate(110)' : 'translate(0 -54)'}>
        {Array.from({ length: 10 }, (_, k) => (
          <ellipse
            key={k}
            cx="0"
            cy="-11"
            rx="4"
            ry="7"
            fill={wilted ? '#C9A24A' : '#F7D55C'}
            transform={`rotate(${k * 36})`}
          />
        ))}
        <circle r="7" fill="#7A4A2A" />
      </g>
    </g>
  )
}

export function Mushroom({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`} stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d="M-6 0v-14h12V0z" fill="#FFF8EE" />
      <path d="M-18-12c0-12 8-20 18-20s18 8 18 20z" fill="#FF6B5C" />
      <circle cx="-7" cy="-21" r="3" fill="#FFF8EE" />
      <circle cx="6" cy="-24" r="2.5" fill="#FFF8EE" />
      <circle cx="9" cy="-15" r="2" fill="#FFF8EE" />
    </g>
  )
}

/** Cash: a drawer with seed packets that never get planted. */
export function Drawer({ packets }: { packets: number }) {
  const n = Math.min(packets, 6)
  return (
    <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      {Array.from({ length: n }, (_, k) => (
        <g
          key={k}
          transform={`translate(${-22 + k * 9} ${-30 - (k % 2) * 4}) rotate(${(k % 3) * 6 - 6})`}
        >
          <rect x="-6" y="-10" width="12" height="18" rx="2" fill="#F4E3C3" />
          <circle cx="0" cy="-2" r="2.5" fill="#B07A4F" />
        </g>
      ))}
      <path d="M-34-22h68v22h-68z" fill="#C98E5E" />
      <path d="M-8-12h16" strokeLinecap="round" />
    </g>
  )
}

/** Savings account: a small greenhouse with seedlings inside. */
export function Greenhouse({ seedlings }: { seedlings: number }) {
  const n = Math.min(seedlings, 6)
  return (
    <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d="M-34 0v-30l34-22 34 22V0z" fill="#BFE9F2" fillOpacity="0.85" />
      <path d="M0-52V0M-34-30h68" fill="none" opacity="0.5" />
      {Array.from({ length: n }, (_, k) => (
        <g key={k} transform={`translate(${-26 + k * 10} -2)`}>
          <path d="M0 0v-8" />
          <path d="M0-8c-4-4-7-3-8-1 3 2 5 2 8 1z" fill="#8FD16A" />
        </g>
      ))}
    </g>
  )
}

/** A small sign stuck in the ground. */
export function Sign({ text, color = '#FFF8EE' }: { text: string; color?: string }) {
  const w = text.length * 5.6 + 14
  return (
    <g stroke={INK} strokeWidth={SW}>
      <path d="M0 0v-16" />
      <rect x={-w / 2} y="-32" width={w} height="18" rx="5" fill={color} />
      <text
        y="-19"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill={INK}
        stroke="none"
        fontFamily="DM Sans, sans-serif"
      >
        {text}
      </text>
    </g>
  )
}

/** Government bonds: a neat hedge. */
export function Hedge({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`} stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d="M-22 0v-18c0-8 6-12 11-10 3-6 19-6 22 0 5-2 11 2 11 10V0z" fill="#5FB878" />
      <path d="M-12-14v4M0-18v4M12-14v4" strokeLinecap="round" opacity="0.5" />
    </g>
  )
}

/** Actively managed fund: a fruit bush (fees eat some of the fruit). */
export function FruitBush({ fruit = 0, s = 1 }: { fruit?: number; s?: number }) {
  const spots = [
    [-8, -18],
    [8, -22],
    [12, -10],
    [-12, -8],
    [0, -12],
  ]
  return (
    <g transform={`scale(${s})`} stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d="M-20 0c-6-10 0-22 10-22 2-8 18-8 20 0 10 0 16 12 10 22z" fill="#79C46A" />
      {spots.slice(0, fruit).map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={3.5} fill="#7A5CD6" />
      ))}
    </g>
  )
}

/** Life-insurance savings: vines climbing a little trellis. */
export function Vines({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`} stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d="M-12 0v-34M12 0v-34M-14-30h28M-14-16h28" fill="none" />
      <path d="M-12-4c10-6-6-14 4-22s14 4 20-6" fill="none" stroke="#3E8E4E" strokeWidth={3} />
      {[
        [-6, -10],
        [6, -20],
        [-2, -28],
      ].map(([x, y]) => (
        <path key={`${x}${y}`} d={`M${x} ${y}c-5-3-8 0-7 3 3 1 5 0 7-3z`} fill="#8FD16A" />
      ))}
    </g>
  )
}
