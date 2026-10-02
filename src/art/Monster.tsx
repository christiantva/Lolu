import { useId, type ReactNode } from 'react'
import type { MonsterKind } from '../data/types'

interface Props {
  kind: MonsterKind
  hue: number
  size?: number
  className?: string
  boss?: boolean
}

const hsl = (h: number, s: number, l: number, a = 1) => `hsla(${h} ${s}% ${l}% / ${a})`

function Eyes({ x1, x2, y, r = 9, angry = true, color = '#fff', pupil = '#1a0b1f' }: { x1: number; x2: number; y: number; r?: number; angry?: boolean; color?: string; pupil?: string }) {
  return (
    <g>
      {[x1, x2].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={color} />
          <circle cx={x + (i ? -2 : 2)} cy={y + 1} r={r * 0.5} fill={pupil} />
          <circle cx={x + (i ? -3.5 : 0.5)} cy={y - 2} r={r * 0.18} fill="#fff" />
        </g>
      ))}
      {angry && (
        <g stroke="#1a0b1f" strokeWidth="4" strokeLinecap="round">
          <path d={`M${x1 - r} ${y - r - 4} L${x1 + r * 0.8} ${y - r + 3}`} />
          <path d={`M${x2 + r} ${y - r - 4} L${x2 - r * 0.8} ${y - r + 3}`} />
        </g>
      )}
    </g>
  )
}

const Fangs = ({ x, y, w = 30 }: { x: number; y: number; w?: number }) => (
  <g>
    <path d={`M${x - w / 2} ${y} Q${x} ${y + w * 0.55} ${x + w / 2} ${y} Z`} fill="#3a0b1f" />
    <path d={`M${x - w / 3} ${y + 1} l4 8 l4 -8 Z M${x + w / 3 - 8} ${y + 1} l4 8 l4 -8 Z`} fill="#fff" />
  </g>
)

/** Galería de monstruos en SVG. Cada tipo tiene su silueta; el tono se ajusta con `hue`. */
export function Monster({ kind, hue, size = 200, className = '', boss }: Props) {
  const uid = useId().replace(/:/g, '')
  const body = `url(#b${uid})`
  const dark = hsl(hue, 55, 22)
  const mid = hsl(hue, 65, 45)
  const light = hsl(hue, 85, 70)

  const art: Record<MonsterKind, ReactNode> = {
    slime: (
      <g className="anim-squish">
        <path d="M30 160 Q24 90 100 60 Q176 90 170 160 Q100 176 30 160 Z" fill={body} stroke={dark} strokeWidth="4" />
        <ellipse cx="72" cy="90" rx="16" ry="9" fill="#fff" opacity=".45" transform="rotate(-25 72 90)" />
        <Eyes x1={78} x2={122} y={118} r={11} />
        <path d="M82 145 Q100 135 118 145" stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="150" cy="70" r="6" fill={light} opacity=".7" className="anim-float" />
      </g>
    ),
    goblin: (
      <g className="anim-bob">
        <path d="M40 90 L10 60 L62 78 Z M160 90 L190 60 L138 78 Z" fill={body} stroke={dark} strokeWidth="3" />
        <ellipse cx="100" cy="150" rx="40" ry="32" fill={hsl(hue + 200, 35, 35)} stroke={dark} strokeWidth="3" />
        <circle cx="100" cy="92" r="46" fill={body} stroke={dark} strokeWidth="4" />
        <Eyes x1={82} x2={118} y={88} r={10} color="#fff6a8" />
        <path d="M100 98 l-6 12 h12 Z" fill={dark} />
        <path d="M78 116 Q100 132 122 116" stroke={dark} strokeWidth="4" fill="#5a0b1f" />
        <path d="M86 118 l4 7 l4 -7 M106 118 l4 7 l4 -7" fill="#fff" />
        <path d="M62 52 Q100 30 138 52 L130 60 Q100 46 70 60 Z" fill="#6b4423" />
      </g>
    ),
    golem: (
      <g className="anim-bob-slow">
        <rect x="18" y="96" width="36" height="66" rx="14" fill={body} stroke={dark} strokeWidth="4" />
        <rect x="146" y="96" width="36" height="66" rx="14" fill={body} stroke={dark} strokeWidth="4" />
        <path d="M44 70 L156 70 L168 170 L32 170 Z" fill={body} stroke={dark} strokeWidth="5" />
        <path d="M60 100 L80 120 M120 140 L140 118 M70 150 l20 -6" stroke={dark} strokeWidth="3" opacity=".6" />
        <rect x="60" y="20" width="80" height="62" rx="12" fill={body} stroke={dark} strokeWidth="5" />
        <rect x="70" y="42" width="22" height="12" rx="3" fill="#ffdf5a" className="anim-glow" />
        <rect x="108" y="42" width="22" height="12" rx="3" fill="#ffdf5a" className="anim-glow" />
        <path d="M76 68 h48" stroke={dark} strokeWidth="5" strokeLinecap="round" />
        {/* papeles burocráticos */}
        <g className="anim-float">
          <rect x="150" y="30" width="26" height="32" rx="2" fill="#fff8e1" stroke="#c9b37a" transform="rotate(14 163 46)" />
          <path d="M156 40 h14 M156 46 h14 M156 52 h9" stroke="#c9b37a" strokeWidth="2" transform="rotate(14 163 46)" />
        </g>
        <g className="anim-float-rev">
          <rect x="22" y="40" width="24" height="30" rx="2" fill="#fff8e1" stroke="#c9b37a" transform="rotate(-12 34 55)" />
          <text x="27" y="62" fontSize="14" fill="#c0392b" fontWeight="900" transform="rotate(-12 34 55)">?!</text>
        </g>
      </g>
    ),
    bat: (
      <g className="anim-float">
        <path d="M100 100 Q60 40 6 70 Q30 80 26 100 Q46 92 52 112 Q70 100 100 120 Z" fill={hsl(hue, 45, 30)} stroke={dark} strokeWidth="3" className="anim-flap-l" />
        <path d="M100 100 Q140 40 194 70 Q170 80 174 100 Q154 92 148 112 Q130 100 100 120 Z" fill={hsl(hue, 45, 30)} stroke={dark} strokeWidth="3" className="anim-flap-r" />
        <path d="M74 70 L68 40 L88 60 Z M126 70 L132 40 L112 60 Z" fill={body} stroke={dark} strokeWidth="3" />
        <circle cx="100" cy="100" r="36" fill={body} stroke={dark} strokeWidth="4" />
        <Eyes x1={86} x2={114} y={94} r={9} color="#ffe25a" />
        <Fangs x={100} y={114} w={26} />
      </g>
    ),
    mushroom: (
      <g className="anim-squish">
        <path d="M70 110 Q64 160 72 172 L128 172 Q136 160 130 110 Z" fill="#f6ead2" stroke="#8a7a5a" strokeWidth="4" />
        <path d="M14 112 Q20 30 100 28 Q180 30 186 112 Q100 128 14 112 Z" fill={body} stroke={dark} strokeWidth="5" />
        {[[50, 70, 12], [100, 52, 14], [150, 72, 11], [76, 98, 8], [128, 96, 9]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity=".85" />
        ))}
        <Eyes x1={86} x2={114} y={134} r={8} />
        <path d="M88 156 Q100 150 112 156" stroke="#5a4a3a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* hojas fotocopiadas */}
        <g className="anim-float-rev" opacity=".9">
          <rect x="160" y="130" width="22" height="28" fill="#fff" stroke="#bbb" transform="rotate(10 171 144)" />
          <rect x="166" y="124" width="22" height="28" fill="#fff" stroke="#bbb" transform="rotate(18 177 138)" />
        </g>
      </g>
    ),
    hydra: (
      <g>
        <path d="M40 180 Q30 120 100 110 Q170 120 160 180 Z" fill={body} stroke={dark} strokeWidth="5" />
        {[
          { d: 'M70 130 Q30 100 40 50', hx: 40, hy: 44, cls: 'anim-sway' },
          { d: 'M100 120 Q100 70 100 30', hx: 100, hy: 26, cls: 'anim-sway-rev' },
          { d: 'M130 130 Q170 100 160 50', hx: 160, hy: 44, cls: 'anim-sway' },
        ].map((h, i) => (
          <g key={i} className={h.cls} style={{ transformOrigin: `${h.hx}px 140px` }}>
            <path d={h.d} stroke={dark} strokeWidth="24" fill="none" strokeLinecap="round" />
            <path d={h.d} stroke={mid} strokeWidth="17" fill="none" strokeLinecap="round" />
            <ellipse cx={h.hx} cy={h.hy} rx="24" ry="19" fill={body} stroke={dark} strokeWidth="4" />
            <circle cx={h.hx - 9} cy={h.hy - 4} r="5.5" fill="#ffe25a" />
            <circle cx={h.hx + 9} cy={h.hy - 4} r="5.5" fill="#ffe25a" />
            <circle cx={h.hx - 9} cy={h.hy - 3} r="2.5" fill="#1a0b1f" />
            <circle cx={h.hx + 9} cy={h.hy - 3} r="2.5" fill="#1a0b1f" />
            <path d={`M${h.hx - 10} ${h.hy + 8} Q${h.hx} ${h.hy + 15} ${h.hx + 10} ${h.hy + 8}`} stroke="#1a0b1f" strokeWidth="3" fill="none" />
          </g>
        ))}
        <text x="100" y="168" textAnchor="middle" fontSize="20" fontWeight="900" fill={dark} opacity=".5">ABC</text>
      </g>
    ),
    skull: (
      <g className="anim-bob">
        <path d="M40 92 Q40 26 100 26 Q160 26 160 92 Q160 120 138 128 L136 156 L64 156 L62 128 Q40 120 40 92 Z" fill="#fff6e6" stroke="#5a3a2a" strokeWidth="5" />
        <circle cx="76" cy="90" r="18" fill="#2a1a2a" />
        <circle cx="124" cy="90" r="18" fill="#2a1a2a" />
        <circle cx="76" cy="90" r="6" fill={light} className="anim-glow" />
        <circle cx="124" cy="90" r="6" fill={light} className="anim-glow" />
        <path d="M100 104 l-8 14 h16 Z" fill="#2a1a2a" />
        <path d="M70 136 h60 M80 128 v20 M92 128 v20 M104 128 v20 M116 128 v20" stroke="#5a3a2a" strokeWidth="3" />
        {/* adornos florales */}
        {[[60, 40, '#ff5f8f'], [100, 30, '#ffd23f'], [140, 40, '#5fd3ff']].map(([x, y, c], i) => (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={(x as number) + 7 * Math.cos((a * Math.PI) / 180)} cy={(y as number) + 7 * Math.sin((a * Math.PI) / 180)} r="5" fill={c as string} />
            ))}
            <circle cx={x as number} cy={y as number} r="4" fill="#fff" />
          </g>
        ))}
      </g>
    ),
    serpent: (
      <g>
        <path d="M30 170 Q10 130 60 130 Q120 130 110 100 Q100 70 140 60" stroke={dark} strokeWidth="38" fill="none" strokeLinecap="round" className="anim-sway" style={{ transformOrigin: '60px 170px' }} />
        <path d="M30 170 Q10 130 60 130 Q120 130 110 100 Q100 70 140 60" stroke={body} strokeWidth="30" fill="none" strokeLinecap="round" className="anim-sway" style={{ transformOrigin: '60px 170px' }} />
        <path d="M30 170 Q10 130 60 130 Q120 130 110 100 Q100 70 140 60" stroke={light} strokeWidth="6" fill="none" strokeDasharray="4 14" strokeLinecap="round" className="anim-sway" style={{ transformOrigin: '60px 170px' }} />
        <g className="anim-bob">
          <ellipse cx="146" cy="56" rx="34" ry="26" fill={body} stroke={dark} strokeWidth="4" />
          <circle cx="136" cy="48" r="7" fill="#ffe25a" />
          <circle cx="158" cy="48" r="7" fill="#ffe25a" />
          <rect x="135" y="42" width="2.5" height="12" fill="#1a0b1f" />
          <rect x="157" y="42" width="2.5" height="12" fill="#1a0b1f" />
          <path d="M146 76 v12 l-6 6 M146 88 l6 6" stroke="#e0245e" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <text x="40" y="60" fontSize="22" fill={light} opacity=".7" className="anim-float">z</text>
        <text x="58" y="40" fontSize="16" fill={light} opacity=".6" className="anim-float-rev">z</text>
      </g>
    ),
    jaguar: (
      <g className="anim-bob-slow">
        <path d="M150 150 Q196 140 186 96" stroke={dark} strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M150 150 Q196 140 186 96" stroke={body} strokeWidth="9" fill="none" strokeLinecap="round" />
        <ellipse cx="104" cy="146" rx="62" ry="34" fill={body} stroke={dark} strokeWidth="4" />
        <rect x="56" y="150" width="20" height="30" rx="9" fill={body} stroke={dark} strokeWidth="3" />
        <rect x="128" y="150" width="20" height="30" rx="9" fill={body} stroke={dark} strokeWidth="3" />
        <path d="M54 54 L48 22 L78 44 Z M146 54 L152 22 L122 44 Z" fill={body} stroke={dark} strokeWidth="4" />
        <circle cx="100" cy="82" r="50" fill={body} stroke={dark} strokeWidth="5" />
        {[[70, 60], [130, 60], [64, 96], [136, 96], [100, 44], [84, 140], [118, 132], [146, 142], [60, 136]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill="none" stroke={dark} strokeWidth="3.5" />
        ))}
        <ellipse cx="100" cy="102" rx="24" ry="17" fill={hsl(hue, 70, 85)} />
        <path d="M92 94 h16 l-8 9 Z" fill="#3a1a1a" />
        <path d="M84 112 Q100 122 116 112" stroke="#3a1a1a" strokeWidth="3.5" fill="none" />
        <path d="M86 112 l4 9 l4 -8 M106 112 l4 8 l4 -9" fill="#fff" />
        <Eyes x1={80} x2={120} y={76} r={10} color="#b6ff5a" />
      </g>
    ),
    yeti: (
      <g className="anim-bob">
        <path d="M30 100 Q14 140 30 160 M170 100 Q186 140 170 160" stroke="#e8f3ff" strokeWidth="26" strokeLinecap="round" fill="none" />
        <path d="M44 70 Q30 120 46 176 L154 176 Q170 120 156 70 Q100 30 44 70 Z" fill="#f1f7ff" stroke="#7aa4c9" strokeWidth="5" />
        {[[60, 80], [80, 66], [120, 66], [140, 80], [52, 130], [148, 130]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q6 -10 12 0`} stroke="#b8d3ea" strokeWidth="3" fill="none" />
        ))}
        <ellipse cx="100" cy="110" rx="40" ry="34" fill={hsl(hue, 60, 70)} stroke="#4a7aa9" strokeWidth="3" />
        <Eyes x1={84} x2={116} y={100} r={9} />
        <path d="M80 124 Q100 140 120 124 L120 130 Q100 146 80 130 Z" fill="#3a1a3a" />
        <path d="M84 126 l5 8 l5 -8 M106 126 l5 8 l5 -8" fill="#fff" />
        {/* cuadernos de tarea */}
        <g className="anim-float">
          <rect x="150" y="20" width="30" height="38" rx="3" fill="#ff6b6b" stroke="#a33" strokeWidth="2" transform="rotate(12 165 39)" />
          <text x="155" y="45" fontSize="11" fontWeight="900" fill="#fff" transform="rotate(12 165 39)">TAREA</text>
        </g>
      </g>
    ),
    paperdragon: (
      <g className="anim-float">
        <path d="M20 120 L60 90 L80 120 L110 86 L130 120 L160 92 L180 130 L150 140 L120 132 L90 144 L60 134 Z" fill="#fff" stroke="#c9c2b0" strokeWidth="3" />
        <path d="M60 90 L70 128 M110 86 L110 136 M160 92 L150 140" stroke="#ddd5c0" strokeWidth="2" />
        <path d="M120 80 L172 40 L190 70 L150 96 Z" fill="#fff" stroke="#c9c2b0" strokeWidth="3" />
        <path d="M60 110 L20 60 L90 92 Z" fill={hsl(hue, 80, 60)} stroke={dark} strokeWidth="3" className="anim-flap-l" />
        <circle cx="172" cy="56" r="5" fill="#e0245e" />
        <path d="M184 66 l14 4 l-12 6" fill="#ff8a3d" />
        <text x="80" y="128" fontSize="20" fontWeight="900" fill="#e0245e">PSLE</text>
        <text x="132" y="122" fontSize="14" fontWeight="900" fill="#e0245e">A+</text>
      </g>
    ),
    dragon: (
      <g>
        <path d="M100 110 Q40 40 4 70 Q30 86 18 112 Q46 104 50 128 Q72 112 96 132 Z" fill={hsl(hue, 55, 30)} stroke={dark} strokeWidth="4" className="anim-flap-l" />
        <path d="M100 110 Q160 40 196 70 Q170 86 182 112 Q154 104 150 128 Q128 112 104 132 Z" fill={hsl(hue, 55, 30)} stroke={dark} strokeWidth="4" className="anim-flap-r" />
        <path d="M140 172 Q190 170 186 130" stroke={dark} strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M140 172 Q190 170 186 130" stroke={body} strokeWidth="10" fill="none" strokeLinecap="round" />
        <ellipse cx="100" cy="146" rx="52" ry="36" fill={body} stroke={dark} strokeWidth="5" />
        <ellipse cx="100" cy="152" rx="30" ry="22" fill={hsl(hue, 60, 82)} />
        {[136, 146, 156, 166].map((y) => (
          <path key={y} d={`M78 ${y} h44`} stroke={hsl(hue, 40, 65)} strokeWidth="2" />
        ))}
        <g className="anim-bob">
          <path d="M70 46 L56 10 L86 36 Z M130 46 L144 10 L114 36 Z" fill="#f5e6b8" stroke="#8a6a32" strokeWidth="3" />
          <ellipse cx="100" cy="66" rx="44" ry="36" fill={body} stroke={dark} strokeWidth="5" />
          <ellipse cx="100" cy="86" rx="28" ry="16" fill={hsl(hue, 60, 75)} />
          <circle cx="90" cy="82" r="3.5" fill={dark} />
          <circle cx="110" cy="82" r="3.5" fill={dark} />
          <Eyes x1={80} x2={120} y={58} r={10} color="#ff6a3d" pupil="#2a0a0a" />
          {/* monóculo de examinador */}
          <circle cx="120" cy="58" r="14" fill="none" stroke="#ffd76a" strokeWidth="3" />
          <path d="M134 60 Q140 80 134 96" stroke="#ffd76a" strokeWidth="2" fill="none" />
        </g>
        <g className="anim-glow">
          <path d="M100 98 Q90 120 70 118 Q86 128 100 112 Q114 128 130 118 Q110 120 100 98 Z" fill="#7ad8ff" opacity=".85" />
        </g>
      </g>
    ),
    examiner: (
      <g>
        <circle cx="100" cy="100" r="92" fill={`url(#aura${uid})`} className="anim-pulse" />
        <path d="M44 190 Q40 110 100 92 Q160 110 156 190 Z" fill={hsl(hue, 50, 22)} stroke={hsl(hue, 70, 60)} strokeWidth="4" />
        <path d="M100 96 L100 190" stroke="#ffd76a" strokeWidth="3" />
        {[120, 140, 160].map((y) => (
          <circle key={y} cx="100" cy={y} r="4" fill="#ffd76a" />
        ))}
        <g className="anim-bob">
          <path d="M56 56 Q100 -6 144 56 Q144 100 100 108 Q56 100 56 56 Z" fill={hsl(hue, 45, 16)} stroke={hsl(hue, 70, 60)} strokeWidth="4" />
          <circle cx="100" cy="64" r="26" fill="#0b0618" />
          <circle cx="100" cy="64" r="16" fill={`url(#eye${uid})`} className="anim-glow" />
          <circle cx="100" cy="64" r="6" fill="#0b0618" />
          <circle cx="96" cy="60" r="2.5" fill="#fff" />
          <path d="M70 22 L80 4 L90 18 L100 0 L110 18 L120 4 L130 22 Z" fill="#ffd76a" stroke="#a86b12" strokeWidth="2" />
        </g>
        {/* libros orbitando */}
        <g className="anim-orbit" style={{ transformOrigin: '100px 100px' }}>
          {[0, 90, 180, 270].map((a, i) => (
            <g key={a} transform={`rotate(${a} 100 100) translate(0 -86)`}>
              <rect x="88" y="92" width="24" height="18" rx="2" fill={['#ff7a59', '#2fd38a', '#ffd23f', '#7cc8ff'][i]} stroke="#1a0b1f" strokeWidth="2" />
              <path d="M100 92 v18" stroke="#1a0b1f" strokeWidth="1.5" />
            </g>
          ))}
        </g>
      </g>
    ),
  }

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`b${uid}`} cx=".38" cy=".32" r=".85">
          <stop offset="0" stopColor={light} />
          <stop offset=".55" stopColor={mid} />
          <stop offset="1" stopColor={hsl(hue, 60, 30)} />
        </radialGradient>
        <radialGradient id={`aura${uid}`}>
          <stop offset="0" stopColor={hsl(hue, 90, 60, 0.55)} />
          <stop offset="1" stopColor={hsl(hue, 90, 50, 0)} />
        </radialGradient>
        <radialGradient id={`eye${uid}`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset=".4" stopColor="#ffd76a" />
          <stop offset="1" stopColor="#ff4d6d" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="186" rx={boss ? 80 : 60} ry="9" fill="rgba(0,0,0,.35)" />
      {boss && kind !== 'examiner' && <circle cx="100" cy="100" r="96" fill={`url(#aura${uid})`} className="anim-pulse" />}
      {art[kind]}
    </svg>
  )
}
